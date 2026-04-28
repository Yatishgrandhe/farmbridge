
BEGIN;
CREATE TABLE IF NOT EXISTS crisis_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL,
  metric_name text NOT NULL,
  value double precision NOT NULL,
  unit text,
  source text,
  UNIQUE (date, metric_name)
);
DELETE FROM resources;
DELETE FROM crisis_metrics;
COMMIT;
