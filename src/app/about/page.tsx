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
                I created this site because I build my recipes in a very specific kind of way, and it might be helpful
                to someone else like me.
              </p>
              <p>
                Anytime I wanted to make something, or found a recipe that interested me, I would start this workflow I
                didn&apos;t even realize I had created. I would tweak the recipe to fit my needs, pull in different parts
                from different versions, and then rewrite it into a format that worked for me.
              </p>
              <p>
                Over time, that format became consistent. It included things like being able to quickly extract
                ingredients and add them to my grocery list.
              </p>
              <p>
                Clear prep instructions before any cooking started, so I could focus once I began instead of going back
                and forth.
              </p>
              <p>
                Measurements in both common kitchen units and grams, because I prefer to measure on a scale while I
                prep.
              </p>
              <p>
                And having the amount of each ingredient written at the exact moment it gets used, so I wouldn&apos;t have
                to keep checking back.
              </p>
              <p>
                Eventually I realized I should keep these recipes once they were in the format I actually use to follow
                through and produce them.
              </p>
              <p>
                So I built the site for me, and hopefully for other people like me. People who are good at following
                instructions and are holding out hope that maybe one day they can be good home cooks too.
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
