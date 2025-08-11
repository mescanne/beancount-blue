"""Tag transactions based on account.

This plugin automatically adds tags to transactions based on the accounts they
involve. This can be useful for categorizing transactions and for generating
reports.

For example, you can configure the plugin to add the tag "shopping" to any
transaction that involves the account "Expenses:Shopping".

Example configuration:

.. code-block:: beancount

    plugin "beancount_blue.tag" "{
        'accounts': {
            'Expenses:Shopping': 'shopping',
            'Expenses:Groceries': 'groceries'
        }
    }"

"""

import ast
from typing import Any

from beancount.core.data import Entries, Transaction

__plugins__ = ["tag"]


def tag(entries: Entries, _, config_str: str) -> tuple[Entries, list[Any]]:
    """Tag transactions based on account.

    This function is the entry point for the Beancount plugin. It takes the
    existing entries, the Beancount options, and a configuration string.

    The configuration string should be a Python dictionary literal that maps
    account names to the tags that should be applied.

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
        return entries, ["no accounts defined"]

    new_entries = entries[:]

    errors = []
    for acct, tag in accounts.items():
        print(f"Running tag for {acct}, tag {tag}")

        for transId, entry in enumerate(new_entries):
            if not isinstance(entry, Transaction):
                continue
            if all(post.account != acct for post in entry.postings):
                continue
            new_entries[transId] = entry._replace(tags=frozenset(set(entry.tags).union([tag])))

    return new_entries, errors
