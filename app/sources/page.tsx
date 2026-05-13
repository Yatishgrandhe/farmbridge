import type { Metadata } from "next";
import { SourcesContent } from "@/components/SourcesContent";

export const metadata: Metadata = {
  title: "Sources & Citations | LoanedAFuture",
  description:
    "Chicago-style web citations with media literacy labels for classroom use.",
};

export default function SourcesPage() {
  return (
    <main className="min-h-screen bg-white text-primary">
      <SourcesContent />
    </main>
  );
}
