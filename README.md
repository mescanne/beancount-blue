# beancount-blue

[![Release](https://img.shields.io/github/v/release/mescanne/beancount-blue)](https://img.shields.io/github/v/release/mescanne/beancount-blue)
[![Build status](https://img.shields.io/github/actions/workflow/status/mescanne/beancount-blue/main.yml?branch=main)](https://github.com/mescanne/beancount-blue/actions/workflows/main.yml?query=branch%3Amain)
[![Commit activity](https://img.shields.io/github/commit-activity/m/mescanne/beancount-blue)](https://img.shields.io/github/commit-activity/m/mescanne/beancount-blue)

- **Github repository**: <https://github.com/mescanne/beancount-blue/>
- **Documentation** <https://mescanne.github.io/beancount-blue/>

`beancount-blue` is a collection of plugins for the [Beancount](https://beancount.github.io/docs/) plaintext accounting tool. These plugins provide additional functionality to help automate and streamline your bookkeeping.

## Plugins

This collection currently includes the following plugins:

- **[Amortize](https://mescanne.github.io/beancount-blue/modules/#beancount_blue.amortize)**: Amortize expenses over a specific period. For example, if you pay for a yearly subscription, you can use this plugin to spread the cost over 12 months.
- **[Tag](https://mescanne.github.io/beancount-blue/modules/#beancount_blue.tag)**: Automatically add tags to transactions based on the accounts they involve. This can help with tracking and reporting on specific categories of income or expenses.
- **[UK Capital Gains](https://mescanne.github.io/beancount-blue/modules/#beancount_blue.calc_uk_gains)**: A flexible capital gains calculator that can be configured to handle different tax regulations.
- **[Clear Residual Lots](https://mescanne.github.io/beancount-blue/modules/#beancount_blue.clear_residual_lots)**: Automatically clear out small, leftover lots in investment accounts that can occur when using the `NONE` booking method. This helps keep your books clean and accurate.

## Installation

To use these plugins, you first need to install this package:

```bash
pip install beancount-blue
```

Then, you can enable the plugins in your Beancount file by adding a line like this:

```beancount
plugin "beancount_blue.amortize" "{...}"
```

For more detailed instructions and configuration options, please see the [documentation](https://mescanne.github.io/beancount-blue/).

## Contributing

Contributions are welcome! If you have an idea for a new plugin or an improvement to an existing one, please open an issue or submit a pull request. See the [contributing guidelines](CONTRIBUTING.md) for more information.
