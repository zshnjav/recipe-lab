import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RecipeIngredientsPanel } from "@/components/recipe-ingredients-panel";
import { RecipeMethod } from "@/components/recipe-method";
import { getAllRecipes, getRecipeBySlug, getRecipeSlugs } from "@/lib/recipes";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return getRecipeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return {
      title: "Recipe not found",
    };
  }

  return {
    title: `${recipe.title} | Recipe Lab`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) {
    notFound();
  }

  const related = getAllRecipes()
    .filter((item) => item.slug !== recipe.slug && item.tags.some((tag) => recipe.tags.includes(tag)))
    .slice(0, 3);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <Link
        href="/recipes"
        className="font-mono-ui text-xs uppercase tracking-[0.09em] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      >
        Back to all recipes
      </Link>
      <article className="mt-4 grid gap-8 lg:grid-cols-[420px_1fr]">
        <aside className="surface-card h-fit p-5">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-fg)]">{recipe.title}</h1>
          <p className="font-mono-ui mt-2 text-xs uppercase tracking-[0.09em] text-[var(--color-muted)]">
            {formatDate(recipe.date)}
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{recipe.description}</p>
          <div className="console-panel mt-5 overflow-hidden">
            <dl className="font-mono-ui grid grid-cols-2 gap-px bg-[var(--color-panel-text)]/10 text-xs uppercase tracking-[0.08em] text-[var(--color-panel-text)]">
              <div className="bg-[var(--color-panel)] px-3 py-3">
                <dt className="text-[var(--color-panel-text)]/65">Servings</dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--color-accent)]">{recipe.servings}</dd>
              </div>
              <div className="bg-[var(--color-panel)] px-3 py-3">
                <dt className="text-[var(--color-panel-text)]/65">Prep</dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--color-accent)]">
                  {recipe.prepMinutes}m
                </dd>
              </div>
              <div className="bg-[var(--color-panel)] px-3 py-3">
                <dt className="text-[var(--color-panel-text)]/65">Cook</dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--color-accent)]">
                  {recipe.cookMinutes}m
                </dd>
              </div>
              <div className="bg-[var(--color-panel)] px-3 py-3">
                <dt className="text-[var(--color-panel-text)]/65">Total</dt>
                <dd className="mt-1 text-sm font-semibold text-[var(--color-accent)]">
                  {recipe.totalMinutes}m
                </dd>
              </div>
            </dl>
          </div>
          <RecipeIngredientsPanel ingredients={recipe.ingredients} baseServings={recipe.servings} />
          <ul className="mt-5 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <li key={tag}>
                <Link href={`/tags/${encodeURIComponent(tag)}`} className="chip inline-flex px-2.5 py-1.5">
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="space-y-8">
          <div className="surface-card bg-[#f6f3ec] p-6">
            <RecipeMethod body={recipe.body} />
          </div>
          {related.length > 0 ? (
            <div>
              <h2 className="mb-3 text-xl font-semibold text-[var(--color-fg)]">Related recipes</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/recipes/${item.slug}`}
                      className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-accent-hover)]"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </article>
    </main>
  );
}
