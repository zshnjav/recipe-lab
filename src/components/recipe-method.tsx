"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface RecipeMethodProps {
  body: string;
}

interface RecipeImage {
  alt: string;
  src: string;
}

interface ParsedSection {
  steps: string[];
  notes: string[];
  paragraphs: string[];
  images: RecipeImage[];
}

type WakeLockStatus = "idle" | "active" | "unsupported" | "error";

function parseImageLine(line: string): RecipeImage | null {
  const match = line.match(/^!\[(.*)\]\((.*)\)$/);
  if (!match) {
    return null;
  }

  return {
    alt: match[1].trim() || "Recipe image",
    src: match[2].trim(),
  };
}

function parseSection(lines: string[]): ParsedSection {
  const steps = lines
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, ""));
  const notes = lines
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-\s+/, ""));
  const images = lines
    .map((line) => parseImageLine(line))
    .filter((image): image is RecipeImage => image !== null);
  const paragraphs = lines.filter(
    (line) =>
      line &&
      !/^\d+\.\s+/.test(line) &&
      !/^-\s+/.test(line) &&
      !line.endsWith(":") &&
      parseImageLine(line) === null,
  );

  return { steps, notes, paragraphs, images };
}

function extractMethodSections(body: string): {
  prep: string[];
  execution: string[];
  usedFallback: boolean;
} {
  const lines = body.split(/\r?\n/).map((line) => line.trim());
  const prepHeader = /^##\s+prep(\s+\(mise-en-place\)|\s*\/\/\s*mise\s+en\s+place)\s*$/i;
  const executionHeader = /^##\s+execution(\s*\/\/\s*active\s+cooking)?\s*$/i;

  const prepIndex = lines.findIndex((line) => prepHeader.test(line));
  const executionIndex = lines.findIndex((line) => executionHeader.test(line));

  if (prepIndex === -1 && executionIndex === -1) {
    return { prep: [], execution: lines.filter(Boolean), usedFallback: true };
  }

  const nextHeaderIndex = (start: number) =>
    lines.findIndex((line, index) => index > start && /^##\s+/.test(line));

  const sectionLines = (start: number) => {
    if (start === -1) {
      return [];
    }
    const end = nextHeaderIndex(start);
    const sliceEnd = end === -1 ? lines.length : end;
    return lines.slice(start + 1, sliceEnd).filter(Boolean);
  };

  return {
    prep: sectionLines(prepIndex),
    execution: sectionLines(executionIndex),
    usedFallback: false,
  };
}

function MethodSection({
  title,
  parsed,
  stepOffset,
  activeStepIndex,
  onStepToggle,
}: {
  title: string;
  parsed: ParsedSection;
  stepOffset: number;
  activeStepIndex: number | null;
  onStepToggle: (stepIndex: number) => void;
}) {
  const hasSelection = activeStepIndex !== null;

  if (
    parsed.steps.length === 0 &&
    parsed.paragraphs.length === 0 &&
    parsed.images.length === 0 &&
    parsed.notes.length === 0
  ) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="border-b border-[var(--color-border)] pb-2">
        <h3 className="font-mono-ui text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          {title}
        </h3>
      </div>
      {parsed.steps.length > 0 ? (
        <ol className="space-y-3">
          {parsed.steps.map((step, index) => {
            const stepIndex = stepOffset + index;
            const isActive = activeStepIndex === stepIndex;
            const isMuted = hasSelection && !isActive;

            let stepClassName =
              "w-full rounded-md border border-[var(--color-border)] bg-[#fbfaf6] p-4 text-left text-sm leading-6 text-[var(--color-fg)] transition duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40";
            if (isActive) {
              stepClassName +=
                " border-[var(--color-accent)] bg-[#f7ecd9] text-[var(--color-fg)] ring-2 ring-[var(--color-accent)]/45 shadow-[0_2px_6px_rgba(25,20,14,0.08)]";
            } else if (isMuted) {
              stepClassName += " bg-[#f5f2eb] text-[var(--color-muted)] opacity-95";
            }

            return (
              <li key={`${title}-${stepIndex}`}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onStepToggle(stepIndex)}
                  className={stepClassName}
                >
                  {step}
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
      {parsed.paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-[var(--color-muted)]">
          {paragraph}
        </p>
      ))}
      {parsed.images.length > 0 ? (
        <div className="space-y-4">
          {parsed.images.map((image) => (
            <figure
              key={`${image.src}-${image.alt}`}
              className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[#fbfaf6]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt={image.alt} className="h-auto w-full object-cover" loading="lazy" />
              <figcaption className="font-mono-ui px-3 py-2 text-[0.68rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {image.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {parsed.notes.length > 0 ? (
        <div>
          <h4 className="font-mono-ui mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Notes
          </h4>
          <ul className="list-disc space-y-2 pl-5 text-sm text-[var(--color-muted)]">
            {parsed.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function RecipeMethod({ body }: RecipeMethodProps) {
  const { prep, execution, usedFallback } = extractMethodSections(body);
  const prepParsed = useMemo(() => parseSection(prep), [prep]);
  const executionParsed = useMemo(() => parseSection(execution), [execution]);
  const totalSteps = prepParsed.steps.length + executionParsed.steps.length;
  const hasSteps = totalSteps > 0;
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [keepScreenAwakeEnabled, setKeepScreenAwakeEnabled] = useState(false);
  const [wakeLockStatus, setWakeLockStatus] = useState<WakeLockStatus>("idle");
  const [wakeLockSupported, setWakeLockSupported] = useState(
    () => typeof navigator !== "undefined" && "wakeLock" in navigator,
  );
  const wakeLockSentinelRef = useRef<WakeLockSentinel | null>(null);

  const releaseWakeLock = useCallback(async () => {
    const activeWakeLock = wakeLockSentinelRef.current;
    if (!activeWakeLock) {
      return;
    }

    try {
      await activeWakeLock.release();
    } catch {
      // Wake lock release can fail if lock was already released by the UA.
    } finally {
      wakeLockSentinelRef.current = null;
    }
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (activeStepIndex === null || !keepScreenAwakeEnabled) {
      return;
    }

    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
      setWakeLockStatus("active");
      return;
    }

    if (!("wakeLock" in navigator)) {
      setWakeLockStatus("unsupported");
      return;
    }

    try {
      const sentinel = await navigator.wakeLock.request("screen");
      wakeLockSentinelRef.current = sentinel;
      sentinel.onrelease = () => {
        wakeLockSentinelRef.current = null;
        setWakeLockStatus((current) => (current === "unsupported" ? current : "idle"));
      };
      setWakeLockStatus("active");
    } catch {
      setWakeLockStatus("error");
    }
  }, [activeStepIndex, keepScreenAwakeEnabled]);

  useEffect(() => {
    const supportsWakeLock = "wakeLock" in navigator;
    setWakeLockSupported(supportsWakeLock);
    if (!supportsWakeLock) {
      setWakeLockStatus("unsupported");
    }
  }, []);

  useEffect(() => {
    if (!hasSteps) {
      setActiveStepIndex(null);
      setKeepScreenAwakeEnabled(false);
      return;
    }

    setActiveStepIndex((current) => {
      if (current === null) {
        return null;
      }
      return Math.max(0, Math.min(current, totalSteps - 1));
    });
  }, [hasSteps, totalSteps]);

  useEffect(() => {
    if (!wakeLockSupported) {
      return;
    }

    if (activeStepIndex === null || !keepScreenAwakeEnabled) {
      void releaseWakeLock();
      setWakeLockStatus("idle");
      return;
    }

    void requestWakeLock();
  }, [
    keepScreenAwakeEnabled,
    activeStepIndex,
    releaseWakeLock,
    requestWakeLock,
    wakeLockSupported,
  ]);

  useEffect(() => {
    if (!wakeLockSupported) {
      return;
    }

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        return;
      }
      if (activeStepIndex === null || !keepScreenAwakeEnabled) {
        return;
      }
      void requestWakeLock();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [activeStepIndex, keepScreenAwakeEnabled, requestWakeLock, wakeLockSupported]);

  useEffect(() => {
    return () => {
      void releaseWakeLock();
    };
  }, [releaseWakeLock]);

  if (usedFallback && process.env.NODE_ENV !== "production") {
    console.warn(
      'Recipe method is missing expected prep/execution headings. Rendering legacy fallback.',
    );
  }

  const onStepToggle = (nextIndex: number) => {
    if (!hasSteps) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(nextIndex, totalSteps - 1));
    setActiveStepIndex((current) => {
      if (current === clampedIndex) {
        setKeepScreenAwakeEnabled(false);
        return null;
      }

      setKeepScreenAwakeEnabled(true);
      return clampedIndex;
    });
  };

  const wakeLockStatusMessage =
    wakeLockStatus === "error" ? "Could not keep screen awake. Check browser permissions." : "";

  return (
    <section className="space-y-6">
      {hasSteps ? (
        <div className="rounded-md border border-[var(--color-border)] bg-[#f3efe7] p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="font-mono-ui text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Procedure Controls
            </span>
            <button
              type="button"
              aria-pressed={keepScreenAwakeEnabled}
              onClick={() => setKeepScreenAwakeEnabled((current) => !current)}
              className={`font-mono-ui inline-flex items-center rounded-sm border px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.08em] transition duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]/40 ${
                keepScreenAwakeEnabled
                  ? "border-[var(--color-accent)] bg-[#f2e2c6] text-[#5f3f1a]"
                  : "border-[var(--color-border)] bg-[#fbfaf6] text-[var(--color-muted)] hover:border-[var(--color-accent)]"
              }`}
            >
              Keep Screen Awake
            </button>
          </div>
          <p className="font-mono-ui text-[0.66rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Tap a step to focus it. Tap again to return to full view.
          </p>
          <p className="font-mono-ui mt-1 text-[0.66rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {wakeLockSupported
              ? "Keep Screen Awake prevents your display from sleeping while this recipe is open."
              : "Keep-awake is not supported on this browser."}
          </p>
          {wakeLockStatusMessage ? (
            <p className="font-mono-ui mt-1 text-[0.66rem] uppercase tracking-[0.08em] text-[#8a3f35]">
              {wakeLockStatusMessage}
            </p>
          ) : null}
        </div>
      ) : null}
      <MethodSection
        title="Prep // Mise en Place"
        parsed={prepParsed}
        stepOffset={0}
        activeStepIndex={activeStepIndex}
        onStepToggle={onStepToggle}
      />
      <MethodSection
        title="Execution // Active Cooking"
        parsed={executionParsed}
        stepOffset={prepParsed.steps.length}
        activeStepIndex={activeStepIndex}
        onStepToggle={onStepToggle}
      />
    </section>
  );
}
