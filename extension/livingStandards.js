/**
 * Pochi Living Standards Module
 * Maps transaction leakage to Dar es Salaam 2026 market realities
 */

// Dar es Salaam 2026 Cost of Living Index (TZS)
const COMMODITIES = [
  { threshold: 800, item: "2 Chapati", category: "food", icon: "bread" },
  { threshold: 1000, item: "1kg Maize Flour (Unga ya Muhogo)", category: "food", icon: "flour" },
  { threshold: 1500, item: "1kg Rice + Beans portion", category: "food", icon: "rice" },
  { threshold: 1800, item: "3 Chapati + Beans (Mama Lishe)", category: "food", icon: "meal" },
  { threshold: 2500, item: "Full meal + Soda", category: "food", icon: "soda" },
  { threshold: 3500, item: "1 day Daladala commute (to/from work)", category: "transport", icon: "bus" },
  { threshold: 5000, item: "5L cooking oil", category: "food", icon: "oil" },
  { threshold: 7000, item: "1-3 days Daladala fares", category: "transport", icon: "bus" },
  { threshold: 10000, item: "1kg meat + vegetables", category: "food", icon: "meat" },
  { threshold: 15000, item: "1 month school supplies", category: "education", icon: "books" },
  { threshold: 25000, item: "Electricity token (1 month, basic)", category: "utilities", icon: "lightning" },
  { threshold: 50000, item: "1 month rent (single room, outskirts)", category: "housing", icon: "home" },
  { threshold: 100000, item: "1 month rent (2-room, city)", category: "housing", icon: "home" }
];

/**
 * Find the human impact equivalent for a given leakage amount
 * @param {number} leakageAmount - The total fee/leakage in TZS
 * @returns {Object|null} - The matching commodity or null
 */
function getHumanImpact(leakageAmount) {
  if (!leakageAmount || leakageAmount < 500) {
    return null;
  }
  
  // Find the highest threshold that doesn't exceed the leakage
  const matches = COMMODITIES.filter(c => leakageAmount >= c.threshold);
  
  if (matches.length === 0) {
    return null;
  }
  
  // Return the highest match (most valuable item they could afford)
  const bestMatch = matches[matches.length - 1];
  
  // Calculate how many of this item they could buy
  const quantity = Math.floor(leakageAmount / bestMatch.threshold);
  
  return {
    ...bestMatch,
    quantity: quantity > 1 ? quantity : 1,
    totalCost: bestMatch.threshold * (quantity > 1 ? quantity : 1)
  };
}

/**
 * Format the impact message for display
 * @param {number} leakageAmount - The total fee/leakage in TZS
 * @returns {string|null} - Formatted message or null
 */
function formatImpactMessage(leakageAmount) {
  const impact = getHumanImpact(leakageAmount);
  
  if (!impact) {
    return null;
  }
  
  const qtyText = impact.quantity > 1 ? `${impact.quantity}x ` : '';
  return `This fee could have bought: ${qtyText}${impact.item}`;
}

/**
 * Get alternative context for small leakages
 * @param {number} leakageAmount - The total fee/leakage in TZS
 * @returns {string|null} - Alternative message or null
 */
function getAlternativeContext(leakageAmount) {
  if (leakageAmount < 500) {
    return "This fee is small, but fees add up over time.";
  }
  if (leakageAmount < 1000) {
    return "This fee could have bought breakfast.";
  }
  return null;
}

/**
 * Calculate compound impact (what this costs over time)
 * @param {number} singleFee - Single transaction fee
 * @param {number} frequency - Times per month
 * @returns {Object} - Monthly and yearly impact
 */
function calculateCompoundImpact(singleFee, frequency = 10) {
  const monthly = singleFee * frequency;
  const yearly = monthly * 12;
  
  const monthlyImpact = getHumanImpact(monthly);
  const yearlyImpact = getHumanImpact(yearly);
  
  return {
    monthly,
    yearly,
    monthlyImpact,
    yearlyImpact
  };
}

// Export for use in popup.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    COMMODITIES,
    getHumanImpact,
    formatImpactMessage,
    getAlternativeContext,
    calculateCompoundImpact
  };
}