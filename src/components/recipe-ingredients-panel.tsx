"use client";

import { useMemo, useState } from "react";
import type { RecipeIngredient } from "@/types/recipe";

interface RecipeIngredientsPanelProps {
  ingredients: RecipeIngredient[];
  baseServings: number;
  recipeTitle: string;
  recipeDescription: string;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  methodBody: string;
}

function formatKitchenFraction(value: number): string {
  if (Number.isInteger(value)) {
    return String(value);
  }

  const roundedToEighth = Math.round(value * 8) / 8;
  const whole = Math.floor(roundedToEighth);
  const fractional = roundedToEighth - whole;
  const eighths = Math.round(fractional * 8);

  const fractions: Record<number, string> = {
    1: "1/8",
    2: "1/4",
    3: "3/8",
    4: "1/2",
    5: "5/8",
    6: "3/4",
    7: "7/8",
  };

  if (!fractions[eighths]) {
    return String(roundedToEighth);
  }

  return whole > 0 ? `${whole} ${fractions[eighths]}` : fractions[eighths];
}

function formatMeasurement(
  ingredient: RecipeIngredient,
  multiplier: number,
): { common?: string; grams?: string } {
  const common =
    ingredient.amount !== undefined
      ? `${formatKitchenFraction(ingredient.amount.value * multiplier)} ${ingredient.amount.unit}`
      : undefined;
  const grams =
    ingredient.grams !== undefined && ingredient.grams > 0
      ? `${Math.round(ingredient.grams * multiplier)} g`
      : undefined;

  return { common, grams };
}

function formatShoppingListLine(ingredient: RecipeIngredient, multiplier: number): string {
  const measurement = formatMeasurement(ingredient, multiplier);
  if (measurement.common && measurement.grams) {
    return `${ingredient.name} - ${measurement.common} (${measurement.grams})`;
  }
  if (measurement.common) {
    return `${ingredient.name} - ${measurement.common}`;
  }
  if (measurement.grams) {
    return `${ingredient.name} - ${measurement.grams}`;
  }
  return ingredient.name;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined") {
    return false;
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }

  return false;
}

export function RecipeIngredientsPanel({
  ingredients,
  baseServings,
  recipeTitle,
  recipeDescription,
  prepMinutes,
  cookMinutes,
  totalMinutes,
  methodBody,
}: RecipeIngredientsPanelProps) {
  const [servings, setServings] = useState(baseServings);
  const [copyStatus, setCopyStatus] = useState<string>("");

  const multiplier = servings / baseServings;
  const scaledLines = useMemo(
    () => ingredients.map((ingredient) => formatShoppingListLine(ingredient, multiplier)),
    [ingredients, multiplier],
  );

  const copyList = async () => {
    if (scaledLines.length === 0) {
      setCopyStatus("No ingredients to copy.");
      return;
    }

    const shoppingListText = `${recipeTitle}\n${scaledLines.join("\n")}`;
    const didCopy = await copyTextToClipboard(shoppingListText);
    setCopyStatus(didCopy ? "Shopping list copied." : "Clipboard unavailable in this browser.");
  };

  const copyFullRecipe = async () => {
    if (scaledLines.length === 0) {
      setCopyStatus("No recipe data to copy.");
      return;
    }

    const fullRecipeText = [
      recipeTitle,
      recipeDescription,
      "",
      `Prep: ${prepMinutes}m`,
      `Cook: ${cookMinutes}m`,
      `Total: ${totalMinutes}m`,
      `Servings: ${servings}`,
      "",
      "Ingredients",
      ...scaledLines.map((line) => `- ${line}`),
      "",
      "Method",
      methodBody.trim(),
    ].join("\n");

    const didCopy = await copyTextToClipboard(fullRecipeText);
    setCopyStatus(didCopy ? "Full recipe copied." : "Clipboard unavailable in this browser.");
  };

  return (
    <section className="mt-6">
      <div className="rounded-md border border-[var(--color-border)] bg-[#f0ede6] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono-ui text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-muted)]">
            Ingredients
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setServings((value) => Math.max(1, value - 1))}
              className="h-8 w-8 rounded-sm border border-[var(--color-border)] bg-[#f8f5ee] text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--color-accent)]"
            >
              -
            </button>
            <span className="font-mono-ui min-w-24 text-center text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {servings} servings
            </span>
            <button
              type="button"
              onClick={() => setServings((value) => value + 1)}
              className="h-8 w-8 rounded-sm border border-[var(--color-border)] bg-[#f8f5ee] text-sm font-semibold text-[var(--color-fg)] hover:border-[var(--color-accent)]"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {ingredients.map((ingredient, index) => {
            const measurement = formatMeasurement(ingredient, multiplier);
            return (
              <div
                key={`${ingredient.name}-${index}`}
                className="flex items-start justify-between gap-3 rounded-sm border border-[var(--color-border)] bg-[#fbfaf6] px-3 py-2.5"
              >
                <span className="text-sm text-[var(--color-fg)]">{ingredient.name}</span>
                <span className="font-mono-ui text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                  {measurement.common && measurement.grams
                    ? `${measurement.common} (${measurement.grams})`
                    : measurement.common ?? measurement.grams}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copyList}
            className="font-mono-ui rounded-sm border border-[var(--color-panel)] bg-[var(--color-panel)] px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-panel-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          >
            Copy shopping list
          </button>
          <button
            type="button"
            onClick={copyFullRecipe}
            className="font-mono-ui ml-auto rounded-sm border border-[var(--color-border)] bg-[#f8f5ee] px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Copy full recipe
          </button>
        </div>
        {copyStatus ? (
          <p className="font-mono-ui mt-2 text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {copyStatus}
          </p>
        ) : null}
      </div>
    </section>
  );
}
