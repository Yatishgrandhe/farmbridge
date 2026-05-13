import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/background", label: "Background" },
  { href: "/sides", label: "Both Sides" },
  { href: "/impact", label: "Impact" },
  { href: "/government", label: "Government" },
  { href: "/action", label: "Take Action" },
  { href: "/sources", label: "Sources" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-12 text-primary">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-heading text-2xl font-semibold text-primary">
            LoanedAFuture
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-mid">
            A student-built explainer on federal student loans, politics, and
            policy tradeoffs.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
          aria-label="Footer"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-mid underline-offset-4 transition hover:text-accent hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-6xl border-t border-border pt-6 text-center text-sm text-mid">
        Created for AP U.S. Government and Politics, Spring 2026
      </p>
    </footer>
  );
}
