import unittest

from beancount import loader

from beancount_blue.tag import tag


class TestTag(unittest.TestCase):
    @loader.load_doc()
    def test_simple_tagging(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Groceries"
          Expenses:Groceries  50.00 GBP
          Assets:Cash        -50.00 GBP

        2023-01-16 * "Shopping"
          Expenses:Shopping  100.00 GBP
          Assets:Cash        -100.00 GBP
        """

        config = """{
            'accounts': {
                'Expenses:Groceries': 'groceries-tag',
                'Expenses:Shopping': 'shopping-tag'
            }
        }"""

        new_entries, errors = tag(entries, options_map, config)

        self.assertEqual(0, len(errors))
        self.assertEqual(5, len(new_entries))

        from beancount.core.data import Transaction

        transactions = [entry for entry in new_entries if isinstance(entry, Transaction)]
        self.assertEqual(2, len(transactions))

        # Check that the first transaction has the 'groceries-tag'
        groceries_txn = transactions[0]
        self.assertIn("groceries-tag", groceries_txn.tags)

        # Check that the second transaction has the 'shopping-tag'
        shopping_txn = transactions[1]
        self.assertIn("shopping-tag", shopping_txn.tags)
