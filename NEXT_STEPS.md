# Next Steps & Architectural Roadmap

*This document captures strategic technical debt, architectural vulnerabilities, and high-leverage refactoring initiatives for the `beancount-blue` project.*

## 1. The Strategic Map (Executive Summary)
At its core, `beancount-blue` aims to be an automated bridge between external banking APIs (Monzo, Starling, TrueLayer) and a local plaintext accounting system (Beancount), seamlessly embedded within the Fava web UI.

**The Assessment:** The architecture serves the business goal effectively but suffers from a "monolithic pipeline" mentality. By attempting to perform synchronous HTTP fetching, full-ledger I/O reads, local machine-learning model retraining, and file mutation entirely within a single web request or a single generic base class, the system guarantees severe fragility as ledgers scale. Its greatest strength—the rigorous mapping of configurations via modern Python typing—is currently being overshadowed by highly coupled, blocking application logic.

## 2. Architectural Critique

**Strengths**
* **Rigorous Configuration Binding:** Leveraging `pydantic` (and specifically `pydantic-settings` / `TypeAdapter`) to cast untyped YAML files into strongly validated Python configuration structures is state-of-the-art. The discriminator usage in the CLI to route bank types ensures the pipeline is inherently polymorphic.
* **API Offline Isolation:** The `cache_data` and `load_data` mechanics correctly separate the network-heavy API fetching phase from the Beancount translation phase. This allows the system to easily "replay" states offline, making testing and debugging remarkably stable.

**Vulnerabilities**
* **Synchronous Web Execution:** The Fava extension endpoints (`/generate`, `/sync`) invoke heavy data ingestion synchronously within the Flask request cycle. If a bank API rate-limits, or the system needs to retrain the ML model by loading a 10-year ledger via `beancount.loader.load_file`, the web request will inevitably time out.
* **Stateful Edge-Cases:** The ledger conflict-resolution logic in `imported_to_beancount` calculates delta sums based on versioning strings hidden in transaction metadata (`tx.meta["vers"]`). Tracking transaction versions mutably across string metadata is highly brittle and risks generating invalid negative offsetting entries if state is manipulated manually by the user.

**Coupling & Cohesion**
* **The `APIImporter` God Object:** The `delta_importer.py` base class violates the Single Responsibility Principle. It manages: Pydantic configuration schemas, dynamic type introspection, ledger account mapping/filtering, file-system date comparisons (`stat().st_mtime`), executing ML model training, and triggering Beancount generation. The system lacks clear boundaries between *configuration*, *execution*, and *transformation*.

## 3. Stack & Ecosystem Evaluation

**Library Choices**
* **Pydantic (v2):** Excellent choice. Optimal for configuration handling.
* **Bespoke Naive Bayes (`predictor.py`):** **Resolved.** Replaced the custom Naive Bayes implementation with a robust `scikit-learn` Logistic Regression engine (`SGDClassifier` with TF-IDF vectorization and `joblib` serialization). This provides magnitude speedups, superior NLP features, and standard model storage.
* **Beangulp vs Beancount.core:** The imports show ecosystem drift. You are mixing `beangulp.importer` (the newer v3 ecosystem approach) with legacy Beancount v2 entry models (`Directive`, `Entries`). This is a known symptom of the Beancount v3 migration, but it leaves the library straddling two shifting APIs.

**Tooling**
* **Build & Linting:** Exceptional. The usage of `uv`, strict `ruff` formatting, and `basedpyright` proves the foundational tooling is as modern and robust as the Python ecosystem allows.

## 4. Quality & Incubation Framework

**Testing Strategy**
* **Critique:** The testing relies far too heavily on full integration Playwright E2E browser sessions (`tests/test_coffee_flow.py`). While this verifies the "happy path", UI integration tests are slow, highly brittle, and terrible at proving edge-cases.
* **Proposed Shift:** Push testing down the pyramid. Extract the core transformation logic—`imported_to_beancount(imported_dataclasses, existing_ledger_entries)`—and write extensive `pytest` unit tests mapping isolated dataclasses directly to target Beancount `Entries`. You need explicit coverage for edge cases like multi-currency resolution, overlapping transaction IDs, and missing balances, detached entirely from HTTP fetching or browser rendering.

**Code Design & Style**
* **Side-Effect Heavy Prediction:** The `apply_predictions` method mutates incoming dataclasses directly inside loops (`tx.meta["conf_counteraccount"] = ...`). The importer pipeline should act as a pure functional transform.
* **Implicit Retraining Triggers:** The `beancount_load` method makes implicit file-system calls (`Path.exists()`, `stat().st_mtime`) to decide whether to trigger ML training. Application orchestration logic (cache staleness checks) should not be interleaved with data transformation logic.

## 5. The "Next 3 Moves"

**1. Extract the ML Predictor from the Importer Lifecycle**
Remove the file-system staleness checks and `predictor.train()` logic out of the `APIImporter.beancount_load` method. The importer should only *consume* a pre-computed model. Training should be explicitly orchestrated via the CLI (`uv run importer train`) or an explicit background hook, not hidden as a side-effect of hitting the "Generate" button.

**2. Decouple Fava Web Endpoints via Async or CLI delegation**
Halt synchronous processing inside the Flask request lifecycle. The Fava extension should merely *read* cached Beancount data for UI display. Rely on a background cron job (or the CLI) to fetch API data and update the cached state. If you must process from the UI, decouple generation into a background task queue (or at minimum, an asynchronous sub-process).

**3. Replace Bespoke ML with Scikit-Learn (Completed)**
Delete the pure Python `NaiveBayesPredictor` implementation. Replace it with `scikit-learn`. This reduces the codebase's liability, improves inference speed on large ledgers by orders of magnitude, and paves the way for vastly superior NLP heuristics (like n-grams and TF-IDF) without writing manual math.
