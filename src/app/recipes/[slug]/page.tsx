import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
      <Link href="/recipes" className="text-sm font-medium text-amber-800 hover:text-amber-900">
        Back to all recipes
      </Link>
      <article className="mt-4 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{recipe.title}</h1>
          <p className="mt-2 text-sm text-stone-600">{formatDate(recipe.date)}</p>
          <p className="mt-4 text-sm leading-7 text-stone-700">{recipe.description}</p>
          <dl className="mt-5 space-y-2 text-sm text-stone-700">
            <div className="flex justify-between gap-4">
              <dt>Prep</dt>
              <dd>{recipe.prepMinutes} min</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Cook</dt>
              <dd>{recipe.cookMinutes} min</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Total</dt>
              <dd>{recipe.totalMinutes} min</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Servings</dt>
              <dd>{recipe.servings}</dd>
            </div>
          </dl>
          <h2 className="mt-6 text-lg font-semibold text-stone-900">Ingredients</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-stone-700">
            {recipe.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                >
                  #{tag}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="space-y-8">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <RecipeMethod body={recipe.body} />
          </div>
          {related.length > 0 ? (
            <div>
              <h2 className="mb-3 text-xl font-semibold text-stone-900">Related recipes</h2>
              <ul className="space-y-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/recipes/${item.slug}`}
                      className="text-sm font-medium text-stone-800 hover:text-amber-800"
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
