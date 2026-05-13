"use client";

import { useMemo, useState } from "react";
import { senatorData } from "@/app/action/senatorData";

const ORDERED_STATES = Object.keys(senatorData).sort((a, b) =>
  a.localeCompare(b),
);

export function ContactSenateForm() {
  const [state, setState] = useState("");

  const row = state ? senatorData[state] : null;

  const mailtoHref = useMemo(() => {
    if (!row || !state) {
      return "";
    }
    const subject = encodeURIComponent(
      "Federal student loans: constituent perspective",
    );
    const body = encodeURIComponent(
      `Dear Senator,\n\nI am writing as a constituent from ${state} about federal student loan policy. I am asking you to prioritize transparent repayment rules, fair treatment of borrowers, and bipartisan solutions that reduce delinquency without surprise cliffs.\n\nContact forms for reference:\n${row.senator1}: ${row.url1}\n${row.senator2}: ${row.url2}\n\nThank you for your service.\n`,
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }, [row, state]);

  return (
    <div className="rounded-2xl border border-accent/30 bg-primary/40 p-6 sm:p-8">
      <h2 className="font-heading text-2xl font-semibold text-accent sm:text-3xl">
        Contact your senators
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-light/90">
        Choose your state, then open each senator&apos;s official Senate contact
        form in a new tab. You can also draft an email in your own mail app. No
        data is stored on this site.
      </p>
      <p className="mt-4 max-w-2xl text-xs leading-relaxed text-light/75">
        Write to your senators about the College Cost Reduction Act and student
        loan IDR restoration. Reference bill numbers S.1 and HR.2 in your
        message. Ask them to support restoring SAVE plan protections and
        expanding Pell Grant funding.
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-light">
          State
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="rounded-md border border-light/25 bg-primary px-3 py-3 text-light outline-none focus:border-accent"
          >
            <option value="">Select your state</option>
            {ORDERED_STATES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <a
          href={mailtoHref || undefined}
          className={`inline-flex items-center justify-center rounded-md border border-accent px-5 py-3 text-center text-sm font-semibold text-accent transition hover:bg-accent/10 ${
            !row ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Draft email (mailto)
        </a>
      </div>

      {row ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={row.url1}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-accent bg-primary px-4 py-5 text-center shadow-md transition hover:brightness-110"
          >
            <p className="text-base font-semibold text-light">{row.senator1}</p>
            <p className="mt-3 text-sm font-semibold text-accent">
              Open contact form
            </p>
          </a>
          <a
            href={row.url2}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border-2 border-accent bg-primary px-4 py-5 text-center shadow-md transition hover:brightness-110"
          >
            <p className="text-base font-semibold text-light">{row.senator2}</p>
            <p className="mt-3 text-sm font-semibold text-accent">
              Open contact form
            </p>
          </a>
        </div>
      ) : null}
    </div>
  );
}
