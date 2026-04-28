"""FarmBridge dataset generation entry point."""

from __future__ import annotations

from datetime import date
import json
import logging
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from dotenv import load_dotenv
from rich.console import Console
from rich.logging import RichHandler
from rich.progress import Progress
from rich.table import Table

from config import CSV_DIR, JSON_DIR, LOG_FILE, OUTPUT_DIR, RANDOM_SEED, SOURCE_REFERENCES, SQL_DIR
from generators import (
    CountyGenerator,
    ProgramGenerator,
    ResourceGenerator,
    SQLExporter,
    TimeSeriesGenerator,
)
from validators import DataValidationError, SchemaValidator


def setup_logging(console: Console) -> logging.Logger:
    """Configure terminal and file logging.

    Args:
        console: Rich console used by RichHandler.

    Returns:
        Root logger configured for the pipeline.
    """
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    logger = logging.getLogger("farmbridge_dataset")
    logger.setLevel(logging.INFO)
    logger.handlers.clear()
    logger.addHandler(RichHandler(console=console, rich_tracebacks=True))
    file_handler = logging.FileHandler(LOG_FILE, mode="w", encoding="utf-8")
    file_handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(file_handler)
    return logger


def build_eligibility_rules(programs_df: pd.DataFrame) -> dict[str, Any]:
    """Create decision-tree style eligibility rules JSON.

    Args:
        programs_df: Program dataset source.

    Returns:
        Structured eligibility rules object.
    """
    programs: dict[str, Any] = {}
    for _, row in programs_df.iterrows():
        payload = json.loads(row["eligibility_json"])
        programs[row["slug"]] = {
            "required_conditions": ["documented_loss"] if payload["requires_loss"] else [],
            "disqualifying_conditions": [],
            "preferred_conditions": ["beginning_farmer"] if payload["beginning_farmer_priority"] else [],
            "county_restriction": (
                "disaster_designated" if payload["counties"] == "disaster_designated" else "all"
            ),
            "eligible_crops": payload["crop_types"],
            "min_acres": None,
            "max_annual_sales": None,
            "score_weights": {
                "requires_loss": 25,
                "beginning_farmer_priority": 15,
                "urgent_bonus": 10,
            },
        }
    return {"programs": programs}


def write_readme(file_manifest: list[dict[str, str]]) -> None:
    """Auto-generate README for the generated dataset package.

    Args:
        file_manifest: Exported file metadata for documentation.
    """
    readme_path = Path("README.md")
    lines = [
        "# FarmBridge Dataset Automation",
        "",
        f"Generated on {date.today().isoformat()} by `python main.py`.",
        "",
        "## Output Files",
    ]
    for item in file_manifest:
        lines.append(f"- `{item['file']}`: {item['description']} ({item['path']})")
    lines.extend(
        [
            "",
            "## Supabase Import",
            "1. Open Supabase SQL editor.",
            "2. Paste `output/sql/supabase_seed.sql` and run.",
            "3. Confirm tables `counties`, `programs`, `resources`, `crisis_metrics` are populated.",
            "",
            "## Flourish Usage",
            "- Upload `output/csv/crisis_metrics.csv` directly in Flourish for line/bar visuals.",
            "- Filter `metric_name` for chart-specific series.",
            "",
            "## Verified Sources",
        ]
    )
    for ref in SOURCE_REFERENCES:
        lines.append(f"- {ref['label']} ({ref['date']}): {ref['url']}")
    readme_path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def maybe_upload_to_supabase(
    logger: logging.Logger,
    counties_df: pd.DataFrame,
    programs_df: pd.DataFrame,
    resources_df: pd.DataFrame,
    crisis_metrics_df: pd.DataFrame,
) -> None:
    """Attempt optional direct upload if credentials exist."""
    url = Path(".env").exists()  # simple guard to avoid env parsing errors in bare runs
    supabase_url = None
    supabase_key = None
    if url:
        load_dotenv(".env")
    from os import getenv

    supabase_url = getenv("SUPABASE_URL")
    supabase_key = getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        logger.info("Supabase credentials missing. Skipping direct upload and keeping local exports only.")
        return
    try:
        from supabase import create_client
    except ImportError:
        logger.info("supabase package not installed. Skipping direct upload.")
        return
    client = create_client(supabase_url, supabase_key)
    client.table("counties").upsert(
        counties_df[
            [
                "fips_code",
                "name",
                "drought_level",
                "is_primary_disaster_area",
                "is_contiguous_disaster_area",
                "disaster_declaration_date",
                "disaster_number",
                "topsoil_moisture",
                "precipitation_deficit_inches",
            ]
        ].to_dict("records"),
        on_conflict="fips_code",
    ).execute()
    client.table("programs").upsert(
        [
            {
                "id": row["id"],
                "slug": row["slug"],
                "name": row["name"],
                "acronym": row["acronym"],
                "agency": row["agency"],
                "category": row["category"],
                "summary": row["summary"],
                "description": row["description"],
                "how_to_apply": row["how_to_apply"],
                "eligibility_rules": json.loads(row["eligibility_json"]),
                "deadline": row["deadline"],
                "deadline_label": row["deadline_label"],
                "is_urgent": row["is_urgent"],
                "funding_amount": row["funding_amount"],
                "payment_type": row["payment_type"],
                "apply_url": row["apply_url"],
                "phone_number": row["phone_number"],
                "active": row["active"],
            }
            for _, row in programs_df.iterrows()
        ],
        on_conflict="slug",
    ).execute()
    client.table("resources").upsert(resources_df.to_dict("records"), on_conflict="id").execute()
    client.table("crisis_metrics").upsert(crisis_metrics_df.to_dict("records"), on_conflict="date,metric_name").execute()
    logger.info("Supabase upload completed.")


