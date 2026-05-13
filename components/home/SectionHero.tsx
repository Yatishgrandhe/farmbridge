"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { UNSPLASH } from "@/lib/images";

const TOTAL_FEDERAL_DEBT_USD = 1_774_000_000_000;

export function SectionHero() {
  const [clock, setClock] = useState("");

  const debtDigits = useMemo(
    () =>
      TOTAL_FEDERAL_DEBT_USD.toLocaleString("en-US", {
        maximumFractionDigits: 0,
      }),
    [],
  );

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const opts: Intl.DateTimeFormatOptions = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      };
      setClock(d.toLocaleString("en-US", opts));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" as const },
    },
  };

  const containerVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.2 },
      },
    }),
    [],
  );

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-30" aria-hidden>
        <div className="relative h-full min-h-[100svh] w-full">
          <Image
            src={UNSPLASH.heroGraduation}
            alt="Graduation caps thrown in celebration"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-20 bg-navy/68" aria-hidden />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-3 pb-28 pt-24 text-center sm:px-4 sm:pb-24 sm:pt-28">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-xl px-2 sm:max-w-2xl"
        >
          <motion.p
            variants={fadeUp}
            className="font-body text-sm font-medium text-cream/90 sm:text-base"
          >
            Total federal student loan debt owed
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="mt-3 font-heading text-2xl font-semibold tracking-tight text-cream sm:text-3xl md:text-4xl"
          >
            <span className="text-accent">$</span>
            <span className="tabular-nums tracking-tight">{debtDigits}</span>
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-7 max-w-3xl text-pretty px-1 text-base text-cream/95 sm:mt-8 sm:px-0 sm:text-lg"
        >
          The federal student loan crisis is not a future problem. It is happening
          right now to 43 million Americans. Courts have blocked relief. Congress is
          deadlocked. The Department of Education is being dismantled. This site
          exists to show you what is at stake.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.45, ease: "easeOut" }}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/background"
              className="inline-flex rounded-full bg-accent px-8 py-4 text-sm font-semibold text-cream sm:text-base"
            >
              Explore the Crisis
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/action"
              className="inline-flex rounded-full border-2 border-cream/90 bg-transparent px-8 py-4 text-sm font-semibold text-cream sm:text-base"
            >
              Take Action Now
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-20 max-w-[min(100%,22rem)] border-l-4 border-accent pl-3 text-left font-mono text-[10px] leading-snug text-cream/90 sm:text-xs md:text-sm">
        As of {clock || "\u00a0"}
      </div>
    </section>
  );
}
