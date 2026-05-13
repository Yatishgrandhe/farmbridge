"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"section">, "children">;

export function AnimatedSection({
  children,
  className,
  ...motionProps
}: Props) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      {...motionProps}
    >
      {children}
    </motion.section>
  );
}
