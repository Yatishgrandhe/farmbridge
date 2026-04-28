"""Dataset schema validation with Pydantic."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import json

import pandas as pd
from pydantic import BaseModel, HttpUrl, ValidationError, field_validator
from rich.table import Table


class DataValidationError(Exception):
    """Raised when generated data fails validation."""


class CountyModel(BaseModel):
    """County row validation model."""

    fips_code: str
    name: str
    drought_level: str
    topsoil_moisture: str
    precipitation_deficit_inches: float
    lat: float
    lng: float

    @field_validator("drought_level")
    @classmethod
    def valid_drought_level(cls, value: str) -> str:
        """Ensure drought level enum is valid."""
        allowed = {"none", "abnormally_dry", "moderate", "severe", "extreme", "exceptional"}
        if value not in allowed:
            raise ValueError(f"Invalid drought level: {value}")
        return value


class ProgramModel(BaseModel):
    """Program row validation model."""

    slug: str
    deadline: date
    apply_url: HttpUrl
    eligibility_json: str

    @field_validator("deadline")
    @classmethod
    def deadline_in_future(cls, value: date) -> date:
        """Require deadline to be in the future."""
        if value <= date.today():
            raise ValueError(f"Deadline must be future dated: {value}")
        return value


class ResourceModel(BaseModel):
    """Resource row validation model."""

    id: str
    name: str
    website_url: HttpUrl


class CrisisMetricModel(BaseModel):
    """Crisis metric row validation model."""

    date: date
    metric_name: str
    value: float
    source: str


@dataclass
class SchemaValidator:
    """Run row-level validation and produce a Rich summary table."""

    console: object

    def _validate_df(self, df: pd.DataFrame, model: type[BaseModel], dataset_name: str) -> tuple[int, int, str]:
        """Validate each row against the provided Pydantic model."""
        null_count = int(df.isna().sum().sum())
        for idx, row in df.iterrows():
            try:
                model(**row.to_dict())
            except ValidationError as exc:
                raise DataValidationError(f"{dataset_name} row {idx} failed: {exc}") from exc
        return len(df), null_count, "ok"

    def validate_all(
        self,
        counties_df: pd.DataFrame,
        programs_df: pd.DataFrame,
        resources_df: pd.DataFrame,
        crisis_metrics_df: pd.DataFrame,
    ) -> None:
        """Validate all generated datasets and print a status table."""
        if counties_df["fips_code"].isna().any():
            raise DataValidationError("counties.csv has null fips_code values.")
        for _, row in programs_df.iterrows():
            try:
                payload = json.loads(row["eligibility_json"])
            except json.JSONDecodeError as exc:
                raise DataValidationError(f"Invalid eligibility_json for {row['slug']}") from exc
            if not isinstance(payload, dict):
                raise DataValidationError(f"eligibility_json must decode into object for {row['slug']}")
        summary = Table(title="FarmBridge Dataset Validation Summary")
        summary.add_column("Dataset")
        summary.add_column("Rows", justify="right")
        summary.add_column("Nulls", justify="right")
        summary.add_column("Status")
        checks = [
            ("counties.csv", counties_df, CountyModel),
            ("programs.csv", programs_df, ProgramModel),
            ("resources.csv", resources_df.fillna({"website_url": "https://www.usda.gov"}), ResourceModel),
            ("crisis_metrics.csv", crisis_metrics_df, CrisisMetricModel),
        ]
        for name, frame, model in checks:
            rows, nulls, status = self._validate_df(frame, model, name)
            summary.add_row(name, str(rows), str(nulls), status)
        self.console.print(summary)

