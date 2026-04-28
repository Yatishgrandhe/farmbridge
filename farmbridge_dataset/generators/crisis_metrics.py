"""Time-series crisis metrics generator."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

import numpy as np
import pandas as pd


@dataclass
class TimeSeriesGenerator:
    """Generate smooth monthly/quarterly farm crisis metrics."""

    random_seed: int = 42

    def generate(self) -> pd.DataFrame:
        """Build time series data.

        Returns:
            DataFrame with date, metric_name, value, unit, and source.
        """
        rng = np.random.default_rng(self.random_seed)
        months = pd.date_range("2023-01-01", "2026-04-01", freq="MS")
        rows: list[dict[str, object]] = []

        for idx, month in enumerate(months):
            iso = month.date().isoformat()
            drought = np.interp(idx, [0, 24, len(months) - 1], [18.0, 20.0, 100.0]) + rng.normal(0, 1.0)
            urea_base = np.interp(idx, [0, len(months) - 1], [470.0, 475.0])
            ammonia_base = np.interp(idx, [0, len(months) - 1], [700.0, 710.0])
            if month >= pd.Timestamp("2026-03-01"):
                urea_base *= 1.49
                ammonia_base *= 1.39
            corn = np.interp(idx, [0, len(months) - 1], [6.5, 3.8]) + rng.normal(0, 0.05)
            soy = np.interp(idx, [0, len(months) - 1], [14.2, 10.3]) + rng.normal(0, 0.08)
            topsoil_very_short = np.interp(idx, [0, 24, len(months) - 1], [9.0, 20.0, 60.0]) + rng.normal(0, 1.0)
            diesel = np.interp(idx, [0, 36, len(months) - 1], [2.75, 5.20, 4.05]) + rng.normal(0, 0.04)
            rows.extend(
                [
                    {"date": iso, "metric_name": "nc_drought_coverage_pct", "value": round(float(np.clip(drought, 0, 100)), 2), "unit": "percent", "source": "U.S. Drought Monitor"},
                    {"date": iso, "metric_name": "urea_price_per_ton", "value": round(float(urea_base + rng.normal(0, 10)), 2), "unit": "usd_per_ton", "source": "USDA AMS"},
                    {"date": iso, "metric_name": "anhydrous_ammonia_price", "value": round(float(ammonia_base + rng.normal(0, 12)), 2), "unit": "usd_per_ton", "source": "USDA AMS"},
                    {"date": iso, "metric_name": "corn_price_per_bushel", "value": round(float(corn), 2), "unit": "usd_per_bushel", "source": "USDA NASS"},
                    {"date": iso, "metric_name": "soybean_price_per_bushel", "value": round(float(soy), 2), "unit": "usd_per_bushel", "source": "USDA NASS"},
                    {"date": iso, "metric_name": "nc_topsoil_moisture_very_short_pct", "value": round(float(np.clip(topsoil_very_short, 0, 100)), 2), "unit": "percent", "source": "USDA Crop Progress"},
                    {"date": iso, "metric_name": "farm_diesel_price_per_gallon", "value": round(float(diesel), 2), "unit": "usd_per_gallon", "source": "U.S. EIA"},
                    {"date": iso, "metric_name": "net_farm_income_usd_billion", "value": round(float(np.interp(idx, [0, 24, len(months) - 1], [186.0, 154.6, 153.4]) + rng.normal(0, 0.5)), 2), "unit": "usd_billion", "source": "USDA ERS"},
                    {"date": iso, "metric_name": "total_farm_debt_usd_billion", "value": round(float(np.interp(idx, [0, 24, len(months) - 1], [540.0, 593.9, 624.7]) + rng.normal(0, 0.6)), 2), "unit": "usd_billion", "source": "USDA ERS"},
                    {"date": iso, "metric_name": "farm_interest_expense_usd_billion", "value": round(float(np.interp(idx, [0, len(months) - 1], [24.0, 33.0]) + rng.normal(0, 0.2)), 2), "unit": "usd_billion", "source": "AFBF Market Intel"},
                    {"date": iso, "metric_name": "farm_expenses_usd_billion", "value": round(float(np.interp(idx, [0, len(months) - 1], [430.0, 477.7]) + rng.normal(0, 0.5)), 2), "unit": "usd_billion", "source": "USDA ERS"},
                ]
            )

        quarter_dates = pd.date_range("2023-01-01", "2026-04-01", freq="QS")
        for idx, qdate in enumerate(quarter_dates):
            qv = np.interp(idx, [0, 7, len(quarter_dates) - 1], [205.0, 315.0, 318.0]) + rng.normal(0, 2.0)
            rows.append(
                {
                    "date": qdate.date().isoformat(),
                    "metric_name": "chapter12_bankruptcies_national",
                    "value": round(float(qv), 2),
                    "unit": "cases",
                    "source": "U.S. Courts",
                }
            )
        return pd.DataFrame(rows)

    def validate(self, metrics_df: pd.DataFrame) -> None:
        """Validate trend table quality requirements."""
        if len(metrics_df) < 400:
            raise ValueError("crisis_metrics.csv must contain at least 400 rows.")
        if metrics_df["value"].isna().any():
            raise ValueError("crisis_metrics values must all be numeric.")
        if not metrics_df["date"].map(lambda d: isinstance(d, str) and len(d) == 10).all():
            raise ValueError("crisis_metrics dates must be ISO formatted.")
        required_metrics = {
            "nc_drought_coverage_pct",
            "urea_price_per_ton",
            "anhydrous_ammonia_price",
            "corn_price_per_bushel",
            "soybean_price_per_bushel",
            "chapter12_bankruptcies_national",
            "nc_topsoil_moisture_very_short_pct",
            "farm_diesel_price_per_gallon",
        }
        if not required_metrics.issubset(set(metrics_df["metric_name"])):
            raise ValueError("Missing required metric series.")

