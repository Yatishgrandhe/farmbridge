"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ContactSenateForm } from "@/components/ContactSenateForm";
import { ShareIssueBlock } from "@/components/ShareIssueBlock";
import { UNSPLASH } from "@/lib/images";

const orgs = [
  {
    name: "Student Borrower Protection Center",
    href: "https://protectborrowers.org",
    blurb: "Legal advocacy focused on predatory servicing and borrower rights.",
  },
  {
    name: "American Federation of Teachers",
    href: "https://aft.org",
    blurb: "Union voice on college affordability and public-service loan forgiveness.",
  },
  {
    name: "Debt Collective",
    href: "https://debtcollective.org",
    blurb: "Grassroots campaigns linking debt refusal to broader economic justice.",
  },
  {
    name: "National Association of Student Financial Aid Administrators",
    href: "https://nasfaa.org",
    blurb: "Financial-aid professionals translating policy into campus practice.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function ActionContent() {
  return (
    <>
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <Image
            src={UNSPLASH.protest}
            alt="Demonstrators with signs at a public rally"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-primary/80" aria-hidden />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="font-heading text-4xl font-bold text-accent sm:text-6xl"
          >
            Turn urgency into action
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-5 text-lg text-light/90"
          >
            AP Gov is not only about knowing institutions: it is about using them.
            Start with one email, one petition signature, one classroom
            conversation.
          </motion.p>
        </div>
      </section>

      <div className="space-y-16 bg-primary px-4 py-16">
        <ContactSenateForm />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="font-heading text-2xl font-semibold text-accent sm:text-3xl">
            Sign a petition
          </h2>
          <Link
            href="https://www.studentdebtcrisis.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex min-h-[140px] items-center justify-center rounded-2xl border-2 border-accent bg-accent px-6 py-10 text-center text-xl font-semibold text-primary shadow-lg transition hover:brightness-110 sm:text-2xl"
          >
            Visit Student Debt Crisis: add your name to national campaigns
          </Link>
        </motion.section>

        <section>
          <h2 className="font-heading text-2xl font-semibold text-accent sm:text-3xl">
            Organizations to follow
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {orgs.map((org, i) => (
              <motion.article
                key={org.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col rounded-xl border border-accent/30 bg-black/25 p-6"
              >
                <h3 className="font-heading text-xl font-semibold text-light">
                  {org.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-light/85">{org.blurb}</p>
                <a
                  href={org.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary transition hover:brightness-110"
                >
                  Visit
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <ShareIssueBlock />
      </div>
    </>
  );
}
