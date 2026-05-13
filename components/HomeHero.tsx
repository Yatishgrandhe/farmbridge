"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { UNSPLASH } from "@/lib/images";

const lineVariants = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.12 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      <motion.div
        style={{ y: imageY }}
        className="pointer-events-none absolute inset-0 -z-20 will-change-transform"
        aria-hidden
      >
        <div className="relative h-full min-h-[100svh] w-full">
          <Image
            src={UNSPLASH.heroGraduation}
            alt="Graduates celebrating with caps in the air"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-primary/65"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-28 sm:pt-32">
        <div>
          <motion.p
            custom={0}
            variants={lineVariants}
            initial="hidden"
            animate="show"
            className="text-sm font-semibold uppercase tracking-[0.2em] text-accent"
          >
            AP Government Final Project
          </motion.p>
          <motion.h1
            custom={1}
            variants={lineVariants}
            initial="hidden"
            animate="show"
            className="font-heading mt-4 text-balance text-4xl font-bold leading-tight text-light sm:text-5xl md:text-6xl"
          >
            $1.7 Trillion. 45 Million Borrowers. One Crisis.
          </motion.h1>
          <motion.p
            custom={2}
            variants={lineVariants}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-2xl text-pretty text-lg italic text-light/90 sm:text-xl"
          >
            The federal student loan debt crisis is reshaping the American dream,
            and the government&apos;s response may define a generation.
          </motion.p>
        </div>
        <motion.div
          custom={3}
          variants={lineVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <Link
            href="/background"
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-center text-sm font-semibold text-primary shadow-lg shadow-black/20 transition hover:brightness-110"
          >
            Learn the Facts
          </Link>
          <Link
            href="/action"
            className="inline-flex items-center justify-center rounded-md border-2 border-accent bg-transparent px-6 py-3 text-center text-sm font-semibold text-accent transition hover:bg-accent/10"
          >
            Take Action
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
