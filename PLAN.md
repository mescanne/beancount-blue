# Architectural Roadmap & Execution Plan

## 1. The Strategic Map (Executive Summary)
The `beancount-blue` importer framework has successfully implemented a robust Anti-Corruption Layer: it cleanly translates unpredictable bank JSON into a normalized `ImportedTransaction` domain model before converting it into Beancount ledgers.

However, the current architecture conflates **Integration Definition** (what a specific bank does) with **Application Orchestration** (how the Beancount pipeline runs). The `APIImporter` base class currently acts as a God Object, forcing subclasses (Monzo, Starling) to inherit file I/O operations, ML model training, and Beancount state parsing.

**The Goal:** Disentangle the pure bank integration definitions from the shared pipeline orchestration. This will ensure bank modules remain razor-thin, the ML and Beancount translation logic remains truly shared, and the Fava UI can observe system state without instantiating heavy execution logic.

---

## 2. Core Refactor: Extracting the Orchestrator

We will split the monolithic `APIImporter` class into two distinct concepts: the **Integration Contract** and the **Pipeline Orchestrator**.

### Step 2.1: The Pure Integration Contract (`APIImporter`)
`APIImporter` will be stripped of all application orchestration logic (like `.tar.gz` saving, `st_mtime` checks, and Beancount ML loading). It will serve strictly as a strongly-typed Pydantic configuration and integration interface.

```python
class APIImporter[APIData: BaseModel](BaseSettings, metaclass=ABCMeta):
    # Configuration Fields...
    name: str
    cache_data: str | None
    auto_predict: bool

    @abstractmethod
    def refresh(self, state: APIData) -> None:
        """Hits the network, handles OAuth, updates the API payload state."""

    @abstractmethod
    def extract(self, state: APIData) -> list[ImportedTransaction]:
        """Translates raw API payload state into neutral domain models."""

    @abstractmethod
    def extract_available_balances(self, state: APIData) -> dict[str, tuple[Decimal, str]]:
        """Extracts raw bank balances for observability."""
```
*Result:* Integration files like `monzo.py` will contain only HTTP logic and data mapping.

### Step 2.2: The Pipeline Orchestrator (Shared Logic)
The disk I/O, caching, ML prediction, and Beancount generation will be extracted into standalone pure functions in `delta_importer.py`. These functions will *consume* an `APIImporter` instance.

```python
def fetch_and_cache_state(importer: APIImporter) -> ImporterState:
    """Handles disk I/O, cache staleness, and wraps the raw APIData."""
    # 1. Read .tar.gz (if exists)
    # 2. Try importer.refresh(state.data)
    # 3. Handle exceptions and update ImporterState envelope
    # 4. Save .tar.gz to disk

def run_import_pipeline(importer: APIImporter, existing_ledger: Entries = None) -> Entries:
    """The central nervous system of the importer pipeline."""
    # 1. IO Phase
    state = fetch_and_cache_state(importer)

    # 2. Extraction Phase
    imported_entries = importer.extract(state.data)
    imported_entries = importer.filter(imported_entries)

    # 3. Machine Learning Phase
    if importer.auto_predict:
        apply_ml_predictions(importer, imported_entries) # Orchestrates the scikit-learn training/loading

    # 4. Translation Phase
    final_entries = imported_to_beancount(imported_entries, existing_ledger, ...)
    return importer.filter_beancount(final_entries)
```

---

## 3. The Dashboard Observability Layer (Fava Integration)

With the orchestrator extracted, the Fava dashboard can now become a lightweight observability tool.

### 3.1 Passive State Reading
Fava no longer needs to instantiate `APIImporter` or parse Beancount ledgers just to show the dashboard.
- The `/dashboard` endpoint will simply parse the `ImporterState[T]` `.tar.gz` files from disk.
- It will read `last_sync_time`, `last_sync_error`, and call a standalone `format_balances` helper to display the health of the integrations.

### 3.2 Synchronous Fallback (The Escape Hatch)
Routine synchronization should be delegated to a CLI cronjob (`uv run importer ...`).
- The Fava UI's `POST /sync` button will remain synchronous, acting purely as an **interactive escape hatch** for resolving broken OAuth flows or forcing manual refreshes.
- A strict HTTP timeout wrapper will be added so that if a bank API hangs, the Fava web thread fails fast instead of indefinitely blocking the UI.

---

## 4. Execution Sequence

1. **Refactor `APIImporter` Base Class:** Move `load_data()`, `beancount_load()`, and `filter_beancount()` out of the class and into standalone functions.
2. **Update CLI:** Map the existing CLI `extract` and `train` commands to consume the new orchestrator functions.
3. **Update Beancount v2 Plugin (`api_importer.py`):** Update `extract()` to call `run_import_pipeline()`.
4. **Refactor Fava Sync:** Update the Fava extension to rely on `fetch_and_cache_state` instead of `importer.load_data()`.
