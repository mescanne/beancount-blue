"""Amortize expenses over a period of months.

This plugin amortizes expenses over a specified number of months. When you
purchase something with a long-term benefit (like a yearly subscription), you
can use this plugin to spread the expense over the entire period.

For example, if you have a transaction for a 12-month subscription, this plugin
will generate a series of transactions to spread the cost over the 12 months.

To use this plugin, you need to configure it with the accounts you want to
amortize and the number of months for each.
"""

import ast
from collections import defaultdict, namedtuple
from decimal import Decimal

from beancount.core.amount import Amount
from beancount.core.data import Entries, Posting, Transaction
from beancount.core.flags import FLAG_OKAY
from dateutil import relativedelta

__plugins__ = ["amortize"]


AmortizeError = namedtuple("AmortizeError", "source message entry")


def amortize(entries: Entries, _, config_str: str) -> tuple[Entries, list[AmortizeError]]:
    """Amortize expenses over a period of months.

    This function is the entry point for the Beancount plugin. It takes the
    existing entries, the Beancount options, and a configuration string.

    The configuration string should be a Python dictionary literal that specifies
    which accounts to amortize and over how many months.

    Example configuration:

    .. code-block:: beancount

        plugin "beancount_blue.amortize" "{
            'accounts': {
                'Expenses:Software': {'months': 12},
                'Expenses:Subscriptions': {'months': 12},
            }
        }"

    Args:
        entries: A list of beancount entries.
        _: The Beancount options map (not used).
        config_str: A string containing the configuration for the plugin.

    Returns:
        A tuple of the modified entries and a list of errors.
    """

    config = ast.literal_eval(config_str)
    accounts = config.get("accounts", None)
    if not accounts:
        return entries, [AmortizeError(source=None, message="no accounts defined", entry=None)]

    new_entries = entries[:]

    errors = []
    for config_acct, acct_config in accounts.items():
        if not config_acct.startswith("Expenses:"):
            raise Exception(f"amortize requires Expenses: accounts, got {config_acct}")  # noqa: TRY002, TRY003
        acct = config_acct.replace("Expenses:", "Equity:Amortization:")
        counteraccount = config_acct
        months = acct_config.get("months", None)
        if months is None:
            errors.append(AmortizeError(source=None, message=f"no months for account {config_acct}", entry=None))
        decimals = acct_config.get("decimals", 2)

        # Collect all of the trading histories
        cashflow = {}
        src = {}
        for _, entry in enumerate(entries):
            if not isinstance(entry, Transaction):
                continue
            for _, post in enumerate(entry.postings):
                if post.account != config_acct:
                    continue
                if len(entry.tags) > 1:
                    errors.append(AmortizeError(entry=entry, message="must be zero or one tag only", source=None))
                    continue
                if not post.units or not post.units.number:
                    errors.append(
                        AmortizeError(entry=entry, message="cannot amortize a posting without units", source=None)
                    )
                    continue
                tag = next(iter(entry.tags)) if entry.tags else ""
                key = (tag, post.units.currency)
                if key not in cashflow:
                    cashflow[key] = defaultdict(Decimal)
                    src[key] = {
                        "lineno": entry.meta["lineno"],
                        "filename": entry.meta["filename"],
                    }
                # Immediately reverse the original expense
                new_entries.append(
                    Transaction(
                        date=entry.date,
                        meta=entry.meta,
                        flag=FLAG_OKAY,
                        payee="Amortization",
                        narration=f"Reverse original expense for {config_acct}",
                        tags=frozenset(list(entry.tags) + ["amort-internal"]),
                        links=frozenset(),
                        postings=[
                            Posting(acct, Amount(number=-1 * post.units.number, currency=post.units.currency), None, None, None, {}),
                            Posting(counteraccount, Amount(number=post.units.number, currency=post.units.currency), None, None, None, {}),
                        ],
                    )
                )

                remaining_amt = post.units.number
                for i in range(months):
                    cashflow_amt = Decimal(round(remaining_amt / (months - i), decimals))
                    cashflow_date = (
                        entry.date + relativedelta.relativedelta(months=i) + relativedelta.relativedelta(day=31)
                    )
                    cashflow[key][cashflow_date] += cashflow_amt
                    remaining_amt -= cashflow_amt

        for key, amts in cashflow.items():
            narration = "Amortization Adjustment"
            if key[0]:
                narration = narration + f" for {key[0]}"
            for date, amt in amts.items():
                new_entries.append(
                    Transaction(
                        date=date,
                        meta=src[key],
                        flag=FLAG_OKAY,
                        payee="Amortized",
                        narration=narration,
                        tags=frozenset({key[0], "amort"}) if key[0] else frozenset({"amort"}),
                        links=frozenset(),
                        postings=[
                            Posting(acct, Amount(number=amt, currency=key[1]), None, None, None, {}),
                            Posting(counteraccount, Amount(number=-1 * amt, currency=key[1]), None, None, None, {}),
                        ],
                    )
                )

    return new_entries, errors
