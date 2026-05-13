"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/background", label: "Background" },
  { href: "/sides", label: "Both Sides" },
  { href: "/impact", label: "Impact" },
  { href: "/government", label: "Government" },
  { href: "/action", label: "Action" },
  { href: "/sources", label: "Sources" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-light/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-primary sm:text-xl"
        >
          LoanedAFuture
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-mid hover:bg-surface hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-border bg-elevated text-primary md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <span
            className={`block h-0.5 w-5 bg-primary transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-primary transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-5 bg-primary transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-elevated md:hidden"
          >
            <div className="flex flex-col gap-0.5 px-3 py-2">
              {nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-mid hover:bg-surface hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
