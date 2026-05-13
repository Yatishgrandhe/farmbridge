"use client";

import { motion } from "framer-motion";

type Bias = "gov" | "nonpartisan" | "left" | "right" | "center";

const citations: {
  title: string;
  bias: Bias;
  note: string;
  href: string;
  chicago: string;
}[] = [
  {
    title: "Federal Student Aid (FSA Data Center update)",
    bias: "gov",
    note: "Government / official",
    href: "https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2025-08-21/federal-student-aid-posts-updated-reports-fsa-data-center",
    chicago:
      'Federal Student Aid, U.S. Department of Education. "Federal Student Aid Posts Updated Reports to FSA Data Center." Electronic announcement, August 21, 2025. https://fsapartners.ed.gov/knowledge-center/library/electronic-announcements/2025-08-21/federal-student-aid-posts-updated-reports-fsa-data-center.',
  },
  {
    title: "Federal Reserve Board (household well-being, 2024)",
    bias: "nonpartisan",
    note: "Nonpartisan / government",
    href: "https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-higher-education-and-student-loans.htm",
    chicago:
      'Board of Governors of the Federal Reserve System. "Report on the Economic Well-Being of U.S. Households in 2024: Higher Education and Student Loans." May 2025. https://www.federalreserve.gov/publications/2025-economic-well-being-of-us-households-in-2024-higher-education-and-student-loans.htm.',
  },
  {
    title: "Federal Reserve Board (FEDS, student loans and homeownership)",
    bias: "nonpartisan",
    note: "Nonpartisan",
    href: "https://www.federalreserve.gov/econres/feds/student-loans-and-homeownership.htm",
    chicago:
      'Mezza, Alvaro A., Daniel R. Ringo, Shane M. Sherlund, and Kamila Sommer. "Student Loans and Homeownership." Finance and Economics Discussion Series 2016-010. Board of Governors of the Federal Reserve System, 2016. https://www.federalreserve.gov/econres/feds/student-loans-and-homeownership.htm.',
  },
  {
    title: "Brookings Institution (default crisis)",
    bias: "left",
    note: "Center-left",
    href: "https://www.brookings.edu/articles/the-looming-student-loan-default-crisis-is-worse-than-we-thought/",
    chicago:
      'Scott-Clayton, Judith. "The Looming Student Loan Default Crisis Is Worse than We Thought." Brookings Institution Evidence Speaks Reports, Vol. 2, No. 34, January 10, 2018. https://www.brookings.edu/articles/the-looming-student-loan-default-crisis-is-worse-than-we-thought/.',
  },
  {
    title: "Brookings Institution (borrowers and defaults)",
    bias: "left",
    note: "Center-left",
    href: "https://www.brookings.edu/articles/a-crisis-in-student-loans-how-changes-in-the-characteristics-of-borrowers-and-in-the-institutions-they-attended-contributed-to-rising-loan-defaults/",
    chicago:
      'Looney, Adam, and Constantine Yannelis. "A Crisis in Student Loans? How Changes in the Characteristics of Borrowers and in the Institutions They Attended Contributed to Rising Loan Defaults." Brookings Papers on Economic Activity. Brookings Institution, 2015. https://www.brookings.edu/articles/a-crisis-in-student-loans-how-changes-in-the-characteristics-of-borrowers-and-in-the-institutions-they-attended-contributed-to-rising-loan-defaults/.',
  },
  {
    title: "Penn Wharton Budget Model (forgiving student loans)",
    bias: "nonpartisan",
    note: "Nonpartisan",
    href: "https://budgetmodel.wharton.upenn.edu/issues/2022/8/23/forgiving-student-loans",
    chicago:
      'Penn Wharton Budget Model. "Forgiving Student Loans: Budgetary Costs and Distributional Impact." University of Pennsylvania, August 23, 2022. https://budgetmodel.wharton.upenn.edu/issues/2022/8/23/forgiving-student-loans.',
  },
  {
    title: "Penn Wharton Budget Model (Biden forgiveness plan)",
    bias: "nonpartisan",
    note: "Nonpartisan",
    href: "https://budgetmodel.wharton.upenn.edu/p/2022-08-26-the-biden-student-loan-forgiveness-plan/",
    chicago:
      'Penn Wharton Budget Model. "The Biden Student Loan Forgiveness Plan: Budgetary Costs and Distributional Impact." University of Pennsylvania, August 26, 2022. https://budgetmodel.wharton.upenn.edu/p/2022-08-26-the-biden-student-loan-forgiveness-plan/.',
  },
  {
    title: "The Heritage Foundation (seven reasons report)",
    bias: "right",
    note: "Right-leaning",
    href: "https://www.heritage.org/education/report/seven-reasons-why-president-bidens-student-loan-debt-transfer-bad-america",
    chicago:
      'Butcher, Jonathan, and Lindsey Burke. "Seven Reasons Why President Biden\'s Student-Loan Debt Transfer Is Bad for America." The Heritage Foundation, August 29, 2022. https://www.heritage.org/education/report/seven-reasons-why-president-bidens-student-loan-debt-transfer-bad-america.',
  },
  {
    title: "The Heritage Foundation (court commentary)",
    bias: "right",
    note: "Right-leaning",
    href: "https://www.heritage.org/courts/commentary/federal-court-biden-the-student-loan-bailout-its-still-illegal",
    chicago:
      'The Heritage Foundation. "Federal Court to Biden on the Student Loan Bailout: It\'s Still Illegal." August 30, 2024. https://www.heritage.org/courts/commentary/federal-court-biden-the-student-loan-bailout-its-still-illegal.',
  },
  {
    title: "National Center for Education Statistics",
    bias: "center",
    note: "Center",
    href: "https://nces.ed.gov/fastfacts/display.asp?id=900",
    chicago:
      'National Center for Education Statistics. "Fast Facts: Student Debt." U.S. Department of Education, Institute of Education Sciences, 2024. https://nces.ed.gov/fastfacts/display.asp?id=900.',
  },
];

