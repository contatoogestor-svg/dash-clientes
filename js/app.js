/* ========================================
   Dashboard Funil — App Principal
   ======================================== */

const DashApp = {
  // Estado
  state: {
    cliente: '',
    platform: 'google',
    period: 'month',
    dateStart: '',
    dateEnd: '',
    data: {},
    editedFields: {},
    hasChanges: false
  },

  /**
   * Inicializa o dashboard
   */
  init() {
    // Pega cliente da URL ou usa padrao
    const params = new URLSearchParams(window.location.search);
    this.state.cliente = params.get('cliente') || DASH_CONFIG.DEFAULT_CLIENT;

    // Seta datas padrao (mes atual)
    this.setDefaultDates();

    // Bind eventos
    this.bindEvents();

    // Carrega dados
    this.loadData();
  },

  /**
   * Define datas padrao (mes atual)
   */
  setDefaultDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    this.state.dateStart = `${year}-${month}-01`;
    this.state.dateEnd = `${year}-${month}-${day}`;

    document.getElementById('dateStart').value = this.state.dateStart;
    document.getElementById('dateEnd').value = this.state.dateEnd;

    this.updatePeriodLabel();
  },

  /**
   * Bind de eventos da UI
   */
  bindEvents() {
    // Platform selector
    document.querySelectorAll('.platform-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.platform = btn.dataset.platform;
        this.loadData();
      });
    });

    // Period selector
    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.period = btn.dataset.period;

        const customEl = document.getElementById('periodCustom');
        if (this.state.period === 'custom') {
          customEl.style.display = 'flex';
        } else {
          customEl.style.display = 'none';
          this.calculateDates();
          this.loadData();
        }
      });
    });

    // Custom date apply
    document.getElementById('dateApply').addEventListener('click', () => {
      this.state.dateStart = document.getElementById('dateStart').value;
      this.state.dateEnd = document.getElementById('dateEnd').value;
      if (this.state.dateStart && this.state.dateEnd) {
        this.loadData();
      }
    });
  },

  /**
   * Calcula datas baseado no periodo selecionado
   */
  calculateDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    switch (this.state.period) {
      case 'today':
        this.state.dateStart = this.formatDate(now);
        this.state.dateEnd = this.formatDate(now);
        break;

      case '7d': {
        const start = new Date(now);
        start.setDate(day - 6);
        this.state.dateStart = this.formatDate(start);
        this.state.dateEnd = this.formatDate(now);
        break;
      }

      case 'month':
        this.state.dateStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        this.state.dateEnd = this.formatDate(now);
        break;

      case 'last-month': {
        const lastMonth = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        this.state.dateStart = this.formatDate(lastMonth);
        this.state.dateEnd = this.formatDate(lastDay);
        break;
      }
    }

    document.getElementById('dateStart').value = this.state.dateStart;
    document.getElementById('dateEnd').value = this.state.dateEnd;
    this.updatePeriodLabel();
  },

  /**
   * Atualiza o label de periodo exibido
   */
  updatePeriodLabel() {
    const start = this.state.dateStart.split('-').reverse().join('/');
    const end = this.state.dateEnd.split('-').reverse().join('/');
    document.getElementById('periodLabel').textContent = `${start} — ${end}`;
  },

  /**
   * Carrega dados (API ou mock)
   */
  async loadData() {
    const container = document.getElementById('funnelContainer');
    container.innerHTML = `
      <div class="funnel-loading" id="funnelLoading">
        <div class="spinner"></div>
        <span>Carregando dados...</span>
      </div>
    `;

    this.updatePeriodLabel();

    try {
      let data;

      if (DASH_CONFIG.API_URL) {
        data = await this.fetchFromAPI();
      } else {
        data = this.getMockData();
      }

      this.state.data = data;

      // Atualiza investimento
      document.getElementById('investmentValue').textContent =
        FunnelRenderer.formatCurrency(data.investimento);

      // Atualiza nome do cliente
      if (data.clienteNome) {
        document.getElementById('clientName').textContent = data.clienteNome;
      }

      // Atualiza ultima atualizacao
      document.getElementById('lastUpdate').textContent =
        new Date().toLocaleString('pt-BR');

      // Renderiza funil
      FunnelRenderer.render(container, this.state.platform, data);

    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      container.innerHTML = `
        <div class="funnel-loading">
          <span style="color: var(--red);">Erro ao carregar: ${err.message}</span>
        </div>
      `;
    }
  },

  /**
   * Busca dados da API (Apps Script)
   */
  async fetchFromAPI() {
    try {
      const url = new URL(DASH_CONFIG.API_URL);
      url.searchParams.set('action', 'getData');
      url.searchParams.set('cliente', this.state.cliente);
      url.searchParams.set('plataforma', this.state.platform);
      url.searchParams.set('inicio', this.state.dateStart);
      url.searchParams.set('fim', this.state.dateEnd);

      // Apps Script Web App faz redirect — precisa de mode: 'cors' e redirect: 'follow'
      const res = await fetch(url.toString(), {
        method: 'GET',
        redirect: 'follow'
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      return data;
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      this.showToast('Erro ao carregar dados. Usando dados de exemplo.', true);
      return this.getMockData();
    }
  },

  /**
   * Dados mockados para desenvolvimento
   */
  getMockData() {
    if (this.state.platform === 'google') {
      return {
        cliente: 'nutrigene',
        clienteNome: 'Clinica Nutrigene',
        plataforma: 'google',
        investimento: 2850.00,
        impressoes: 45200,
        cliques: 3180,
        visitas: 2410,
        whatsapp: 185,
        contatos: null,
        conversoes: null
      };
    } else {
      return {
        cliente: 'nutrigene',
        clienteNome: 'Clinica Nutrigene',
        plataforma: 'meta',
        investimento: 1500.00,
        impressoes: 68400,
        cliques: 2950,
        resultados: 210,
        contatos: null,
        conversoes: null
      };
    }
  },

  /**
   * Callback quando um campo editavel muda
   */
  onInputChange() {
    this.state.hasChanges = true;
    const saveBar = document.getElementById('saveBar');
    if (saveBar) saveBar.classList.add('visible');
  },

  /**
   * Cancela edicao
   */
  cancelEdit() {
    this.state.hasChanges = false;
    this.loadData(); // Re-renderiza com dados originais
  },

  /**
   * Salva inputs manuais
   */
  async saveInputs() {
    const inputs = document.querySelectorAll('.step-input');
    const updates = {};

    inputs.forEach(input => {
      const key = input.dataset.key;
      const val = input.value.trim();
      if (val !== '') {
        updates[key] = Number(val);
      }
    });

    if (Object.keys(updates).length === 0) {
      this.showToast('Nenhum dado para salvar.');
      return;
    }

    // Atualiza state local
    Object.assign(this.state.data, updates);

    // Se tem API, envia pro backend
    if (DASH_CONFIG.API_URL) {
      try {
        await fetch(DASH_CONFIG.API_URL, {
          method: 'POST',
          redirect: 'follow',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'saveInput',
            cliente: this.state.cliente,
            plataforma: this.state.platform,
            periodo: this.state.dateStart.substring(0, 7),
            inputs: updates
          })
        });
      } catch (err) {
        console.error('Erro ao salvar:', err);
        this.showToast('Erro ao salvar no servidor.', true);
        return;
      }
    }

    this.state.hasChanges = false;
    this.showToast('Dados salvos com sucesso!');

    // Re-renderiza com dados atualizados
    const container = document.getElementById('funnelContainer');
    FunnelRenderer.render(container, this.state.platform, this.state.data);
  },

  /**
   * Exibe toast de notificacao
   */
  showToast(msg, isError = false) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.style.borderColor = isError ? 'var(--red)' : 'var(--green)';
    toast.style.color = isError ? 'var(--red)' : 'var(--green)';
    toast.querySelector('.toast-icon').innerHTML = isError ? '&#10007;' : '&#10003;';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  },

  /**
   * Formata data para YYYY-MM-DD
   */
  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
};

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => DashApp.init());
