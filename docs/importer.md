# API Importers & ML Prediction

`beancount-blue` includes an extensible, secure banking API ingestion engine. It connects directly to bank and Open Banking APIs, stores state locally in compressed, version-controlled caches, and generates native Beancount directives.

It uniquely features a built-in **Machine Learning Predictor** using `scikit-learn` that learns from your existing Beancount books to automatically categorize payees and counter-accounts for incoming transactions.

---

## Supported Bank Providers

### 1. Monzo (`monzo`)
* **Authentication:** OAuth 2.0 via Monzo Developer Portal ([developers.monzo.com](https://developers.monzo.com/)).
* **Capabilities:**
  * Ingests transactions and balances from standard current accounts, joint accounts, and Monzo Flex.
  * Automatically detects Monzo Pots and generates internal transfer postings to pot accounts (e.g. `Assets:Monzo:Main -> Assets:Monzo:HolidayPot`).
  * Correctly resolves pending card authorizations and Mastercard clearing reversals using `mastercard_lifecycle_id`.
  * Supports pocket money transfers for Young Monzo accounts.

### 2. Starling (`starling`)
* **Authentication:** Personal Access Token via Starling Developer Portal.
* **Capabilities:**
  * Ingests primary accounts, spending spaces, and savings spaces.
  * Automatically maps internal transfers between spaces.
  * Supports multi-user joint accounts via `user_map` (mapping Starling user UUIDs to friendly names in transaction metadata).

### 3. TrueLayer Open Banking (`truelayer`)
* **Authentication:** OAuth 2.0 Open Banking client credentials via TrueLayer Console ([console.truelayer.com](https://console.truelayer.com/)).
* **Capabilities:**
  * Connects to dozens of UK and European banks, credit cards, and institutions (Amex, Chase, Barclaycard, etc.).
  * Synchronizes both bank accounts and credit cards with automated debit/credit sign standardization.

---

## Configuration

Importers are configured through YAML files typically stored in your `api_configs/` directory.

### Example Configuration: Monzo (`api_configs/monzo.yaml`)

```yaml
importer_name: monzo
client_id: "oauth2client_00000000000000"
client_secret: "mnzpub.secret_key_here"

# Cache & State Settings
cache_data: "data/monzo.json.gz"
units: 2

# Native Machine Learning Prediction
auto_predict: true
predict_ledger_path: "main.beancount"
predict_model_path: "data/monzo_model.joblib"
predict_min_confidence: 0.6
predict_retrain_days: 7.0

# Account Mapping (Anchor Account)
account_map:
  acc_123456789: "Assets:Current:Monzo"
```

### Example Configuration: Starling (`api_configs/starling.yaml`)

```yaml
importer_name: starling
personal_access_token: "your_starling_token_here"
cache_data: "data/starling.json.gz"

auto_predict: true
predict_ledger_path: "main.beancount"
predict_model_path: "data/starling_model.joblib"

account_map:
  "00000000-0000-0000-0000-000000000001": "Assets:Current:Starling"

user_map:
  "88888888-8888-8888-8888-888888888888": "Alice"
```

### Example Configuration: TrueLayer (`api_configs/truelayer.yaml`)

```yaml
importer_name: truelayer
client_id: "your_truelayer_client_id"
client_secret: "your_truelayer_client_secret"
cache_data: "data/truelayer.json.gz"

auto_predict: true
predict_ledger_path: "main.beancount"
predict_model_path: "data/truelayer_model.joblib"

account_map:
  "acc_amex_gold": "Liabilities:CreditCard:Amex"
```

---

## Machine Learning Auto-Categorization

When `auto_predict: true` is enabled, the importer automatically learns from your historical ledger:

1. **Training Heuristic:** On extraction, it loads transactions from `predict_ledger_path` involving the accounts listed in `account_map`.
2. **Feature Extraction & Classification:** It extracts text features (narration, description, existing payee) using a `TfidfVectorizer` and fits a fast, lightweight online logistic regression model (`SGDClassifier`).
3. **Model Persistence:** The pipeline is serialized to `predict_model_path` using `joblib`.
4. **Inference:** When new transactions arrive from the bank API, the model predicts the most likely `counter_account` (e.g. `Expenses:Groceries`) and clean `payee`. Predictions with probability above `predict_min_confidence` are automatically injected into the imported entries.
5. **Smart Retraining:** The model is automatically retrained when your ledger file modification time (`mtime`) is newer than the saved model file, or if the model file is older than `predict_retrain_days`.

---

## Command Line Interface (`bean-blue-importer`)

`beancount-blue` installs a dedicated CLI tool: `bean-blue-importer`.

### Common Commands

```bash
# 1. Fetch latest data from bank API and save compressed cache
bean-blue-importer sync --settings api_configs/monzo.yaml

# 2. Output Beancount directives with ML predictions applied
bean-blue-importer beancount --settings api_configs/monzo.yaml > imported_entries.beancount

# 3. Force-retrain the ML categorization model
bean-blue-importer train --settings api_configs/monzo.yaml --ledger main.beancount
```

---

## Python API Reference

### `beancount_blue.importer.delta_importer`
::: beancount_blue.importer.delta_importer.APIImporter
    options:
      show_root_heading: true

### `beancount_blue.importer.monzo`
::: beancount_blue.importer.monzo.MonzoImporter
    options:
      show_root_heading: true

### `beancount_blue.importer.starling`
::: beancount_blue.importer.starling.StarlingImporter
    options:
      show_root_heading: true

### `beancount_blue.importer.truelayer`
::: beancount_blue.importer.truelayer.TrueLayerImporter
    options:
      show_root_heading: true
