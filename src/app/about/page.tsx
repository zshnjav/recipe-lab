import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Recipe Lab",
  description: "Why Recipe Lab exists, how it is built, and the philosophy behind it.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <p className="font-mono-ui text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">System Profile</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-fg)]">About Recipe Lab</h1>
      </header>

      <section className="surface-card p-5 md:p-6">
        <div className="space-y-6">
          <section>
            <h2 className="font-mono-ui text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">Why this exists</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-fg)]">
              Recipe Lab is a practical archive of meals I actually cook. The goal is repeatability: clear ingredients,
              clear steps, and reliable results without guessing.
            </p>
          </section>

          <section className="border-t border-[var(--color-border)] pt-6">
            <h2 className="font-mono-ui text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">How it&apos;s built</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-fg)]">
              The site is built with Next.js, TypeScript, and Tailwind in a static-first setup for speed and low
              maintenance. It was built with help from Codex and designed to keep authoring and retrieval simple.
            </p>
            <div className="mt-3">
              <a
                className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)]"
                href="https://www.linkedin.com/in/zeejaved/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            </div>
          </section>

          <section className="border-t border-[var(--color-border)] pt-6">
            <h2 className="font-mono-ui text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">Philosophy</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-fg)]">
              The interface follows a technical-manual approach: restrained visuals, consistent modules, and metadata
              that supports decisions. The priority is calm utility over novelty.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
