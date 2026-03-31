/**
 * Pochi - Test Suite
 * Tests for core functions
 */

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value,
    removeItem: (key) => delete store[key],
    clear: () => store = {}
  };
})();

// Test runner
const TestRunner = {
  tests: [],
  
  test(name, fn) {
    this.tests.push({ name, fn });
  },
  
  async run() {
    console.log('🧪 Running tests...\n');
    let passed = 0;
    let failed = 0;
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        passed++;
      } catch (err) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${err.message}`);
        failed++;
      }
    }
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
    return { passed, failed };
  }
};

// Tests for translations.js
TestRunner.test('Translation: t() returns correct English text', () => {
  const result = t('fee');
  if (result !== 'Fee') {
    throw new Error(`Expected "Fee", got "${result}"`);
  }
});

TestRunner.test('Translation: t() falls back to key if not found', () => {
  const result = t('nonexistent_key');
  if (result !== 'nonexistent_key') {
    throw new Error(`Expected "nonexistent_key", got "${result}"`);
  }
});

TestRunner.test('Translation: setLanguage() changes current language', () => {
  setLanguage('sw');
  const lang = getLanguage();
  if (lang !== 'sw') {
    throw new Error(`Expected "sw", got "${lang}"`);
  }
  // Reset to English
  setLanguage('en');
});

TestRunner.test('Translation: Swahili translation works', () => {
  setLanguage('sw');
  const result = t('fee');
  setLanguage('en'); // Reset
  
  if (result !== 'Ada') {
    throw new Error(`Expected "Ada", got "${result}"`);
  }
});

// Tests for livingStandards.js
TestRunner.test('Living Standards: getHumanImpact() returns valid object', () => {
  if (typeof getHumanImpact !== 'function') {
    throw new Error('getHumanImpact function not found');
  }
  
  const result = getHumanImpact(1000);
  if (!result || typeof result !== 'object') {
    throw new Error('Expected object, got ' + typeof result);
  }
  if (!result.item || !result.category) {
    throw new Error('Result missing required properties');
  }
});

TestRunner.test('Living Standards: getHumanImpactByCategory() filters by category', () => {
  if (typeof getHumanImpactByCategory !== 'function') {
    throw new Error('getHumanImpactByCategory function not found');
  }
  
  // Test with food category
  const result = getHumanImpactByCategory(1500, 'food');
  if (result && result.category !== 'food') {
    throw new Error(`Expected food category, got ${result.category}`);
  }
});

TestRunner.test('Living Standards: Small amounts return null', () => {
  const result = getHumanImpact(100);
  if (result !== null) {
    throw new Error('Expected null for small amounts');
  }
});

TestRunner.test('Living Standards: getCategories() returns array', () => {
  if (typeof getCategories !== 'function') {
    throw new Error('getCategories function not found');
  }
  
  const categories = getCategories();
  if (!Array.isArray(categories)) {
    throw new Error('Expected array, got ' + typeof categories);
  }
  if (categories.length === 0) {
    throw new Error('Categories array is empty');
  }
});

// Tests for format functions
TestRunner.test('Format: formatNumber() adds commas correctly', () => {
  if (typeof formatNumber !== 'function') {
    throw new Error('formatNumber function not found');
  }
  
  const result = formatNumber('1000000');
  if (result !== '1,000,000') {
    throw new Error(`Expected "1,000,000", got "${result}"`);
  }
});

TestRunner.test('Format: formatMoney() adds TZS prefix', () => {
  if (typeof formatMoney !== 'function') {
    throw new Error('formatMoney function not found');
  }
  
  const result = formatMoney(5000);
  if (!result.includes('TZS')) {
    throw new Error('Expected TZS prefix in result');
  }
});

// Tests for tax calculation
TestRunner.test('Tax: calculateTaxBreakdown() returns correct structure', () => {
  if (typeof calculateTaxBreakdown !== 'function') {
    throw new Error('calculateTaxBreakdown function not found');
  }
  
  const result = calculateTaxBreakdown(1000);
  if (typeof result.baseFee !== 'number') {
    throw new Error('baseFee should be a number');
  }
  if (typeof result.vat !== 'number') {
    throw new Error('vat should be a number');
  }
  if (typeof result.exciseDuty !== 'number') {
    throw new Error('exciseDuty should be a number');
  }
});

TestRunner.test('Tax: VAT calculation is approximately 18%', () => {
  const fee = 1000;
  const result = calculateTaxBreakdown(fee);
  const expectedVat = fee * 0.18;
  
  if (Math.abs(result.vat - expectedVat) > 0.01) {
    throw new Error(`VAT should be ~${expectedVat}, got ${result.vat}`);
  }
});

// Settings tests
TestRunner.test('Settings: Default theme is light', () => {
  // Check if settings state exists
  if (typeof state === 'undefined' || !state.settings) {
    throw new Error('Settings state not found');
  }
  
  if (state.settings.theme !== 'light') {
    throw new Error(`Expected default theme "light", got "${state.settings.theme}"`);
  }
});

TestRunner.test('Settings: All required settings exist', () => {
  const required = ['theme', 'autoDelete', 'impactUnit', 'showTaxBreakdown'];
  
  for (const key of required) {
    if (!(key in state.settings)) {
      throw new Error(`Missing setting: ${key}`);
    }
  }
});

// Data validation tests
TestRunner.test('Data: Bank files have transfer field', async () => {
  const banks = ['crdb', 'nmb', 'kcb', 'stanbic', 'equity'];
  
  for (const bank of banks) {
    try {
      const url = chrome.runtime.getURL(`data/${bank}.json`);
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.bands || !Array.isArray(data.bands)) {
        throw new Error(`${bank}.json missing bands array`);
      }
      
      const hasTransfer = data.bands.some(b => 'transfer' in b);
      if (!hasTransfer) {
        throw new Error(`${bank}.json bands missing transfer field`);
      }
    } catch (err) {
      throw new Error(`Failed to validate ${bank}.json: ${err.message}`);
    }
  }
});

TestRunner.test('Data: Mobile money files have required fields', async () => {
  const providers = ['mpesa', 'tigopesa'];
  
  for (const provider of providers) {
    try {
      const url = chrome.runtime.getURL(`data/${provider}.json`);
      const res = await fetch(url);
      const data = await res.json();
      
      if (!data.bands || !Array.isArray(data.bands)) {
        throw new Error(`${provider}.json missing bands array`);
      }
      
      const required = ['min', 'max', 'withdraw', 'send_registered', 'send_unregistered'];
      const firstBand = data.bands[0];
      
      for (const field of required) {
        if (!(field in firstBand)) {
          throw new Error(`${provider}.json missing field: ${field}`);
        }
      }
    } catch (err) {
      throw new Error(`Failed to validate ${provider}.json: ${err.message}`);
    }
  }
});

// Run tests when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Add test button to settings
    const testBtn = document.createElement('button');
    testBtn.textContent = '🧪 Run Tests';
    testBtn.className = 'text-btn';
    testBtn.style.marginTop = '20px';
    testBtn.addEventListener('click', async () => {
      console.clear();
      await TestRunner.run();
    });
    
    // Append to modal body
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.appendChild(testBtn);
    }
  });
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestRunner };
}