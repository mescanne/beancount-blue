import unittest

from beancount import loader

from beancount_blue.amortize import amortize


class TestAmortize(unittest.TestCase):
    @loader.load_doc()
    def test_simple_amortization(self, entries, _, options_map):
        """
        option "booking_method" "NONE"
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Software Purchase"
          Expenses:Software  1200.00 GBP
          Assets:Cash       -1200.00 GBP
        """

        config = """{
                'accounts': {
                        'Expenses:Software': {
                            'expense_account': 'Expenses:Software',
                            'months': 12,
                        }
                }
        }"""

        new_entries, errors = amortize(entries, options_map, config)

        self.assertEqual(0, len(errors))
        self.assertEqual(16, len(new_entries))

        # The original transaction plus 1 reversing transaction plus 12 amortization transactions
        amortization_txns = new_entries[4:]
        from beancount.core.data import Transaction

        transactions = [txn for txn in amortization_txns if isinstance(txn, Transaction)]

        from decimal import Decimal

        # Check the first amortization transaction
        posting = transactions[0].postings[0]
        if posting.units and posting.units.number is not None:
            self.assertEqual(Decimal("100.00"), posting.units.number)
        posting = transactions[0].postings[1]
        if posting.units and posting.units.number is not None:
            self.assertEqual(Decimal("-100.00"), posting.units.number)

        # Check the last amortization transaction
        posting = transactions[11].postings[0]
        if posting.units and posting.units.number is not None:
            self.assertEqual(Decimal("100.00"), posting.units.number)
        posting = transactions[11].postings[1]
        if posting.units and posting.units.number is not None:
            self.assertEqual(Decimal("-100.00"), posting.units.number)

        # Check the total amount amortized
        total_amortized = Decimal(0)
        for txn in transactions:
            posting = txn.postings[0]
            if posting.units and posting.units.number is not None:
                total_amortized += posting.units.number
        self.assertAlmostEqual(Decimal("1200.00"), total_amortized, places=2)
