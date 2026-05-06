/* ========================================
   Dashboard Funil — Configuracao
   ======================================== */

const DASH_CONFIG = {
  // URL do Google Apps Script Web App (backend)
  API_URL: 'https://script.google.com/macros/s/AKfycbz5D5UkxfppzUp0Tzg6cpwusT5yGBU6LNP3VUux79aJ5LdR_tmzw2z9t3ntosmSrQTO/exec',

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
    'run-fitness':      { nome: 'Run Fitness Club',           plataformas: ['google', 'meta'], logo: 'run-fitness.png' },
    'fisiocardio':      { nome: 'Fisiocárdio',                plataformas: ['google', 'meta'], logo: 'fisiocardio.png' },
    'artoria':          { nome: 'Artória Restaurante',        plataformas: ['google'],         logo: 'artoria.png' },
    'dog-time':         { nome: 'Dog Time',                   plataformas: ['google', 'meta'], logo: 'dog-time.png' },
    'quebeck':          { nome: 'Quebeck Automação',          plataformas: ['google', 'meta'], logo: 'quebeck.png' },
    'charme-coqueteis': { nome: 'Charme Coquetéis',           plataformas: ['google'],         logo: 'charme-coqueteis.png' },
    'tecnomanutencao':  { nome: 'Tecnomanutenção',            plataformas: ['google'],         logo: 'tecnomanutencao.png' },
    'ser-tecnologia':   { nome: 'Ser Tecnologia',             plataformas: ['google'],         logo: 'ser-tecnologia.png' },
    'tm-estetica':      { nome: 'TM Estética Automotiva',     plataformas: ['google'],         logo: 'tm-estetica.avif' },
    'grafica-sf':       { nome: 'Gráfica Sagrada Família',    plataformas: ['google'],         logo: 'grafica-sf.jpg' },
    'angatu':           { nome: 'Angatu',                     plataformas: ['meta'],           logo: 'angatu.png' },
    'crossfit-tavros':  { nome: 'Crossfit Távros',            plataformas: ['meta'],           logo: 'crossfit-tavros.png' },
    'guardian':         { nome: 'Guardian Monitoramento',      plataformas: ['google', 'meta'], logo: 'guardian.png' },
    'cre-ser':          { nome: 'CRE.SER',                     plataformas: ['google'],         logo: 'cre-ser.svg'  },
    'somos-de-sol':     { nome: 'Somos de Sol',                 plataformas: ['meta'],           logo: 'Somos-de-sol.jpg' }
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
