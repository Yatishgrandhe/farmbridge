import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { UNSPLASH } from "@/lib/images";

export const metadata: Metadata = {
  title: "Background & History | LoanedAFuture",
  description:
    "How federal student loans began, why balances exploded, and the legal fights over repayment and cancellation.",
};

function GoldRule() {
  return (
    <div
      className="my-10 h-1.5 w-full max-w-md rounded-full bg-accent"
      aria-hidden
    />
  );
}

function PullQuote({ children }: { children: string }) {
  return (
    <blockquote className="my-8 border-l-4 border-accent bg-accent/5 px-5 py-4 font-heading text-lg italic text-accent sm:text-xl">
      {children}
    </blockquote>
  );
}

export default function BackgroundPage() {
  return (
    <main className="min-h-screen bg-light pb-20 text-primary">
      <header className="border-b border-primary/10 bg-light px-4 pb-12 pt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">
            Background
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold sm:text-5xl">
            How we got here
          </h1>
          <p className="mt-4 text-lg text-mid">
            Federal student lending started as a narrow national-security tool.
            Today it underwrites a huge share of U.S. higher education, and
            carries political consequences Congress cannot ignore.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4">
        <AnimatedSection className="mt-16">
          <GoldRule />
          <h2 className="font-heading text-3xl font-semibold">The origin</h2>
          <PullQuote>
            Policy choices turned a targeted scholarship into a mass borrowing
            system.
          </PullQuote>
        </AnimatedSection>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <ScrollReveal side="left">
            <div className="overflow-hidden rounded-xl shadow-lg shadow-primary/10">
              <Image
                src={UNSPLASH.capitol}
                alt="United States Capitol dome at dusk"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal side="right">
            <div className="space-y-4 text-mid leading-relaxed">
              <p>
                The modern story begins with the{" "}
                <strong className="text-primary">
                  National Defense Education Act (1958)
                </strong>
                , which linked student aid to Cold War competition in science
                and engineering. Congress expanded access through the{" "}
                <strong className="text-primary">
                  Higher Education Act of 1965
                </strong>{" "}
                and later amendments, building a federal guarantee for private
                lenders before the government shifted toward{" "}
                <strong className="text-primary">direct lending</strong> in the
                2010s.
              </p>
              <p>
                Each expansion widened eligibility while tuition climbed: by the
                1970s, lawmakers were already debating whether aid fueled
                inflation on campus, a tension that still frames hearings today.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <AnimatedSection className="mt-24">
          <GoldRule />
          <h2 className="font-heading text-3xl font-semibold">The explosion</h2>
          <PullQuote>
            Sticker prices raced ahead of typical paychecks, and borrowers felt
            it in monthly statements.
          </PullQuote>
          <p className="mt-6 max-w-3xl text-mid leading-relaxed">
            According to College Board trend data cited across major outlets,
            published tuition and fees at public four-year institutions have
            risen roughly{" "}
            <strong className="text-primary">169% in inflation-adjusted</strong>{" "}
            terms since 1980, even as median wages crawled. That gap helps explain
            why average federal loan balances sit near{" "}
            <strong className="text-primary">$37,787</strong> per borrower while
            total balances hover near{" "}
            <strong className="text-primary">$1.774 trillion</strong>.
          </p>

          <div className="mt-10 rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-primary">
              Illustrative growth since 1980 (indexed, 1980 = 100)
            </p>
            <p className="mt-1 text-xs text-mid">
              Tuition vs. overall inflation vs. wage growth. Bars animate to show
              relative scale used in classroom analysis (not a live data feed).
            </p>
            <div className="mt-8 space-y-6">
              {[
                {
                  label: "Published tuition & fees (inflation-adjusted)",
                  pct: 100,
                  delay: "0ms",
                },
                { label: "Consumer price index (overall inflation)", pct: 38, delay: "120ms" },
                { label: "Median weekly earnings (indexed trend)", pct: 28, delay: "240ms" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-mid sm:text-sm">
                    <span>{row.label}</span>
                    <span className="text-primary">{row.pct}</span>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-primary/10">
                    <div
                      className="bar-fill h-full rounded-full bg-accent"
                      style={{
                        width: `${row.pct}%`,
                        animationDelay: row.delay,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
          <ScrollReveal side="left">
            <div className="overflow-hidden rounded-xl shadow-lg shadow-primary/10">
              <Image
                src={UNSPLASH.studentStudying}
                alt="Student reading on campus steps with books"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal side="right">
            <div className="space-y-4 text-mid leading-relaxed">
              <h2 className="font-heading text-2xl font-semibold text-primary">
                Behind every statistic is a schedule
              </h2>
              <p>
                Borrowers are not a monolith: some work double shifts through
                night school; others finance professional degrees expected to pay
                off quickly. What unites the data is{" "}
                <strong className="text-primary">
                  policy volatility
                </strong>
                when rules change with each election, families cannot plan.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <AnimatedSection className="mt-24">
          <GoldRule />
          <h2 className="font-heading text-3xl font-semibold">
            Income-driven repayment (IDR)
          </h2>
          <PullQuote>
            IDR promises breathing room today in exchange for a longer runway
            tomorrow.
          </PullQuote>
          <div className="mt-6 space-y-4 text-mid leading-relaxed">
            <p>
              <strong className="text-primary">IDR plans</strong> tie monthly
              payments to a borrower&apos;s income and family size, capping bills
              at a percentage of{" "}
              <em className="text-primary">discretionary income</em>. Programs
              such as <strong>SAVE</strong>, <strong>PAYE</strong>,{" "}
              <strong>IBR</strong>, and <strong>ICR</strong> differ in
              eligibility, caps, and forgiveness timelines, but they share one
              promise: after <strong>20 to 25 years</strong> of qualifying payments,
              remaining balances may be forgiven, though forgiven amounts can have
              tax implications depending on law.
            </p>
            <p>
              The <strong className="text-primary">SAVE</strong> plan sought to
              cut payments for many low- and middle-income borrowers, but{" "}
              <strong className="text-primary">
                federal courts blocked key pieces in 2024 to 2025
              </strong>{" "}
              after states challenged the administration&apos;s authority, echoing
              earlier litigation over broad cancellation.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-24 grid gap-10 md:grid-cols-2 md:items-center">
          <ScrollReveal side="left">
            <div className="space-y-4 text-mid leading-relaxed">
              <GoldRule />
              <h2 className="font-heading text-3xl font-semibold">
                The legal battle
              </h2>
              <PullQuote>
                Courts became the arena when Congress stalled and presidents
                acted alone.
              </PullQuote>
              <p>
                Republican-led states sued to block SAVE, and the{" "}
                <strong className="text-primary">Eighth Circuit</strong> issued
                rulings that disrupted enrollment and implementation timelines.
                Separately, the Supreme Court&apos;s{" "}
                <strong className="text-primary">
                  <em>Biden v. Nebraska</em> (2023)
                </strong>{" "}
                rejected the Biden administration&apos;s one-time debt
                cancellation plan, with a conservative majority emphasizing the{" "}
                <strong className="text-primary">major questions doctrine</strong>
                : Congress must speak clearly before agencies reshape huge
                portions of the economy.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal side="right">
            <div className="overflow-hidden rounded-xl shadow-lg shadow-primary/10">
              <Image
                src={UNSPLASH.protest}
                alt="Crowd at a demonstration with raised signs"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </ScrollReveal>
        </div>

        <AnimatedSection className="mt-24 pb-8">
          <GoldRule />
          <h2 className="font-heading text-3xl font-semibold">
            Where we are now (2025 to 2026)
          </h2>
          <PullQuote>
            Elections turn administrative rules into political footballs. Borrowers
            are left reading fine print.
          </PullQuote>
          <div className="mt-6 space-y-4 text-mid leading-relaxed">
            <p>
              Reporting across NPR, Politico, and the{" "}
              <em>Wall Street Journal</em> tracks a volatile mix: the Trump
              administration moved to{" "}
              <strong className="text-primary">
                dismantle the Department of Education
              </strong>{" "}
              as a cabinet agency, freeze parts of{" "}
              <strong className="text-primary">IDR processing</strong>, and end
              SAVE-style benefits for new enrollees. Congressional Republicans
              have floated <strong className="text-primary">block grants</strong>{" "}
              that would send lump sums to states with fewer federal strings.
            </p>
            <p>
              Democrats, led in messaging by figures such as Senator Warren, have
              continued to push{" "}
              <strong className="text-primary">
                cancellation up to $50,000
              </strong>{" "}
              for qualifying borrowers alongside free community college proposals.
              With divided government, most near-term changes still hinge on{" "}
              <strong className="text-primary">agency rules, lawsuits, and budget</strong>{" "}
              fights, not a single clean bill.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
