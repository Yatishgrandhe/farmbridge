"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const SHARE_TEXT =
  "Federal student loans now touch tens of millions of Americans. If you are learning about this in school too, read this AP Gov project at LoanedAFuture. Facts, both sides, and what you can do.";

export function ShareIssueBlock() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(SHARE_TEXT);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-2xl border border-accent/30 bg-primary/35 p-6 sm:p-8">
      <h2 className="font-heading text-2xl font-semibold text-accent">
        Share this issue
      </h2>
      <p className="mt-2 text-sm text-light/85">
        Copy a starter post for X (Twitter). Paste, tag your friends, and add
        your own voice.
      </p>
      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-5 rounded-lg border border-light/15 bg-black/20 p-4 text-sm italic leading-relaxed text-light/95"
      >
        {SHARE_TEXT}
      </motion.blockquote>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-5 inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition hover:brightness-110"
      >
        {copied ? "Copied!" : "Copy post text"}
      </button>
    </section>
  );
}
