/**
 * Pochi - Tanzania Fee Calculator
 * Human-friendly, non-corporate code
 */

// State
const state = {
  providerType: 'mobile',
  provider: null,
  mode: 'send',
  recipient: 'reg',
  amount: 0,
  feeData: null,
  providers: { mobile: [], bank: [] },
  settings: {
    compareRate: 2,
    theme: 'light',
    autoDelete: '720', // 24h=24, 7d=168, 30d=720, never=never
    impactUnit: 'all',
    showTaxBreakdown: false
  }
};

const HISTORY_KEY = 'pochi_history';
const SETTINGS_KEY = 'pochi_settings';
const MAX_HISTORY = 5;

// DOM Elements
const els = {
  // Header
  btnSettings: document.getElementById('btn-settings'),
  btnLang: document.getElementById('btn-lang'),
  btnClearFooter: document.getElementById('btn-clear-footer'),
  
  // Tabs
  segments: document.querySelectorAll('.segment'),
  
  // Provider
  providerSelect: document.getElementById('provider'),
  
  // Transaction modes
  txnBtns: document.querySelectorAll('.txn-btn'),
  
  // Recipient
  recipientGroup: document.getElementById('recipient-group'),
  recipientInputs: document.querySelectorAll('input[name="recipient"]'),
  
  // Amount
  amountInput: document.getElementById('amount'),
  quickBtns: document.querySelectorAll('.quick-btn'),
  
  // Results
  resultsCard: document.getElementById('results-card'),
  feeAmount: document.getElementById('fee-amount'),
  sendAmount: document.getElementById('send-amount'),
  totalAmount: document.getElementById('total-amount'),
  percentage: document.getElementById('percentage'),
  leakagePercentage: document.getElementById('leakage-percentage'),
  
  // Impact
  impactCard: document.getElementById('impact-card'),
  impactIcon: document.getElementById('impact-icon'),
  impactText: document.getElementById('impact-text'),
  
  // History
  historyList: document.getElementById('history-list'),
  
  // Modal
  modal: document.getElementById('settings-modal'),
  modalClose: document.querySelector('.modal-close'),
  modalOverlay: document.querySelector('.modal-overlay'),
  compareRateSelect: document.getElementById('compare-rate'),
  themeBtns: document.querySelectorAll('.theme-btn'),
  clearHistoryBtn: document.getElementById('clear-history'),
  
  // New Settings
  autoDeleteSelect: document.getElementById('auto-delete'),
  impactUnitSelect: document.getElementById('impact-unit'),
  taxBreakdownCheckbox: document.getElementById('tax-breakdown')
};

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  initLanguage();
  loadSettings();
  setupListeners();
  await loadProviders();
  updateUI();
  renderHistory();
}

// Settings
function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      state.settings = { ...state.settings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.log('No saved settings');
  }
  updateSettingsUI();
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function updateSettingsUI() {
  els.compareRateSelect.value = state.settings.compareRate;
  els.themeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.settings.theme);
  });
  
  // New settings
  if (els.autoDeleteSelect) {
    els.autoDeleteSelect.value = state.settings.autoDelete;
  }
  if (els.impactUnitSelect) {
    els.impactUnitSelect.value = state.settings.impactUnit;
  }
  if (els.taxBreakdownCheckbox) {
    els.taxBreakdownCheckbox.checked = state.settings.showTaxBreakdown;
  }
}

