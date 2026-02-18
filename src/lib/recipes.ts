import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Recipe, RecipeFrontmatter, RecipeSummary } from "@/types/recipe";

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");

type FrontmatterValue = string | number | string[];

function stripQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseInlineList(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [stripQuotes(trimmed)];
  }

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) {
    return [];
  }

  return inner.split(",").map((item) => stripQuotes(item.trim()));
}

function parseScalar(value: string): string | number {
  const cleaned = stripQuotes(value.trim());
  if (/^\d+$/.test(cleaned)) {
    return Number(cleaned);
  }

  return cleaned;
}

function parseFrontmatter(raw: string): Record<string, FrontmatterValue> {
  const parsed: Record<string, FrontmatterValue> = {};
  const lines = raw.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    const rawValue = match[2].trim();

    if (rawValue.length > 0) {
      if (rawValue.startsWith("[")) {
        parsed[key] = parseInlineList(rawValue);
      } else {
        parsed[key] = parseScalar(rawValue);
      }
      continue;
    }

    const list: string[] = [];
    let next = index + 1;
    while (next < lines.length) {
      const listMatch = lines[next].match(/^\s*-\s+(.*)$/);
      if (!listMatch) {
        break;
      }
      list.push(stripQuotes(listMatch[1].trim()));
      next += 1;
    }

    parsed[key] = list;
    index = next - 1;
  }

  return parsed;
}

function splitMarkdownFile(content: string): {
  frontmatter: Record<string, FrontmatterValue>;
  body: string;
} {
  const normalized = content.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Recipe file is missing valid frontmatter delimiters.");
  }

  return {
    frontmatter: parseFrontmatter(match[1]),
    body: match[2].trim(),
  };
}

function toStringArray(value: FrontmatterValue | undefined, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Frontmatter field "${field}" must be a string array.`);
  }

  return value;
}

function toString(value: FrontmatterValue | undefined, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Frontmatter field "${field}" must be a non-empty string.`);
  }

  return value;
}

function toNumber(value: FrontmatterValue | undefined, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Frontmatter field "${field}" must be a valid number.`);
  }

  return value;
}

function validateFrontmatter(frontmatter: Record<string, FrontmatterValue>): RecipeFrontmatter {
  return {
    title: toString(frontmatter.title, "title"),
    date: toString(frontmatter.date, "date"),
    description: toString(frontmatter.description, "description"),
    tags: toStringArray(frontmatter.tags, "tags"),
    prepMinutes: toNumber(frontmatter.prepMinutes, "prepMinutes"),
    cookMinutes: toNumber(frontmatter.cookMinutes, "cookMinutes"),
    totalMinutes: toNumber(frontmatter.totalMinutes, "totalMinutes"),
    servings: toNumber(frontmatter.servings, "servings"),
    ingredients: toStringArray(frontmatter.ingredients, "ingredients"),
  };
}

function parseRecipeFromFile(slug: string): Recipe {
  const fullPath = path.join(RECIPES_DIR, `${slug}.md`);
  const fileContents = readFileSync(fullPath, "utf8");
  const { frontmatter, body } = splitMarkdownFile(fileContents);
  const validated = validateFrontmatter(frontmatter);

  return {
    ...validated,
    slug,
    body,
  };
}

export function getRecipeSlugs(): string[] {
  return readdirSync(RECIPES_DIR)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}

export function getAllRecipes(): Recipe[] {
  return getRecipeSlugs()
    .map((slug) => parseRecipeFromFile(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRecipeBySlug(slug: string): Recipe | null {
  try {
    return parseRecipeFromFile(slug);
  } catch {
    return null;
  }
}

export function getAllTags(): string[] {
  const tags = new Set<string>();

  for (const recipe of getAllRecipes()) {
    for (const tag of recipe.tags) {
      tags.add(tag);
    }
  }

  return [...tags].sort((a, b) => a.localeCompare(b));
}

export function getRecipeSummaries(): RecipeSummary[] {
  return getAllRecipes().map((recipe) => ({
    slug: recipe.slug,
    title: recipe.title,
    date: recipe.date,
    description: recipe.description,
    tags: recipe.tags,
    prepMinutes: recipe.prepMinutes,
    cookMinutes: recipe.cookMinutes,
    totalMinutes: recipe.totalMinutes,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
  }));
}
