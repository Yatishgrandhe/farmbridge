"use client";

const STATS = [
  "$1.774 trillion in total student debt",
  "Average borrower owes $37,787",
  "43 million Americans carry student loan debt",
  "Only 32% of borrowers are actively repaying",
  "IDR plans cover 8 million+ enrollees",
];

export function StatTicker() {
  const loop = [...STATS, ...STATS];

  return (
    <div className="border-y border-border bg-surface py-3 text-primary">
      <div className="relative overflow-hidden">
        <div className="ticker-track flex w-max gap-16 whitespace-nowrap px-4 text-sm font-medium sm:text-base">
          {loop.map((text, idx) => (
            <span key={`${text}-${idx}`} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2 w-2 rounded-full bg-accent"
                aria-hidden
              />
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
