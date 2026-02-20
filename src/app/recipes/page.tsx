import { RecipeBrowser } from "@/components/recipe-browser";
import { getAllTags, getRecipeSummaries } from "@/lib/recipes";

export default function RecipesPage() {
  const recipes = getRecipeSummaries();
  const tags = getAllTags();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <p className="font-mono-ui text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
          Browse Console
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
          Browse Recipes
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Search recipes directly or build combinations by selecting co-occurring tags.
        </p>
      </header>
      <RecipeBrowser recipes={recipes} tags={tags} showRandomButton enableAdvancedTagFiltering />
    </main>
  );
}
