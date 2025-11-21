import unittest

from beancount import loader
from beancount.core.compare import compare_entries
from beancount.ops.validation import validate

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

        new_entries, _, _ = loader.load_string('''
            2023-01-25 open Assets:Test1

            2023-01-25 * "Acquisition"
              Assets:Test1      10 X {5.00 GBP, 2023-01-25}
              Assets:Test1  -50.00 GBP

            2023-01-26 * "Acquisition"
              Assets:Test1      20 X {9.00 GBP, 2023-01-26}
              Assets:Test1  -90.00 GBP
              Assets:Test1     -10 X {5.00 GBP, 2023-01-25}
              Equity:Gains  -40.00 GBP
                note: "full_adjustment"

            2023-02-25 * "Redemption"
              Assets:Test1     16 X {7.00 GBP, 2023-02-25}
              Assets:Test1  40.00 GBP
              Assets:Test1    -20 X {9.00 GBP, 2023-01-26}
              Equity:Gains  28.00 GBP
                note: "full_adjustment"''')

        self.assertTrue(validate(entries, options_map))

        same, removed_entries, added_entries = compare_entries(gain_transactions, new_entries)

        if not same:
            if removed_entries:
                print("Entries removed: ", removed_entries)
            if added_entries:
                print("Entries added: ", added_entries)
            self.assertTrue(False)
