# Agent Instructions - recipe-lab

## Project Goal
Recipe Lab is a personal recipe blog built to be:
- Fast (static-first)
- Low-friction to maintain
- Easy to share publicly
- A practical learning project (Codex + GitHub + Vercel)

Primary use case:
- Store, search, and revisit recipes already cooked.

## Design Philosophy and Vision
- Build a calm, polished "digital console / technical manual" for repeatable cooking.
- Keep titles and instructions human-readable; present metadata/specs with technical clarity.
- Prefer modular sections, clear borders, consistent radii, and restrained depth.
- Use contrast intentionally: warm off-white surfaces, deep slate panels, amber for state/focus/action.
- Prioritize consistency and usability over decorative effects or novelty.
- Keep the product lightweight and practical: fast authoring, fast retrieval, and predictable behavior.

---

## Tech Stack (Do Not Change Without Asking)
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- GitHub + Vercel auto-deploy

Do not add backend services unless explicitly requested.

---

## Information Architecture (Current)
- `/` Home: overview + quick browsing + search + random tags
- `/recipes` Browse Recipes: main consolidated browse/search/filter/sort page
- `/recipes/[slug]` Recipe detail page
- `/tags/[tag]` Tag-specific page (legacy direct links still supported)
- `/tags` redirects to `/recipes`

---

## Content Architecture
Recipes are markdown files:
- `content/recipes/*.md`

Use frontmatter + markdown body.

### Required Frontmatter
- `title: string`
- `date: YYYY-MM-DD`
- `description: string`
- `tags: string[]`
- `prepMinutes: number`
- `cookMinutes: number`
- `totalMinutes: number`
- `servings: number`
- `ingredients: RecipeIngredient[]`

### Ingredient Schema (Current)
Each ingredient is structured:

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

Rules:
- Each ingredient must include at least one measurement: `amount` or `grams`.
- Both values scale with servings if present.
- Grams are displayed as whole numbers after scaling.

### Method Body Structure (Current Standard)
Use:

```md
## Prep (Mise-en-Place)
1. ...

## Execution
1. ...
```

Legacy markdown still has fallback rendering, but new recipes should follow this structure.

---

## Publishing Workflow (Important)
Use the template workflow for low-friction publishing:

1. Copy `content/templates/recipe-template.md`
2. Fill frontmatter and method sections
3. Save as `content/recipes/<slug>.md`
4. Run local checks (`npm run lint`, `npx tsc --noEmit`)
5. Verify in browser via `npm run dev`
6. Commit and push (Vercel preview deploy runs from GitHub)

Detailed authoring guidance:
- `content/templates/README.md`

---

## Images in Recipes
Store images in:
- `public/recipes/<slug>/...`

Reference in markdown body:

```md
![Alt text](/recipes/<slug>/step-1.jpg)
```

Keep slug folder names consistent with markdown filename slug.

---

## Feature Scope
Keep implementation lightweight and maintainable.

### Core
- Full-text search (title + ingredients + tags)
- Tag filtering
- Clean recipe detail layout

### Lightweight extras
- Random recipe button
- Shopping list builder (copy/paste)
- Servings scaler

Notes:
- `quick` tag is auto-added when `totalMinutes <= 30`.
- Do not re-introduce removed features unless requested.

---

## Explicit Non-Goals
Do not add:
- User accounts/auth
- Databases
- Comments/ratings
- Heavy CMS/admin systems
- Heavy UI libraries unless necessary

---

## Development Rules
- Prefer small, incremental changes.
- Keep code readable and minimal.
- Do not refactor unrelated code.
- Ask before introducing dependencies.

Validation after each task:
1. `npm run dev` (or confirm runtime path)
2. `npm run lint`
3. `npx tsc --noEmit`

---

## Deploy + Git Workflow
- Work in small commits.
- Use feature branches for major work.
- Push frequently to use Vercel previews.
- Default flow:
  1. Branch
  2. Implement
  3. Validate
  4. Commit
  5. Push
  6. Review preview
