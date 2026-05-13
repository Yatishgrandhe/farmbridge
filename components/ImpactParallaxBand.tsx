"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { UNSPLASH } from "@/lib/images";

export function ImpactParallaxBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className="relative h-72 overflow-hidden sm:h-96">
      <motion.div
        style={{ y }}
        className="absolute inset-0 will-change-transform"
        aria-hidden
      >
        <div className="relative h-[130%] w-full">
          <Image
            src={UNSPLASH.moneyDebt}
            alt="Coins stacked with paper currency representing household budgets"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </motion.div>
      <div className="absolute inset-0 bg-primary/70" aria-hidden />
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <p className="font-heading max-w-3xl text-balance text-2xl text-light sm:text-3xl">
          Debt is not abstract: it shows up in rent checks skipped, hours picked
          up, and plans postponed.
        </p>
      </div>
    </div>
  );
}
