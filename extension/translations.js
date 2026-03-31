/**
 * Pochi - English/Swahili Translations
 */

const TRANSLATIONS = {
  en: {
    // Header
    appName: 'Pochi',
    settings: 'Settings',
    
    // Provider tabs
    mobileMoney: 'Mobile Money',
    banks: 'Banks',
    
    // Labels
    selectProvider: 'Select Provider',
    transaction: 'Transaction',
    recipient: 'Recipient',
    amount: 'Amount',
    
    // Transaction types
    send: 'Send',
    payBill: 'Pay Bill',
    withdraw: 'Withdraw',
    
    // Recipient types
    registered: 'Registered',
    unregistered: 'Unregistered',
    
    // Currency
    currency: 'TZS',
    
    // Quick amounts
    quick5k: '5K',
    quick10k: '10K',
    quick50k: '50K',
    quick100k: '100K',
    
    // Results
    fee: 'Fee',
    youSend: 'You Send',
    totalCost: 'Total Cost',
    effectiveRate: 'Effective Rate',
    
    // Impact
    dailyImpact: 'DAILY IMPACT',
    impactPrefix: 'This fee could have bought:',
    
    // Awareness
    trustTaxTitle: 'THE HIDDEN TAX ON TRUST',
    trustTaxText: 'High fees break trust. When you see 20% disappear, you return to cash. Cash excludes you from credit, savings, and growth.',
    virtuousCycle: 'The Virtuous Cycle: Transparency → Demand → Lower Fees → Inclusion → Growth',
    transparencyMatters: 'Transparency creates the demand for fair pricing.',
    
    // History
    recent: 'Recent',
    noHistory: 'No calculations yet',
    sendReg: 'Send',
    sendUnreg: 'Send Unreg',
    
    // Footer
    clearHistory: 'Clear History',
    
    // Settings modal
    settingsTitle: 'Settings',
    compareWith: 'Compare with',
    kenya2: 'Kenya (2%)',
    ghana15: 'Ghana (1.5%)',
    uganda1: 'Uganda (1%)',
    custom: 'Custom',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    close: 'Close'
  },
  
  sw: {
    // Header
    appName: 'Pochi',
    settings: 'Mipangilio',
    
    // Provider tabs
    mobileMoney: 'Pesa ya Simu',
    banks: 'Benki',
    
    // Labels
    selectProvider: 'Chagua Mtoa Huduma',
    transaction: 'Shughuli',
    recipient: 'Mpokeaji',
    amount: 'Kiasi',
    
    // Transaction types
    send: 'Tuma',
    payBill: 'Lipa Bili',
    withdraw: 'Toa',
    
    // Recipient types
    registered: 'Amesajili',
    unregistered: 'Hajasajili',
    
    // Currency
    currency: 'TZS',
    
    // Quick amounts
    quick5k: '5K',
    quick10k: '10K',
    quick50k: '50K',
    quick100k: '100K',
    
    // Results
    fee: 'Ada',
    youSend: 'Unatuma',
    totalCost: 'Jumla ya Gharama',
    effectiveRate: 'Kiwango cha Ada',
    
    // Impact
    dailyImpact: 'ATHARI YA KILA SIKU',
    impactPrefix: 'Ada hii ingeweza kununua:',
    
    // Awareness
    trustTaxTitle: 'TOZO YA SIRI KWA IMANI',
    trustTaxText: 'Ada kubwa huvunja imani. Unaporona 20% inapotea, unarudi kwa pesa taslimu. Pesa taslimu hukutenga na mikopo, akiba, na ukuaji.',
    virtuousCycle: 'Mzunguko Wenye Faida: Uwazi → Mahitaji → Ada Ndogo → Kujumuishwa → Ukuaji',
    transparencyMatters: 'Uwazi huumba mahitaji ya bei haki.',
    
    // History
    recent: 'Hivi Karibuni',
    noHistory: 'Hakuna mahesabu bado',
    sendReg: 'Tuma',
    sendUnreg: 'Tuma Usajili',
    
    // Footer
    clearHistory: 'Futa Historia',
    
    // Settings modal
    settingsTitle: 'Mipangilio',
    compareWith: 'Linganisha na',
    kenya2: 'Kenya (2%)',
    ghana15: 'Ghana (1.5%)',
    uganda1: 'Uganda (1%)',
    custom: 'Kawaida',
    theme: 'Mandhari',
    light: 'Nuru',
    dark: 'Giza',
    close: 'Funga'
  }
};

// Current language
let currentLang = 'en';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} - Translated text
 */
function t(key) {
  return TRANSLATIONS[currentLang][key] || TRANSLATIONS['en'][key] || key;
}

/**
 * Set current language
 * @param {string} lang - 'en' or 'sw'
 */
function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    localStorage.setItem('pochi_language', lang);
  }
}

/**
 * Get current language
 * @returns {string} - Current language code
 */
function getLanguage() {
  return currentLang;
}

/**
 * Initialize language from storage
 */
function initLanguage() {
  const saved = localStorage.getItem('pochi_language');
  if (saved && TRANSLATIONS[saved]) {
    currentLang = saved;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { t, setLanguage, getLanguage, initLanguage, TRANSLATIONS };
}