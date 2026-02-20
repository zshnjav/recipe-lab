import type { Metadata } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
      <body className={`${body.variable} ${mono.variable} antialiased`}>
        <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
            <Link href="/" className="text-2xl font-semibold tracking-tight text-[var(--color-fg)]">
              Recipe Lab
            </Link>
            <nav className="font-mono-ui flex items-center gap-5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">
              <Link href="/" className="hover:text-[var(--color-fg)]">
                Home
              </Link>
              <Link href="/recipes" className="hover:text-[var(--color-fg)]">
                Recipes
              </Link>
              <Link href="/tags" className="hover:text-[var(--color-fg)]">
                Tags
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
