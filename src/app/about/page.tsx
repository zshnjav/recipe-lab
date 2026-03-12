import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Recipe Lab",
  description: "The story behind Recipe Lab and a quick way to connect.",
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
            <h2 className="font-mono-ui text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">
              Why I Built Recipe Lab
            </h2>
            <div className="mt-2 space-y-4 text-sm leading-7 text-[var(--color-fg)]">
              <p>
                Whenever I found a recipe I wanted to make, I usually ended up rewriting it.
              </p>
              <p>
                I&apos;d tweak it, combine ideas from different versions, and turn it into a format that was easier for
                me to actually cook from.
              </p>
              <p>
                Over time, that format became consistent: ingredients that are easy to pull into a grocery list, clear
                prep before cooking starts, measurements in both kitchen units and grams, and ingredient amounts
                written exactly when they&apos;re used.
              </p>
              <p>
                Eventually I realized this was the format I actually wanted to keep.
              </p>
              <p>
                So I built Recipe Lab for myself, and hopefully for other people like me who want recipes to feel
                clear, practical, and easy to follow.
              </p>
            </div>
          </section>

          <section className="border-t border-[var(--color-border)] pt-6">
            <h2 className="font-mono-ui text-sm uppercase tracking-[0.08em] text-[var(--color-muted)]">About Me</h2>
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
        </div>
      </section>
    </main>
  );
}
