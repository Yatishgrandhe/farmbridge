"use client";

import { motion } from "framer-motion";

const STATS = [
  "Total student debt: $1.774 trillion (Federal Reserve, 2024)",
  "Average debt per borrower: $37,787",
  "Monthly payment under standard plan: $393 average",
  "43 million Americans hold federal student loans",
  "Only 32% of borrowers are actively in repayment",
  "8.7 million enrolled in IDR plans as of 2024",
  "Tuition has risen 169% since 1980 after inflation",
  "Black borrowers owe 25% more on average than white borrowers 4 years after graduation",
  "Women hold 67% of all student loan debt",
  "Borrowers 50 and older hold $281.8 billion in student debt",
];

export function TickerBar() {
  const loop = [...STATS, ...STATS];

  return (
    <div className="overflow-hidden bg-accent py-3 text-primary">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap px-4 text-sm font-semibold sm:text-base"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {loop.map((text, idx) => (
          <span key={`${idx}-${text.slice(0, 12)}`} className="inline-flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary"
              aria-hidden
            />
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
