import Link from "next/link";
import { RecipeBrowser } from "@/components/recipe-browser";
import { getRecipeSummaries } from "@/lib/recipes";

export default function Home() {
  const recipes = getRecipeSummaries();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="console-panel mb-8 p-7 md:p-8">
        <p className="font-mono-ui mb-3 text-xs uppercase tracking-[0.12em] text-[var(--color-panel-text)]/70">
          Recipe Lab // Personal Archive
        </p>
        <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-[var(--color-panel-text)] md:text-5xl">
          My kitchen-tested recipes, written the way I actually cook.
        </h1>
        <p className="max-w-2xl text-base text-[var(--color-panel-text)]/88">
          For someone who isn&apos;t a chef but is good at following directions.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="rounded-md border border-[var(--color-panel-text)]/20 bg-[var(--color-panel-text)] px-4 py-2.5 text-sm font-semibold text-[var(--color-panel)] transition hover:bg-[var(--color-panel-text)]/90"
          >
            Browse all recipes
          </Link>
        </div>
      </section>
      <RecipeBrowser
        recipes={recipes}
        tags={[]}
        initialCount={6}
        showRandomButton
        featuredTagCount={10}
        browseTagsHref="/recipes"
        browseActionLabel="Browse recipes"
        showAllTag={false}
      />
      <div className="mt-8 text-right">
        <Link
          href="/recipes"
          className="font-mono-ui text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          View full recipe archive
        </Link>
      </div>
    </main>
  );
}
