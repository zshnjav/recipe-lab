"use client";

import { useMemo, useState } from "react";
import type { RecipeIngredient } from "@/types/recipe";

interface RecipeIngredientsPanelProps {
  ingredients: RecipeIngredient[];
  baseServings: number;
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
    ingredient.grams !== undefined ? `${Math.round(ingredient.grams * multiplier)} g` : undefined;

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

export function RecipeIngredientsPanel({ ingredients, baseServings }: RecipeIngredientsPanelProps) {
  const [servings, setServings] = useState(baseServings);
  const [selected, setSelected] = useState<Set<number>>(new Set(ingredients.map((_, index) => index)));
  const [copyStatus, setCopyStatus] = useState<string>("");

  const multiplier = servings / baseServings;
  const scaledLines = useMemo(
    () => ingredients.map((ingredient) => formatShoppingListLine(ingredient, multiplier)),
    [ingredients, multiplier],
  );

  const toggleSelection = (index: number) => {
    setSelected((current) => {
      const updated = new Set(current);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const copySelected = async () => {
    const lines = scaledLines.filter((_, index) => selected.has(index));
    if (lines.length === 0) {
      setCopyStatus("Select at least one ingredient.");
      return;
    }

    const didCopy = await copyTextToClipboard(lines.join("\n"));
    setCopyStatus(didCopy ? "Shopping list copied." : "Clipboard unavailable in this browser.");
  };

  return (
    <section className="mt-6">
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">Ingredients</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setServings((value) => Math.max(1, value - 1))}
              className="h-8 w-8 rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-100"
            >
              -
            </button>
            <span className="min-w-24 text-center text-sm font-medium text-stone-700">
              {servings} servings
            </span>
            <button
              type="button"
              onClick={() => setServings((value) => value + 1)}
              className="h-8 w-8 rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {ingredients.map((ingredient, index) => {
            const measurement = formatMeasurement(ingredient, multiplier);
            return (
              <label
                key={`${ingredient.name}-${index}`}
                className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-2.5"
              >
                <input
                  type="checkbox"
                  checked={selected.has(index)}
                  onChange={() => toggleSelection(index)}
                  className="mt-1 h-4 w-4 accent-amber-600"
                />
                <div className="flex w-full flex-wrap items-start justify-between gap-2">
                  <span className="text-sm text-stone-800">{ingredient.name}</span>
                  <span className="text-sm font-medium text-stone-700">
                    {measurement.common && measurement.grams
                      ? `${measurement.common} (${measurement.grams})`
                      : measurement.common ?? measurement.grams}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copySelected}
            className="rounded-lg bg-stone-900 px-3 py-2 text-xs font-semibold text-white hover:bg-stone-800"
          >
            Copy shopping list
          </button>
          {copyStatus ? <span className="text-xs text-stone-600">{copyStatus}</span> : null}
        </div>
      </div>
    </section>
  );
}
