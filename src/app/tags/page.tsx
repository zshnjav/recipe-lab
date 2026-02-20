import Link from "next/link";
import { getAllTags } from "@/lib/recipes";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-6">
        <p className="font-mono-ui text-xs uppercase tracking-[0.1em] text-[var(--color-muted)]">
          Classification
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-[var(--color-fg)]">
          Browse Tags
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Pick a tag to see matching recipes.</p>
      </header>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/tags/${encodeURIComponent(tag)}`} className="chip inline-flex px-3 py-1.5">
              #{tag}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
