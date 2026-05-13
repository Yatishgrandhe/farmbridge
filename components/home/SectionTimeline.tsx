"use client";

import { motion } from "framer-motion";

const EVENTS: { year: string; text: string }[] = [
  {
    year: "1958",
    text: "National Defense Education Act creates first federal student loan program in response to Sputnik launch",
  },
  {
    year: "1965",
    text: "Higher Education Act under President Johnson establishes guaranteed student loan program, expanding access to millions",
  },
  {
    year: "1972",
    text: "Pell Grant program created, initially covering nearly 79% of average public college costs",
  },
  {
    year: "1993",
    text: "Student Loan Reform Act creates Direct Lending, federal government becomes direct lender",
  },
  {
    year: "2007",
    text: "College Cost Reduction and Access Act creates Income-Driven Repayment and Public Service Loan Forgiveness",
  },
  {
    year: "2010",
    text: "Health Care and Education Reconciliation Act ends private bank subsidies, federal government becomes sole lender, student debt hits $800 billion",
  },
  {
    year: "2012",
    text: "Student loan debt surpasses $1 trillion for the first time",
  },
  {
    year: "2015",
    text: "Corinthian Colleges collapses, leaving 350,000 students with worthless degrees and full debt loads",
  },
  {
    year: "2020",
    text: "COVID-19 pandemic triggers payment pause affecting 42 million borrowers",
  },
  {
    year: "2022",
    text: "Biden announces $10,000 to $20,000 cancellation plan, immediately challenged in court",
  },
  {
    year: "2023",
    text: "Supreme Court rules 6 to 3 in Biden v. Nebraska that mass cancellation exceeds executive authority under Major Questions Doctrine",
  },
  {
    year: "2024",
    text: "SAVE plan blocked by Eighth Circuit in August, 8 million borrowers placed in interest-free forbearance with no forgiveness credit accruing",
  },
  {
    year: "2025",
    text: "Trump administration moves to eliminate Department of Education, transfer loan servicing to SBA and Treasury. 5.3 million borrowers in default.",
  },
  {
    year: "2026",
    text: "No comprehensive federal student loan legislation has passed. 44.6 million borrowers await resolution.",
  },
];

function TimelineCard({
  ev,
  side,
}: {
  ev: { year: string; text: string };
  side: "left" | "right";
}) {
  const fromX = side === "left" ? -60 : 60;
  return (
    <motion.article
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md min-w-0 rounded-xl bg-white p-4 shadow-md sm:p-5"
    >
      <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
        {ev.year}
      </span>
      <p className="text-pretty text-sm leading-relaxed text-primary sm:text-base">
        {ev.text}
      </p>
    </motion.article>
  );
}

export function SectionTimeline() {
  return (
    <section className="bg-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          How We Got Here: A Timeline
        </h2>

        <div className="relative mt-14">
          <div
            className="absolute top-0 bottom-0 left-[1.35rem] w-px bg-accent md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <div className="space-y-10">
            {EVENTS.map((ev, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div key={ev.year} className="relative min-h-[1px] md:grid md:grid-cols-2 md:items-center md:gap-10">
                  <div className="pl-12 md:hidden">
                    <TimelineCard ev={ev} side="left" />
                  </div>

                  <div className="relative hidden md:flex md:min-h-[120px] md:items-center md:justify-end md:pr-8">
                    {isLeft ? <TimelineCard ev={ev} side="left" /> : null}
                  </div>
                  <div className="relative hidden md:flex md:min-h-[120px] md:items-center md:justify-start md:pl-8">
                    {!isLeft ? <TimelineCard ev={ev} side="right" /> : null}
                  </div>

                  <div
                    className="absolute left-[1.35rem] top-6 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border-2 border-accent bg-white md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                    aria-hidden
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
