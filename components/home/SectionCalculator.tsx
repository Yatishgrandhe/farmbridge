"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const FPL_2024 = [15060, 20440, 25820, 31200, 36580, 41960, 47340, 52720];

function monthlyStandard(balance: number, annualRatePercent: number) {
  const r = annualRatePercent / 100 / 12;
  const n = 120;
  if (r <= 0) {
    return balance / n;
  }
  return (balance * r) / (1 - Math.pow(1 + r, -n));
}

function monthlyIbr(income: number, familySize: number) {
  const fpl = FPL_2024[familySize - 1] ?? FPL_2024[0];
  const discretionary = income - 1.5 * fpl;
  return Math.max(0, (discretionary * 0.1) / 12);
}

function monthlySave(
  income: number,
  familySize: number,
  isGraduate: boolean,
) {
  const fpl = FPL_2024[familySize - 1] ?? FPL_2024[0];
  const discretionary = income - 2.25 * fpl;
  const share = isGraduate ? 0.1 : 0.05;
  return Math.max(0, (discretionary * share) / 12);
}

function simulateRemaining(
  balance: number,
  annualRatePercent: number,
  monthlyPay: number,
  months: number,
) {
  const r = annualRatePercent / 100 / 12;
  let b = balance;
  for (let m = 0; m < months; m += 1) {
    const interest = b * r;
    const due = b + interest;
    const pay = Math.min(Math.max(0, monthlyPay), due);
    b = due - pay;
    if (b <= 0) {
      return 0;
    }
  }
  return b;
}

