import unittest

from beancount import loader
from beancount.core.amount import Amount
from beancount.core.data import Transaction
from beancount.core.number import D
from beancount.ops.validation import validate
from beancount.parser import printer

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
          Assets:Test1  10 X {{ 50.00 GBP }}
          Assets:Test1  -50.00 GBP

        2023/1/26 * "Acquisition"
          Assets:Test1  10 X {{ 90.00 GBP }}
          Assets:Test1  -90.00 GBP

        2023/2/25 * "Redemption"
          Assets:Test1  -4 X {{ 40.00 GBP }}
          Assets:Test1  40.00 GBP
        """

        config = """{
                'accounts': {
                        'Assets:Test1': { 'method': 'cost_avg',
                                          'counterAccount': 'Equity:Gains', 'lots_adjust': True},
                        'Assets:Test2': { 'method': 'cost_avg',
                                          'counterAccount': 'Equity:Gains'},
                }
        }"""

        gain_transactions, errors = calc_gains(entries, options_map, config)

        for t in gain_transactions:
            print(printer.format_entry(t))

        self.assertTrue(validate(entries, options_map))
        # self.assertTrue(False)

        self.assertEqual(4, len(gain_transactions))
        gain_txn = gain_transactions[2]

        if not isinstance(gain_txn, Transaction):
            self.assertTrue(False, "invalid type")
            return

        self.assertEqual(4, len(gain_txn.postings))

        self.assertEqual(4, len(gain_txn.postings))

        # The original cash posting
        self.assertEqual("Assets:Cash", gain_txn.postings[1].account)
        self.assertEqual(Amount(D("90.00"), "GBP"), gain_txn.postings[1].units)

        # Check the posting to the asset account (cost basis adjustment)
        self.assertEqual("Assets:Test1", postings[0].account)
        self.assertEqual(Amount(D("20"), "X"), postings[0].units)
        self.assertEqual(Amount(D("9.00"), "GBP"), postings[0].cost)

        self.assertEqual("Assets:Test1", postings[1].account)
        self.assertEqual(Amount(D("-90.00"), "GBP"), postings[1].units)

        # Check the posting to the gains account
        self.assertEqual("Assets:Test1", postings[2].account)
        self.assertEqual(Amount(D("-10"), "X"), postings[2].units)
