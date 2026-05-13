import type { Metadata } from "next";
import { GovernmentMain } from "@/components/GovernmentMain";

export const metadata: Metadata = {
  title: "Can Government Solve This? | LoanedAFuture",
  description:
    "Congressional authority, executive IDR tools, court limits, and bipartisan ideas, plus how a bill becomes law.",
};

export default function GovernmentPage() {
  return (
    <main className="min-h-screen bg-white text-primary">
      <GovernmentMain />
    </main>
  );
}
