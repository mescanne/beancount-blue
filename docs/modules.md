# Core Accounting Plugins

`beancount-blue` provides four specialized plugins for Beancount that automate common, complex bookkeeping workflows:

1. **[Amortize](#amortize):** Spread large or recurring expenses across multiple months.
2. **[UK Capital Gains](#uk-capital-gains):** HMRC-compliant capital gains calculations and lot adjustments.
3. **[Clear Residual Lots](#clear-residual-lots):** Clear fractional lot dust before closing investment accounts.
4. **[Auto-Tagger](#auto-tagger):** Automatically apply tags to transactions based on participating accounts.

---

## Amortize

The `amortize` plugin aggregates expenses posted to designated accounts and spreads them evenly over a configurable number of months.

### Key Features
* Creates a monthly adjusting transaction that debits/credits the expense account and offsets against an `Equity:Amortization` holding account.
* Tags all generated adjusting transactions with `#amort`.
* If a transaction has a tag (e.g. `#holiday-2026`), the adjustments are grouped by that tag, keeping distinct events separated.
* Fully configurable amortization period (in months) and decimal precision per account.

### Configuration Example

Add the plugin to your ledger:

```beancount
plugin "beancount_blue.amortize" "{
    'accounts': {
        'Expenses:Renovation': {
            'months': 12,
            'decimals': 2,
        },
        'Expenses:Insurance': {
            'months': 12,
            'decimals': 2,
        }
    }
}"

2023-01-15 * "Annual Home Insurance"
  Expenses:Insurance  1200.00 GBP
  Assets:Bank        -1200.00 GBP
```

### Resulting Behavior
The £1,200.00 expense recorded in January is amortized over 12 months (£100.00/month from January to December) using an equity holding account (`Equity:Amortization:Insurance`), ensuring your monthly income and expense reports reflect true monthly consumption.

---

## UK Capital Gains

The `calc_gains` plugin automates capital gains tax calculations for investment and trading portfolios according to UK HMRC regulations.

### Key Features
* **Section 104 Holding Pools:** Implements the average-cost pool method (`cost_avg`) for shares and securities.
* **Lot Rebalancing (`lots_adjust`):** Automatically liquidates previous inventory positions and generates matching capital gains/loss postings to your designated income or equity account.
* **Cost Basis Tracking:** Accurately adjusts the cost basis of holdings following acquisitions and redemptions.

### Configuration Example

```beancount
option "booking_method" "NONE"

plugin "beancount_blue.calc_gains" "{
    'accounts': {
        'Assets:Investments:GIA': {
            'method': 'cost_avg',
            'counterAccount': 'Income:CapitalGains',
            'lots_adjust': True
        }
    }
}"

2023-01-25 * "Buy Share A"
  Assets:Investments:GIA   10 VUSA {{ 50.00 GBP }}
  Assets:Bank             -50.00 GBP

2023-01-26 * "Buy Share A"
  Assets:Investments:GIA   10 VUSA {{ 90.00 GBP }}
  Assets:Bank             -90.00 GBP

2023-02-25 * "Sell Share A"
  Assets:Investments:GIA   -4 VUSA {{ 40.00 GBP }}
  Assets:Bank              40.00 GBP
```

---

## Clear Residual Lots

When using Beancount's `NONE` booking method, selling assets might not clear the original purchase lots with exact floating-point precision. This leaves tiny fractional "dust" positions (e.g. `0.000001 LOT`) that prevent accounts from being cleanly closed and clutter Fava reports.

The `clear_residual_lots` plugin detects pending account closures and automatically injects a balancing transaction immediately before the `close` directive to zero out any residual lots.

### Configuration Example

Pass the balancing account name as the plugin argument:

```beancount
plugin "beancount_blue.clear_residual_lots" "Equity:Gains"

2020-01-01 open Assets:Investments:Crypto
...
2024-12-30 close Assets:Investments:Crypto
```

---

## Auto-Tagger

The `tag` plugin automatically applies tags to transactions whenever specific accounts are involved, simplifying filtering, reporting, and categorization.

### Configuration Example

```beancount
plugin "beancount_blue.tag" "{
    'accounts': {
        'Expenses:Groceries': 'groceries',
        'Expenses:Entertainment': 'fun',
        'Income:Salary': 'taxable'
    }
}"

2024-03-01 * "Tesco"
  Expenses:Groceries  45.00 GBP
  Assets:Current:Monzo -45.00 GBP
; This transaction will automatically receive the #groceries tag.
```

---

## API Reference

### `beancount_blue.amortize`
::: beancount_blue.amortize

### `beancount_blue.calc_gains`
::: beancount_blue.calc_gains

### `beancount_blue.clear_residual_lots`
::: beancount_blue.clear_residual_lots

### `beancount_blue.tag`
::: beancount_blue.tag
