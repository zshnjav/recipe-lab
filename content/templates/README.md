# Recipe Publishing Guide

Use this folder as your low-friction publishing workflow.

## Quick Start

1. Copy `content/templates/recipe-template.md`.
2. Fill in the frontmatter and method sections.
3. Save the new file to `content/recipes/<your-slug>.md`.
4. (Optional) Add images under `public/recipes/<your-slug>/`.
5. Run `npm run dev` and open the recipe page.

## File Naming

- Use lowercase kebab-case for slugs.
- Example: `chicken-tikka-wraps.md`

This becomes the URL:
- `/recipes/chicken-tikka-wraps`

## Frontmatter Rules

Required fields:

- `title: string`
- `date: YYYY-MM-DD`
- `description: string`
- `tags: string[]`
- `prepMinutes: number`
- `cookMinutes: number`
- `totalMinutes: number`
- `servings: number`
- `ingredients: RecipeIngredient[]`

Ingredient format:

```yaml
ingredients:
  - name: all-purpose flour
    amount:
      value: 2
      unit: cups
    grams: 240
  - name: eggs
    amount:
      value: 2
      unit: whole
```

Notes:

- Each ingredient must include at least one measurement: `amount` or `grams`.
- If both are present, both are shown and both scale with servings.
- `grams` are displayed as whole numbers when scaled.
- `quick` is auto-added when `totalMinutes <= 30`; you do not need to add `quick` manually.

## Method Format (Required Structure)

Use these two headings in the markdown body:

```md
## Prep (Mise-en-Place)
1. ...

## Execution
1. ...
```

You can include `Notes:` and bullet points under either section.

## Images

Store images in `public/recipes/<slug>/`.

Example file:
- `public/recipes/chicken-tikka-wraps/step-1.jpg`

Reference in markdown:

```md
![Searing chicken](/recipes/chicken-tikka-wraps/step-1.jpg)
```

## Final Checklist

- Frontmatter complete and valid
- Uses both method section headings
- Ingredient measurements look right when servings are adjusted
- Recipe renders at `/recipes/<slug>`
