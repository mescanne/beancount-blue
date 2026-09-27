# Welcome to beancount-blue

[![Release](https://img.shields.io/github/v/release/mescanne/beancount-blue)](https://github.com/mescanne/beancount-blue/releases)
[![PyPI](https://img.shields.io/pypi/v/beancount-blue)](https://pypi.org/project/beancount-blue/)
[![Build status](https://img.shields.io/github/actions/workflow/status/mescanne/beancount-blue/main.yml?branch=main)](https://github.com/mescanne/beancount-blue/actions/workflows/main.yml?query=branch%3Amain)
[![License](https://img.shields.io/github/license/mescanne/beancount-blue)](https://github.com/mescanne/beancount-blue/blob/main/LICENSE)
[![Python Versions](https://img.shields.io/pypi/pyversions/beancount-blue)](https://pypi.org/project/beancount-blue/)

**`beancount-blue`** is a comprehensive, production-tested toolkit for [Beancount](https://beancount.github.io/docs/) and [Fava](https://beancount.github.io/fava/). It provides automated Open Banking API integrations, machine-learning-driven auto-categorization, a native Fava web management interface, and essential accounting plugins.

---

## Key Features

### 🏦 Automated Banking API Importers
Connect directly to UK and European bank APIs to ingest transactions and balances automatically:
* **Monzo:** Native OAuth integration supporting personal, joint, Flex, pots, and child accounts.
* **Starling:** Personal Access Token integration supporting primary accounts, categories, and spending spaces.
* **TrueLayer (Open Banking):** Connect to major UK/EU banks and credit cards (Amex, Chase, Barclaycard, etc.).

### 🤖 Machine Learning Auto-Categorization
Includes a native machine learning categorization pipeline based on `scikit-learn` (`SGDClassifier` with TF-IDF vectorization):
* Automatically trains on your existing ledger entries.
* Predicts payees and counter-accounts with configurable confidence thresholds.
* Automatically retrains when your ledger file is edited.

### 🌐 Fava Web Management Extension (BankSync)
An embedded web UI inside Fava:
* **Integrations Dashboard:** Real-time table displaying configured bank integrations, latest balances, sync status, and errors.
* **Interactive Sync:** Trigger API syncs and review imports directly from the browser.
* **In-Browser Configuration:** Add new APIs (`+ Add API`) and edit configurations in a built-in Monaco YAML editor.

### 🧮 Core Accounting Plugins
* **[Amortization](modules.md#amortize):** Spread multi-month expenses (e.g. annual insurance, subscriptions) evenly across time using automated equity balancing.
* **[UK Capital Gains Tax](modules.md#uk-capital-gains):** Calculate capital gains following HMRC rules (same-day rule, 30-day "bed and breakfast" rule, and Section 104 average-cost holding pools).
* **[Clear Residual Lots](modules.md#clear-residual-lots):** Automatically balances and cleans fractional leftover lots that accumulate when using the `NONE` booking method.
* **[Auto-Tagger](modules.md#auto-tagger):** Automatically applies tags to transactions based on involved accounts.

---

## Installation

Install `beancount-blue` using `pip`:

```bash
pip install beancount-blue
```

Or using `uv`:

```bash
uv add beancount-blue
```

---

## Documentation Guide

* **[Fava Extension Guide](fava.md):** How to enable and use the BankSync dashboard in Fava.
* **[API Importers & ML Predictor](importer.md):** Configuration guide for Monzo, Starling, TrueLayer, ML auto-categorization, and the `bean-blue-importer` CLI.
* **[Core Plugins Reference](modules.md):** Usage guides and directives for `amortize`, `calc_gains`, `clear_residual_lots`, and `tag`.
