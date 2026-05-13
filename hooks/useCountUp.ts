"use client";

import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  durationMs: number,
  active: boolean,
  decimals = 0,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    let cancelled = false;
    let raf = 0;

    raf = requestAnimationFrame(() => {
      if (cancelled) {
        return;
      }
      setValue(0);
      const t0 = performance.now();
      const step = (now: number) => {
        if (cancelled) {
          return;
        }
        const t = Math.min(1.0, (now - t0) / durationMs);
        const eased = 1.0 - Math.pow(1.0 - t, 4);
        const next = target * eased;
        setValue(next);
        if (t < 1.0) {
          raf = requestAnimationFrame(step);
        } else {
          setValue(target);
        }
      };
      raf = requestAnimationFrame(step);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active, target, durationMs]);

  const rounded =
    decimals > 0
      ? Number(value.toFixed(decimals))
      : Math.round(value);

  return rounded;
}
