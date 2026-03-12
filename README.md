# Recipe Lab

Personal recipe blog built with Next.js, TypeScript, and Tailwind CSS.

The site is static-first and markdown-driven: recipes live in `content/recipes/*.md`.

## Beginner Notes

- You do not need to know React deeply to add recipes. Most of your work is editing markdown files.
- Think of `content/recipes` as your recipe database. Every `.md` file becomes a real recipe page.
- `frontmatter` means the YAML block between `---` lines at the top of each recipe file.
- Keep slug filenames simple and lowercase (example: `beef-fried-rice.md`).
- When in doubt, copy `content/templates/recipe-template.md` and replace values.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel via GitHub

## Routes

- `/` Home overview with quick discovery and search.
- `/recipes` Main browse/search/filter/sort page.
- `/recipes/[slug]` Recipe detail page.
- `/about` About page.
- `/tags` Redirects to `/recipes`.
- `/tags/[tag]` Legacy tag route that redirects to `/recipes?tags=<tag>`.

## Current Features

- Home page:
  - Search across title, description, tags, and ingredients
  - Random recipe button
  - Recent recipe cards (latest recipes)
  - "View full recipe archive" link to `/recipes`
- Browse page (`/recipes`):
  - Search input
  - Multi-tag filtering through URL params (`tags=a,b,c`)
  - Co-occurring tag discovery panel
  - Sort options: newest first or lowest total time
  - Random recipe button
  - Result summary and clear-all controls
- Recipe detail page (`/recipes/[slug]`):
  - Specs panel (servings, prep, cook, total)
  - Ingredients panel with servings scaler
  - Copy shopping list
  - Copy full recipe
  - Method rendering with `Prep` and `Execution` sections
  - Step focus mode with optional "Keep Screen Awake"
  - Recipe image rendering from markdown image lines
- Automatic `quick` tag when `totalMinutes <= 30`

## Recipe Content Model

Each recipe file uses frontmatter plus markdown body.

Required frontmatter fields:

- `title: string`
- `date: YYYY-MM-DD`
- `description: string`
- `tags: string[]`
- `prepMinutes: number`
- `cookMinutes: number`
- `totalMinutes: number`
- `servings: number`
- `ingredients: RecipeIngredient[]`

Ingredient shape:

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

- Each object-style ingredient must include at least one measurement: `amount` or `grams`.
- If both are provided, both are shown and scaled.
- Common units are displayed with kitchen-style fraction formatting after scaling.
- Grams scale and display as whole numbers.
- Legacy string ingredients are still parsed for backward compatibility.
- `quick` is auto-added when `totalMinutes <= 30`.

## Method Body Format

Use this structure in the markdown body:

```md
## Prep (Mise-en-Place)
1. ...

## Execution
1. ...
```

Legacy markdown still renders as a fallback, but new recipes should follow this structure.

## Adding a New Recipe

1. Copy `content/templates/recipe-template.md`.
2. Fill frontmatter and method sections.
3. Save as `content/recipes/<slug>.md`.
4. Run checks:
   - `npm run lint`
   - `npx tsc --noEmit`
5. Run `npm run dev` and verify at `/recipes/<slug>`.

Detailed authoring guide:

- `content/templates/README.md`

## Adding Images

Store images under:

- `public/recipes/<slug>/...`

Reference in markdown:

```md
![Alt text](/recipes/<slug>/step-1.jpg)
```

Tip:

- The markdown path must match the real file path exactly.
- Keep the image folder slug aligned with the markdown filename slug.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

## Project Structure

```text
content/
  recipes/
  templates/
public/
  recipes/
src/
  app/
  components/
  lib/
  types/
```
