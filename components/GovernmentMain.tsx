"use client";

import { motion } from "framer-motion";
import { PolicyAccordion } from "@/components/PolicyAccordion";

const yesItems = [
  {
    id: "hearings",
    title: "Congress can rewrite loan terms",
    summary: "The Higher Education Act is a statutory hook for big changes.",
    body: (
      <div className="space-y-3">
        <p>
          Under the Constitution&apos;s Article I powers, Congress can tax,
          spend, and regulate interstate commerce. Student loans are created by
          statute, chiefly the <strong>Higher Education Act (HEA)</strong>, so
          Congress can change interest formulas, eligibility, forgiveness
          windows, and even authorize targeted cancellation if it writes the
          policy clearly enough to survive judicial review.
        </p>
      </div>
    ),
  },
  {
    id: "precedent",
    title: "Selective forgiveness is not legally unheard of",
    summary: "PPP and farm debt are common classroom comparisons.",
    body: (
      <p>
        Supporters of broad executive action often point to precedents like{" "}
        <strong>PPP loan forgiveness</strong> or{" "}
        <strong>farm debt relief</strong> to argue Congress and the executive
        have paired emergency spending with forgiveness-style design when they
        believe stability matters more than perfect targeting.
      </p>
    ),
  },
  {
    id: "idr",
    title: "Agencies administer repayment every day",
    summary: "HEA frameworks still empower rulemaking on IDR.",
    body: (
      <p>
        Even after <em>Biden v. Nebraska</em>, the Department of Education
        retains responsibility for servicing contracts, income certification, and
        plan enrollment. Section <strong>432</strong> of HEA is the statutory
        backbone students cite when they argue IDR is not a gift: it is a
        congressionally authorized repayment schedule.
      </p>
    ),
  },
];

const noItems = [
  {
    id: "mqd",
    title: "Courts can veto “major” executive moves",
    summary: "The major questions doctrine raises the bar for agency creativity.",
    body: (
      <div className="space-y-3">
        <p>
          In <em>Biden v. Nebraska</em> (2023), a 6-3 Court held that the
          Secretary of Education lacked clear congressional authorization for a
          nearly half-trillion-dollar cancellation program. The decision leaned
          on the <strong>major questions doctrine</strong>: if an agency action
          is economically and politically huge, Congress must speak in
          reasonably specific statutory language.
        </p>
        <p>
          For AP Gov: elections determine who appoints judges, and judges now
          shape whether presidents can deliver loan relief without new statutes.
        </p>
      </div>
    ),
  },
  {
    id: "gridlock",
    title: "Polarization caps legislative fixes",
    summary: "Divided government rewards litigation over compromise.",
    body: (
      <p>
        Even when public opinion favors “doing something,” filibusters, narrow
        majorities, and distrust make grand bargains rare. Interest groups, from{" "}
        <strong>university associations</strong> to{" "}
        <strong>banking coalitions</strong>
        , lobby on small technical lines in bill text, which can sink larger
        packages.
      </p>
    ),
  },
  {
    id: "capture",
    title: "Institutional capture matters",
    summary: "Colleges are not passive players.",
    body: (
      <p>
        Critics of accountability legislation argue elite universities lobby
        against <strong>risk-sharing</strong> rules that would claw back federal
        aid from programs with poor earnings outcomes, another example of how
        iron triangles can block reforms that poll well with voters.
      </p>
    ),
  },
];

const workItems = [
  {
    id: "means",
    title: "Means-tested cancellation + guardrails",
    summary: "Shrink the price tag while helping distressed borrowers.",
    body: (
      <p>
        Policy analysts across think tanks have modeled income caps, asset
        tests, and phase-outs so dollars flow to borrowers with high{" "}
        <strong>debt-to-income</strong> ratios rather than high lifetime
        earners, an approach designed to survive CBO scoring and moderate
        senators&apos; fiscal concerns.
      </p>
    ),
  },
  {
    id: "risk",
    title: "Institutional risk-sharing",
    summary: "Give colleges skin in the game.",
    body: (
      <p>
        Risk-sharing proposals tie a portion of defaulted or unrepaid dollars
        back to the campus that originated the aid package, pushing schools to
        invest in advising, completion, and honest cost estimates instead of
        maximizing enrollment alone.
      </p>
    ),
  },
  {
    id: "cc",
    title: "Free community college + accreditation reform",
    summary: "Front-end affordability reduces future borrowing.",
    body: (
      <p>
        Bipartisan talk occasionally pairs <strong>free community college</strong>{" "}
        with tighter accreditation standards so federal dollars do not subsidize
        low-value credentials, mirroring how other countries gate aid behind
        quality benchmarks.
      </p>
    ),
  },
];

