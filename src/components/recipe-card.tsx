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
    <article className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-stone-500">
        <span>{formatDate(recipe.date)}</span>
        <span>{recipe.totalMinutes} min</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight text-stone-900">
        <Link href={`/recipes/${recipe.slug}`} className="hover:text-amber-700">
          {recipe.title}
        </Link>
      </h3>
      <p className="mb-4 text-sm text-stone-700">{recipe.description}</p>
      <ul className="mb-4 flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-100"
            >
              #{tag}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-xs text-stone-600">
        Serves {recipe.servings} • Prep {recipe.prepMinutes} min • Cook {recipe.cookMinutes} min
      </p>
    </article>
  );
}
