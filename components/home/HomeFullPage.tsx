"use client";

import { SectionCalculator } from "@/components/home/SectionCalculator";
import { SectionCta } from "@/components/home/SectionCta";
import { SectionDashboard } from "@/components/home/SectionDashboard";
import { SectionDebate } from "@/components/home/SectionDebate";
import { SectionDemographics } from "@/components/home/SectionDemographics";
import { SectionHero } from "@/components/home/SectionHero";
import { SectionMap } from "@/components/home/SectionMap";
import { SectionQuotes } from "@/components/home/SectionQuotes";
import { SectionTicker } from "@/components/home/SectionTicker";
import { SectionTimeline } from "@/components/home/SectionTimeline";

export function HomeFullPage() {
  return (
    <main className="min-w-0 max-w-[100vw] overflow-x-hidden">
      <SectionHero />
      <SectionTicker />
      <SectionDashboard />
      <SectionMap />
      <SectionTimeline />
      <SectionDemographics />
      <SectionCalculator />
      <SectionQuotes />
      <SectionDebate />
      <SectionCta />
    </main>
  );
}
