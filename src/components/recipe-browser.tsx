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
  const [diceFace, setDiceFace] = useState<number>(5);

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

  const onToggleTag = (tag: string) => {
    setActiveTag((current) => (current === tag ? "all" : tag));
  };

  const randomizeDiceFace = () => {
    setDiceFace((current) => {
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * 6) + 1;
      }
      return next;
    });
  };

  const pipMap: Record<number, Array<[number, number]>> = {
    1: [[50, 50]],
    2: [
      [30, 30],
      [70, 70],
    ],
    3: [
      [30, 30],
      [50, 50],
      [70, 70],
    ],
    4: [
      [30, 30],
      [70, 30],
      [30, 70],
      [70, 70],
    ],
    5: [
      [30, 30],
      [70, 30],
      [50, 50],
      [30, 70],
      [70, 70],
    ],
    6: [
      [30, 28],
      [70, 28],
      [30, 50],
      [70, 50],
      [30, 72],
      [70, 72],
    ],
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
              onMouseEnter={randomizeDiceFace}
              aria-label="Open random recipe"
              className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[var(--color-random-border)] bg-[var(--color-random-bg)] text-[var(--color-random-text)] shadow-[0_2px_8px_rgba(45,26,30,0.1)] transition duration-200 hover:border-[var(--color-random-hover-border)] hover:bg-[var(--color-random-hover-bg)]"
              disabled={filtered.length === 0}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[360deg]"
                aria-hidden="true"
              >
                <rect
                  x="3.5"
                  y="3.5"
                  width="17"
                  height="17"
                  rx="3.2"
                  fill="currentColor"
                  opacity="0.2"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                {pipMap[diceFace].map(([cx, cy], index) => (
                  <circle key={`${cx}-${cy}-${index}`} cx={cx / 4} cy={cy / 4} r="1.25" fill="currentColor" />
                ))}
              </svg>
            </button>
          ) : null}
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {showAllTag ? (
            <li>
              <button
                type="button"
                onClick={() => setActiveTag("all")}
                className={`inline-flex items-center rounded-sm border px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] transition duration-200 ${
                  activeTag === "all"
                    ? "border-[var(--color-accent)] bg-[var(--color-chip-selected-bg)] text-[var(--color-chip-selected-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-chip-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)]"
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
                onClick={() => onToggleTag(tag)}
                className={`inline-flex items-center rounded-sm border px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] transition duration-200 ${
                  activeTag === tag
                    ? "border-[var(--color-accent)] bg-[var(--color-chip-selected-bg)] text-[var(--color-chip-selected-text)]"
                    : "border-[var(--color-border)] bg-[var(--color-chip-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)]"
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
                className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-browse-bg)] px-3 py-1.5 text-[0.72rem] font-medium uppercase leading-none tracking-[0.04em] text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-browse-hover-bg)]"
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
