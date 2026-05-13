"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

function StatCard({
  target,
  label,
  subtext,
  prefix,
  suffix,
  decimals,
  icon,
}: {
  target: number;
  label: string;
  subtext: string;
  prefix: string;
  suffix: string;
  decimals?: number;
  icon: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const d = decimals ?? 0;
  const count = useCountUp(target, 2500, inView, d);
  const formatted =
    d > 0
      ? count.toLocaleString("en-US", {
          minimumFractionDigits: d,
          maximumFractionDigits: d,
        })
      : count.toLocaleString("en-US");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      whileHover={{ y: -8, borderTopColor: "#e4a400" }}
      className="min-w-0 overflow-hidden rounded-2xl border-t-4 border-primary bg-white p-5 shadow-lg transition-colors duration-200 sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-xl font-bold tabular-nums break-words text-primary sm:text-2xl md:text-3xl lg:text-4xl">
            {prefix}
            {formatted}
            {suffix}
          </p>
          <p className="mt-2 text-pretty text-base font-semibold leading-snug text-primary sm:text-lg">
            {label}
          </p>
          <p className="mt-1 text-pretty text-xs leading-relaxed text-mid sm:text-sm">
            {subtext}
          </p>
        </div>
        <div className="shrink-0 self-start sm:self-auto">{icon}</div>
      </div>
    </motion.div>
  );
}

function IconCircleGold() {
  return (
    <div
      className="h-10 w-10 rounded-full bg-accent"
      aria-hidden
    />
  );
}

function IconBars() {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden>
      <div className="h-4 w-2 rounded-sm bg-accent" />
      <div className="h-6 w-2 rounded-sm bg-accent" />
      <div className="h-8 w-2 rounded-sm bg-accent" />
      <div className="h-10 w-2 rounded-sm bg-accent" />
    </div>
  );
}

function IconPerson() {
  return (
    <div className="relative h-10 w-8" aria-hidden>
      <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-accent" />
      <div className="absolute bottom-0 left-0 right-0 mx-auto h-5 w-8 rounded-t-full bg-accent" />
    </div>
  );
}

function IconWarning() {
  return (
    <div
      className="h-0 w-0 border-x-[18px] border-b-[30px] border-x-transparent border-b-accent"
      aria-hidden
    />
  );
}

function IconClock() {
  return (
    <div
      className="relative h-10 w-10 rounded-full border-2 border-accent"
      aria-hidden
    >
      <div className="absolute left-1/2 top-1/2 h-3 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full bg-accent" />
      <div className="absolute left-1/2 top-1/2 h-2 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full rotate-90 bg-accent" />
    </div>
  );
}

function TuitionBarRow({
  title,
  pct,
  labelText,
  labelClass,
  delay,
}: {
  title: string;
  pct: number;
  labelText: string;
  labelClass: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const visual = Math.min(100, pct);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="mb-6"
    >
      <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-x-2">
        <p className="min-w-0 flex-1 text-pretty font-medium leading-snug text-primary">
          {title}
        </p>
        <span className={`shrink-0 text-sm font-bold ${labelClass}`}>{labelText}</span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="relative h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-white/80">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={inView ? { width: `${visual}%` } : { width: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </div>
        <span className="shrink-0 text-sm font-bold text-primary sm:pt-0">
          plus {pct}%
        </span>
      </div>
    </motion.div>
  );
}

export function SectionDashboard() {
  const titleRef = useRef<HTMLDivElement>(null);
  const underlineInView = useInView(titleRef, { once: true, amount: 0.8 });

  return (
    <section className="bg-light px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div ref={titleRef} className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary sm:text-4xl">
            The Crisis By The Numbers
          </h2>
          <motion.div
            className="mx-auto mt-3 h-1 w-48 origin-center bg-accent"
            initial={{ scaleX: 0 }}
            animate={underlineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            target={44600000}
            label="Americans with Federal Student Debt"
            subtext="As of Q3 Fiscal Year 2025, Federal Student Aid"
            prefix=""
            suffix=""
            icon={<IconCircleGold />}
          />
          <StatCard
            target={1774000000000}
            label="Total Federal Student Debt"
            subtext="Federal Reserve, 2024"
            prefix="$"
            suffix=""
            icon={<IconBars />}
          />
          <StatCard
            target={37787}
            label="Average Debt Per Borrower"
            subtext="Federal Student Aid Portfolio Data"
            prefix="$"
            suffix=""
            icon={<IconPerson />}
          />
          <StatCard
            target={5300000}
            label="Borrowers Currently in Default"
            subtext="Federal Student Aid, June 2025"
            prefix=""
            suffix=""
            icon={<IconWarning />}
          />
          <StatCard
            target={9.57}
            label="Percent of Loans Severely Delinquent"
            subtext="90 or more days past due, Q4 2025, LendingTree"
            prefix=""
            suffix="%"
            decimals={2}
            icon={<IconBars />}
          />
          <StatCard
            target={281800000000}
            label="Debt Held by Borrowers 50 and Older"
            subtext="Federal Reserve Board"
            prefix="$"
            suffix=""
            icon={<IconClock />}
          />
        </div>

        <div className="mt-16 min-w-0 rounded-2xl bg-white/60 p-4 shadow-inner sm:p-10">
          <h3 className="mb-8 text-center font-heading text-2xl font-bold text-primary sm:text-3xl">
            How Much Has Tuition Grown?
          </h3>
          <TuitionBarRow
            title="Tuition at 4-Year Public Universities since 1980"
            pct={169}
            labelText="plus 169%"
            labelClass="text-alert"
            delay={0}
          />
          <TuitionBarRow
            title="Overall Inflation since 1980"
            pct={118}
            labelText="plus 118%"
            labelClass="text-[#e07b00]"
            delay={0.08}
          />
          <TuitionBarRow
            title="Median Wage Growth since 1980"
            pct={19}
            labelText="plus 19%"
            labelClass="text-success"
            delay={0.16}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="mt-8"
          >
            <p className="mb-3 font-medium text-primary">
              Maximum Pell Grant Coverage of College Costs
            </p>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex min-w-0 flex-wrap justify-between gap-x-2 gap-y-1 text-sm text-mid">
                  <span className="min-w-0">1975 coverage</span>
                  <span className="font-bold text-primary">79%</span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-white/80">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: "79%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 flex min-w-0 flex-wrap justify-between gap-x-2 gap-y-1 text-sm text-mid">
                  <span className="min-w-0">2024 coverage</span>
                  <span className="font-bold text-primary">26%</span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-white/80">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    whileInView={{ width: "26%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
