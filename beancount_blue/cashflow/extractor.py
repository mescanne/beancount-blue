"""
beancount_blue.cashflow.extractor

Generic Beancount ledger extractor for starting balances and historical burn rates.
"""

from __future__ import annotations

import re
from collections.abc import Callable, Iterable
from decimal import Decimal
from pathlib import Path
from typing import TYPE_CHECKING, Protocol, cast, runtime_checkable

import beanquery
from beancount.core import prices, realization
from beancount.loader import load_file

if TYPE_CHECKING:
    from beancount.core.data import Entries
    from beancount.core.position import Position
    from beancount.core.realization import RealAccount


class DbCursor(Protocol):
    def execute(self, query: str) -> object: ...
    def fetchall(self) -> list[tuple[object, ...]]: ...


class DbConnection(Protocol):
    def cursor(self) -> DbCursor: ...


@runtime_checkable
class FavaLedgerLike(Protocol):
    all_entries: Entries
    options: dict[str, object]
    errors: list[object]


class LedgerExtractor:
    """
    Generic ledger inspection utility.

    Extracts numerical starting balances and historical aggregates from a Beancount ledger
    without imposing any domain or household assumptions.
    """

    entries: Entries
    options: dict[str, object]
    errors: list[object]

    def __init__(self, ledger_source: object) -> None:
        """
        Initializes the extractor from a FavaLedger, file path, or (entries, errors, options).
        """
        if isinstance(ledger_source, FavaLedgerLike):
            self.entries = ledger_source.all_entries
            self.options = getattr(ledger_source, "options", {})
            self.errors = getattr(ledger_source, "errors", [])
        elif isinstance(ledger_source, (str, Path)):
            entries_l, errors_l, options_l = load_file(str(ledger_source))
            self.entries = entries_l
            self.errors = cast("list[object]", errors_l)
            self.options = cast("dict[str, object]", options_l)
        elif isinstance(ledger_source, tuple):
            t = cast("tuple[object, ...]", ledger_source)
            if len(t) == 3:
                self.entries = cast("Entries", t[0])
                self.errors = cast("list[object]", t[1])
                self.options = cast("dict[str, object]", t[2])
            else:
                raise ValueError(f"Unsupported ledger tuple length: {len(t)}")
        elif isinstance(ledger_source, list):
            self.entries = cast("Entries", ledger_source)
            self.errors = []
            self.options = {}
        else:
            raise TypeError(f"Unsupported ledger source type: {type(ledger_source)}")

        realize_fn = cast("Callable[..., RealAccount]", realization.realize)
        self._real_root: RealAccount = realize_fn(self.entries)
        build_price_map_fn = cast("Callable[..., prices.PriceMap]", prices.build_price_map)
        self._price_map: prices.PriceMap = build_price_map_fn(self.entries)

    def _compile_pattern(self, pattern: str) -> re.Pattern[str]:
        """Compiles glob or regex into a compiled regex."""
        # Convert simple glob to regex if not already containing regex metacharacters
        if "*" in pattern and not any(c in pattern for c in ["^", "$", "(", "|", ")", "["]):
            clean = pattern.replace(".", r"\.").replace("*", ".*")
            return re.compile(f"^{clean}$")
        return re.compile(pattern)

    def get_balance(
        self,
        account_pattern: str,
        currency: str = "GBP",
        abs_value: bool = False,
    ) -> float:
        """
        Sums balances of accounts matching the regex or glob pattern.
        Converts non-operating currency positions using latest prices in the ledger.
        """
        regex = self._compile_pattern(account_pattern)
        total = 0.0

        iter_children_fn = cast("Callable[..., Iterable[RealAccount]]", realization.iter_children)
        all_children = iter_children_fn(self._real_root)
        for acc in all_children:
            account_name = getattr(acc, "account", None)
            if not isinstance(account_name, str) or not regex.search(account_name):
                continue

            balance_inv: object = getattr(acc, "balance", None)
            if balance_inv is None:
                continue

            positions = cast("Iterable[Position]", balance_inv)
            for pos in positions:
                units = pos.units
                num = units.number
                if num is None:
                    continue
                units_num = float(num)

                if units.currency == currency:
                    total += units_num
                else:
                    # Look up latest price
                    get_price_fn = cast("Callable[..., tuple[object, object] | None]", prices.get_latest_price)
                    latest_raw = get_price_fn(self._price_map, (units.currency, currency))
                    if latest_raw is not None:
                        rate_val = latest_raw[1]
                        if isinstance(rate_val, (int, float, Decimal)):
                            total += units_num * float(rate_val)
                            continue

                    cost_obj = pos.cost
                    if cost_obj and cost_obj.currency == currency:
                        total += units_num * float(cost_obj.number)
                    else:
                        total += units_num

        return abs(total) if abs_value else total

    def get_balances(
        self,
        patterns: dict[str, str],
        currency: str = "GBP",
        abs_value: bool = False,
    ) -> dict[str, float]:
        """
        Extracts multiple account balances given a mapping of {key: account_pattern}.
        """
        return {
            key: self.get_balance(pattern, currency=currency, abs_value=abs_value) for key, pattern in patterns.items()
        }

    def query_sum(self, bql: str, currency: str = "GBP") -> float:
        """
        Executes a BQL query against the ledger and sums the resulting values.
        Useful for deriving baseline annual expenditure or income sums.
        """
        connect_fn = cast(Callable[..., DbConnection], beanquery.connect)
        conn = connect_fn(
            "beancount:",
            entries=self.entries,
            errors=self.errors,
            options=self.options,
        )
        cur = conn.cursor()
        cur.execute(bql)
        rows = cur.fetchall()

        total = 0.0
        for row in rows:
            for cell in row:
                if cell is None:
                    continue
                get_units = getattr(cell, "get_currency_units", None)
                if callable(get_units):
                    amount_obj = get_units(currency)
                    num = getattr(amount_obj, "number", None) if amount_obj is not None else None
                    if isinstance(num, (int, float, Decimal)):
                        total += float(num)
                    else:
                        # Sum all positions in the inventory
                        for pos in cast(Iterable[object], cell):
                            pos_units = getattr(pos, "units", None)
                            pos_num = getattr(pos_units, "number", None) if pos_units else None
                            if isinstance(pos_num, (int, float, Decimal)):
                                total += float(pos_num)
                elif isinstance(cell, (int, float, Decimal)):
                    total += float(cell)
                else:
                    num = getattr(cell, "number", None)
                    if isinstance(num, (int, float, Decimal)):
                        total += float(num)

        return total