// Update all UI text based on current language
function updateUI() {
  if (typeof t !== 'function') return;
  
  // Update button text
  els.btnLang.textContent = getLanguage() === 'en' ? 'EN/SW' : 'SW/EN';
  els.btnClearFooter.textContent = t('clearHistory');
  els.btnSettings.title = t('settings');
  
  // Update tabs
  document.querySelector('.segment[data-type="mobile"]').textContent = t('mobileMoney');
  document.querySelector('.segment[data-type="bank"]').textContent = t('banks');
  
  // Update labels
  document.querySelectorAll('.field-label')[0].textContent = t('selectProvider');
  document.querySelectorAll('.field-label')[1].textContent = t('transaction');
  document.querySelectorAll('.field-label')[2].textContent = t('recipient');
  document.querySelectorAll('.field-label')[3].textContent = t('amount');
  
  // Update transaction buttons
  document.querySelector('.txn-btn[data-mode="send"] .txn-text').textContent = t('send');
  document.querySelector('.txn-btn[data-mode="paybill"] .txn-text').textContent = t('payBill');
  document.querySelector('.txn-btn[data-mode="withdraw"] .txn-text').textContent = t('withdraw');
  
  // Update recipient labels
  document.querySelector('label[for="rec-reg"]').textContent = t('registered');
  document.querySelector('label[for="rec-unreg"]').textContent = t('unregistered');
  
  // Update currency
  document.querySelector('.currency').textContent = t('currency');
  
  // Update quick buttons
  document.querySelector('.quick-btn[data-amount="5000"]').textContent = t('quick5k');
  document.querySelector('.quick-btn[data-amount="10000"]').textContent = t('quick10k');
  document.querySelector('.quick-btn[data-amount="50000"]').textContent = t('quick50k');
  document.querySelector('.quick-btn[data-amount="100000"]').textContent = t('quick100k');
  
  // Update results labels
  document.querySelector('.result-fee-label').textContent = t('fee');
  document.querySelectorAll('.result-row')[0].querySelector('span:first-child').textContent = t('youSend');
  document.querySelectorAll('.result-row')[1].querySelector('span:first-child').textContent = t('totalCost');
  document.querySelectorAll('.result-row')[2].querySelector('span:first-child').textContent = t('effectiveRate');
  
  // Update impact
  document.querySelector('.impact-header').textContent = t('dailyImpact');
  
  // Update trust tax
  const trustTaxTitle = document.querySelector('.trust-tax-title');
  const trustTaxText = document.querySelector('.trust-tax-text');
  const virtuousCycle = document.querySelector('.virtuous-cycle');
  if (trustTaxTitle) trustTaxTitle.textContent = t('trustTaxTitle');
  if (trustTaxText) trustTaxText.textContent = t('trustTaxText');
  if (virtuousCycle) virtuousCycle.textContent = t('virtuousCycle');
  // Update empty state if visible
  const emptyState = document.querySelector('.empty-state');
  if (emptyState && emptyState.style.display !== 'none') {
    emptyState.textContent = t('noHistory');
  }
  
  // Update modal
  document.querySelector('.modal-header h2').textContent = t('settingsTitle');
  document.querySelectorAll('.setting-label')[0].textContent = t('compareWith');
  document.querySelectorAll('.setting-label')[1].textContent = t('theme');
  document.querySelector('.text-btn').textContent = t('clearHistory');
  
  // Update compare options
  const options = els.compareRateSelect.querySelectorAll('option');
  options[0].textContent = t('kenya2');
  options[1].textContent = t('ghana15');
  options[2].textContent = t('uganda1');
  options[3].textContent = t('custom');
  
  // Update theme buttons
  document.querySelector('.theme-btn[data-theme="light"]').textContent = t('light');
  document.querySelector('.theme-btn[data-theme="dark"]').textContent = t('dark');
  
  // Update page title
  document.title = t('appName') + ' - Fee Calculator';
  
  // Re-render history to update mode labels
  renderHistory();
  
  // Re-calculate to update impact text
  if (state.amount > 0) {
    calculate();
  }
}