function Money({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const text = `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}${suffix}`;
  return (
    <motion.span
      key={text}
      className="inline-block max-w-full break-words tabular-nums"
      initial={{ opacity: 0.4, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {text}
    </motion.span>
  );
}

export function SectionCalculator() {
  const [balance, setBalance] = useState(37787);
  const [income, setIncome] = useState(52000);
  const [loanType, setLoanType] = useState<"ug" | "grad">("ug");
  const [familySize, setFamilySize] = useState(1);

  const rate = loanType === "ug" ? 6.54 : 8.08;
  const isGrad = loanType === "grad";

  const results = useMemo(() => {
    const std = monthlyStandard(balance, rate);
    const totalPaidStd = std * 120;
    const interestStd = Math.max(0, totalPaidStd - balance);
    const ibr = monthlyIbr(income, familySize);
    const save = monthlySave(income, familySize, isGrad);
    const forgive20 = simulateRemaining(balance, rate, ibr, 240);
    const forgivePslf = simulateRemaining(balance, rate, ibr, 120);
    return {
      std,
      totalPaidStd,
      interestStd,
      ibr,
      save,
      forgive20,
      forgivePslf,
    };
  }, [balance, income, familySize, rate, isGrad]);

  const fillPct = Math.min(100, Math.max(0, ((balance - 1000) / (500000 - 1000)) * 100));

  return (
    <section className="bg-light px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-heading text-3xl font-bold text-primary sm:text-4xl">
          What Could Your Debt Look Like?
        </h2>
        <p className="mt-3 max-w-3xl text-pretty text-mid">
          Use this calculator to estimate federal student loan repayment under
          different plans. All calculations use standard federal formulas.
        </p>

        <div className="mt-10 grid min-w-0 gap-8 rounded-2xl bg-white/70 p-4 shadow-inner sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="min-w-0 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-primary">
                Loan Balance
              </label>
              <input
                type="number"
                min={1000}
                max={500000}
                step={500}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-primary/20 px-3 py-2"
              />
              <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-primary/10">
                <motion.div
                  className="h-full rounded-full bg-accent"
                  animate={{ width: `${fillPct}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 24 }}
                />
              </div>
              <input
                type="range"
                min={1000}
                max={500000}
                step={500}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                className="mt-2 w-full accent-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-primary">
                Annual Income
              </label>
              <input
                type="number"
                min={10000}
                max={300000}
                step={1000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-primary/20 px-3 py-2"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-semibold text-primary">
                Loan Type
              </legend>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="loanType"
                    checked={loanType === "ug"}
                    onChange={() => setLoanType("ug")}
                  />
                  Undergraduate
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="loanType"
                    checked={loanType === "grad"}
                    onChange={() => setLoanType("grad")}
                  />
                  Graduate
                </label>
              </div>
            </fieldset>

            <div>
              <label className="block text-sm font-semibold text-primary">
                Family Size
              </label>
              <select
                value={familySize}
                onChange={(e) => setFamilySize(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-primary/20 px-3 py-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 overflow-hidden rounded-2xl border-t-4 border-primary/40 bg-white p-4 shadow-md sm:p-6">
              <h3 className="font-heading text-lg font-bold text-primary">
                Standard Plan
              </h3>
              <p className="mt-2 text-pretty text-sm text-mid">120 equal payments</p>
              <p className="mt-4 text-pretty text-sm text-primary">
                Monthly payment:{" "}
                <span className="text-lg font-bold">
                  <Money value={results.std} prefix="$" />
                </span>
              </p>
              <p className="mt-2 text-pretty text-sm text-primary">
                Total paid:{" "}
                <span className="font-semibold">
                  <Money value={results.totalPaidStd} prefix="$" />
                </span>
              </p>
              <p className="mt-2 text-pretty text-sm text-primary">
                Total interest:{" "}
                <span className="font-semibold">
                  <Money value={results.interestStd} prefix="$" />
                </span>
              </p>
              <p className="mt-2 text-pretty text-sm text-primary">Payoff: 10 years</p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border-t-4 border-accent bg-white p-4 shadow-md sm:p-6">
              <h3 className="font-heading text-lg font-bold text-primary">IBR Plan</h3>
              <p className="mt-2 text-pretty text-sm text-mid">10% of discretionary income</p>
              <p className="mt-4 text-pretty text-sm text-primary">
                Monthly payment:{" "}
                <span className="text-lg font-bold">
                  <Money value={results.ibr} prefix="$" />
                </span>
              </p>
              <p className="mt-2 text-pretty text-sm text-primary">
                Estimated forgiveness after 20 years:{" "}
                <span className="font-semibold text-alert">
                  <Money value={results.forgive20} prefix="$" />
                </span>
              </p>
              <p className="mt-2 text-pretty text-xs text-mid">
                Forgiveness under IBR may be treated as taxable income in some
                years. Consult a tax professional.
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border-t-4 border-alert bg-white p-4 shadow-md sm:p-6">
              <p className="mb-3 rounded-md bg-alert px-2 py-2 text-center text-[10px] font-bold leading-snug text-white sm:text-left">
                CURRENTLY BLOCKED BY COURTS - 8th Circuit Injunction, August 2024
              </p>
              <h3 className="font-heading text-lg font-bold text-primary">
                SAVE Plan (Pre-Court Injunction)
              </h3>
              <p className="mt-4 text-pretty text-sm text-primary">
                Monthly payment (model):{" "}
                <span className="text-lg font-bold">
                  <Money value={results.save} prefix="$" />
                </span>
              </p>
              <p className="mt-3 text-pretty text-xs leading-relaxed text-alert">
                This plan is not available for new enrollments while litigation
                continues. Numbers reflect pre-injunction formulas only.
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border-t-4 border-success bg-white p-4 shadow-md sm:p-6">
              <h3 className="font-heading text-lg font-bold text-primary">
                PSLF Track
              </h3>
              <p className="mt-2 text-pretty text-sm text-mid">
                Uses the same IBR-style monthly estimate for illustration.
              </p>
              <p className="mt-4 text-pretty text-sm text-primary">
                Monthly payment:{" "}
                <span className="text-lg font-bold">
                  <Money value={results.ibr} prefix="$" />
                </span>
              </p>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-primary">
                If you work in public service and make 120 qualifying payments,
                the remaining balance is forgiven tax-free after 10 years.
                Estimated forgiveness:{" "}
                <span className="font-semibold text-success">
                  <Money value={results.forgivePslf} prefix="$" />
                </span>
              </p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-pretty text-center text-xs text-mid">
          This calculator is for educational purposes only and uses simplified
          federal formulas. Actual payments depend on servicer calculations,
          interest capitalization, and plan eligibility. Consult studentaid.gov
          for official estimates.
        </p>
      </div>
    </section>
  );
}
