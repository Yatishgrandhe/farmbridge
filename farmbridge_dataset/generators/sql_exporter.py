"""SQL export generation."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pandas as pd


def _sql_literal(value: Any) -> str:
    """Convert Python values into SQL literals."""
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value).replace("'", "''")
    return f"'{text}'"


@dataclass
class SQLExporter:
    """Export generated data into an idempotent Supabase seed SQL."""

    output_path: Path

    def export(
        self,
        counties_df: pd.DataFrame,
        programs_df: pd.DataFrame,
        resources_df: pd.DataFrame,
        crisis_metrics_df: pd.DataFrame,
    ) -> Path:
        """Write SQL seed file.

        Returns:
            Path to SQL file.
        """
        lines = [
            "BEGIN;",
            "",
            "-- Crisis metrics schema (safe create)",
            "CREATE TABLE IF NOT EXISTS crisis_metrics (",
            "  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,",
            "  date date NOT NULL,",
            "  metric_name text NOT NULL,",
            "  value double precision NOT NULL,",
            "  unit text,",
            "  source text,",
            "  UNIQUE (date, metric_name)",
            ");",
            "",
            "-- Refresh non-keyed tables for idempotent seeding",
            "DELETE FROM resources;",
            "DELETE FROM crisis_metrics;",
            "",
            "-- Counties",
        ]
        for _, row in counties_df.iterrows():
            lines.append(
                "INSERT INTO counties (fips_code,name,drought_level,is_primary_disaster_area,is_contiguous_disaster_area,disaster_declaration_date,disaster_number,topsoil_moisture,precipitation_deficit_inches)"
                f" VALUES ({','.join(_sql_literal(row[col]) for col in ['fips_code','name','drought_level','is_primary_disaster_area','is_contiguous_disaster_area','disaster_declaration_date','disaster_number','topsoil_moisture','precipitation_deficit_inches'])})"
                " ON CONFLICT (fips_code) DO UPDATE SET "
                "name=EXCLUDED.name, drought_level=EXCLUDED.drought_level, is_primary_disaster_area=EXCLUDED.is_primary_disaster_area, "
                "is_contiguous_disaster_area=EXCLUDED.is_contiguous_disaster_area, disaster_declaration_date=EXCLUDED.disaster_declaration_date, "
                "disaster_number=EXCLUDED.disaster_number, topsoil_moisture=EXCLUDED.topsoil_moisture, precipitation_deficit_inches=EXCLUDED.precipitation_deficit_inches;"
            )
        lines.extend(["", "-- Programs"])
        for _, row in programs_df.iterrows():
            eligibility_rules = json.dumps(json.loads(row["eligibility_json"]))
            values = {
                "slug": row["slug"],
                "name": row["name"],
                "acronym": row["acronym"],
                "agency": row["agency"],
                "category": row["category"],
                "summary": row["summary"],
                "description": row["description"],
                "how_to_apply": row["how_to_apply"],
                "eligibility_rules": eligibility_rules,
                "deadline": row["deadline"],
                "deadline_label": row["deadline_label"],
                "is_urgent": row["is_urgent"],
                "funding_amount": row["funding_amount"],
                "payment_type": row["payment_type"],
                "apply_url": row["apply_url"],
                "phone_number": row["phone_number"],
                "active": row["active"],
            }
            cols = ",".join(values.keys())
            vals = ",".join(_sql_literal(v) for v in values.values())
            lines.append(
                f"INSERT INTO programs ({cols}) VALUES ({vals}) "
                "ON CONFLICT (slug) DO UPDATE SET "
                "name=EXCLUDED.name, acronym=EXCLUDED.acronym, agency=EXCLUDED.agency, category=EXCLUDED.category, summary=EXCLUDED.summary, "
                "description=EXCLUDED.description, how_to_apply=EXCLUDED.how_to_apply, eligibility_rules=EXCLUDED.eligibility_rules, "
                "deadline=EXCLUDED.deadline, deadline_label=EXCLUDED.deadline_label, is_urgent=EXCLUDED.is_urgent, funding_amount=EXCLUDED.funding_amount, "
                "payment_type=EXCLUDED.payment_type, apply_url=EXCLUDED.apply_url, phone_number=EXCLUDED.phone_number, active=EXCLUDED.active;"
            )
        lines.extend(["", "-- Resources"])
        for _, row in resources_df.iterrows():
            cols = ["county_fips", "type", "name", "address", "phone", "email", "website_url", "hours", "notes"]
            vals = ",".join(_sql_literal(row[col]) for col in cols)
            lines.append(
                f"INSERT INTO resources ({','.join(cols)}) VALUES ({vals}) ON CONFLICT DO NOTHING;"
            )
        lines.extend(["", "-- Crisis Metrics"])
        for _, row in crisis_metrics_df.iterrows():
            cols = ["date", "metric_name", "value", "unit", "source"]
            vals = ",".join(_sql_literal(row[col]) for col in cols)
            lines.append(
                f"INSERT INTO crisis_metrics ({','.join(cols)}) VALUES ({vals}) ON CONFLICT (date, metric_name) DO NOTHING;"
            )
        lines.extend(["", "COMMIT;"])
        self.output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return self.output_path

