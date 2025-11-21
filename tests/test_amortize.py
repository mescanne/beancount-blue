import unittest

from beancount import loader
from beancount.core.compare import compare_entries

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

        entries, errors = amortize(entries, options_map, config)

        amortized_entries, _, _ = loader.load_string("""
            2023-01-15 open Assets:Cash

            2023-01-15 open Expenses:Software

            2023-01-15 * "Software Purchase"
              Expenses:Software   1200.00 GBP
              Assets:Cash        -1200.00 GBP

            2023-01-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-02-28 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-03-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-04-30 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-05-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-06-30 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-07-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-08-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-09-30 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-10-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-11-30 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP

            2023-12-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  -100.00 GBP
              Expenses:Software              100.00 GBP""")

        same, removed_entries, added_entries = compare_entries(amortized_entries, entries)

        if not same:
            if removed_entries:
                print("Entries removed: ", removed_entries)
            if added_entries:
                print("Entries added: ", added_entries)
            self.assertTrue(False)
