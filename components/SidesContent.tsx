"use client";

import { motion } from "framer-motion";

function SidePanel({
  side,
  bg,
  text,
  children,
}: {
  side: "left" | "right";
  bg: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: side === "left" ? -72 : 72 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
      className={`flex flex-col gap-6 px-6 py-14 sm:px-10 lg:py-16 ${bg}`}
    >
      <div className={`space-y-4 ${text}`}>{children}</div>
    </motion.section>
  );
}

export function SidesContent() {
  return (
    <>
      <header className="border-b border-primary/10 px-4 pb-10 pt-24 text-center">
        <h1 className="font-heading text-4xl font-bold text-primary sm:text-5xl">
          Both sides of the debate
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-mid">
          Strong claims exist on each side. This page mirrors how AP Gov expects
          you to articulate competing constitutional and policy visions before
          you stake your own claim.
        </p>
      </header>

      <div className="grid min-h-[70vh] lg:grid-cols-2">
        <SidePanel
          side="left"
          bg="bg-surface border-border lg:border-r"
          text="text-primary"
        >
          <h2 className="font-heading text-3xl font-semibold text-accent">
            The case for relief
          </h2>
          <p className="text-sm text-mid">
            Key figures: Bernie Sanders, Elizabeth Warren, President Biden
            (2021 to 2025 agenda), Rep. Ayanna Pressley.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mid">
            <li>
              <strong className="text-accent">Economic mobility:</strong>{" "}
              monthly payments crowd out saving; reducing balances can free
              spending that supports local economies.
            </li>
            <li>
              <strong className="text-accent">Racial equity:</strong> Black
              borrowers, on average, owe more and take longer to pay down debt
              than white peers. Cancellation is framed as a wealth-gap intervention.
            </li>
            <li>
              <strong className="text-accent">Broken promise:</strong> college
              was sold as a path to stability while states disinvested from public
              campuses. Borrowers did what policymakers asked.
            </li>
          </ul>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
              Proposed solutions
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-mid">
              <li>Substantial or full cancellation for federal loans</li>
              <li>Expand and simplify IDR; auto-enrollment for delinquency risk</li>
              <li>Free community college and larger Pell grants</li>
              <li>
                Progressive revenue options (often described as taxing Wall Street
                trades or ultra-high wealth) to offset costs
              </li>
            </ul>
          </div>
          <figure className="rounded-lg border border-border bg-elevated p-4 shadow-sm">
            <blockquote className="font-heading text-sm italic leading-relaxed text-primary">
              Warren-style argument (paraphrased): targeted cancellation can shrink
              the racial wealth gap because student debt is concentrated among
              Black and brown borrowers who were steered into borrowing by
              decades of policy.
            </blockquote>
          </figure>
        </SidePanel>

        <SidePanel
          side="right"
          bg="bg-accent-soft border-border lg:border-l"
          text="text-primary"
        >
          <h2 className="font-heading text-3xl font-semibold text-primary">
            The case against cancellation
          </h2>
          <p className="text-sm text-mid">
            Key figures: Betsy DeVos, Sen. John Thune, Rep. Virginia Foxx, Trump
            administration officials.
          </p>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-mid">
            <li>
              <strong className="text-primary">Fairness:</strong> millions repaid
              loans or chose cheaper paths. Broad cancellation rewards a subset at
              taxpayer expense.
            </li>
            <li>
              <strong className="text-primary">Inflation & incentives:</strong>{" "}
              sudden forgiveness may boost demand while creating a{" "}
              <em>moral hazard</em> for future borrowers and colleges that raise
              prices.
            </li>
            <li>
              <strong className="text-primary">Separation of powers:</strong>{" "}
              big structural changes should come from Congress, not unilateral
              executive action, consistent with <em>Biden v. Nebraska</em>.
            </li>
          </ul>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Proposed alternatives
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-mid">
              <li>Income Share Agreements and private market tools (debated)</li>
              <li>Bigger investments in vocational training and apprenticeships</li>
              <li>
                Institutional accountability: colleges with high default rates share
                financial risk (&quot;skin in the game&quot;)
              </li>
              <li>Caps or elimination of Graduate PLUS lending</li>
            </ul>
          </div>
          <figure className="rounded-lg border border-border bg-elevated p-4 shadow-sm">
            <blockquote className="font-heading text-sm italic leading-relaxed text-primary">
              Common conservative argument (paraphrased): blanket cancellation
              asks plumbers and nurses to subsidize lawyers and doctors who
              voluntarily signed promissory notes.
            </blockquote>
          </figure>
        </SidePanel>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55 }}
        className="mx-auto max-w-3xl px-4 py-16"
      >
        <h2 className="font-heading text-center text-3xl font-semibold text-primary">
          A centrist read on the evidence
        </h2>
        <p className="mt-6 text-mid leading-relaxed">
          Economists genuinely disagree on the net effect of large-scale
          cancellation. The{" "}
          <strong className="text-primary">Penn Wharton Budget Model</strong>{" "}
          estimated that certain broad forgiveness proposals could add on the
          order of <strong>$300 to $500 billion</strong> to deficits over a decade,
          depending on income caps and take-up. Other researchers emphasize{" "}
          <strong className="text-primary">multiplier effects</strong>: freed-up
          cash for younger households can lift consumption, support small
          businesses, and reduce defaults that already cost the government money.
        </p>
        <p className="mt-4 text-mid leading-relaxed">
          For an AP Gov lens, the lesson is institutional:{" "}
          <strong className="text-primary">
            the CBO, universities, borrowers, and bond markets
          </strong>{" "}
          all respond to different incentives, so &quot;solve student debt&quot;
          is really dozens of policy levers, not one speech.
        </p>
      </motion.section>
    </>
  );
}
