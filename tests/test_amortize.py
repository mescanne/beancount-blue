import unittest

from beancount import loader
from beancount.core.compare import compare_entries
from beancount.parser.printer import print_entries

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
                            'months': 12,
                        }
                }
        }"""

        entries, _ = amortize(entries, options_map, config)

        amortized_entries, _, _ = loader.load_string("""
            2023-01-15 open Assets:Cash

            2023-01-15 open Expenses:Software

            2023-01-15 * "Software Purchase"
              Expenses:Software   1200.00 GBP
              Assets:Cash        -1200.00 GBP

            2023-01-31 * "Amortized" "Amortization Adjustment" #amort
              Equity:Amortization:Software  1100.00 GBP
              Expenses:Software             -1100.00 GBP

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
            print("Expected:")
            print_entries(amortized_entries)
            print("Calculated:")
            print_entries(entries)
            self.assertTrue(False)

    @loader.load_doc()
    def no_test_one_month_amortization(self, entries, _, options_map):
        """
        option "booking_method" "NONE"
        plugin "beancount.plugins.auto_accounts"

        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          Income:Salary  -1000.00 GBP
          Assets:Bank

        """

        config = """{
                'accounts': {
                        'Income:Salary': {
                            'months': 1,
                        }
                }
        }"""

        entries, _ = amortize(entries, options_map, config)

        amortized_entries, _, _ = loader.load_string("""
            2023-01-15 open Assets:Bank

            2023-01-15 open Income:Salary

            plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
              Income:Salary  -1000.00 GBP
              Assets:Bank  1000.00 GBP""")

        same, removed_entries, added_entries = compare_entries(amortized_entries, entries)

        if not same:
            print("Expected:")
            print_entries(amortized_entries)
            print("Calculated:")
            print_entries(entries)
            self.assertTrue(False)

    @loader.load_doc()
    def test_missing_accounts(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          Income:Salary  -1000.00 GBP
          Assets:Bank       1000.00 GBP
        """
        config = "{}"
        _, errors = amortize(entries, options_map, config)
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].message, "no accounts defined")

    @loader.load_doc()
    def test_invalid_account_prefix(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          Assets:Bank  1000.00 GBP
          Income:Unknown  -1000.00 GBP
        """
        config = "{'accounts': {'Assets:Bank': {'months': 1}}}"
        with self.assertRaises(Exception) as context:
            amortize(entries, options_map, config)
        self.assertIn("amortize requires Expenses: or Income: accounts", str(context.exception))

    @loader.load_doc()
    def test_missing_months_config(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          Income:Salary  -1000.00 GBP
          Assets:Bank       1000.00 GBP
        """
        config = "{'accounts': {'Income:Salary': {}}}"
        _, errors = amortize(entries, options_map, config)
        self.assertEqual(len(errors), 1)
        self.assertIn("no months for account Income:Salary", errors[0].message)

    @loader.load_doc()
    def test_multiple_tags(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income" #tag1 #tag2
          Income:Salary  -1000.00 GBP
          Assets:Bank       1000.00 GBP
        """
        config = "{'accounts': {'Income:Salary': {'months': 12}}}"
        _, errors = amortize(entries, options_map, config)
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].message, "must be zero or one tag only")

    @loader.load_doc()
    def test_missing_units(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          Income:Salary
          Assets:Bank  1000.00 GBP
        """
        config = "{'accounts': {'Income:Salary': {'months': 12}}}"
        entries[2] = entries[2]._replace(postings=[entries[2].postings[0]._replace(units=None), entries[2].postings[1]])
        _, errors = amortize(entries, options_map, config)
        self.assertEqual(len(errors), 1)
        self.assertEqual(errors[0].message, "cannot amortize a posting without units")

    @loader.load_doc()
    def test_meta_amortization_months(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income"
          amortization_months: "2"
          Income:Salary  -1000.00 GBP
          Assets:Bank       1000.00 GBP
        """
        config = "{'accounts': {'Income:Salary': {'months': 12}}}"
        entries, _ = amortize(entries, options_map, config)
        self.assertEqual(len(entries), 5)

    @loader.load_doc()
    def test_tag_narration(self, entries, _, options_map):
        """
        plugin "beancount.plugins.auto_accounts"

        2023-01-15 * "Income" #mytag
          Income:Salary  -1000.00 GBP
          Assets:Bank       1000.00 GBP
        """
        config = "{'accounts': {'Income:Salary': {'months': 2}}}"
        entries, _ = amortize(entries, options_map, config)
        self.assertEqual(len(entries), 5)
        self.assertEqual(entries[3].narration, "Amortization Adjustment for mytag")
