import Link from "next/link";
import { getAllTags } from "@/lib/recipes";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-6">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-900">Browse Tags</h1>
        <p className="mt-2 text-sm text-stone-700">Pick a tag to see matching recipes.</p>
      </header>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`/tags/${encodeURIComponent(tag)}`}
              className="inline-flex rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              #{tag}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
