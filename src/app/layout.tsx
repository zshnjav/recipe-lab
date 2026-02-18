import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const heading = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Recipe Lab",
  description: "A clean and searchable personal recipe blog.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} antialiased`}>
        <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
            <Link href="/" className="font-heading text-2xl font-semibold tracking-tight text-stone-900">
              Recipe Lab
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium text-stone-700">
              <Link href="/" className="hover:text-amber-800">
                Home
              </Link>
              <Link href="/recipes" className="hover:text-amber-800">
                Recipes
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
