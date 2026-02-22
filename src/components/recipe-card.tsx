"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { RecipeSummary } from "@/types/recipe";

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface RecipeCardProps {
  recipe: RecipeSummary;
}

function KnifeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" aria-hidden="true">
      <path d="M5.2 6.8h10.9v10.1H7.1c-1.1 0-1.9-.9-1.9-1.9V6.8Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M16.1 9h1.7a1.8 1.8 0 0 1 0 3.6h-1.7" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M8.2 9.2h4.2M8.2 11.4h4.2M8.2 13.6h4.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" aria-hidden="true">
      <path
        d="M12 21c-3.5 0-6.4-2.7-6.4-6.1 0-3 2.1-4.7 3.8-6.1 1.2-1 2.3-1.9 2.7-3.3 2.8 2 5.9 4.6 5.9 9.1 0 3.4-2.8 6.4-6 6.4Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 18.6c-1.7 0-3.1-1.2-3.1-2.9 0-1.4 1-2.3 2-3.2.6-.5 1.1-1 1.4-1.7 1.3 1 2.8 2.3 2.8 4.4 0 1.8-1.4 3.4-3.1 3.4Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.1" />
      <path d="M12 7.8v4.7l3.1 1.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function PlateIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 opacity-70" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.8" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildBrowseTagHref = (tag: string): string => {
    const params = new URLSearchParams(searchParams.toString());
    const rawTags = params.get("tags");
    const existingTags = rawTags
      ? rawTags
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];
    const nextTags = existingTags.includes(tag) ? existingTags : [...existingTags, tag];
    params.set("tags", nextTags.join(","));

    return `/recipes?${params.toString()}`;
  };

  return (
    <article className="surface-card flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]">
      <div className="font-mono-ui mb-3 flex items-center justify-between gap-3 text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        <span>{formatDate(recipe.date)}</span>
        <span className="inline-flex items-center gap-1">
          <ClockIcon />
          Total <span className="text-[var(--color-accent)]">{recipe.totalMinutes}m</span>
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-[var(--color-fg)]">
        <Link href={`/recipes/${recipe.slug}`} className="hover:text-[var(--color-accent-hover)]">
          {recipe.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-[var(--color-muted)]">{recipe.description}</p>
      <div className="mt-auto">
        <ul className="mb-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={pathname === "/recipes" ? buildBrowseTagHref(tag) : `/recipes?tags=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)]"
              >
                #{tag}
              </Link>
            </li>
          ))}
        </ul>
        <p className="font-mono-ui flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1">
            <PlateIcon />
            Servings <span className="text-[var(--color-accent)]">{recipe.servings}</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <KnifeIcon />
            Prep <span className="text-[var(--color-accent)]">{recipe.prepMinutes}m</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <FlameIcon />
            Cook <span className="text-[var(--color-accent)]">{recipe.cookMinutes}m</span>
          </span>
        </p>
      </div>
    </article>
  );
}
