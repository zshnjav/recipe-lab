import { notFound, redirect } from "next/navigation";
import { getAllTags } from "@/lib/recipes";

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

  redirect(`/recipes?tags=${encodeURIComponent(decodedTag)}`);
}
