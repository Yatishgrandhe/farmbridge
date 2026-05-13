import type { Metadata } from "next";
import Image from "next/image";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ImpactParallaxBand } from "@/components/ImpactParallaxBand";
import { StatCounter } from "@/components/StatCounter";
import { UNSPLASH } from "@/lib/images";

export const metadata: Metadata = {
  title: "Why It Matters | LoanedAFuture",
  description:
    "Who carries student debt, how it delays life milestones, and why this project matters personally.",
};

export default function ImpactPage() {
  return (
    <main className="min-h-screen bg-light text-primary">
      <header className="relative overflow-hidden pt-24">
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={UNSPLASH.graduationCaps}
            alt="Graduates tossing caps in the air"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-navy/68" aria-hidden />
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <h1 className="font-heading text-4xl font-bold text-cream sm:text-5xl">
              Who is affected?
            </h1>
          </div>
        </div>
        <p className="mx-auto max-w-3xl px-4 py-10 text-center text-mid">
          Roughly <strong className="text-accent">one in eight</strong> adults
          lives with student debt. The averages hide massive variation: some owe
          less than a car payment, others owe six figures from graduate school.
        </p>
      </header>

      <section className="border-y border-border bg-surface px-4 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <StatCounter
            label="Americans with student debt (rounded)"
            target={43}
            suffix=" Million"
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
          <StatCounter
            label="Average balance per borrower (Federal Reserve trend)"
            target={37787}
            prefix="$"
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
          <StatCounter
            label="Total national student loan balance (Federal Reserve)"
            target={1.774}
            prefix="$"
            suffix=" Trillion"
            decimals={3}
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
          <StatCounter
            label="Borrowers who say debt delayed homeownership (survey estimates)"
            target={55}
            suffix="%"
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
          <StatCounter
            label="Who delayed marriage or children (survey estimates)"
            target={36}
            suffix="%"
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
          <StatCounter
            label="Estimated deficit impact of broad cancellation (Penn Wharton range, illustrative)"
            target={300}
            prefix="$"
            suffix="B+"
            className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
          />
        </div>
      </section>

      <ImpactParallaxBand />

      <AnimatedSection className="bg-surface px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading text-center text-3xl font-semibold text-primary sm:text-4xl">
            Demographic breakdown
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-mid">
            Bars compare magnitudes used in policy debates (approximate, for
            classroom visualization).
          </p>
          <div className="mt-12 space-y-8">
            {[
              {
                title: "Black vs. white borrowers",
                caption:
                  "Education Department analyses often find Black borrowers average about $25,000 more debt than white borrowers at the median of long-term portfolios.",
                bars: [
                  { label: "Black borrowers (indexed debt load)", w: 100 },
                  { label: "White borrowers (indexed)", w: 72 },
                ],
              },
              {
                title: "Share of debt by gender",
                caption:
                  "Women hold roughly two-thirds of outstanding student debt, driven by enrollment, program mix, and wage gaps after graduation.",
                bars: [
                  { label: "Women’s share of debt", w: 67 },
                  { label: "Men’s share", w: 33 },
                ],
              },
              {
                title: "Graduate vs. undergraduate borrowers",
                caption:
                  "Graduate borrowers are a small slice of people with loans but hold an outsized chunk of dollars outstanding.",
                bars: [
                  { label: "Graduate share of balances (~40%)", w: 100 },
                  { label: "Graduate share of borrowers (~14%)", w: 35 },
                ],
              },
            ].map((block) => (
              <div
                key={block.title}
                className="rounded-xl border border-border bg-elevated p-6 shadow-sm"
              >
                <h3 className="font-heading text-xl font-semibold text-primary">
                  {block.title}
                </h3>
                <p className="mt-2 text-sm text-mid">{block.caption}</p>
                <div className="mt-6 space-y-4">
                  {block.bars.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs text-mid">
                        <span>{b.label}</span>
                        <span className="font-medium text-accent">{b.w}%</span>
                      </div>
                      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-sunken">
                        <div
                          className="bar-fill h-full rounded-full bg-accent"
                          style={{ width: `${b.w}%`, animationDelay: "80ms" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <section className="border-t border-border bg-light px-4 py-16 text-primary">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-center text-3xl font-semibold">
            Your opinion
          </h2>
          <article className="mt-8 border-l-4 border-accent bg-accent-soft p-8 shadow-sm">
            <p className="font-heading text-lg italic leading-relaxed text-primary/90">
              I am <span className="font-semibold text-accent">[STUDENT NAME]</span>
              , and I chose this topic because student loans sit at the
              intersection of everything we study in AP Gov: federalism,
              separation of powers, interest groups, and political participation.
              When I see friends stress about FAFSA glitches or parents refinance
              Parent PLUS loans, the textbook diagrams suddenly feel urgent. I am
              not pretending there is a painless fix, but I do think voters my age
              deserve a government that pairs accountability for colleges with a
              repayment system that is legible, fair, and stable across
              administrations.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
