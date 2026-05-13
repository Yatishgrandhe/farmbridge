"use client";

import { animate, motion, useInView, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  label: string;
  labelDetail?: string;
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

function formatDisplay(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return Math.round(value).toLocaleString("en-US");
}

export function StatCounter({
  label,
  labelDetail,
  target,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const motionValue = useMotionValue(0);
  const zeroText = useMemo(
    () => `${prefix}${formatDisplay(0, decimals)}${suffix}`,
    [decimals, prefix, suffix],
  );
  const [display, setDisplay] = useState(zeroText);

  const endText = useMemo(
    () => `${prefix}${formatDisplay(target, decimals)}${suffix}`,
    [decimals, prefix, suffix, target],
  );

  useEffect(() => {
    if (!isInView) {
      return;
    }
    motionValue.set(0);
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(`${prefix}${formatDisplay(latest, decimals)}${suffix}`);
    });
    const controls = animate(motionValue, target, {
      duration,
      ease: [0.22, 1, 0.36, 1] as const,
    });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [decimals, duration, isInView, motionValue, prefix, suffix, target]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
    >
      <p className="font-heading text-3xl font-semibold text-accent sm:text-4xl md:text-5xl">
        {isInView ? display : zeroText}
      </p>
      <p className="mt-2 text-sm font-medium text-primary sm:text-base">{label}</p>
      {labelDetail ? (
        <p className="mt-1 text-xs text-mid sm:text-sm">{labelDetail}</p>
      ) : null}
      <p className="sr-only" aria-live="polite">
        Animated statistic ending at {endText}
      </p>
    </motion.div>
  );
}
