import type { Metadata } from "next";
import { SidesContent } from "@/components/SidesContent";

export const metadata: Metadata = {
  title: "Both Sides of the Debate | LoanedAFuture",
  description:
    "Arguments for relief versus arguments against cancellation, with a centrist read on what economists still disagree about.",
};

export default function SidesPage() {
  return (
    <main className="min-h-screen bg-light">
      <SidesContent />
    </main>
  );
}