function Flowchart() {
  return (
    <div className="mt-10 rounded-xl border border-primary/15 bg-light p-6">
      <h3 className="font-heading text-lg font-semibold text-primary">
        How a cancellation bill becomes law (simplified)
      </h3>
      <div className="mt-8 flex flex-col items-center gap-3 text-sm text-mid">
        <div className="w-full max-w-md rounded-md border-2 border-primary bg-white px-4 py-3 text-center font-medium text-primary">
          House committee drafts HEA / budget reconciliation language
        </div>
        <span className="text-2xl text-accent" aria-hidden>
          ↓
        </span>
        <div className="w-full max-w-md rounded-md border-2 border-primary bg-white px-4 py-3 text-center font-medium text-primary">
          CBO scores cost + Senate Finance / HELP markup
        </div>
        <span className="text-2xl text-accent" aria-hidden>
          ↓
        </span>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <div className="flex-1 rounded-md border-2 border-accent bg-accent/10 px-3 py-3 text-center text-primary">
            60 votes (filibuster){" "}
            <span className="block text-xs text-mid">unless budget rules fit</span>
          </div>
          <div className="flex-1 rounded-md border-2 border-primary/30 bg-white px-3 py-3 text-center text-primary">
            House passage
          </div>
        </div>
        <span className="text-2xl text-accent" aria-hidden>
          ↓
        </span>
        <div className="w-full max-w-md rounded-md border-2 border-primary bg-primary px-4 py-3 text-center font-medium text-light">
          President signs → agencies write rules → courts review challenges
        </div>
      </div>
    </div>
  );
}

export function GovernmentMain() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-20 pt-24 lg:flex-row">
      <aside className="lg:sticky lg:top-24 lg:h-fit lg:w-56 lg:shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          On this page
        </p>
        <nav
          className="mt-4 flex flex-col gap-2 text-sm text-mid"
          aria-label="Page table of contents"
        >
          <a className="hover:text-primary" href="#yes">
            Yes, government can
          </a>
          <a className="hover:text-primary" href="#no">
            No, not easily
          </a>
          <a className="hover:text-primary" href="#work">
            What might work
          </a>
          <a className="hover:text-primary" href="#flow">
            Legislative flowchart
          </a>
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-16">
        <header>
          <h1 className="font-heading text-4xl font-bold text-primary sm:text-5xl">
            Can government solve this?
          </h1>
          <p className="mt-4 text-lg text-mid">
            Short answer: <strong>yes in theory</strong>, because Congress
            created the loan system, but <strong>no in practice</strong> unless
            politics, courts, and implementation align.
          </p>
        </header>

        <motion.section
          id="yes"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading border-b-4 border-accent pb-2 text-3xl font-semibold text-primary">
            Yes, it can
          </h2>
          <PolicyAccordion items={yesItems} />
        </motion.section>

        <motion.section
          id="no"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading border-b-4 border-accent pb-2 text-3xl font-semibold text-primary">
            No, it can&apos;t easily
          </h2>
          <PolicyAccordion items={noItems} />
        </motion.section>

        <motion.section
          id="work"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading border-b-4 border-accent pb-2 text-3xl font-semibold text-primary">
            What would actually work?
          </h2>
          <p className="mt-3 text-mid">
            Senator Collins and Senator Manchin have at times embodied the
            swing-seat math that determines whether aid bills gain 60 votes. Here
            are policy buckets often discussed in bipartisan frameworks.
          </p>
          <PolicyAccordion items={workItems} />
        </motion.section>

        <motion.section
          id="flow"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <Flowchart />
        </motion.section>
      </div>
    </div>
  );
}
