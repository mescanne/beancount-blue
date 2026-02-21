# Product Guidelines: beancount-blue

# Design Principles
- **Accuracy:** Financial calculations must be precise and correct.
- **Simplicity:** Plugins should be easy to configure and use.
- **Robustness:** Handle edge cases and malformed data gracefully.
- **Maintainability:** Code should be modular, typed, and well-tested.

# Prose & Documentation Style
- **Clarity:** Use clear, concise language in all documentation.
- **Consistency:** Follow standard terminology for Beancount.
- **Examples:** Provide practical, copy-pastable examples for each plugin.
- **Transparency:** Clearly state any assumptions or limitations in calculations.

# User Experience (CLI & Library)
- **Informative Feedback:** Provide clear error messages and progress updates.
- **Sensible Defaults:** Use defaults that work for most users but allow customization.
- **Stability:** Maintain backward compatibility whenever possible.
- **Discoverability:** Use consistent naming conventions for plugins and options.

# Importer Design

The importer is designed to provide a framework for importing from stateful APIs. These
APIs will be provide transactions, potentially unsettled, and updates to these transactions.

There are several layers in the framework:
- **API Refreshing.**
  - This is API specific and will have a separate implementation per API (e.g. Monzo, Starling, etc).
  - As part of this framework, it takes a mutable state (for persisting across refreshes), an immutable configuration
    (for access tokens, etc), and a method to refresh() (connect to the API and download) and to extract
    standardized transactions that can be imported.
  - The mutable state is intended to reflect the raw data (converted into JSON, most of the data, not necessarily all)
    that comes from the API.
  - The standardized transactions are *not* beancount formatted, but rather in a format that is sympathetic to changing transactions
    with metadata from an API. So they may have description, payee, etc but not a counteraccount. Plus the transaction may
    change as it settles.
  - This code will fundamentally need to be tested by hand, unfortunately, but the CLI tools (see below) will make it
    easier to test by hand and the functionality will be focused on the API provider specific aspect.

- **API Library.**
  - This is a library (for persisting and updating the mutable state) and for transforming the standardized transactions into
    Beancount transactions. The transformation into standardized transactions also includes establishing balance assertions and
    updating (amended) transactions.
  - This should be tested extensively through unit tests.

- **CLI Driver.**
  - This is a CLI driver for the lib rary against any one of the provided APIs. The mutable state is managed by the library,
    and the immutable configuration is via a YAML file. Commands are available to refresh the state, du mp the saved mutable state,
    and showing the standardized transactions for importing.
  - This is useful for testing the provided APIs.

- **Beancount Driver.**
  - This is a Beancount Driver that adapts the APIs directly into Beancount with configuration provided through YAML files
    that are in the to-be-imported folder.
