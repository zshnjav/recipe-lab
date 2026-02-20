import Link from "next/link";
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

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]">
      <div className="font-mono-ui mb-3 flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        <span>{formatDate(recipe.date)}</span>
        <span>Total {recipe.totalMinutes}m</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-[var(--color-fg)]">
        <Link href={`/recipes/${recipe.slug}`} className="hover:text-[var(--color-accent-hover)]">
          {recipe.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-[var(--color-muted)]">{recipe.description}</p>
      <ul className="mb-4 flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-chip-bg)] px-3 py-1.5 font-mono-ui text-[0.72rem] uppercase leading-none tracking-[0.04em] text-[var(--color-muted)] transition duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-chip-hover-bg)] hover:text-[var(--color-fg)]"
            >
              #{tag}
            </Link>
          </li>
        ))}
      </ul>
      <p className="font-mono-ui text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
        Servings <span className="text-[var(--color-accent)]">{recipe.servings}</span> / Prep{" "}
        <span className="text-[var(--color-accent)]">{recipe.prepMinutes}m</span> / Cook{" "}
        <span className="text-[var(--color-accent)]">{recipe.cookMinutes}m</span>
      </p>
    </article>
  );
}
