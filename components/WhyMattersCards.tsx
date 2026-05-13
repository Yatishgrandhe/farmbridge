"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Democratic stakes",
    body: "Loan rules shape who can run for office, vote, and build wealth without drowning in payments.",
    shape: "capitol",
  },
  {
    title: "Economic ripple effects",
    body: "Monthly bills crowd out saving, entrepreneurship, and home purchases for millions of households.",
    shape: "bars",
  },
  {
    title: "Generational fairness",
    body: "Tuition climbed faster than wages. Today's borrowers are paying for yesterday's policy choices.",
    shape: "orbit",
  },
] as const;

function CssShape({ type }: { type: (typeof cards)[number]["shape"] }) {
  if (type === "capitol") {
    return (
      <div className="flex h-14 w-14 flex-col items-center justify-end" aria-hidden>
        <div className="h-0 w-0 border-x-[18px] border-b-[14px] border-x-transparent border-b-accent" />
        <div className="h-6 w-12 rounded-sm bg-accent/80" />
        <div className="mt-1 h-2 w-16 rounded-sm bg-accent" />
      </div>
    );
  }
  if (type === "bars") {
    return (
      <div className="flex h-14 items-end gap-1" aria-hidden>
        <span className="block h-6 w-3 rounded-sm bg-accent/70" />
        <span className="block h-10 w-3 rounded-sm bg-accent" />
        <span className="block h-14 w-3 rounded-sm bg-accent/90" />
        <span className="block h-8 w-3 rounded-sm bg-accent/60" />
      </div>
    );
  }
  return (
    <div className="relative flex h-14 w-14 items-center justify-center" aria-hidden>
      <span className="absolute h-12 w-12 rounded-full border-4 border-accent/35" />
      <span className="absolute h-8 w-8 rounded-full border-4 border-accent/60" />
      <span className="h-4 w-4 rounded-full bg-accent" />
    </div>
  );
}

export function WhyMattersCards() {
  return (
    <section className="bg-light px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-heading text-center text-3xl font-semibold text-primary sm:text-4xl">
          Why This Matters
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-mid">
          Student debt is not only a personal finance story: it is a story about
          power, institutions, and who gets a fair shot.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: 0.08 * i, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm shadow-primary/5"
            >
              <CssShape type={card.shape} />
              <h3 className="font-heading mt-5 text-xl font-semibold text-primary">
                {card.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mid">{card.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
