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

function MethodSection({ title, lines }: { title: string; lines: string[] }) {
  const parsed = parseSection(lines);

  if (lines.length === 0) {
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
          {parsed.steps.map((step) => (
            <li
              key={step}
              className="rounded-md border border-[var(--color-border)] bg-[#fbfaf6] p-4 text-sm leading-6 text-[var(--color-fg)]"
            >
              {step}
            </li>
          ))}
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

  if (usedFallback && process.env.NODE_ENV !== "production") {
    console.warn(
      'Recipe method is missing expected prep/execution headings. Rendering legacy fallback.',
    );
  }

  return (
    <section className="space-y-6">
      <MethodSection title="Prep // Mise en Place" lines={prep} />
      <MethodSection title="Execution // Active Cooking" lines={execution} />
    </section>
  );
}
