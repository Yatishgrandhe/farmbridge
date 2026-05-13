"use client";

import { motion } from "framer-motion";

const STATS = [
  "$1.774 trillion in total federal student debt",
  "44.6 million borrowers as of Q3 2025",
  "Average debt per borrower: $37,787",
  "9.57% of loans are 90 or more days delinquent as of Q4 2025",
  "8.7 million borrowers enrolled in IDR plans",
  "SAVE plan blocked by 8th Circuit, August 2024",
  "Tuition up 169% since 1980 after inflation",
  "Women hold 67% of all student loan debt",
  "Black borrowers owe 25% more than white peers after 4 years",
  "5.3 million borrowers in default as of June 2025",
  "$281.8 billion held by borrowers age 50 and older",
  "Pell Grant covers only 26% of average college costs in 2024, down from 79% in 1975",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-4 whitespace-nowrap px-4">
      {STATS.map((s, i) => (
        <span key={`${s}-${i}`} className="flex items-center gap-4">
          <span className="text-sm font-bold text-primary">{s}</span>
          <span className="text-primary" aria-hidden>
            &#9670;
          </span>
        </span>
      ))}
    </div>
  );
}

export function SectionTicker() {
  return (
    <div className="h-12 w-full overflow-hidden bg-accent">
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}
