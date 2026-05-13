"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useId, useState } from "react";

type Item = {
  id: string;
  title: string;
  summary: string;
  body: ReactNode;
};

export function PolicyAccordion({ items }: { items: Item[] }) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const headerId = `${baseId}-${item.id}-header`;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-primary/15 bg-white shadow-sm"
          >
            <button
              type="button"
              id={headerId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
            >
              <span>
                <span className="block font-heading text-lg font-semibold text-primary">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm text-mid">{item.summary}</span>
              </span>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 text-accent"
                aria-hidden
              >
                <motion.span
                  animate={{ rotate: open ? 45 : 0 }}
                  className="text-xl leading-none"
                >
                  +
                </motion.span>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
                >
                  <div className="border-t border-primary/10 px-4 py-4 text-sm leading-relaxed text-mid">
                    {item.body}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