// Event Listeners
function setupListeners() {
  // Provider type tabs
  els.segments.forEach(seg => {
    seg.addEventListener('click', () => {
      els.segments.forEach(s => s.classList.remove('active'));
      seg.classList.add('active');
      state.providerType = seg.dataset.type;
      populateProviders();
      // Load first provider
      if (state.providers[state.providerType].length > 0) {
        state.provider = state.providers[state.providerType][0].id;
        els.providerSelect.value = state.provider;
        loadFeeData();
      }
      calculate();
    });
  });
  
  // Provider select
  els.providerSelect.addEventListener('change', async (e) => {
    state.provider = e.target.value;
    await loadFeeData();
    calculate();
  });
  
  // Transaction modes
  els.txnBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      els.txnBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
      
      // Show/hide recipient group
      els.recipientGroup.style.display = state.mode === 'send' ? 'flex' : 'none';
      
      calculate();
    });
  });
  
  // Recipient toggle
  els.recipientInputs.forEach(input => {
    input.addEventListener('change', () => {
      state.recipient = input.value;
      calculate();
    });
  });
  
  // Amount input with formatting
  els.amountInput.addEventListener('input', (e) => {
    // Remove non-digits
    let value = e.target.value.replace(/[^0-9]/g, '');
    // Parse for calculation
    state.amount = parseInt(value) || 0;
    // Format with commas
    e.target.value = formatNumber(value);
    calculate();
  });
  
  // Quick amount buttons
  els.quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = parseInt(btn.dataset.amount);
      els.amountInput.value = formatNumber(amount.toString());
      state.amount = amount;
      calculate();
    });
  });
  
  // Settings modal
  els.btnSettings.addEventListener('click', () => {
    els.modal.classList.remove('hidden');
  });
  
  els.modalClose.addEventListener('click', closeModal);
  els.modalOverlay.addEventListener('click', closeModal);
  
  // Compare rate
  els.compareRateSelect.addEventListener('change', (e) => {
    state.settings.compareRate = parseFloat(e.target.value);
    saveSettings();
    calculate();
  });
  
  // Theme toggle
  els.themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.settings.theme = btn.dataset.theme;
      els.themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      saveSettings();
    });
  });
  
  // Clear history
  els.clearHistoryBtn.addEventListener('click', () => {
    chrome.storage.local.remove(HISTORY_KEY);
    renderHistory();
    closeModal();
  });
  
  // Language toggle
  els.btnLang.addEventListener('click', () => {
    const newLang = getLanguage() === 'en' ? 'sw' : 'en';
    setLanguage(newLang);
    updateUI();
  });
  
  // Clear history footer button
  els.btnClearFooter.addEventListener('click', () => {
    chrome.storage.local.remove(HISTORY_KEY);
    renderHistory();
  });
  
  // New Settings Event Listeners
  if (els.autoDeleteSelect) {
    els.autoDeleteSelect.addEventListener('change', (e) => {
      state.settings.autoDelete = e.target.value;
      saveSettings();
      applyAutoDelete();
    });
  }
  
  if (els.impactUnitSelect) {
    els.impactUnitSelect.addEventListener('change', (e) => {
      state.settings.impactUnit = e.target.value;
      saveSettings();
      // Re-calculate to update impact display
      if (state.amount > 0) {
        calculate();
      }
    });
  }
  
  if (els.taxBreakdownCheckbox) {
    els.taxBreakdownCheckbox.addEventListener('change', (e) => {
      state.settings.showTaxBreakdown = e.target.checked;
      saveSettings();
      // Re-calculate to update tax display
      if (state.amount > 0) {
        calculate();
      }
    });
  }
}

function closeModal() {
  els.modal.classList.add('hidden');
}

// Apply auto-delete based on setting
async function applyAutoDelete() {
  const autoDelete = state.settings.autoDelete;
  
  if (autoDelete === 'never') {
    // Don't save any new history
    return;
  }
  
  // Clean up old history entries
  try {
    const res = await chrome.storage.local.get(HISTORY_KEY);
    let history = res[HISTORY_KEY] || [];
    const now = Date.now();
    const hours = parseInt(autoDelete);
    const cutoff = now - (hours * 60 * 60 * 1000);
    
    history = history.filter(h => h.time > cutoff);
    await chrome.storage.local.set({ [HISTORY_KEY]: history });
    renderHistory();
  } catch (err) {
    console.error('Auto-delete failed:', err);
  }
}

// Load providers
async function loadProviders() {
  try {
    const url = chrome.runtime.getURL('data/providers.json');
    const res = await fetch(url);
    const data = await res.json();
    state.providers = data.providers;
    populateProviders();
    
    // Load first provider
    if (state.providers.mobile.length > 0) {
      state.provider = state.providers.mobile[0].id;
      await loadFeeData();
    }
  } catch (err) {
    console.error('Failed to load providers:', err);
    // Fallback
    state.providers = {
      mobile: [
        { id: 'mpesa', name: 'M-Pesa' },
        { id: 'tigopesa', name: 'Tigo Pesa' }
      ],
      bank: []
    };
    populateProviders();
    state.provider = 'mpesa';
    await loadFeeData();
  }
}

