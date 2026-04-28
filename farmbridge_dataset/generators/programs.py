"""Program dataset generator."""

from __future__ import annotations

import json
from dataclasses import dataclass

import jsonschema
import pandas as pd

from config import PROGRAMS


ELIGIBILITY_SCHEMA = {
    "type": "object",
    "properties": {
        "requires_loss": {"type": "boolean"},
        "crop_types": {"type": ["array", "null"]},
        "counties": {"enum": ["all", "disaster_designated"]},
        "is_urgent": {"type": "boolean"},
        "beginning_farmer_priority": {"type": "boolean"},
    },
    "required": [
        "requires_loss",
        "crop_types",
        "counties",
        "is_urgent",
        "beginning_farmer_priority",
    ],
}


@dataclass
class ProgramGenerator:
    """Generate the federal/state programs dataset."""

    def generate(self) -> pd.DataFrame:
        """Build the programs DataFrame.

        Returns:
            DataFrame with required program metadata.
        """
        rows = []
        for program in PROGRAMS:
            row = dict(program)
            row["eligibility_json"] = json.dumps(program["eligibility_json"])
            rows.append(row)
        return pd.DataFrame(rows)

    def validate(self, programs_df: pd.DataFrame) -> None:
        """Validate program count and eligibility JSON payloads.

        Args:
            programs_df: Generated program dataset.
        """
        if len(programs_df) != 8:
            raise ValueError(f"Expected 8 programs, got {len(programs_df)}.")
        for _, row in programs_df.iterrows():
            eligibility = json.loads(row["eligibility_json"])
            jsonschema.validate(eligibility, ELIGIBILITY_SCHEMA)
            if not str(row["apply_url"]).startswith("https://"):
                raise ValueError(f"Invalid URL for program '{row['slug']}'.")

