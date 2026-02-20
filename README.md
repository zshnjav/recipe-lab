# Recipe Lab

Personal recipe blog built with Next.js, TypeScript, and Tailwind CSS.

The site is static-first and markdown-driven: recipes live in `content/recipes/*.md`.

## Beginner Notes

- You do not need to know React deeply to add recipes. Most of your work is just editing markdown files.
- Think of `content/recipes` as your "database". Every `.md` file there becomes a real recipe page.
- `frontmatter` means the YAML block between `---` lines at the top of each recipe.
- If the site does not load, run `npm run lint` first to catch formatting/schema mistakes quickly.
- Keep slug filenames simple and lowercase (example: `beef-fried-rice.md`).
- When in doubt, copy `content/templates/recipe-template.md` and only replace values.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel via GitHub

## Current Features

- Home page with:
  - search across title, tags, and ingredients
  - random recipe button
  - 6 random tag pills + `Browse by tags`
  - recent recipe cards
- `/recipes` archive page with search + tag filters
- `/recipes/[slug]` detail page with:
  - structured ingredients panel
  - servings scaler
  - shopping list copy
  - method sections (`Prep (Mise-en-Place)` + `Execution`)
  - related recipes
- `/tags` index page
- `/tags/[tag]` filtered tag page
- Automatic `quick` tag when `totalMinutes <= 30`

## Recipe Content Model

Each recipe file uses frontmatter + markdown body.

Frontmatter = metadata used by the app for cards, tags, filtering, and timings.

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

- Each ingredient needs at least one measurement (`amount` or `grams`).
- If both are provided, both are shown and scaled.
- Common units scale using kitchen-style fractions.
- Grams scale and display as whole numbers.
- `quick` is added automatically if `totalMinutes` is 30 or less.

## Method Body Format

Use this structure in the markdown body:

```md
## Prep (Mise-en-Place)
1. ...

## Execution
1. ...
```

Legacy method markdown still renders, but new recipes should follow this structure.

Plain-English meaning:

- `Prep (Mise-en-Place)` = all setup work before heat (chopping, mixing, measuring).
- `Execution` = actual cooking steps.

## Adding a New Recipe (Low-Friction Workflow)

1. Copy `content/templates/recipe-template.md`
2. Fill in frontmatter and method sections
3. Save as `content/recipes/<slug>.md`
4. Run `npm run dev` and verify at `/recipes/<slug>`

Detailed authoring instructions:

- `content/templates/README.md`

## Adding Images

Store images under:

- `public/recipes/<slug>/...`

Reference in markdown:

```md
![Alt text](/recipes/<slug>/step-1.jpg)
```

Beginner tip:

- The file path in markdown must match the real file path exactly.
- Good pattern: folder name and markdown slug should be identical.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

What these do:

- `npm run dev`: starts local development server (usually `http://localhost:3000`).
- `npm run build`: checks production build.
- `npm run start`: runs production build locally after building.
- `npm run lint`: catches code/style issues early.

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
