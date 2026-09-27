# Fava Web Extension: BankSync

`beancount-blue` includes **BankSync**, a native web extension for [Fava](https://beancount.github.io/fava/) that provides a visual dashboard for managing banking integrations, monitoring balances, and importing transactions directly within your browser.

---

## Enabling BankSync in your Ledger

To enable the extension in Fava, add the following directive to your main `.beancount` ledger file:

```beancount
2020-01-01 custom "fava-extension" "beancount_blue.importer.fava.bank_sync"
```

### Configuration Options

You can optionally pass a configuration dictionary as the last argument:

```beancount
2020-01-01 custom "fava-extension" "beancount_blue.importer.fava.bank_sync" "{'config_dir': 'api_configs'}"
```

* **`config_dir`** *(string, default: `"api_configs"`)*: The directory where your bank configuration YAML files are stored. If relative, it is resolved relative to the ledger file's location.

Once added, a new **"API Importers"** entry will appear in the Fava sidebar navigation.

---

## Features

### 1. Centralized Integrations Dashboard
The main view renders a clean overview table of all bank integrations found in your `config_dir`:
* **Integration Name & File:** The configuration filename (e.g. `api_monzo.yaml`).
* **Importer Type:** The provider type (`monzo`, `starling`, or `truelayer`).
* **Balances:** Real-time balances reported by the bank API across your accounts and spaces.
* **Last Sync:** Timestamp of the last successful synchronization.
* **Status:** Visual indicator (`OK` or `Error`) with expandable error diagnostics if a sync fails.

### 2. Interactive Synchronization & Import
* **Sync Button:** Click **Sync** on any integration row to trigger an immediate API refresh. The extension fetches new transactions, updates the cached balance state, and notifies you when finished.
* **Import Review:** Click **Import** to open Fava's native transaction review overlay. You can review pending and settled transactions, adjust auto-predicted counter-accounts, and commit them directly to your ledger files.

### 3. Adding New Integrations (`+ Add API`)
Click the **+ Add API** button in the dashboard to open the new integration wizard:
1. Select your provider (`Monzo`, `Starling`, or `TrueLayer`).
2. Give the integration a recognizable name (e.g. `joint_current`).
3. Click **Create**; BankSync generates a boilerplate YAML configuration in your `config_dir` and immediately opens it in the editor.

### 4. Built-in Monaco YAML Editor
Click **Edit** on any integration to open the embedded Monaco editor:
* Edit credentials, account maps, and ML prediction settings without leaving the browser.
* Real-time YAML syntax checking and Pydantic validation before saving.
* Sensitive fields (like `client_secret` and `personal_access_token`) are securely stored in your local configuration files.

---

## OAuth Redirect Callbacks

For integrations requiring OAuth (such as Monzo and TrueLayer):
1. Configure your developer application's redirect URI to:
   ```
   http://localhost:5000/<ledger_slug>/extension/BankSync/callback
   ```
   *(or the port where your Fava instance runs, e.g. `http://localhost:8000/...`)*
2. When authorizing, the bank will redirect back to Fava, and BankSync will automatically capture the authorization code, exchange it for tokens, and persist the state.
