"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { UNSPLASH } from "@/lib/images";

export function SectionDemographics() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0px", "50px"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary py-16 sm:py-24">
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-10">
        <div className="relative h-full min-h-[480px] w-full">
          <Image
            src={UNSPLASH.moneyDebt}
            alt="Financial documents and calculator"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>
      <div className="absolute inset-0 -z-0 bg-primary/80" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-accent sm:text-4xl">
          Who Bears the Burden?
        </h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.15, delayChildren: 0.1 },
            },
          }}
          className="mt-12 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.article
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-w-0 overflow-hidden rounded-2xl border border-accent bg-primary/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <div className="mb-4 flex min-w-0 items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-accent" aria-hidden />
              <h3 className="min-w-0 font-heading text-lg font-semibold text-pretty text-light sm:text-xl">
                Women
              </h3>
            </div>
            <p className="font-heading text-4xl font-bold tabular-nums text-accent sm:text-5xl">
              67%
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-light/90">
              Women hold two thirds of all student loan debt in the United States,
              totaling over $929 billion. Women are more likely to attend graduate
              school and more likely to work in lower-paying fields such as education
              and social work despite holding advanced degrees.
            </p>
          </motion.article>

          <motion.article
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-w-0 overflow-hidden rounded-2xl border border-accent bg-primary/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <div className="mb-4 flex min-w-0 items-center gap-3">
              <div className="flex h-10 shrink-0 items-end gap-1" aria-hidden>
                <div className="h-3 w-2 rounded-sm bg-accent" />
                <div className="h-5 w-2 rounded-sm bg-accent" />
                <div className="h-7 w-2 rounded-sm bg-accent" />
                <div className="h-9 w-2 rounded-sm bg-accent" />
              </div>
              <h3 className="min-w-0 font-heading text-lg font-semibold text-pretty text-light sm:text-xl">
                Black Borrowers
              </h3>
            </div>
            <p className="font-heading text-4xl font-bold tabular-nums text-alert sm:text-5xl">
              plus 25%
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-light/90">
              Black borrowers owe on average 25% more than white peers four years
              after graduation. The Black-white disparity in student debt more than
              triples in the years following graduation. Black bachelor&apos;s degree
              holders owe an average of $25,000 more than white peers 12 years after
              starting college.
            </p>
          </motion.article>

          <motion.article
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-w-0 overflow-hidden rounded-2xl border border-accent bg-primary/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <div className="mb-4 flex min-w-0 items-center gap-3">
              <div
                className="relative h-10 w-10 shrink-0 rounded-full border-2 border-accent"
                aria-hidden
              >
                <div className="absolute left-1/2 top-1/2 h-3 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-accent" />
                <div className="absolute left-1/2 top-1/2 h-2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rotate-90 bg-accent" />
              </div>
              <h3 className="min-w-0 font-heading text-lg font-semibold text-pretty text-light sm:text-xl">
                Borrowers Over 50
              </h3>
            </div>
            <p className="font-heading text-3xl font-bold tabular-nums break-words text-accent sm:text-4xl">
              $281.8B
            </p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-light/90">
              Americans aged 50 and older hold $281.8 billion in federal student loan
              debt. Many borrowed for their own education decades ago and are still
              paying. Others borrowed through Parent PLUS loans to finance their
              children&apos;s education and now face retirement with significant loan
              obligations.
            </p>
          </motion.article>

          <motion.article
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0 },
            }}
            className="min-w-0 overflow-hidden rounded-2xl border border-accent bg-primary/70 p-5 backdrop-blur-sm sm:p-6"
          >
            <div className="mb-4 flex min-w-0 items-center gap-3">
              <div
                className="h-0 w-0 shrink-0 border-x-[14px] border-b-[24px] border-x-transparent border-b-accent"
                aria-hidden
              />
              <h3 className="min-w-0 font-heading text-lg font-semibold text-pretty text-light sm:text-xl">
                For-Profit School Students
              </h3>
            </div>
            <p className="font-heading text-4xl font-bold text-alert sm:text-5xl">3x</p>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-light/90">
              Borrowers who attended for-profit institutions default at three times the
              rate of those who attended public universities. For-profit school
              students represent a disproportionate share of all defaults despite
              having lower average balances, because credential and earnings outcomes
              are significantly worse.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}