function populateProviders() {
  els.providerSelect.innerHTML = '';
  const list = state.providers[state.providerType] || [];
  
  list.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    els.providerSelect.appendChild(opt);
  });
  
  if (list.length > 0) {
    state.provider = list[0].id;
    els.providerSelect.value = state.provider;
  }
}

// Load fee data
async function loadFeeData() {
  if (!state.provider) return;
  
  try {
    const url = chrome.runtime.getURL(`data/${state.provider}.json`);
    const res = await fetch(url);
    state.feeData = await res.json();
  } catch (err) {
    console.error('Failed to load fee data:', err);
    state.feeData = null;
  }
}

// Find fee band
function findBand(amount) {
  if (!state.feeData?.bands) return null;
  return state.feeData.bands.find(b => amount >= b.min && amount <= b.max);
}

// Get fee
function getFee(band) {
  if (!band) return 0;
  
  // Bank transfers use 'transfer' field
  if (state.providerType === 'bank') {
    return band.transfer || 0;
  }
  
  // Mobile money providers
  switch (state.mode) {
    case 'withdraw': return band.withdraw || 0;
    case 'paybill': return band.pay_bill || 0;
    case 'send':
      return state.recipient === 'reg' 
        ? (band.send_registered || 0) 
        : (band.send_unregistered || 0);
    default: return 0;
  }
}

