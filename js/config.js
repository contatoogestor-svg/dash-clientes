/* ========================================
   Dashboard Funil — Configuracao
   ======================================== */

const DASH_CONFIG = {
  // URL do Google Apps Script Web App (backend)
  // Atualizar apos deploy do Apps Script
  API_URL: 'https://script.google.com/macros/s/AKfycbwRByKyzD4bGF17hDO9CURckf4u9lVcKm1cbzc_wad1X0htPlQ2HJLUO3dd2fDFqrus/exec',

  // Token de autenticacao (sera gerado no deploy)
  API_TOKEN: '',

  // Cliente padrao (pode ser override via ?cliente=xxx na URL)
  DEFAULT_CLIENT: 'nutrigene',

  // Formato de moeda
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',

  // Definicoes dos funis por plataforma
  funnels: {
    google: {
      label: 'Google Ads',
      steps: [
        { key: 'impressoes',  label: 'Impressoes',          editable: false },
        { key: 'cliques',     label: 'Cliques',             editable: false },
        { key: 'visitas',     label: 'Visitas na Pagina',   editable: false },
        { key: 'whatsapp',    label: 'Botao de WhatsApp',   editable: false },
        { key: 'contatos',    label: 'Contatos Recebidos',  editable: true  },
        { key: 'conversoes',  label: 'Conversoes',          editable: true  }
      ],
      costMetrics: [
        { label: 'CPM',              calc: (d) => (d.investimento / d.impressoes) * 1000 },
        { label: 'CPC',              calc: (d) => d.investimento / d.cliques },
        { label: 'Custo/Visita',     calc: (d) => d.investimento / d.visitas },
        { label: 'Custo/WhatsApp',   calc: (d) => d.investimento / d.whatsapp },
        { label: 'Custo/Contato',    calc: (d) => d.investimento / d.contatos },
        { label: 'CAC',              calc: (d) => d.investimento / d.conversoes }
      ]
    },
    meta: {
      label: 'Meta Ads',
      steps: [
        { key: 'impressoes',   label: 'Impressoes',           editable: false },
        { key: 'cliques',      label: 'Cliques no Link',      editable: false },
        { key: 'resultados',   label: 'Resultados',           editable: false },
        { key: 'contatos',     label: 'Contatos Recebidos',   editable: true  },
        { key: 'conversoes',   label: 'Conversoes',           editable: true  }
      ],
      costMetrics: [
        { label: 'CPM',              calc: (d) => (d.investimento / d.impressoes) * 1000 },
        { label: 'CPC',              calc: (d) => d.investimento / d.cliques },
        { label: 'Custo/Resultado',  calc: (d) => d.investimento / d.resultados },
        { label: 'Custo/Contato',    calc: (d) => d.investimento / d.contatos },
        { label: 'CAC',              calc: (d) => d.investimento / d.conversoes }
      ]
    }
  }
};
