import type { Metadata } from "next";
import { ActionContent } from "@/components/ActionContent";

export const metadata: Metadata = {
  title: "Take Action | LoanedAFuture",
  description:
    "Contact senators, sign petitions, follow advocacy groups, and share accurate information.",
};

export default function ActionPage() {
  return <main className="min-h-screen bg-light text-primary"><ActionContent /></main>;
}
