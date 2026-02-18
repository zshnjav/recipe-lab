interface RecipeMethodProps {
  body: string;
}

export function RecipeMethod({ body }: RecipeMethodProps) {
  const lines = body.split(/\r?\n/).map((line) => line.trim());
  const steps = lines
    .filter((line) => /^\d+\.\s+/.test(line))
    .map((line) => line.replace(/^\d+\.\s+/, ""));
  const notes = lines
    .filter((line) => /^-\s+/.test(line))
    .map((line) => line.replace(/^-\s+/, ""));
  const paragraphs = lines.filter(
    (line) => line && !/^\d+\.\s+/.test(line) && !/^-\s+/.test(line) && !line.endsWith(":"),
  );

  return (
    <section className="space-y-6">
      {steps.length > 0 ? (
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-stone-900">Method</h2>
          <ol className="space-y-3">
            {steps.map((step) => (
              <li
                key={step}
                className="rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-800"
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-sm leading-7 text-stone-700">
          {paragraph}
        </p>
      ))}

      {notes.length > 0 ? (
        <div>
          <h3 className="mb-2 text-lg font-semibold text-stone-900">Notes</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-stone-700">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
