# Incubation Framework: API Importer Dashboard

## 1. Strategic Direction
The extension will transition from a full-screen YAML editor into a **Fava-native Tabular Dashboard**. The primary user experience will be "at-a-glance" observability of all configured API integrations, their balances, and their sync health. Configuration editing and new integration creation will be deferred to overlay Modals.

**Core Principles:**
- **Observability First:** The main view is a table listing integrations, their status, last sync time, and available balances.
- **Resilient Identity:** An integration's identity is tied to its physical `api_*.yaml` file. Malformed YAML results in a dashboard "Error" state, not a disappeared integration.
- **Graceful Migration:** Adding sync metadata requires wrapping existing API cache payloads without breaking backward compatibility.

## 2. Data Models & State Management

### 2.1 The Sync Metadata Wrapper (`delta_importer.py`)
We will introduce a generic `ImporterState[T]` model to wrap the raw API data (`MonzoData`, `StarlingData`).
```python
class ImporterState[T: BaseModel](BaseModel):
    last_sync_time: datetime | None = None
    last_sync_error: str | None = None
    latest_transaction_date: date | None = None
    data: T
```
**Migration Boundary:** `utils.load` or `APIImporter.load_data` will be updated to handle legacy `.tar.gz` files. If it fails to parse into `ImporterState`, it will parse as the raw `APIData` and seamlessly wrap it in a new `ImporterState` envelope for future saves.

### 2.2 Backend In-Memory Dashboard Cache (`bank_sync.py`)
To prevent severe disk I/O and gzip decompression on every dashboard load, the Fava extension will maintain an instance-level cache:
`self._dashboard_cache: dict[str, dict]` (mapping `yaml_filename` to a parsed state dict).
- On the `/dashboard` API request, the backend stats the `mtime` of the `.yaml` and the associated `.tar.gz` file.
- It only triggers a re-parse or decompression if the `mtime` has changed since the last cache hit.

## 3. Extension API Boundaries

The python backend will expose the following distinct endpoints:

1. **`GET /dashboard`**: Returns the aggregated, cached list of integrations for the table.
   - *Payload:* `[{ "filename": "api_monzo.yaml", "importer_name": "Monzo", "status": "ok|error", "last_sync": "...", "balances": "...", "error_msg": "..." }]`
2. **`POST /sync`**: Accepts a `filename`.
   - Triggers `importer.load_data(cache_only=False)` (which runs `refresh()`).
   - Catches any exceptions, writes them to `last_sync_error` in the `ImporterState`, updates `last_sync_time`, and saves the `.tar.gz`.
3. **`GET /config` & `POST /config`**: (Existing) Reads and writes raw YAML for the Monaco editor.
4. **`POST /create`**: Accepts `importer_type` and `name`. Generates a boilerplate `api_{name}.yaml` (injecting a standardized `cache_data` path) and saves it to disk.

## 4. Frontend Architecture (Javascript + HTML)

### 4.1 Main View: The Dashboard Table
- A standard Fava data table.
- Columns: Integration (Name/File), Importer, Balances, Last Sync, Status, Actions.
- Actions:
  - `Sync` (Triggers `/sync` endpoint, shows a loading spinner on the row).
  - `Import` (Deep-links to Fava's `GlobalExtract` modal using `window.location.hash`).
  - `Edit` (Opens the Monaco Editor modal).

### 4.2 Modal: YAML Editor
- Triggered by the `Edit` action.
- Uses Fava's native CSS overlay conventions.
- Houses the Monaco Editor configured exactly as it is now.
- `Save` validates the YAML, pushes to backend, and refreshes the dashboard table.

### 4.3 Modal: New Integration
- Triggered by an "Add API" button on the dashboard.
- A simple HTML form: `<select>` for Importer Type (dynamically populated from Python schema), and a `<input>` for the recognizable Name.
- Submitting the form calls `/create`, then automatically opens the YAML Editor Modal for the user to paste their API keys.

## 5. Execution Guardrails
- **File Parsing Safety:** Ensure the Python loop generating the dashboard payload wraps YAML parsing in a `try/except` block. A user typing invalid YAML should never cause the entire `/dashboard` endpoint to 500.
- **Cache Invalidations:** Fava's `background_sync` or CLI triggers might update the `.tar.gz` file outside of the web UI. Relying on `os.stat().st_mtime` ensures the dashboard always picks up these out-of-band updates.
