# Pochi (Wallet)

> Making Financial Inclusion Real — A Tanzania Fee Calculator

**Pochi** means "English" in Swahili. It is a financial transparency tool that exposes the hidden cost of digital transactions, because trust is the foundation of economic growth.

## The Hidden Tax on Trust

When a mama mboga pays TZS 1,000 to receive TZS 5,000, she is not just paying a fee. She is being taxed out of the digital economy.

High leakage breaks the trust loop:

```
Excessive Fees → Cash Preference → Lower Volume → 
Higher Fees to Compensate → More Exclusion
```

When people see 20% disappear, they return to cash. Cash is unsafe. Cash is untraceable. Cash excludes them from credit, savings, and growth.

The solution is transparency. When people see the true cost, they demand better. When fees drop, everyone transacts more. Volume increases. Trust grows. The economy expands.

## What Pochi Does

Pochi makes the invisible visible. It translates abstract percentages into real choices:

| Fee Amount | What You Give Up |
|------------|------------------|
| TZS 1,000 | 1kg Maize Flour (Unga ya Muhogo) |
| TZS 2,500 | A full meal for your child |
| TZS 7,000 | One week of transport to work |

When you see the cost in meals missed and journeys skipped, you understand why fee transparency matters.

## Features

- **Leakage Calculator**: Shows total cost as percentage and real-world impact
- **Daily Impact Translation**: Converts fees to local commodities (Unga, Daladala, Meals)
- **Bilingual UI**: Full English/Swahili support (EN/SW toggle)
- **Banks + Mobile Money**: M-Pesa, Tigo Pesa, Airtel, HaloPesa + CRDB, NMB, KCB, Stanbic, Equity
- **Transaction Types**: Send, Pay Bill (Lipa), Withdraw
- **Real-Time Calculation**: Instant results as you type with comma-formatted numbers
- **History**: Last 5 calculations with persistent storage
- **Clean Design**: High-contrast green/black/white, no gradients, Inter font

## File Structure

```
pochi/
├── extension/
│   ├── data/                  # Fee data files
│   │   ├── providers.json     # Provider registry (mobile + banks)
│   │   ├── mpesa.json         # M-Pesa fee structure
│   │   └── tigopesa.json      # Tigo Pesa fee structure
│   ├── livingStandards.js     # Dar es Salaam commodity prices
│   ├── translations.js        # English/Swahili translations
│   ├── manifest.json          # Chrome Extension Manifest V3
│   ├── popup.html             # Extension popup UI
│   ├── popup.js               # Core calculation logic
│   └── styles.css             # Green/black/white styling
├── .github/workflows/
│   └── validate.yml           # JSON validation GitHub Action
└── README.md                  # This file
```

## JSON Schema

Fee data files follow this structure:

```json
{
  "provider": "Provider Name",
  "country": "Tanzania",
  "currency": "TZS",
  "bands": [
    {
      "min": 1000,
      "max": 1999,
      "withdraw": 350,
      "send_registered": 10,
      "send_unregistered": 500,
      "pay_bill": 0
    }
  ]
}
```

## The Virtuous Cycle

Lower leakage creates a positive feedback loop:

1. **Transparency** → Users see true costs
2. **Demand** → Users push for lower fees
3. **Competition** → Providers reduce charges
4. **Volume** → More people transact digitally
5. **Inclusion** → More people enter formal economy
6. **Growth** → Everyone benefits

Pochi starts the cycle at step one: making costs visible.

## Installation

### From Source (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/pochi.git
   cd pochi
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** and select the `extension/` folder

5. The Pochi icon should appear in your toolbar

## Usage

1. Click the Pochi icon in your Chrome toolbar
2. Select Mobile Money or Banks tab
3. Choose your provider
4. Select transaction type (Send / Pay Bill / Withdraw)
5. Enter amount — numbers format automatically (e.g., 5,000,000)
6. See the fee, percentage, and what that money could have bought

## Technical Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 (Inter font) | Styling |
| Vanilla JS | Logic |
| Chrome Storage API | History & settings persistence |
| GitHub Actions | JSON validation |

## Design System

**Colors:**
- **Green** (`#2d5016`): Primary action, trust, growth
- **Black** (`#1a1a1a`): Text, borders, strength
- **White** (`#ffffff`): Clarity, simplicity
- **Gray** (`#f5f5f5`): Background balance

**No gradients. Bold borders. Maximum readability.**

## Adding New Providers

This project is community-maintained. To add a provider:

1. **Create fee data** in `extension/data/{provider-id}.json`
2. **Register provider** in `extension/data/providers.json`
3. **Submit PR** — GitHub Actions validates automatically

Together, we keep the data accurate and the pressure on for fair pricing.

## Architecture: No-Backend

- ✅ Static JSON files only
- ✅ No server required
- ✅ Works offline
- ✅ Community-updatable fee tables
- ✅ Transparent and auditable

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

MIT License — see [LICENSE](LICENSE) file

---

**Built for trust. Built for growth. Built for Tanzania.**
