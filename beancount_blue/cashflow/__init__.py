"""
beancount_blue.cashflow

Agnostic time-series simulation engine and tools for plain-text cashflow modeling.
"""

from beancount_blue.cashflow import uk
from beancount_blue.cashflow.core import (
    Cashflow,
    ModelDefinition,
    Param,
    SimulationModel,
    SimulationTrace,
    StepResult,
    run_simulation,
)
from beancount_blue.cashflow.extractor import LedgerExtractor
from beancount_blue.cashflow.model import DemoCashflowModel, LedgerModel
from beancount_blue.cashflow.uk import (
    UKCapitalGainsCalculator,
    UKGIAWrapper,
    UKIncomeTaxCalculator,
    UKISAWrapper,
    UKOffsetMortgageWrapper,
    UKSIPPWrapper,
)

__all__ = [
    "Cashflow",
    "DemoCashflowModel",
    "LedgerExtractor",
    "LedgerModel",
    "ModelDefinition",
    "Param",
    "SimulationModel",
    "SimulationTrace",
    "StepResult",
    "UKCapitalGainsCalculator",
    "UKGIAWrapper",
    "UKISAWrapper",
    "UKIncomeTaxCalculator",
    "UKOffsetMortgageWrapper",
    "UKSIPPWrapper",
    "run_simulation",
    "uk",
]
