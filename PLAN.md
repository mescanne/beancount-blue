# Incubation Framework: API Importer Fava Extension

## 1. Strategic Direction
The `BankSync` extension is pivoting from a custom "Clearing House" UI that replicates transaction ingestion, to a lightweight **Configuration Manager** that delegates the heavy lifting to Fava's native import pipeline.

**Core Principles:**
- **Zero Ingestion Logic in the UI:** The extension will no longer fetch, parse, or present transactions.
- **Native Platform Delegation:** We lean entirely on Fava's `/import?auto_extract=<file>&importer=<importer>` mechanism to drive the import UI, loading states, and error handling.
- **External Dependencies for Heavy Lifting:** The browser-based editor will use Monaco Editor, loaded via CDN, to provide a rich YAML editing experience backed by our Python-generated JSON Schema without bloating the extension's bundle size.
- **Future-Proofing for Phase 2 ("Sync"):** While this phase strictly redirects to Fava for extraction, the architecture remains modular enough that a background `/sync` worker could be re-introduced later without disrupting the UI topology.

## 2. Core Architecture

### 2.1 Storage Boundary
- The current implementation passes configuration via the Beancount file (`fava-extension "beancount_blue.importer.fava.bank_sync"` string).
- **Change:** The extension will now manage distinct `api_*.yaml` files stored in a dedicated, well-known directory (e.g., `api_configs/` relative to the Beancount ledger path).
- Fava does not require these files to be in `import-dirs` when deep-linking. We will generate absolute paths from this known directory and pass them directly to Fava's deep link.

### 2.2 Extension Backend (Python)
The `BankSync` (to be renamed or refactored as `APIConfigManager` or similar) class in `beancount_blue/importer/fava/bank_sync.py` will be stripped of its transaction endpoints (`get_transactions`, `commit_transactions`, `sync`, `generate`).

**New API Surface:**
1.  **`@extension_endpoint("configs", methods=["GET"])`**:
    - Scans the dedicated configuration directory.
    - Returns a list of available `api_*.yaml` files and their paths.
2.  **`@extension_endpoint("config", methods=["GET", "POST", "DELETE"])`**:
    - Loads, saves, or deletes the raw YAML content for a specific file.
3.  **`@extension_endpoint("schema", methods=["GET"])`** (Keep existing):
    - Continues to serve `TypeAdapter(Importer).json_schema()` to validate the YAML via Monaco.

### 2.3 Frontend UI (Javascript + HTML)
The heavy `BankSync.js` will be gutted and replaced.

**UI Components:**
1.  **Sidebar/List View:** Displays the list of configured `api_*.yaml` files fetched from the backend.
2.  **Editor Pane:** A Monaco Editor instance (loaded via unpkg/CDN) configured for YAML.
    - Mapped to the JSON schema from the backend to provide real-time validation and autocomplete.
3.  **Action Bar:**
    - `Save`: Writes the YAML back to the backend endpoint.
    - `Import`: Constructs the redirect URL `window.location.href = "/import?auto_extract=" + encodeURIComponent(absolute_path) + "&importer=API+Importer"` and triggers the navigation.

## 3. Data Flow & Handoff

1.  User opens the extension in Fava.
2.  UI fetches the schema and the list of `api_*.yaml` files.
3.  User selects a file. UI loads the YAML content into Monaco Editor.
4.  User edits configuration. Monaco validates against the Pydantic-generated JSON schema.
5.  User clicks Save. YAML is pushed to the extension backend and written to disk.
6.  User clicks Import. The UI completely abandons its state and redirects the browser to Fava's native `/import` route, appending the absolute path of the YAML file.
7.  Fava's native `623c5fdb` commit takes over, triggering `BeancountAPIImporterV2` to extract entries dynamically using the saved configuration file.

## 4. Execution Guardrails
- **State Management:** Do not attempt to preserve state during the redirect to Fava. The Fava deep-link cleanly replaces the history state to prevent loop refresh issues.
- **Monaco Setup:** Use the standard `monaco-editor` CDN and wire up the `monaco-yaml` wrapper to natively bind our JSON schema. Do not attempt to run a Node build pipeline inside the Fava extension.
- **Validation:** Trust the Pydantic JSON schema. Do not duplicate validation logic in Javascript. If the YAML fails the schema check in Monaco, prevent saving.
