import unittest

from beancount import loader
from beancount.core.amount import Amount
from beancount.core.data import Transaction
from beancount.core.number import D

from beancount_blue.calc_gains import calc_gains


class TestCalcUkGains(unittest.TestCase):
    @loader.load_doc()
    def test_simple_gain_calculation(self, entries, _, options_map):
        """
        option "booking_method" "NONE"
        plugin "beancount.plugins.auto_accounts"
        ;2022-12-31 commodity X
        ;  name: "Tradeable entity"
        ;  asset-class: "stock"

        2023/1/25 * "Acquisition"
          Assets:Test1  10 X {{ 10.00 GBP }}
          Assets:Cash  -100.00 GBP

        2023/2/25 * "Redemption"
          Assets:Test1  -4 X {}
          Assets:Cash   90.00 GBP
        """

        config = """{
                'accounts': {
                        'Assets:Test1': { 'method': 'cost_avg',
                                          'counterAccount': 'Equity:Gains'},
                        'Assets:Test2': { 'method': 'cost_avg',
                                          'counterAccount': 'Equity:Gains'},
                }
        }"""

        (gain_transactions, errors) = calc_gains(entries, options_map, config)

        self.assertEqual(4, len(gain_transactions))
        gain_txn = gain_transactions[3]

        if not isinstance(gain_txn, Transaction):
            self.assertTrue(False, "invalid type")
            return

        self.assertEqual(3, len(gain_txn.postings))

        # The original posting being adjusted
        self.assertEqual("Assets:Test1", gain_txn.postings[0].account)
        self.assertEqual(Amount(D("-4"), "X"), gain_txn.postings[0].units)
        # The cost is adjusted to the average cost of 10.00
        self.assertEqual(D("10.00"), gain_txn.postings[0].cost.number)

        # The original cash posting
        self.assertEqual("Assets:Cash", gain_txn.postings[1].account)
        self.assertEqual(Amount(D("90.00"), "GBP"), gain_txn.postings[1].units)

        # The new adjustment posting for the gain
        self.assertEqual("Equity:Gains", gain_txn.postings[2].account)
        self.assertEqual(Amount(D("-50.00"), "GBP"), gain_txn.postings[2].units)


# Tests:
# High priority:
# - Test applied adjustments with expected adjustments for the transactions
# - This needs to be for the base cost average approach
#   (other approaches can be tested in isolation)
# Low priority:
# - Separate tests for cost base averaging
# Low priority:
# - ensure accounts and commodities are filtered the right way
