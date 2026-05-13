"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useState } from "react";

const QUOTES: { text: string; cite: string }[] = [
  {
    text: "Student debt cancellation is not a gift. It is a correction of a system that told an entire generation that the only path to a middle-class life ran through a college degree, and then saddled them with debt they cannot escape even through bankruptcy.",
    cite: "Senator Elizabeth Warren (D-MA), Senate Banking Committee, 2022",
  },
  {
    text: "The question is not whether something should be done about student loan debt. The question is who has the authority to act. The answer, under our constitutional system, is Congress.",
    cite: "Chief Justice John Roberts, Biden v. Nebraska majority opinion, 2023",
  },
  {
    text: "Loan forgiveness is not compassion. It is a transfer of wealth from working Americans who did not attend college or who responsibly paid their loans to those who made choices and now want others to bear the consequences.",
    cite: "Representative Virginia Foxx (R-NC), House Education Committee, 2022",
  },
  {
    text: "Every month that passes without a functioning IDR program is another month that 8 million people in SAVE forbearance get no credit toward the forgiveness they were legally promised.",
    cite: "Student Borrower Protection Center, 2025",
  },
];

const LEN = QUOTES.length;

export function SectionQuotes() {
  const [page, setPage] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPage((p) => (p + 1) % LEN);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  const go = (dir: number) => {
    setPage((p) => (p + dir + LEN * 10) % LEN);
  };

  return (
    <section className="border-y border-border bg-surface px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          What Borrowers and Policymakers Are Saying
        </h2>

        <div className="relative mt-12 min-h-[220px] overflow-hidden sm:min-h-[200px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.45 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_e, info: PanInfo) => {
                if (info.offset.x < -48) {
                  go(1);
                } else if (info.offset.x > 48) {
                  go(-1);
                }
              }}
              className="grid min-w-0 cursor-grab grid-cols-1 gap-4 active:cursor-grabbing md:grid-cols-3"
            >
              <figure className="min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-elevated p-4 shadow-sm sm:p-6">
                <blockquote className="text-pretty text-sm leading-relaxed text-mid sm:text-base">
                  &ldquo;{QUOTES[page].text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-pretty text-xs leading-snug text-mid sm:text-sm">
                  {QUOTES[page].cite}
                </figcaption>
              </figure>
              <figure className="hidden min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-elevated p-4 shadow-sm sm:p-6 md:block">
                <blockquote className="text-pretty text-sm leading-relaxed text-mid sm:text-base">
                  &ldquo;{QUOTES[(page + 1) % LEN].text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-pretty text-xs leading-snug text-mid sm:text-sm">
                  {QUOTES[(page + 1) % LEN].cite}
                </figcaption>
              </figure>
              <figure className="hidden min-w-0 max-w-full overflow-hidden rounded-xl border border-border bg-elevated p-4 shadow-sm sm:p-6 md:block">
                <blockquote className="text-pretty text-sm leading-relaxed text-mid sm:text-base">
                  &ldquo;{QUOTES[(page + 2) % LEN].text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-pretty text-xs leading-snug text-mid sm:text-sm">
                  {QUOTES[(page + 2) % LEN].cite}
                </figcaption>
              </figure>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {QUOTES.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              aria-label={`Show quote group ${i + 1}`}
              onClick={() => setPage(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === page ? "bg-accent" : "bg-border hover:bg-sunken"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
