"""Automatically clear residual lots from closed accounts.

This plugin is designed to solve a specific problem that can occur when using
the 'NONE' booking method in Beancount. With this method, sales of assets do not
always perfectly clear the original purchase lots, which can leave small
residual amounts in the account's inventory. This can cause issues with some
tools, like Fava, which may continue to display accounts that should be closed.

This plugin solves this by creating a balancing transaction to clear out any
remaining lots just before the account is closed.

Example configuration:

.. code-block:: beancount

    plugin "beancount_blue.clear_residual_lots" "Equity:Gains"

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


def clear_residual_lots(entries: Entries, _: Any, config_str: str) -> tuple[Entries, list[Any]]:
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
