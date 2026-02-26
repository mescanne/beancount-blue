"""Amortize expenses over a period of months.

This plugin will amortize all transactions in an Expense account in one aggregate transaction
across multiple months.

Key features:
 * It creates a single transaction each month to adjust the net expense to the amortized amount. It uses the Equity
   account if it needs to adjust the net expense over the time period.
 * It tags all adjustments with #amort so they can be filter out all amortization adjustments.
 * If the transaction has a tag, then the adjustments grouped by the tag and have both #amort and the transaction tag.
   This allows you to divide up different holidays by tag, for example.
 * You can configure the decimals for rounding and number of months.

This is best explained through a demonstration.

Example book:

    ; Configure the Expenses:Renovation account to be amortized over 12 months.
    ;
    ; It will use the Equity:Amortization:Renovation account as the holding account.
    ;
    plugin "beancount_blue.amortize" "{
            'accounts': {
                    'Expenses:Renovation': {
                        'months': 12,
                        'decimals': 2,
                    },
            }
    }"

    2023-01-15 * "Assorted Purchase"
      Expenses:Renovation  1000.00 GBP
      Assets:Bank         -1000.00 GBP

    2023-01-25 * "Assorted Purchase 2"
      Expenses:Renovation  200.00 GBP
      Assets:Bank         -200.00 GBP

    2023-02-15 * "Assorted Purchase 3"
      Expenses:Renovation  360.00 GBP
      Assets:Bank         -360.00 GBP

What will happen as a result of the above:
 * The first two transactions in January are aggregated (1200 GBP) and then divided up over 12 months, so 100 GBP a
   month from Jan 2023 to Dec 2023.
 * The transaction in February is divided up over 12 months, so 30 GBP a month from Feb 2023 to Jan 2024.
"""

import ast
from collections import defaultdict
from datetime import date
from decimal import Decimal
from typing import Any, NamedTuple

from beancount.api import FLAG_OKAY, Amount, Directive, Posting, Transaction
from beancount.core.data import Entries
from dateutil import relativedelta

__plugins__ = ["amortize"]


class AmortizeError(NamedTuple):
    source: str | None
    message: str
    entry: Directive | None


def amortize(entries: Entries, _: Any, config_str: str) -> tuple[Entries, list[AmortizeError]]:
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

    errors: list[AmortizeError] = []
    for config_acct, acct_config in accounts.items():
        if config_acct.startswith("Expenses:"):
            acct = config_acct.replace("Expenses:", "Equity:Amortization:")
        elif config_acct.startswith("Income:"):
            acct = config_acct.replace("Income:", "Equity:Amortization:")
        else:
            raise Exception(f"amortize requires Expenses: or Income: accounts, got {config_acct}")  # noqa: TRY002, TRY003
        counteraccount = config_acct
        months = acct_config.get("months", None)
        if months is None:
            errors.append(AmortizeError(source=None, message=f"no months for account {config_acct}", entry=None))
            continue
        decimals = acct_config.get("decimals", 2)

        # Collect all of the trading histories
        cashflow: dict[tuple[str, str], defaultdict[date, Decimal]] = {}
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
                remaining_amt = -1 * post.units.number
                amort_months = months
                if "amortization_months" in entry.meta:
                    amort_months = int(entry.meta["amortization_months"])
                quantizer = Decimal("1e-" + str(decimals))
                for i in range(amort_months):
                    v = (remaining_amt / (amort_months - i)).quantize(quantizer)
                    cashflow_amt = v
                    cashflow_date = (
                        entry.date + relativedelta.relativedelta(months=i) + relativedelta.relativedelta(day=31)
                    )
                    cashflow[key][cashflow_date] += cashflow_amt + (post.units.number if i == 0 else 0)
                    remaining_amt -= cashflow_amt

        for key, amts in cashflow.items():
            narration = "Amortization Adjustment"
            if key[0]:
                narration = narration + f" for {key[0]}"
            for ndate, amt in amts.items():
                if amt == Decimal(0):
                    continue
                new_entries.append(
                    Transaction(
                        date=ndate,
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
