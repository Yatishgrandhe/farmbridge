import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoanedAFuture | Federal Student Loan Debt and Politics",
  description:
    "An AP U.S. Government and Politics project on the federal student loan debt crisis, courts, Congress, and what citizens can do.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- project requires Google Fonts link tags */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
        <style>{`:root { --font-heading: "Playfair Display", Georgia, serif; --font-body: "DM Sans", system-ui, sans-serif; }`}</style>
      </head>
      <body className="font-body flex min-h-full flex-col bg-light pt-14 text-primary antialiased sm:pt-16">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
