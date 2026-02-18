"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RecipeSummary } from "@/types/recipe";
import { RecipeCard } from "@/components/recipe-card";

interface RecipeBrowserProps {
  recipes: RecipeSummary[];
  tags: string[];
  initialCount?: number;
  showRandomButton?: boolean;
}

function matchesQuery(recipe: RecipeSummary, query: string): boolean {
  const ingredientTerms = recipe.ingredients.flatMap((ingredient) => [
    ingredient.name,
    ingredient.amount?.unit ?? "",
    ingredient.grams ? `${ingredient.grams}` : "",
  ]);
  const haystack = [recipe.title, recipe.description, ...recipe.tags, ...ingredientTerms]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function RecipeBrowser({
  recipes,
  tags,
  initialCount,
  showRandomButton = false,
}: RecipeBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      const queryPass = query.trim() ? matchesQuery(recipe, query.trim()) : true;
      const tagPass = activeTag === "all" ? true : recipe.tags.includes(activeTag);
      return queryPass && tagPass;
    });
  }, [recipes, query, activeTag]);

  const visible = initialCount ? filtered.slice(0, initialCount) : filtered;

  const openRandomRecipe = () => {
    if (filtered.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    router.push(`/recipes/${filtered[randomIndex].slug}`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by title, ingredients, or tags..."
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-amber-300 focus:ring"
          />
          {showRandomButton ? (
            <button
              type="button"
              onClick={openRandomRecipe}
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700"
              disabled={filtered.length === 0}
            >
              Random recipe
            </button>
          ) : null}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li>
            <button
              type="button"
              onClick={() => setActiveTag("all")}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                activeTag === "all"
                  ? "bg-stone-900 text-white"
                  : "border border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              All
            </button>
          </li>
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  activeTag === tag
                    ? "bg-amber-600 text-white"
                    : "border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100"
                }`}
              >
                #{tag}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white p-6 text-sm text-stone-600">
          No recipes match this search yet.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
      {initialCount && filtered.length > initialCount ? (
        <p className="text-sm text-stone-600">
          Showing {initialCount} of {filtered.length} matching recipes.
        </p>
      ) : null}
    </section>
  );
}
