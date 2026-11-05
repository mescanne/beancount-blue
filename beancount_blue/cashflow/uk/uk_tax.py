"""
beancount_blue.cashflow.uk.uk_tax

UK statutory income tax and capital gains tax calculators.
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class UKIncomeTaxCalculator:
    """
    UK Income Tax calculator with standard HMRC bands and personal allowance tapering.

    Standard rates (England/Wales/NI):
    - Personal Allowance: £12,570 (tapers £1 for every £2 earned above £100,000)
    - Basic Rate Band: £12,571 to £50,270 @ 20%
    - Higher Rate Band: £50,271 to £125,140 @ 40%
    - Additional Rate Band: > £125,140 @ 45%
    """

    personal_allowance: float = 12_570.0
    basic_rate_limit: float = 50_270.0
    additional_rate_limit: float = 125_140.0
    basic_rate: float = 0.20
    higher_rate: float = 0.40
    additional_rate: float = 0.45
    taper_threshold: float = 100_000.0

    def effective_personal_allowance(self, gross_income: float) -> float:
        """Calculates personal allowance accounting for the £100k taper."""
        if gross_income <= self.taper_threshold:
            return self.personal_allowance
        reduction = (gross_income - self.taper_threshold) / 2.0
        return max(0.0, self.personal_allowance - reduction)

    def total_tax(self, gross_income: float) -> float:
        """Computes total UK income tax for a given gross income."""
        if gross_income <= 0.0:
            return 0.0

        pa = self.effective_personal_allowance(gross_income)
        taxable_income = max(0.0, gross_income - pa)
        if taxable_income <= 0.0:
            return 0.0

        tax = 0.0

        # Basic rate band: width is (basic_rate_limit - personal_allowance)
        basic_band_width = max(0.0, self.basic_rate_limit - self.personal_allowance)
        in_basic = min(taxable_income, basic_band_width)
        tax += in_basic * self.basic_rate

        # Higher rate band: width is (additional_rate_limit - basic_rate_limit)
        remaining_taxable = taxable_income - in_basic
        if remaining_taxable > 0.0:
            higher_band_width = max(0.0, self.additional_rate_limit - self.basic_rate_limit)
            in_higher = min(remaining_taxable, higher_band_width)
            tax += in_higher * self.higher_rate

            # Additional rate band: anything above
            in_additional = remaining_taxable - in_higher
            if in_additional > 0.0:
                tax += in_additional * self.additional_rate

        return tax

    def marginal_tax(self, additional_gross: float, existing_gross: float = 0.0) -> float:
        """Calculates tax incurred specifically on an additional gross amount."""
        if additional_gross <= 0.0:
            return 0.0
        tax_before = self.total_tax(existing_gross)
        tax_after = self.total_tax(existing_gross + additional_gross)
        return max(0.0, tax_after - tax_before)

    def net_from_gross(self, gross_amount: float, existing_gross: float = 0.0) -> float:
        """Calculates net cash delivered from a gross withdrawal or income addition."""
        if gross_amount <= 0.0:
            return 0.0
        tax = self.marginal_tax(gross_amount, existing_gross)
        return gross_amount - tax

    def gross_from_net(self, net_amount: float, existing_gross: float = 0.0, tolerance: float = 0.01) -> float:
        """
        Solves for the gross amount required to deliver a desired net cashflow.

        Uses monotonic bisection search to accurately invert the piecewise tax curve.
        """
        if net_amount <= 0.0:
            return 0.0

        low = net_amount
        high = max(net_amount * 3.0, 1000.0)

        # Expand high bound if necessary
        while self.net_from_gross(high, existing_gross) < net_amount:
            high *= 2.0

        for _ in range(60):
            mid = (low + high) / 2.0
            mid_net = self.net_from_gross(mid, existing_gross)
            diff = mid_net - net_amount
            if abs(diff) <= tolerance:
                return mid
            if diff < 0:
                low = mid
            else:
                high = mid

        return (low + high) / 2.0


@dataclass
class UKCapitalGainsCalculator:
    """
    UK Capital Gains Tax calculator.

    Models annual exempt amount and basic (18%) vs. higher (24%) CGT rates.
    """

    annual_exemption: float = 3_000.0
    basic_rate: float = 0.18
    higher_rate: float = 0.24

    def tax_on_gain(
        self,
        realized_gain: float,
        is_higher_rate: bool = True,
        unused_exemption: float | None = None,
    ) -> float:
        """Calculates UK capital gains tax on realized investment gain."""
        if realized_gain <= 0.0:
            return 0.0

        exemption = unused_exemption if unused_exemption is not None else self.annual_exemption
        taxable_gain = max(0.0, realized_gain - exemption)
        if taxable_gain <= 0.0:
            return 0.0

        rate = self.higher_rate if is_higher_rate else self.basic_rate
        return taxable_gain * rate