// Format number with comma separators
function formatNumber(value) {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Format currency with comma separators
function formatMoney(amount) {
  return 'TZS ' + formatNumber(amount);
}

// Calculate tax breakdown (VAT 18%, Excise Duty varies)
function calculateTaxBreakdown(fee) {
  // VAT is 18% of the fee
  const vat = fee * 0.18;
  // Excise duty is typically 10-15% for financial services
  const exciseDuty = fee * 0.10;
  const baseFee = fee - vat - exciseDuty;
  
  return {
    baseFee: Math.max(0, baseFee),
    vat: vat,
    exciseDuty: exciseDuty
  };
}

// Calculate
function calculate() {
  const amount = state.amount;
  
  if (amount <= 0 || !state.feeData) {
    els.resultsCard.classList.add('hidden');
    return;
  }
  
  const band = findBand(amount);
  if (!band) {
    els.resultsCard.classList.add('hidden');
    return;
  }
  
  const fee = getFee(band);
  const total = amount + fee;
  const pct = (fee / amount) * 100;
  
  // Update UI
  els.feeAmount.textContent = formatMoney(fee);
  els.sendAmount.textContent = formatMoney(amount);
  els.totalAmount.textContent = formatMoney(total);
  els.percentage.textContent = pct.toFixed(2) + '%';
  
  // Update leakage percentage in trust tax text
  els.leakagePercentage.textContent = pct.toFixed(1) + '%';
  
  // Update Daily Impact
  updateImpactCard(fee);
  
  // Update Tax Breakdown if enabled
  updateTaxBreakdown(fee);
  
  els.resultsCard.classList.remove('hidden');
  
  // Debounced save
  debounceSave(amount, fee, pct);
}

// Update tax breakdown display
function updateTaxBreakdown(fee) {
  const taxBreakdownEl = document.getElementById('tax-breakdown-details');
  
  if (!taxBreakdownEl) {
    // Create tax breakdown element if it doesn't exist
    const detailsDiv = document.createElement('div');
    detailsDiv.id = 'tax-breakdown-details';
    detailsDiv.className = 'tax-breakdown hidden';
    detailsDiv.innerHTML = `
      <div class="tax-row"><span>Base Fee</span><span id="tax-base">TZS 0</span></div>
      <div class="tax-row"><span>VAT (18%)</span><span id="tax-vat">TZS 0</span></div>
      <div class="tax-row"><span>Excise Duty (10%)</span><span id="tax-excise">TZS 0</span></div>
    `;
    els.resultsCard.insertBefore(detailsDiv, document.querySelector('.trust-tax-box'));
  }
  
  const taxEl = document.getElementById('tax-breakdown-details');
  if (state.settings.showTaxBreakdown) {
    const taxes = calculateTaxBreakdown(fee);
    document.getElementById('tax-base').textContent = formatMoney(Math.round(taxes.baseFee));
    document.getElementById('tax-vat').textContent = formatMoney(Math.round(taxes.vat));
    document.getElementById('tax-excise').textContent = formatMoney(Math.round(taxes.exciseDuty));
    taxEl.classList.remove('hidden');
  } else {
    taxEl.classList.add('hidden');
  }
}

// Debounce
let timer;
function debounceSave(amount, fee, pct) {
  clearTimeout(timer);
  timer = setTimeout(() => saveToHistory(amount, fee, pct), 800);
}

// Save history
async function saveToHistory(amount, fee, pct) {
  try {
    const res = await chrome.storage.local.get(HISTORY_KEY);
    let history = res[HISTORY_KEY] || [];
    
    const providerList = state.providers[state.providerType] || [];
    const providerInfo = providerList.find(p => p.id === state.provider);
    
    const entry = {
      provider: state.provider,
      providerName: providerInfo?.name || state.provider,
      providerType: state.providerType,
      mode: state.mode,
      recipient: state.recipient,
      amount,
      fee,
      percentage: pct.toFixed(2),
      time: Date.now()
    };
    
    history = [entry, ...history].slice(0, MAX_HISTORY);
    await chrome.storage.local.set({ [HISTORY_KEY]: history });
    renderHistory();
  } catch (err) {
    console.error('Save failed:', err);
  }
}

// Get history
async function getHistory() {
  try {
    const res = await chrome.storage.local.get(HISTORY_KEY);
    return res[HISTORY_KEY] || [];
  } catch (err) {
    return [];
  }
}

// Render history
async function renderHistory() {
  const history = await getHistory();
  
  if (history.length === 0) {
    els.historyList.innerHTML = '<p class="empty-state">No calculations yet</p>';
    return;
  }
  
  els.historyList.innerHTML = history.map(h => {
    let modeText;
    if (h.mode === 'send') {
      modeText = h.recipient === 'reg' ? 'Send' : 'Send Unreg';
    } else if (h.mode === 'paybill') {
      modeText = 'Pay Bill';
    } else {
      modeText = 'Withdraw';
    }
    
    const icon = h.providerType === 'bank' ? '[B]' : '[M]';
    
    return `
      <div class="history-item">
        <div class="history-main">
          <span class="history-provider">${icon} ${h.providerName}</span>
          <span class="history-amount">${formatMoney(h.amount)}</span>
        </div>
        <div class="history-meta">
          <span class="history-mode">${modeText}</span>
          <span class="history-fee">${h.percentage}% fee</span>
        </div>
      </div>
    `;
  }).join('');
}

// Update Daily Impact Card
function updateImpactCard(fee) {
  // Use category-specific impact function if available
  let impact;
  if (typeof getHumanImpactByCategory === 'function' && state.settings.impactUnit !== 'all') {
    impact = getHumanImpactByCategory(fee, state.settings.impactUnit);
  } else if (typeof getHumanImpact === 'function') {
    impact = getHumanImpact(fee);
  } else {
    els.impactCard.classList.add('hidden');
    return;
  }
  
  if (!impact) {
    els.impactCard.classList.add('hidden');
    return;
  }
  
  // Set icon based on category
  const iconMap = {
    'food': '[F]',
    'transport': '[T]',
    'data': '[D]',
    'education': '[E]',
    'utilities': '[U]',
    'housing': '[H]'
  };
  
  els.impactIcon.textContent = iconMap[impact.category] || '[x]';
  
  // Set text
  const qtyText = impact.quantity > 1 ? `${impact.quantity}x ` : '';
  els.impactText.textContent = `This fee could have bought: ${qtyText}${impact.item}`;
  
  els.impactCard.classList.remove('hidden');
}