def main() -> None:
    """Generate, validate, and export all FarmBridge datasets."""
    np.random.seed(RANDOM_SEED)
    console = Console()
    logger = setup_logging(console)
    console.rule("[bold green]FARMBRIDGE DATASET GENERATOR v1.0 - April 2026")
    for directory in (CSV_DIR, JSON_DIR, SQL_DIR):
        directory.mkdir(parents=True, exist_ok=True)

    county_generator = CountyGenerator(random_seed=RANDOM_SEED)
    program_generator = ProgramGenerator()
    resource_generator = ResourceGenerator()
    timeseries_generator = TimeSeriesGenerator(random_seed=RANDOM_SEED)

    with Progress() as progress:
        task = progress.add_task("Generating datasets", total=6)
        counties_df = county_generator.generate()
        county_generator.validate(counties_df)
        progress.advance(task)
        programs_df = program_generator.generate()
        program_generator.validate(programs_df)
        progress.advance(task)
        resources_df = resource_generator.generate(counties_df.to_dict("records"))
        resource_generator.validate(resources_df)
        progress.advance(task)
        crisis_metrics_df = timeseries_generator.generate()
        timeseries_generator.validate(crisis_metrics_df)
        progress.advance(task)
        eligibility_rules = build_eligibility_rules(programs_df)
        progress.advance(task)
        sql_path = SQLExporter(SQL_DIR / "supabase_seed.sql").export(
            counties_df=counties_df,
            programs_df=programs_df,
            resources_df=resources_df,
            crisis_metrics_df=crisis_metrics_df,
        )
        progress.advance(task)

    validator = SchemaValidator(console=console)
    try:
        validator.validate_all(counties_df, programs_df, resources_df, crisis_metrics_df)
    except DataValidationError as exc:
        logger.error("Validation failed: %s", exc)
        raise

    counties_path = CSV_DIR / "counties.csv"
    programs_path = CSV_DIR / "programs.csv"
    resources_path = CSV_DIR / "resources.csv"
    metrics_path = CSV_DIR / "crisis_metrics.csv"
    rules_path = JSON_DIR / "eligibility_rules.json"
    sources_path = JSON_DIR / "source_manifest.json"
    master_xlsx = OUTPUT_DIR / "farmbridge_master.xlsx"

    counties_df.to_csv(counties_path, index=False)
    programs_df.to_csv(programs_path, index=False)
    resources_df.to_csv(resources_path, index=False)
    crisis_metrics_df.to_csv(metrics_path, index=False)
    rules_path.write_text(json.dumps(eligibility_rules, indent=2), encoding="utf-8")
    sources_path.write_text(json.dumps({"sources": SOURCE_REFERENCES}, indent=2), encoding="utf-8")

    with pd.ExcelWriter(master_xlsx, engine="openpyxl") as writer:
        counties_df.to_excel(writer, sheet_name="counties", index=False)
        programs_df.to_excel(writer, sheet_name="programs", index=False)
        resources_df.to_excel(writer, sheet_name="resources", index=False)
        crisis_metrics_df.to_excel(writer, sheet_name="crisis_metrics", index=False)
        pd.DataFrame(
            [{"slug": key, "rule_json": json.dumps(value)} for key, value in eligibility_rules["programs"].items()]
        ).to_excel(writer, sheet_name="eligibility_rules", index=False)

    maybe_upload_to_supabase(logger, counties_df, programs_df, resources_df, crisis_metrics_df)

    manifest = [
        {"file": "counties.csv", "rows": str(len(counties_df)), "path": str(counties_path), "description": "County drought/disaster attributes"},
        {"file": "programs.csv", "rows": str(len(programs_df)), "path": str(programs_path), "description": "Program metadata and eligibility JSON"},
        {"file": "resources.csv", "rows": str(len(resources_df)), "path": str(resources_path), "description": "County and statewide support resources"},
        {"file": "crisis_metrics.csv", "rows": str(len(crisis_metrics_df)), "path": str(metrics_path), "description": "Monthly/quarterly trend metrics"},
        {"file": "eligibility_rules.json", "rows": str(len(eligibility_rules["programs"])), "path": str(rules_path), "description": "Decision-tree eligibility rules"},
        {"file": "source_manifest.json", "rows": str(len(SOURCE_REFERENCES)), "path": str(sources_path), "description": "Verified source references used for dataset assumptions"},
        {"file": "supabase_seed.sql", "rows": "-", "path": str(sql_path), "description": "Idempotent SQL seed file"},
    ]
    summary = Table(title="FarmBridge Export Summary")
    summary.add_column("File")
    summary.add_column("Rows", justify="right")
    summary.add_column("Size", justify="right")
    summary.add_column("Path")
    for item in manifest:
        file_path = Path(item["path"])
        size_bytes = file_path.stat().st_size if file_path.exists() else 0
        summary.add_row(item["file"], item["rows"], f"{size_bytes:,} B", item["path"])
    console.print(summary)
    write_readme(manifest)
    console.print(
        "\nNext steps:\n"
        "1) Import `output/sql/supabase_seed.sql` in Supabase.\n"
        "2) Use `output/csv/crisis_metrics.csv` in Flourish for timeline charts.\n"
    )


if __name__ == "__main__":
    main()

