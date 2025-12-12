from __future__ import annotations

from typing import final, override

from pydantic import BaseModel, Field

from .delta_importer import APIImporter
from .importer import ImportedTransaction


class MonzoData(BaseModel):
    pass


class MonzoImporter(APIImporter[MonzoData]):
    personal_access_token: str = Field(..., description="Monzo Personal Access Token")

    @classmethod
    def name(cls) -> str:
        return "monzo"

    @final
    @override
    def refresh(self, state: MonzoData) -> None:
        return

    @final
    @override
    def extract(self, state: MonzoData) -> list[ImportedTransaction]:
        return []
