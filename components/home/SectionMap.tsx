"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  NATIONAL_AVG_DEBT,
  STATE_GRID,
  STATE_NAMES,
  heatColorForDebt,
  stateData,
} from "@/lib/homeStateMap";

const TILE = 60;
const GAP = 4;

function defaultRateColor(rate: number) {
  if (rate < 10) {
    return "text-success";
  }
  if (rate <= 14) {
    return "text-[#e07b00]";
  }
  return "text-alert";
}

export function SectionMap() {
  const [selected, setSelected] = useState("TX");
  const [panelOpen, setPanelOpen] = useState(true);

  const row = STATE_GRID.length;
  const col = STATE_GRID[0]?.length ?? 0;
  const width = col * TILE + (col - 1) * GAP;
  const height = row * TILE + (row - 1) * GAP;

  const data = stateData[selected];
  const name = STATE_NAMES[selected] ?? selected;
  const diff = data ? data.avgDebt - NATIONAL_AVG_DEBT : 0;
  const diffAbs = Math.abs(Math.round(diff));
  const comparison =
    diff === 0
      ? `This state's average debt matches the national average of $${NATIONAL_AVG_DEBT.toLocaleString("en-US")}.`
      : diff > 0
        ? `This state's average debt is ${diffAbs.toLocaleString("en-US")} dollars above the national average of $${NATIONAL_AVG_DEBT.toLocaleString("en-US")}.`
        : `This state's average debt is ${diffAbs.toLocaleString("en-US")} dollars below the national average of $${NATIONAL_AVG_DEBT.toLocaleString("en-US")}.`;

  return (
    <section className="border-y border-border bg-surface px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          Student Debt Across America
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-center text-sm text-mid sm:text-base">
          Click any state to see federal student loan data for that state. Data
          from the U.S. Department of Education.
        </p>

        <div className="mt-10 overflow-x-auto">
          <svg
            width={width}
            height={height}
            className="mx-auto block"
            role="img"
            aria-label="Simplified United States state tile map"
          >
            {STATE_GRID.map((cells, r) =>
              cells.map((abbr, c) => {
                if (!abbr) {
                  return null;
                }
                const s = stateData[abbr];
                const fill = s ? heatColorForDebt(s.debt) : "#ccc";
                const x = c * (TILE + GAP);
                const y = r * (TILE + GAP);
                const isSel = abbr === selected;
                return (
                  <g key={abbr}>
                    <motion.rect
                      x={x}
                      y={y}
                      width={TILE}
                      height={TILE}
                      rx={6}
                      fill={fill}
                      stroke={isSel ? "#e4a400" : "#0d1b2a"}
                      strokeWidth={isSel ? 3 : 1}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelected(abbr);
                        setPanelOpen(true);
                      }}
                      whileHover={{ opacity: 0.92 }}
                    />
                    <text
                      x={x + TILE / 2}
                      y={y + TILE / 2 + 5}
                      textAnchor="middle"
                      fill="#0d1b2a"
                      style={{
                        fontFamily: "var(--font-body), ui-sans-serif, system-ui",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {abbr}
                    </text>
                  </g>
                );
              }),
            )}
          </svg>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-4 text-xs text-mid">
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm" style={{ background: "#FDF3D0" }} />
            Under $15B
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm bg-accent" />
            $15B to $40B
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm" style={{ background: "#E07B00" }} />
            $40B to $80B
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-6 rounded-sm" style={{ background: "#C0392B" }} />
            Above $80B
          </span>
        </div>

        <AnimatePresence mode="wait">
          {data && panelOpen && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 mx-auto mt-10 w-full max-w-xl min-w-0 overflow-hidden rounded-2xl bg-light p-4 shadow-xl sm:p-6"
            >
              <motion.h3
                layoutId="map-state-title"
                className="font-heading text-xl font-bold text-pretty text-primary sm:text-2xl"
              >
                {name}
              </motion.h3>
              <p className="mt-2 text-pretty text-base leading-snug text-primary sm:text-lg">
                <span className="font-bold text-accent">$</span>
                <span className="font-bold">
                  {data.debt.toFixed(1)} billion
                </span>{" "}
                total federal student debt
              </p>
              <p className="mt-1 text-pretty text-base text-primary">
                <span className="font-semibold">
                  {data.borrowers.toLocaleString("en-US")} thousand
                </span>{" "}
                borrowers
              </p>
              <p className="mt-1 text-pretty text-base text-primary">
                Average debt per borrower:{" "}
                <span className="font-semibold tabular-nums">
                  ${data.avgDebt.toLocaleString("en-US")}
                </span>
              </p>
              <p className="mt-2 text-pretty">
                <span className="text-mid">Default rate: </span>
                <span className={`font-bold ${defaultRateColor(data.defaultRate)}`}>
                  {data.defaultRate.toFixed(1)}%
                </span>
              </p>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-mid">
                  <span>0%</span>
                  <span>25%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${Math.min(100, (data.defaultRate / 25) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <p className="mt-4 text-pretty text-sm leading-relaxed text-mid">{comparison}</p>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="mt-6 rounded-full border border-border px-4 py-2 text-sm font-semibold text-primary transition hover:bg-surface"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
