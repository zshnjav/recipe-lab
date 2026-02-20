"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { RecipeSummary } from "@/types/recipe";
import { RecipeCard } from "@/components/recipe-card";

interface RecipeBrowserProps {
  recipes: RecipeSummary[];
  tags: string[];
  initialCount?: number;
  showRandomButton?: boolean;
  featuredTagCount?: number;
  showBrowseTagsPill?: boolean;
  browseTagsHref?: string;
  showAllTag?: boolean;
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

function pickRandomTags(tags: string[], count: number): string[] {
  const shuffled = [...tags];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

export function RecipeBrowser({
  recipes,
  tags,
  initialCount,
  showRandomButton = false,
  featuredTagCount,
  showBrowseTagsPill = false,
  browseTagsHref = "/tags",
  showAllTag = true,
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
  const visibleTags = useMemo(() => {
    if (!featuredTagCount || tags.length <= featuredTagCount) {
      return tags;
    }
    return pickRandomTags(tags, featuredTagCount);
  }, [tags, featuredTagCount]);

  const openRandomRecipe = () => {
    if (filtered.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    router.push(`/recipes/${filtered[randomIndex].slug}`);
  };

  return (
    <section className="space-y-6">
      <div className="surface-card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search by title, ingredients, or tags..."
            className="w-full rounded-md border border-[var(--color-border)] bg-[#f1efe8] px-4 py-3 text-sm text-[var(--color-fg)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-focus)]/25"
          />
          {showRandomButton ? (
            <button
              type="button"
              onClick={openRandomRecipe}
              className="font-mono-ui inline-flex shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] bg-[#ece9e0] px-4 py-3 text-xs font-medium uppercase tracking-[0.07em] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
              disabled={filtered.length === 0}
            >
              Random recipe
            </button>
          ) : null}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {showAllTag ? (
            <li>
              <button
                type="button"
                onClick={() => setActiveTag("all")}
                className={`chip px-3 py-1.5 transition hover:border-[var(--color-accent)] hover:text-[var(--color-fg)] ${
                  activeTag === "all" ? "chip-active" : ""
                }`}
              >
                All
              </button>
            </li>
          ) : null}
          {visibleTags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`chip px-3 py-1.5 transition hover:border-[var(--color-accent)] hover:text-[var(--color-fg)] ${
                  activeTag === tag ? "chip-active" : ""
                }`}
              >
                #{tag}
              </button>
            </li>
          ))}
          {showBrowseTagsPill ? (
            <li>
              <Link
                href={browseTagsHref}
                className="chip inline-flex px-3 py-1.5 transition hover:border-[var(--color-accent)] hover:text-[var(--color-fg)]"
              >
                Browse by tags
              </Link>
            </li>
          ) : null}
        </ul>
      </div>

      {filtered.length === 0 ? (
        <p className="surface-card border-dashed p-6 text-sm text-[var(--color-muted)]">
          No recipes match this search yet.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
      {initialCount && filtered.length > initialCount ? (
        <p className="font-mono-ui text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
          Showing {initialCount} of {filtered.length} matching recipes.
        </p>
      ) : null}
    </section>
  );
}
