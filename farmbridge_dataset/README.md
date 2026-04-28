# FarmBridge Dataset Automation

Generated on 2026-04-26 by `python main.py`.

## Output Files
- `counties.csv`: County drought/disaster attributes (output/csv/counties.csv)
- `programs.csv`: Program metadata and eligibility JSON (output/csv/programs.csv)
- `resources.csv`: County and statewide support resources (output/csv/resources.csv)
- `crisis_metrics.csv`: Monthly/quarterly trend metrics (output/csv/crisis_metrics.csv)
- `eligibility_rules.json`: Decision-tree eligibility rules (output/json/eligibility_rules.json)
- `source_manifest.json`: Verified source references used for dataset assumptions (output/json/source_manifest.json)
- `supabase_seed.sql`: Idempotent SQL seed file (output/sql/supabase_seed.sql)

## Supabase Import
1. Open Supabase SQL editor.
2. Paste `output/sql/supabase_seed.sql` and run.
3. Confirm tables `counties`, `programs`, `resources`, `crisis_metrics` are populated.

## Flourish Usage
- Upload `output/csv/crisis_metrics.csv` directly in Flourish for line/bar visuals.
- Filter `metric_name` for chart-specific series.

## Verified Sources
- USDA FSA NC disaster designation (2026-04-21): https://www.fsa.usda.gov/news-events/news/04-21-2026/usda-designates-40-north-carolina-counties-natural-disaster-areas-seven
- Drought.gov Southeast update (2026-04-16): https://www.drought.gov/drought-status-updates/drought-status-update-southeast-2026-04-16
- AFBF bankruptcies report (2026-02-09): https://www.fb.org/market-intel/farm-bankruptcies-continued-to-climb-in-2025
- USDA ERS farm income forecast (2026-02-05): https://www.ers.usda.gov/topics/farm-economy/farm-sector-income-finances/highlights-from-the-farm-income-forecast
- Iran/Hormuz fertilizer shock context (2026-04-21): https://prospect.org/2026/04/21/aftermath-hormuz-farm-crisis-gulf-states-fertilizer-aluminum/
