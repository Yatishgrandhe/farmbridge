"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  side: "left" | "right";
  children: ReactNode;
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">;

export function ScrollReveal({ side, children, className, ...rest }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: side === "left" ? -56 : 56 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
