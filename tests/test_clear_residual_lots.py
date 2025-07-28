import unittest

from beancount import loader
from beancount.core.amount import Amount
from beancount.core.data import Transaction
from beancount.core.number import D

from beancount_blue.clear_residual_lots import clear_residual_lots


class TestClearResidualLots(unittest.TestCase):
    @loader.load_doc()
    def test_simple_residual_clear(self, entries, _, options_map):
        """
        option "booking_method" "NONE"
        plugin "beancount.plugins.auto_accounts"

        2022-01-01 commodity TEST
          price: "USD"

        2023-01-15 open Assets:Investments
        2023-01-15 open Equity:Gains

        2023-01-15 * "Buy TEST"
          Assets:Investments    10 TEST {100.00 USD}
          Assets:Cash      -1000.00 USD

        2023-06-15 * "Sell TEST"
          Assets:Investments   -10 TEST {120.00 USD}
          Assets:Cash       1200.00 USD

        2024-01-01 close Assets:Investments
        """

        self.assertEqual(7, len(entries))

        (new_entries, errors) = clear_residual_lots(entries, options_map, "Equity:Gains")

        self.assertEqual(0, len(errors))
        self.assertEqual(8, len(new_entries))

        # Check the generated transaction
        generated_txn = new_entries[-1]
        if not isinstance(generated_txn, Transaction):
            self.assertTrue(False, "invalid type")
            return
        self.assertEqual(
            "Automatically clear residual lots from closed account: Assets:Investments",
            generated_txn.narration,
        )
        self.assertEqual(4, len(generated_txn.postings))
        self.assertEqual("Assets:Investments", generated_txn.postings[0].account)
        self.assertEqual(Amount(D("-10"), "TEST"), generated_txn.postings[0].units)
        self.assertEqual("Equity:Gains", generated_txn.postings[1].account)
        self.assertEqual(Amount(D("10"), "TEST"), generated_txn.postings[1].units)
        self.assertEqual("Assets:Investments", generated_txn.postings[2].account)
        self.assertEqual(Amount(D("10"), "TEST"), generated_txn.postings[2].units)
        self.assertEqual("Equity:Gains", generated_txn.postings[3].account)
        self.assertEqual(Amount(D("-10"), "TEST"), generated_txn.postings[3].units)
