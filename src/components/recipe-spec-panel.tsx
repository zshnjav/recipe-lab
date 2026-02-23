"use client";

import { useEffect, useMemo, useRef, useState } from "react";

interface RecipeSpecPanelProps {
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
}

const FIELD_TYPING_DELAY_MS = 52;
const FIELD_START_DELAY_MS = 70;
const FIELD_SWITCH_DELAY_MS = 140;
const PANEL_START_DELAY_MS = 200;

export function RecipeSpecPanel({ servings, prepMinutes, cookMinutes, totalMinutes }: RecipeSpecPanelProps) {
  const fields = useMemo(
    () => [
      { label: "Servings", value: `${servings}` },
      { label: "Prep", value: `${prepMinutes}m` },
      { label: "Cook", value: `${cookMinutes}m` },
      { label: "Total", value: `${totalMinutes}m` },
    ],
    [servings, prepMinutes, cookMinutes, totalMinutes],
  );
  const [displayedValues, setDisplayedValues] = useState<string[]>(() => fields.map(() => ""));
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);
  const pendingTimeouts = useRef<number[]>([]);

  useEffect(() => {
    const clearPendingTimeouts = () => {
      for (const timeoutId of pendingTimeouts.current) {
        window.clearTimeout(timeoutId);
      }
      pendingTimeouts.current = [];
    };

    clearPendingTimeouts();

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    pendingTimeouts.current.push(
      window.setTimeout(() => {
        setDisplayedValues(fields.map(() => ""));
        setActiveFieldIndex(null);

        if (prefersReducedMotion) {
          setDisplayedValues(fields.map((field) => field.value));
          return;
        }

        let currentFieldIndex = 0;

        const typeNextField = () => {
          if (currentFieldIndex >= fields.length) {
            setActiveFieldIndex(null);
            return;
          }

          const targetValue = fields[currentFieldIndex].value;
          let characterIndex = 0;
          setActiveFieldIndex(currentFieldIndex);

          const typeCharacter = () => {
            if (characterIndex >= targetValue.length) {
              currentFieldIndex += 1;
              pendingTimeouts.current.push(window.setTimeout(typeNextField, FIELD_SWITCH_DELAY_MS));
              return;
            }

            const nextValue = targetValue.slice(0, characterIndex + 1);
            setDisplayedValues((previous) => {
              const next = [...previous];
              next[currentFieldIndex] = nextValue;
              return next;
            });
            characterIndex += 1;
            pendingTimeouts.current.push(window.setTimeout(typeCharacter, FIELD_TYPING_DELAY_MS));
          };

          pendingTimeouts.current.push(window.setTimeout(typeCharacter, FIELD_START_DELAY_MS));
        };

        pendingTimeouts.current.push(window.setTimeout(typeNextField, PANEL_START_DELAY_MS));
      }, 0),
    );
    return clearPendingTimeouts;
  }, [fields]);

  return (
    <div className="console-panel mt-5 overflow-hidden">
      <dl className="font-mono-ui grid grid-cols-2 gap-px bg-[var(--color-panel-text)]/10 text-xs uppercase tracking-[0.08em] text-[var(--color-panel-text)]">
        {fields.map((field, index) => (
          <div key={field.label} className="bg-[var(--color-panel)] px-3 py-3 transition duration-200 motion-reduce:transition-none">
            <dt className="text-[var(--color-panel-text)]/65">{field.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--color-accent)]" aria-label={field.value}>
              <span>{displayedValues[index]}</span>
              {activeFieldIndex === index ? <span className="spec-typing-caret" aria-hidden="true">|</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
