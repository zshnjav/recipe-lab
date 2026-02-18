import { RecipeBrowser } from "@/components/recipe-browser";
import { getAllTags, getRecipeSummaries } from "@/lib/recipes";

export default function RecipesPage() {
  const recipes = getRecipeSummaries();
  const tags = getAllTags();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">All Recipes</h1>
        <p className="mt-2 text-sm text-stone-700">Filter by tag or search by ingredient keywords.</p>
      </header>
      <RecipeBrowser recipes={recipes} tags={tags} showRandomButton />
    </main>
  );
}
