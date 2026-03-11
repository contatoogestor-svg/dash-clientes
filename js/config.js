/* ========================================
   Dashboard Funil — Configuracao
   ======================================== */

const DASH_CONFIG = {
  // URL do Google Apps Script Web App (backend)
  API_URL: 'https://script.google.com/macros/s/AKfycbz5EB1sEEUMRLpyLjWf02tyykJ5jGg09zzmg30MZcNOU6I92fG9hFoUa8jngqcGjReR/exec',

  // Token de autenticacao
  API_TOKEN: '',

  // Cliente padrao (pode ser override via ?cliente=xxx na URL)
  DEFAULT_CLIENT: 'nutrigene',

  // Formato de moeda
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR',

  // Mapeamento de clientes (plataformas disponiveis + logo)
  clients: {
    'nutrigene':        { nome: 'Clinica Nutrigene',          plataformas: ['google', 'meta'], logo: 'nutrigene.png' },
    'run-fitness':      { nome: 'Run Fitness Club',           plataformas: ['google', 'meta'], logo: null },
    'fisiocardio':      { nome: 'Fisiocárdio',                plataformas: ['google', 'meta'], logo: null },
    'artoria':          { nome: 'Artória Restaurante',        plataformas: ['google'],         logo: null },
    'dog-time':         { nome: 'Dog Time',                   plataformas: ['google', 'meta'], logo: null },
    'quebeck':          { nome: 'Quebeck Automação',          plataformas: ['google', 'meta'], logo: null },
    'charme-coqueteis': { nome: 'Charme Coquetéis',           plataformas: ['google'],         logo: null },
    'tecnomanutencao':  { nome: 'Tecnomanutenção',            plataformas: ['google'],         logo: null },
    'ser-tecnologia':   { nome: 'Ser Tecnologia',             plataformas: ['google'],         logo: null },
    'tm-estetica':      { nome: 'TM Estética Automotiva',     plataformas: ['google'],         logo: null },
    'grafica-sf':       { nome: 'Gráfica Sagrada Família',    plataformas: ['google'],         logo: null },
    'angatu':           { nome: 'Angatu',                     plataformas: ['meta'],           logo: null },
    'crossfit-tavros':  { nome: 'Crossfit Távros',            plataformas: ['meta'],           logo: null },
    'guardian':         { nome: 'Guardian Monitoramento',      plataformas: ['meta'],           logo: null }
  },

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
