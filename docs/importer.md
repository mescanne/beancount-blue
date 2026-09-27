# API Importers & ML Prediction

`beancount-blue` includes a native API importer framework designed to securely connect to external APIs (like Monzo, Starling, and TrueLayer), cache state, and output standard Beancount directives.

It uniquely features a built-in **Machine Learning Predictor** that leverages a scikit-learn `SGDClassifier` pipeline to automatically predict the correct counter-accounts and payees for your transactions.

## Configuration

Importers are configured via a simple YAML or TOML file.

```yaml
# settings.yaml
importer_name: monzo
client_id: "your_client_id"
client_secret: "your_client_secret"

# ML Prediction Settings
auto_predict: true
predict_ledger_path: "main.beancount"
predict_model_path: "monzo_model.joblib"
predict_min_confidence: 0.5
predict_retrain_days: 7.0

# Account mapping
account_map:
  acc_123456789: "Assets:Current:Monzo"
```

### Auto-Categorization (Native ML)

When `auto_predict: true` is set, the importer will:
1. Parse the ledger defined in `predict_ledger_path` (e.g., `main.beancount`).
2. Train a lightweight logistic regression model (`SGDClassifier`) on past transactions involving the anchors defined in `account_map`.
3. Save the serialized model pipeline to `predict_model_path` (e.g., `monzo_model.joblib`).
4. Automatically inject predicted `payee` and `counter_account` values into new incoming API transactions if the confidence is greater than `predict_min_confidence`.

**Smart Retraining:** The system uses heuristics to know when to retrain. If you manually categorize a transaction in your `main.beancount` file, the importer will detect that the ledger's modification time is newer than the model file and automatically rebuild the model in the background on the next run. It will also forcefully retrain if the model is older than `predict_retrain_days`.

## CLI Usage

The framework exposes a command-line interface (`bean-blue-importer`) to interact with your configured importers.

```bash
# Sync data from the API and save state to disk
bean-blue-importer sync --settings settings.yaml

# Output Beancount directives (runs ML prediction during extraction)
bean-blue-importer beancount --settings settings.yaml > output.beancount

# Manually retrain the ML model from your ledger
bean-blue-importer train --settings settings.yaml --ledger main.beancount
```

## Available Importers

::: beancount_blue.importer.delta_importer.APIImporter
    options:
      show_root_heading: true

::: beancount_blue.importer.monzo.MonzoImporter
    options:
      show_root_heading: true

::: beancount_blue.importer.starling.StarlingImporter
    options:
      show_root_heading: true

::: beancount_blue.importer.truelayer.TrueLayerImporter
    options:
      show_root_heading: true
