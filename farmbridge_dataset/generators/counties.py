"""County dataset generator."""

from __future__ import annotations

from dataclasses import dataclass
import numpy as np
import pandas as pd

from config import (
    CONTIGUOUS_DISASTER_FIPS,
    DISASTER_DECLARATION_DATE,
    DISASTER_NUMBER,
    DROUGHT_LEVELS,
    EASTERN_COUNTIES,
    NC_COUNTIES,
    PRIMARY_DISASTER_FIPS,
    SANDHILLS_COUNTIES,
    TOPSOIL_LEVELS,
    WESTERN_COUNTIES,
)


@dataclass
class CountyGenerator:
    """Generate county-level drought and disaster dataset."""

    random_seed: int = 42

    def generate(self) -> pd.DataFrame:
        """Build county rows with deterministic weighted distributions.

        Returns:
            DataFrame with all county fields required by the app and exports.
        """
        rng = np.random.default_rng(self.random_seed)
        rows: list[dict[str, object]] = []
        for fips_code, name, lat, lng in NC_COUNTIES:
            east = name in EASTERN_COUNTIES
            west = name in WESTERN_COUNTIES
            if east:
                drought_probs = [0.0, 0.0, 0.08, 0.34, 0.40, 0.18]
                deficit = rng.uniform(5.0, 8.5)
                topsoil_probs = [0.7, 0.25, 0.05]
            elif west:
                drought_probs = [0.0, 0.0, 0.15, 0.50, 0.27, 0.08]
                deficit = rng.uniform(2.0, 6.4)
                topsoil_probs = [0.45, 0.35, 0.20]
            else:
                drought_probs = [0.0, 0.0, 0.10, 0.42, 0.33, 0.15]
                deficit = rng.uniform(3.3, 7.4)
                topsoil_probs = [0.58, 0.31, 0.11]

            if name in EASTERN_COUNTIES or name in SANDHILLS_COUNTIES:
                products = "tobacco|cotton|hogs"
            elif west:
                products = "christmas_trees|apples|cattle"
            else:
                products = "poultry|dairy|hay"

            rows.append(
                {
                    "fips_code": fips_code,
                    "name": name,
                    "drought_level": rng.choice(DROUGHT_LEVELS, p=drought_probs),
                    "is_primary_disaster_area": fips_code in PRIMARY_DISASTER_FIPS,
                    "is_contiguous_disaster_area": fips_code in CONTIGUOUS_DISASTER_FIPS,
                    "disaster_declaration_date": DISASTER_DECLARATION_DATE
                    if (fips_code in PRIMARY_DISASTER_FIPS or fips_code in CONTIGUOUS_DISASTER_FIPS)
                    else None,
                    "disaster_number": DISASTER_NUMBER
                    if (fips_code in PRIMARY_DISASTER_FIPS or fips_code in CONTIGUOUS_DISASTER_FIPS)
                    else None,
                    "topsoil_moisture": rng.choice(TOPSOIL_LEVELS, p=topsoil_probs),
                    "precipitation_deficit_inches": round(float(deficit), 2),
                    "population_estimate": int(rng.integers(4500, 1150000)),
                    "farm_count_estimate": int(rng.integers(120, 3700)),
                    "primary_agricultural_products": products,
                    "lat": lat,
                    "lng": lng,
                }
            )
        counties_df = pd.DataFrame(rows)

        # Source-aligned drought profile:
        # - 47 counties extreme (NC DMAC update context by Apr 24, 2026)
        # - 95 counties severe/extreme/exceptional
        # - 100% counties in drought
        ranked_idx = counties_df.sort_values(
            by=["precipitation_deficit_inches", "is_primary_disaster_area"],
            ascending=[False, False],
        ).index.tolist()
        counties_df.loc[ranked_idx, "drought_level"] = "severe"
        counties_df.loc[ranked_idx[:47], "drought_level"] = "extreme"
        counties_df.loc[ranked_idx[47:65], "drought_level"] = "exceptional"
        counties_df.loc[ranked_idx[95:], "drought_level"] = "moderate"
        return counties_df

    def validate(self, counties_df: pd.DataFrame) -> None:
        """Validate structural and policy constraints.

        Args:
            counties_df: Generated counties dataset.

        Raises:
            ValueError: If required county/disaster constraints are violated.
        """
        if len(counties_df) != 100:
            raise ValueError(f"Expected 100 counties, got {len(counties_df)}.")
        primary_count = int(counties_df["is_primary_disaster_area"].sum())
        contiguous_count = int(counties_df["is_contiguous_disaster_area"].sum())
        total_designated = int(
            (counties_df["is_primary_disaster_area"] | counties_df["is_contiguous_disaster_area"]).sum()
        )
        if primary_count != 40 or contiguous_count != 42 or total_designated != 82:
            raise ValueError(
                "Disaster county requirements failed. "
                f"Primary={primary_count}, contiguous={contiguous_count}, total={total_designated}."
            )
        extreme_count = int((counties_df["drought_level"] == "extreme").sum())
        severe_plus_count = int(
            counties_df["drought_level"].isin({"severe", "extreme", "exceptional"}).sum()
        )
        if extreme_count != 47:
            raise ValueError(f"Expected 47 extreme drought counties, got {extreme_count}.")
        if severe_plus_count != 95:
            raise ValueError(f"Expected 95 severe/extreme/exceptional counties, got {severe_plus_count}.")

