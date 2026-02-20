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
  browseActionLabel?: string;
  showAllTag?: boolean;
  enableAdvancedTagFiltering?: boolean;
}

type SortMode = "date_desc" | "time_asc";

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

function pickRandomTags(items: string[], count: number): string[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function buildTagCounts(recipes: RecipeSummary[], excludedTags: Set<string>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const recipe of recipes) {
    for (const tag of recipe.tags) {
      if (excludedTags.has(tag)) {
        continue;
      }
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return counts;
}

export function RecipeBrowser({
  recipes,
  tags,
  initialCount,
  showRandomButton = false,
  featuredTagCount,
  showBrowseTagsPill = false,
  browseTagsHref = "/recipes",
  browseActionLabel = "Browse by tags",
  showAllTag = true,
  enableAdvancedTagFiltering = false,
}: RecipeBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [tagQuery, setTagQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [diceFace, setDiceFace] = useState<number>(5);
  const [sortMode, setSortMode] = useState<SortMode>("date_desc");

  const filteredSimple = useMemo(() => {
    return recipes.filter((recipe) => {
      const queryPass = query.trim() ? matchesQuery(recipe, query.trim()) : true;
      const tagPass = activeTag === "all" ? true : recipe.tags.includes(activeTag);
      return queryPass && tagPass;
    });
  }, [recipes, query, activeTag]);

  const matchingRecipesByTags = useMemo(() => {
    return recipes.filter((recipe) => selectedTags.every((tag) => recipe.tags.includes(tag)));
  }, [recipes, selectedTags]);

  const filteredAdvanced = useMemo(() => {
    return matchingRecipesByTags.filter((recipe) => {
      const queryPass = query.trim() ? matchesQuery(recipe, query.trim()) : true;
      return queryPass;
    });
  }, [matchingRecipesByTags, query]);

  const filtered = enableAdvancedTagFiltering ? filteredAdvanced : filteredSimple;

  const sortedFiltered = useMemo(() => {
    const next = [...filtered];
    if (sortMode === "time_asc") {
      next.sort((a, b) => a.totalMinutes - b.totalMinutes || a.title.localeCompare(b.title));
    } else {
      next.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return next;
  }, [filtered, sortMode]);

  const visible = initialCount ? sortedFiltered.slice(0, initialCount) : sortedFiltered;

  const simpleVisibleTags = useMemo(() => {
    if (!featuredTagCount || tags.length <= featuredTagCount) {
      return tags;
    }
    return pickRandomTags(tags, featuredTagCount);
  }, [tags, featuredTagCount]);

  const advancedAvailableTags = useMemo(() => {
    const baseRecipes = selectedTags.length > 0 ? matchingRecipesByTags : recipes;
    const counts = buildTagCounts(baseRecipes, new Set(selectedTags));
    const sorted = [...counts.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        return a[0].localeCompare(b[0]);
      })
      .map(([tag]) => tag);

    const search = tagQuery.trim().toLowerCase();
    const searched = search ? sorted.filter((tag) => tag.toLowerCase().includes(search)) : sorted;

    return searched.slice(0, 20);
  }, [matchingRecipesByTags, recipes, selectedTags, tagQuery]);

  const openRandomRecipe = () => {
    if (sortedFiltered.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * sortedFiltered.length);
    router.push(`/recipes/${sortedFiltered[randomIndex].slug}`);
  };

  const onToggleSimpleTag = (tag: string) => {
    setActiveTag((current) => (current === tag ? "all" : tag));
  };

  const onToggleAdvancedTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((value) => value !== tag);
      }
      setTagQuery("");
      return [...current, tag];
    });
  };

  const clearSelectedTags = () => {
    setSelectedTags([]);
  };

  const clearAllAdvanced = () => {
    setSelectedTags([]);
    setTagQuery("");
    setQuery("");
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
        <div className="space-y-1">
          {enableAdvancedTagFiltering ? (
            <p className="font-mono-ui text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Recipe Search
            </p>
          ) : null}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder={
                enableAdvancedTagFiltering
                  ? "Search recipes (title, ingredients, tags)..."
                  : "Search by title, ingredients, or tags..."
              }
              className="w-full rounded-md border border-[var(--color-border)] bg-[#f1efe8] px-4 py-3 text-sm text-[var(--color-fg)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-focus)]/25"
            />
            {showRandomButton ? (
              <button
                type="button"
                onClick={openRandomRecipe}
                onMouseEnter={randomizeDiceFace}
                aria-label="Open random recipe"
                className="group inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[var(--color-random-border)] bg-[var(--color-random-bg)] text-[var(--color-random-text)] shadow-[0_2px_8px_rgba(45,26,30,0.1)] transition duration-200 hover:border-[var(--color-random-hover-border)] hover:bg-[var(--color-random-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
                disabled={sortedFiltered.length === 0}
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
        </div>

        {enableAdvancedTagFiltering ? (
          <div className="mt-4 rounded-md border border-[var(--color-border)] bg-[#f6f3eb] p-4">
            <h3 className="font-mono-ui text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Filters
            </h3>
            <div className="mt-3 border-t border-[var(--color-border)] pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-mono-ui text-[0.72rem] uppercase tracking-[0.09em] text-[var(--color-muted)]">
                  Selected tags
                </h4>
                {selectedTags.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearSelectedTags}
                    className="font-mono-ui rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.08em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
                  >
                    Clear selected tags
                  </button>
                ) : null}
              </div>
              {selectedTags.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <li key={tag} className="chip-fly-in">
                      <button
                        type="button"
                        onClick={() => onToggleAdvancedTag(tag)}
                        className="inline-flex items-center rounded-sm border border-[var(--color-accent)] bg-[var(--color-chip-selected-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-chip-selected-text)] transition duration-200 hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-chip-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
                      >
                        #{tag}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-xs text-[var(--color-muted)]">No tags selected.</p>
              )}
            </div>
            <div className="mt-3 border-t border-[var(--color-border)] pt-3">
              <div className="space-y-1">
                <h4 className="font-mono-ui text-[0.72rem] uppercase tracking-[0.09em] text-[var(--color-muted)]">
                  Filter tags
                </h4>
                <input
                  value={tagQuery}
                  onChange={(event) => setTagQuery(event.target.value)}
                  type="search"
                  placeholder="Find tags..."
                  className="w-52 rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-2.5 py-1.5 text-xs text-[var(--color-fg)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-focus)]/25"
                />
              </div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {advancedAvailableTags.map((tag) => (
                  <li key={tag} className="chip-fly-in">
                    <button
                      type="button"
                      onClick={() => onToggleAdvancedTag(tag)}
                      className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
                    >
                      #{tag}
                    </button>
                  </li>
                ))}
              </ul>
              {advancedAvailableTags.length === 0 ? (
                <p className="mt-2 text-xs text-[var(--color-muted)]">No tags found.</p>
              ) : null}
            </div>
          </div>
        ) : (
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
            {simpleVisibleTags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => onToggleSimpleTag(tag)}
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
                  className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-browse-bg)] px-3 py-1.5 text-[0.72rem] font-medium uppercase leading-none tracking-[0.04em] text-[var(--color-fg)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-browse-hover-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
                >
                  {browseActionLabel}
                </Link>
              </li>
            ) : null}
          </ul>
        )}
      </div>

      {enableAdvancedTagFiltering ? (
        <div className="surface-card p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="font-mono-ui text-[0.72rem] uppercase tracking-[0.1em] text-[var(--color-muted)]">
                Results summary
              </p>
              <p className="text-sm text-[var(--color-fg)]">Showing {sortedFiltered.length} recipes</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-muted)]">
                {selectedTags.length > 0 ? (
                  <span className="font-mono-ui uppercase tracking-[0.08em]">
                    Tags: {selectedTags.map((tag) => `#${tag}`).join(", ")}
                  </span>
                ) : null}
                {query.trim() ? (
                  <span className="font-mono-ui uppercase tracking-[0.08em]">
                    Query: &quot;{query.trim()}&quot;
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-mode"
                  className="font-mono-ui text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-muted)]"
                >
                  Sort
                </label>
                <select
                  id="sort-mode"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value as SortMode)}
                  className="rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-2 py-1.5 text-xs text-[var(--color-fg)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-focus)]/25"
                >
                  <option value="date_desc">Date added (newest first)</option>
                  <option value="time_asc">Total time (lowest first)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={clearAllAdvanced}
                className="font-mono-ui rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {enableAdvancedTagFiltering && selectedTags.length > 0 && matchingRecipesByTags.length === 0 ? (
        <div className="surface-card p-6">
          <p className="text-sm text-[var(--color-muted)]">No recipes match this combination.</p>
          <button
            type="button"
            onClick={clearSelectedTags}
            className="mt-3 inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40"
          >
            Clear selected tags
          </button>
        </div>
      ) : null}

      {sortedFiltered.length === 0 &&
      !(enableAdvancedTagFiltering && selectedTags.length > 0 && matchingRecipesByTags.length === 0) ? (
        <p className="surface-card border-dashed p-6 text-sm text-[var(--color-muted)]">
          No recipes match this search yet.
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {visible.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
      {initialCount && sortedFiltered.length > initialCount ? (
        <p className="font-mono-ui text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
          Showing {initialCount} of {sortedFiltered.length} matching recipes.
        </p>
      ) : null}
    </section>
  );
}
