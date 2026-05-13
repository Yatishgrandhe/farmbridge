"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function SectionDebate() {
  return (
    <section className="bg-white px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          The Debate at a Glance
        </h2>

        <div className="mt-12 grid min-w-0 grid-cols-1 gap-8 md:grid-cols-2 md:divide-x md:divide-primary/15">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-primary/10 p-5 pl-4 sm:p-6 md:pr-10"
            style={{ borderLeftWidth: 4, borderLeftColor: "#e4a400" }}
          >
            <h3 className="font-heading text-xl font-bold text-pretty text-primary sm:text-2xl">
              The Case for Relief
            </h3>
            <ul className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-primary sm:text-base">
              <li className="flex min-w-0 gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden>
                  ✓
                </span>
                <span className="min-w-0">
                  Cancellation closes racial and gender wealth gaps that are
                  structural, not personal
                </span>
              </li>
              <li className="flex min-w-0 gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden>
                  ✓
                </span>
                <span className="min-w-0">
                  The Levy Economics Institute projects 1.2 to 1.5 million jobs created
                  per year from full cancellation
                </span>
              </li>
              <li className="flex min-w-0 gap-3">
                <span className="mt-0.5 shrink-0 font-bold text-accent" aria-hidden>
                  ✓
                </span>
                <span className="min-w-0">
                  Borrowers were promised forgiveness through IDR. Courts took it away.
                  The government owes them a remedy.
                </span>
              </li>
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-primary/10 p-5 pl-4 sm:p-6 md:pl-10"
            style={{ borderLeftWidth: 4, borderLeftColor: "#c0392b" }}
          >
            <h3 className="font-heading text-xl font-bold text-pretty text-primary sm:text-2xl">
              The Case Against
            </h3>
            <ul className="mt-4 space-y-3 text-pretty text-sm leading-relaxed text-primary sm:text-base">
              <li className="flex min-w-0 gap-3">
                <span
                  className="relative mt-1 inline-flex h-3 w-3 shrink-0 items-center justify-center"
                  aria-hidden
                >
                  <span className="absolute h-0.5 w-3 rotate-45 bg-alert" />
                  <span className="absolute h-0.5 w-3 -rotate-45 bg-alert" />
                </span>
                <span className="min-w-0">
                  Penn Wharton estimates full cancellation costs $300 billion to $980
                  billion added to the federal deficit
                </span>
              </li>
              <li className="flex min-w-0 gap-3">
                <span
                  className="relative mt-1 inline-flex h-3 w-3 shrink-0 items-center justify-center"
                  aria-hidden
                >
                  <span className="absolute h-0.5 w-3 rotate-45 bg-alert" />
                  <span className="absolute h-0.5 w-3 -rotate-45 bg-alert" />
                </span>
                <span className="min-w-0">
                  56% of student debt is held by the top 40% of income earners, making
                  broad cancellation regressive
                </span>
              </li>
              <li className="flex min-w-0 gap-3">
                <span
                  className="relative mt-1 inline-flex h-3 w-3 shrink-0 items-center justify-center"
                  aria-hidden
                >
                  <span className="absolute h-0.5 w-3 rotate-45 bg-alert" />
                  <span className="absolute h-0.5 w-3 -rotate-45 bg-alert" />
                </span>
                <span className="min-w-0">
                  SCOTUS has twice ruled that executive action without clear congressional
                  authorization is unconstitutional
                </span>
              </li>
            </ul>
          </motion.article>
        </div>

        <div className="mt-10 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/sides"
              className="inline-flex rounded-full bg-accent px-8 py-3 text-sm font-semibold text-primary"
            >
              See the Full Debate
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
