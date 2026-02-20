import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeCard } from "@/components/recipe-card";
import { getAllTags, getRecipeSummaries } from "@/lib/recipes";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const allTags = getAllTags();

  if (!allTags.includes(decodedTag)) {
    notFound();
  }

  const recipes = getRecipeSummaries().filter((recipe) => recipe.tags.includes(decodedTag));

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <Link
        href="/recipes"
        className="font-mono-ui text-xs uppercase tracking-[0.09em] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
      >
        Back to recipes
      </Link>
      <header className="mb-6 mt-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-fg)]">#{decodedTag}</h1>
        <p className="font-mono-ui mt-2 text-xs uppercase tracking-[0.09em] text-[var(--color-muted)]">
          {recipes.length} matching recipes
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </main>
  );
}
