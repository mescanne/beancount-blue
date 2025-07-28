"""
A Beancount plugin to automatically clear residual lots from closed accounts.

This plugin is designed to solve a specific problem that occurs when using the
'NONE' booking method. With this method, sales of assets do not reduce the
original purchase lots, leaving a list of residual lots in the account's final
inventory, even when the account's market value is zero. This causes tools
like Fava to continue displaying these closed accounts.

HOW IT WORKS:
1.  It first identifies all accounts that have a 'close' directive.
2.  It then processes all transactions for those specific accounts, building a
    running inventory of every lot that was ever added or removed.
3.  After calculating the final, residual inventory for each closed account, it
    creates a single new balancing transaction for each.
4.  This new transaction is dated the day before the account's closure and
    contains postings that perfectly cancel out every remaining lot.
5.  These lots are balanced against a user-specified write-down account.
6.  The new transaction is injected into the stream of entries right before the
    corresponding 'close' directive, ensuring the account is truly empty when
    closed.
"""

# import ast
from collections import defaultdict
from datetime import timedelta
from typing import Any

from beancount.core import data, inventory
from beancount.core.data import Entries
from beancount.core.flags import FLAG_OKAY
from beancount.core.number import ZERO

__plugins__ = ["clear_residual_lots"]


def clear_residual_lots(entries, _, config_str) -> tuple[Entries, list[Any]]:
    """
    The main plugin function.

    Args:
        entries:    The full list of Beancount entries.
        _:          The Beancount options map.
        config_str: The string provided in the plugin configuration, which
                    should be the name of the balancing account.
    Returns:
        A tuple of (new_entries, errors).
    """
    if not config_str:
        raise ValueError(  # noqa: TRY003
            "Plugin 'clear_residual_lots' requires a balancing account "
            "to be specified in the configuration string. \n"
            'Example: plugin "beancount_blue.clear_residuals_lots" "Equity:Gains"'
        )

    balance_account = config_str

    # Find all closed accounts
    closed_accounts = {entry.account: entry.date for entry in entries if isinstance(entry, data.Close)}

    # Nothing closed -- nothing to do
    if not closed_accounts:
        return entries, []

    # Calculate all residual inventory across closed accounts
    residual_inventories = defaultdict(inventory.Inventory)
    for entry in entries:
        if isinstance(entry, data.Transaction):
            for posting in entry.postings:
                if posting.account in closed_accounts:
                    residual_inventories[posting.account].add_position(posting)

    # Generate balancing transactions for accounts with residuals.
    balancing_txns = {}
    for account, residual_inv in residual_inventories.items():
        # Only process accounts that have a non-empty inventory.
        if residual_inv.is_empty():
            continue

        postings = []
        # Create postings to cancel out every lot in the residual inventory.
        for pos in residual_inv.get_positions():
            if pos.units.number == ZERO:
                continue

            # Add a posting to negate the residual lot.
            postings.extend([
                data.Posting(account, -pos.units, pos.cost, None, None, None),
                data.Posting(balance_account, pos.units, pos.cost, None, None, None),
            ])

        if not postings:
            continue

        close_date = closed_accounts[account]
        balancing_date = close_date - timedelta(days=1)
        meta = data.new_metadata(f"plugin:{__file__}", 0)
        narration = f"Automatically clear residual lots from closed account: {account}"

        balancing_txns[account] = data.Transaction(
            meta, balancing_date, FLAG_OKAY, "", narration, data.EMPTY_SET, data.EMPTY_SET, postings
        )

    # Skip if no balancing transactions
    if not balancing_txns:
        return entries, []

    return entries + list(balancing_txns.values()), []