function BiasBadge({ bias }: { bias: Bias }) {
  const styles: Record<Bias, string> = {
    gov: "bg-emerald-100 text-emerald-950 border-emerald-300",
    nonpartisan: "bg-emerald-100 text-emerald-950 border-emerald-300",
    left: "bg-blue-100 text-blue-900 border-blue-200",
    right: "bg-red-100 text-red-900 border-red-200",
    center: "bg-slate-100 text-slate-900 border-slate-200",
  };
  const labels: Record<Bias, string> = {
    gov: "Government / official",
    nonpartisan: "Nonpartisan",
    left: "Center-left",
    right: "Right-leaning",
    center: "Center",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${styles[bias]}`}
    >
      {labels[bias]}
    </span>
  );
}

export function SourcesContent() {
  return (
    <>
      <header className="border-b border-primary/10 px-4 pb-10 pt-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-4xl font-bold text-primary sm:text-5xl">
            Sources &amp; citations
          </h1>
          <p className="mt-4 text-mid">
            Chicago-style (author-date adapted for web) entries for sources used
            while building this project. Bias labels follow classroom media-literacy
            norms, not precise empirical rankings.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-12">
        {citations.map((c, i) => (
          <motion.article
            key={c.href}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.06 * i, duration: 0.45 }}
            className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-xl font-semibold text-primary">
                {c.title}
              </h2>
              <BiasBadge bias={c.bias} />
            </div>
            <p className="mt-1 text-xs uppercase tracking-wide text-mid">
              Editorial note: {c.note}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-mid">{c.chicago}</p>
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              View source
            </a>
          </motion.article>
        ))}
      </div>

      <section className="border-t border-primary/10 bg-light px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-primary/10 bg-white p-8">
          <h2 className="font-heading text-2xl font-semibold text-primary">
            Sourcing standard (legend)
          </h2>
          <p className="mt-3 text-sm text-mid">
            This project pairs left-leaning and right-leaning commentary with
            government and nonpartisan research. Color badges are a classroom
            shorthand, not a scientific ranking.
          </p>
          <ul className="mt-6 space-y-4 text-sm text-mid">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-10 rounded-full bg-emerald-200" />
              <span>
                <strong className="text-primary">Green badge:</strong> federal
                agencies, official data releases, and research teams commonly
                described as nonpartisan (still interpret findings in context).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-10 rounded-full bg-blue-200" />
              <span>
                <strong className="text-primary">Blue badge:</strong> authors or
                outlets often described as center-left.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-10 rounded-full bg-red-200" />
              <span>
                <strong className="text-primary">Red badge:</strong> outlets or
                authors often described as right-leaning.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-3 w-10 rounded-full bg-slate-200" />
              <span>
                <strong className="text-primary">Gray badge:</strong> neutral
                reference pages or official statistics presented as fast facts.
              </span>
            </li>
          </ul>
          <p className="mt-6 text-sm text-mid">
            For every strong opinion piece, this list also includes government or
            model-based sources so readers can compare claims to data and cost
            estimates.
          </p>
        </div>
      </section>
    </>
  );
}
