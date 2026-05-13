"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UNSPLASH } from "@/lib/images";

function IconEnvelope() {
  return (
    <div
      className="relative mx-auto h-12 w-16 rounded-sm border-2 border-primary"
      aria-hidden
    >
      <div className="absolute inset-x-2 top-2 h-0 border-x-[24px] border-b-[14px] border-x-transparent border-b-primary/30" />
    </div>
  );
}

function IconShare() {
  return (
    <div className="relative mx-auto h-12 w-12" aria-hidden>
      <div className="absolute left-1 top-2 h-2 w-2 rounded-full bg-primary" />
      <div className="absolute right-1 top-8 h-2 w-2 rounded-full bg-primary" />
      <div className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
      <div className="absolute left-3 top-3 h-0.5 w-6 rotate-[-35deg] bg-primary" />
      <div className="absolute left-3 top-7 h-0.5 w-6 rotate-[35deg] bg-primary" />
    </div>
  );
}

function IconBook() {
  return (
    <div className="mx-auto flex h-12 w-14 gap-1" aria-hidden>
      <div className="h-full flex-1 rounded-l-md border-2 border-r-0 border-primary bg-light" />
      <div className="h-full flex-1 rounded-r-md border-2 border-l-0 border-primary bg-light" />
    </div>
  );
}

export function SectionCta() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = "https://LoanedAFuture.us";
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="relative h-full min-h-[420px] w-full">
          <Image
            src={UNSPLASH.campusWalkway}
            alt="Students walking on a tree-lined campus path"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-0 bg-primary/80" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.12, delayChildren: 0.05 },
            },
          }}
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0 },
            }}
            className="font-heading text-pretty text-3xl font-bold leading-tight text-light sm:text-4xl md:text-5xl"
          >
            This is not someone else&apos;s problem.
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            className="mx-auto mt-6 max-w-3xl text-pretty text-base text-light/90 sm:text-lg"
          >
            43 million Americans are living this crisis. 44.6 million federal borrowers.
            5.3 million in default. 8 million in limbo. If you have student debt, or
            know someone who does, this is your issue to act on.
          </motion.p>
        </motion.div>

        <div className="mt-12 grid min-w-0 grid-cols-1 gap-6 md:grid-cols-3">
          <motion.article
            whileHover={{ y: -6 }}
            className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 text-left text-primary shadow-xl sm:p-6"
          >
            <IconEnvelope />
            <h3 className="mt-4 font-heading text-lg font-bold text-pretty sm:text-xl">
              Contact Your Senator
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-mid">
              Write to your senators about restoring IDR protections. It takes 3 minutes.
            </p>
            <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/action"
                className="inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary"
              >
                Open Action Center
              </Link>
            </motion.div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6 }}
            className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 text-left text-primary shadow-xl sm:p-6"
          >
            <IconShare />
            <h3 className="mt-4 font-heading text-lg font-bold text-pretty sm:text-xl">
              Share This Site
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-mid">
              Copy our link and share LoanedAFuture with one person who carries student
              debt.
            </p>
            <motion.button
              type="button"
              onClick={copy}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-6 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary"
            >
              Copy link
              {copied ? (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-lg"
                  aria-hidden
                >
                  ✓
                </motion.span>
              ) : null}
            </motion.button>
          </motion.article>

          <motion.article
            whileHover={{ y: -6 }}
            className="min-w-0 overflow-hidden rounded-2xl bg-white p-5 text-left text-primary shadow-xl sm:p-6"
          >
            <IconBook />
            <h3 className="mt-4 font-heading text-lg font-bold text-pretty sm:text-xl">
              Learn More
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-mid">
              Read the full background, both sides of the debate, and what the government
              can actually do.
            </p>
            <motion.div className="mt-6" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/background"
                className="inline-flex rounded-full bg-accent px-5 py-2 text-sm font-semibold text-primary"
              >
                Read Background
              </Link>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
