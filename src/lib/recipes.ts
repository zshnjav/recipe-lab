import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  Recipe,
  RecipeFrontmatter,
  RecipeIngredient,
  RecipeSummary,
} from "@/types/recipe";

const RECIPES_DIR = path.join(process.cwd(), "content", "recipes");
const COMMON_UNITS = new Set([
  "g",
  "gram",
  "grams",
  "kg",
  "ml",
  "l",
  "tsp",
  "tbsp",
  "cup",
  "cups",
  "oz",
  "lb",
  "pinch",
  "clove",
  "cloves",
  "slice",
  "slices",
  "whole",
]);

function toString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Frontmatter field "${field}" must be a non-empty string.`);
  }

  return value.trim();
}

function toDateString(value: unknown, field: string): string {
  if (typeof value === "string" && value.trim() !== "") {
    return value.trim();
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  throw new Error(`Frontmatter field "${field}" must be a valid date string.`);
}

function toNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`Frontmatter field "${field}" must be a valid number.`);
  }

  return value;
}

function toStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Frontmatter field "${field}" must be a string array.`);
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function parseFraction(input: string): number | null {
  const match = input.match(/^(\d+)\/(\d+)$/);
  if (!match) {
    return null;
  }

  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!denominator) {
    return null;
  }

  return numerator / denominator;
}

function parseNumericToken(input: string): number | null {
  const fraction = parseFraction(input);
  if (fraction !== null) {
    return fraction;
  }

  const value = Number(input);
  return Number.isNaN(value) ? null : value;
}

function parseLegacyIngredient(line: string): RecipeIngredient {
  const tokens = line.trim().split(/\s+/);
  if (tokens.length === 0) {
    throw new Error("Ingredient lines must not be empty.");
  }

  const first = parseNumericToken(tokens[0]);
  if (first === null) {
    return { name: line.trim() };
  }

  const second = tokens[1] ? parseFraction(tokens[1]) : null;
  const amountValue = second !== null ? first + second : first;
  const valueTokenCount = second !== null ? 2 : 1;
  const unitCandidate = tokens[valueTokenCount];

  if (!unitCandidate) {
    return {
      name: line.trim(),
      amount: { value: amountValue, unit: "whole" },
    };
  }

  const unit = unitCandidate.toLowerCase();
  if (COMMON_UNITS.has(unit)) {
    return {
      name: tokens.slice(valueTokenCount + 1).join(" ") || line.trim(),
      amount: { value: amountValue, unit: unitCandidate },
    };
  }

  return {
    name: tokens.slice(valueTokenCount).join(" "),
    amount: { value: amountValue, unit: "whole" },
  };
}

function validateAmount(input: unknown): RecipeIngredient["amount"] {
  if (typeof input !== "object" || input === null) {
    throw new Error('Ingredient "amount" must be an object with value and unit.');
  }

  const amount = input as Record<string, unknown>;
  return {
    value: toNumber(amount.value, "ingredients.amount.value"),
    unit: toString(amount.unit, "ingredients.amount.unit"),
  };
}

function validateIngredients(input: unknown): RecipeIngredient[] {
  if (!Array.isArray(input)) {
    throw new Error('Frontmatter field "ingredients" must be an array.');
  }

  return input.map((ingredient, index) => {
    if (typeof ingredient === "string") {
      return parseLegacyIngredient(ingredient);
    }

    if (typeof ingredient !== "object" || ingredient === null) {
      throw new Error(`Ingredient at index ${index} must be a string or object.`);
    }

    const item = ingredient as Record<string, unknown>;
    const name = toString(item.name, `ingredients[${index}].name`);
    const amount = item.amount !== undefined ? validateAmount(item.amount) : undefined;
    const grams = item.grams !== undefined ? toNumber(item.grams, `ingredients[${index}].grams`) : undefined;

    if (!amount && grams === undefined) {
      throw new Error(
        `Ingredient "${name}" must include at least one measurement: amount or grams.`,
      );
    }

    return { name, amount, grams };
  });
}

function validateFrontmatter(frontmatter: Record<string, unknown>): RecipeFrontmatter {
  return {
    title: toString(frontmatter.title, "title"),
    date: toDateString(frontmatter.date, "date"),
    description: toString(frontmatter.description, "description"),
    tags: toStringArray(frontmatter.tags, "tags"),
    prepMinutes: toNumber(frontmatter.prepMinutes, "prepMinutes"),
    cookMinutes: toNumber(frontmatter.cookMinutes, "cookMinutes"),
    totalMinutes: toNumber(frontmatter.totalMinutes, "totalMinutes"),
    servings: toNumber(frontmatter.servings, "servings"),
    ingredients: validateIngredients(frontmatter.ingredients),
  };
}

function parseRecipeFromFile(slug: string): Recipe {
  const fullPath = path.join(RECIPES_DIR, `${slug}.md`);
  const fileContents = readFileSync(fullPath, "utf8");
  const parsed = matter(fileContents);
  const validated = validateFrontmatter(parsed.data as Record<string, unknown>);

  return {
    ...validated,
    slug,
    body: parsed.content.trim(),
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
