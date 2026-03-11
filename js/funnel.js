/* ========================================
   Dashboard Funil — Renderizacao do Funil
   ======================================== */

const FunnelRenderer = {

  /* Escala progressiva de tamanho dos blocos
     O primeiro bloco e o maior, o ultimo o menor.
     Valores definidos para que nenhuma metrica fique "esmagada". */
  sizeScale: {
    // padding vertical, min-height, font-size valor, font-size label, font-size input
    // Indice 0 = topo (maior), indice N = fundo (menor)
    6: [ // Google Ads (6 etapas)
      { padding: 32, minH: 120, valueSize: 48, labelSize: 14, inputSize: 40 },
      { padding: 28, minH: 108, valueSize: 42, labelSize: 14, inputSize: 36 },
      { padding: 26, minH: 98,  valueSize: 38, labelSize: 13, inputSize: 32 },
      { padding: 24, minH: 90,  valueSize: 34, labelSize: 13, inputSize: 28 },
      { padding: 22, minH: 84,  valueSize: 30, labelSize: 12, inputSize: 26 },
      { padding: 20, minH: 78,  valueSize: 28, labelSize: 12, inputSize: 24 }
    ],
    5: [ // Meta Ads (5 etapas)
      { padding: 32, minH: 120, valueSize: 48, labelSize: 14, inputSize: 40 },
      { padding: 28, minH: 106, valueSize: 42, labelSize: 14, inputSize: 36 },
      { padding: 25, minH: 94,  valueSize: 36, labelSize: 13, inputSize: 30 },
      { padding: 22, minH: 84,  valueSize: 30, labelSize: 12, inputSize: 26 },
      { padding: 20, minH: 78,  valueSize: 28, labelSize: 12, inputSize: 24 }
    ]
  },

  /**
   * Renderiza o funil completo no container
   */
  render(container, platform, data) {
    const config = DASH_CONFIG.funnels[platform];
    if (!config) return;

    container.innerHTML = '';

    const steps = config.steps;
    const totalSteps = steps.length;
    const sizes = this.sizeScale[totalSteps] || this.sizeScale[6];

    steps.forEach((step, index) => {
      // Indentacao do trapezio — progressao suave
      // Menor indent = blocos mais largos. Max ~10% nas laterais no ultimo bloco.
      const indentTop = (index / totalSteps) * 10;
      const indentBottom = ((index + 1) / totalSteps) * 10;

      const size = sizes[index] || sizes[sizes.length - 1];

      // Bloco do funil
      const stepEl = this.createStep(step, data, indentTop, indentBottom, config.costMetrics[index], size);
      container.appendChild(stepEl);

      // Taxa de passagem entre etapas (exceto apos a ultima)
      if (index < totalSteps - 1) {
        const nextStep = steps[index + 1];
        const currentVal = data[step.key] || 0;
        const nextVal = data[nextStep.key] || 0;
        const rate = currentVal > 0 ? (nextVal / currentVal * 100) : 0;

        const rateRow = this.createRateRow(rate);
        container.appendChild(rateRow);
      }
    });

    // Botao de salvar (para campos editaveis)
    const saveBar = document.createElement('div');
    saveBar.className = 'save-bar';
    saveBar.id = 'saveBar';
    saveBar.innerHTML = `
      <button class="cancel-btn" onclick="DashApp.cancelEdit()">Cancelar</button>
      <button class="save-btn" onclick="DashApp.saveInputs()">Salvar dados</button>
    `;
    container.appendChild(saveBar);
  },

  /**
   * Cria um step do funil com tamanho progressivo
   */
  createStep(step, data, indentTop, indentBottom, costMetric, size) {
    const value = data[step.key];
    const row = document.createElement('div');
    row.className = 'funnel-step';

    // Spacer esquerdo
    const spacer = document.createElement('div');
    spacer.className = 'funnel-spacer';
    row.appendChild(spacer);

    // Bloco central (funil)
    const block = document.createElement('div');
    block.className = `funnel-block ${step.editable ? 'editable' : ''}`;
    block.style.setProperty('--indent-top', `${indentTop}%`);
    block.style.setProperty('--indent-bottom', `${indentBottom}%`);
    block.style.setProperty('--block-padding', `${size.padding}px`);
    block.style.setProperty('--block-min-height', `${size.minH}px`);
    block.style.setProperty('--value-size', `${size.valueSize}px`);
    block.style.setProperty('--label-size', `${size.labelSize}px`);
    block.style.setProperty('--input-size', `${size.inputSize}px`);
    block.dataset.key = step.key;

    if (step.editable) {
      block.innerHTML = `
        <span class="step-edit-icon">&#9998;</span>
        <span class="step-label">${step.label}</span>
        <span class="step-value" data-key="${step.key}">${value != null && value !== '' ? this.formatNumber(value) : '—'}</span>
        <input type="number" class="step-input" data-key="${step.key}"
               value="${value || ''}" placeholder="Inserir"
               style="display:none;"
               oninput="DashApp.onInputChange()">
      `;
      block.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT') return;
        this.toggleEdit(block);
      });
    } else {
      block.innerHTML = `
        <span class="step-label">${step.label}</span>
        <span class="step-value">${this.formatNumber(value || 0)}</span>
      `;
    }

    row.appendChild(block);

    // Metrica de custo (lado direito)
    const connector = document.createElement('div');
    connector.className = 'funnel-connector';

    if (costMetric && data.investimento > 0) {
      const costValue = this.safeCostCalc(costMetric.calc, data);
      connector.innerHTML = `
        <div class="connector-line"></div>
        <div class="cost-metric">
          <div class="cost-label">${costMetric.label}</div>
          <div class="cost-value">${costValue !== null ? this.formatCurrency(costValue) : '—'}</div>
        </div>
      `;
    }

    row.appendChild(connector);

    return row;
  },

  /**
   * Cria a linha de taxa de passagem entre etapas
   */
  createRateRow(rate) {
    const row = document.createElement('div');
    row.className = 'funnel-rate-row';

    row.innerHTML = `
      <div class="rate-spacer"></div>
      <div class="rate-badge">
        <span class="arrow-down">&#9660;</span>
        ${this.formatRate(rate)}
      </div>
      <div class="rate-spacer"></div>
    `;

    return row;
  },

  /**
   * Toggle edicao de campo editavel
   */
  toggleEdit(block) {
    const valueEl = block.querySelector('.step-value');
    const inputEl = block.querySelector('.step-input');

    if (inputEl.style.display === 'none') {
      valueEl.style.display = 'none';
      inputEl.style.display = 'block';
      inputEl.focus();
      inputEl.select();
    }
  },

  /**
   * Calculo seguro de custo (evita divisao por zero)
   */
  safeCostCalc(calcFn, data) {
    try {
      const result = calcFn(data);
      if (!isFinite(result) || isNaN(result)) return null;
      return result;
    } catch {
      return null;
    }
  },

  /**
   * Formata numero com separador de milhar brasileiro
   */
  formatNumber(num) {
    if (num == null || num === '') return '—';
    return Number(num).toLocaleString('pt-BR');
  },

  /**
   * Formata moeda (BRL)
   */
  formatCurrency(num) {
    if (num == null) return '—';
    return num.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  /**
   * Formata taxa de passagem
   */
  formatRate(rate) {
    if (!isFinite(rate) || isNaN(rate)) return '0,00%';
    return rate.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '%';
  }
};
