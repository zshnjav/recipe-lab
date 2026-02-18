import Link from "next/link";
import { RecipeBrowser } from "@/components/recipe-browser";
import { getAllTags, getRecipeSummaries } from "@/lib/recipes";

export default function Home() {
  const recipes = getRecipeSummaries();
  const tags = getAllTags();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <section className="mb-8 rounded-3xl border border-stone-200 bg-gradient-to-br from-amber-100 via-orange-50 to-lime-50 p-7 shadow-sm">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-amber-800">
          Recipe Lab
        </p>
        <h1 className="mb-3 text-4xl font-semibold leading-tight tracking-tight text-stone-900 md:text-5xl">
          My kitchen-tested recipes, written the way I actually cook.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-stone-700 md:text-base">
          Clear measurements, mise-en-place steps, and instructions written for someone who isn’t a chef but is good at following directions.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/recipes"
            className="rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Browse all recipes
          </Link>
          <Link
            href="/recipes"
            className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-100"
          >
            Browse by tags
          </Link>
        </div>
      </section>
      <RecipeBrowser recipes={recipes} tags={tags} initialCount={6} showRandomButton />
      <div className="mt-8 text-right">
        <Link href="/recipes" className="text-sm font-semibold text-amber-800 hover:text-amber-900">
          View full recipe archive
        </Link>
      </div>
    </main>
  );
}
