# Recipe Lab - Project Architecture

## 1. Purpose

Recipe Lab is a static-first personal recipe archive focused on repeatability:
- recipes are authored in markdown
- pages are generated through Next.js App Router
- search and filtering are optimized for quick retrieval

This document explains architecture from content and runtime behavior through build and deployment.

---

## 2. High-Level System Overview

### Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4 + global CSS design tokens
- Content source: markdown files in `content/recipes/*.md`
- Deployment: GitHub -> Vercel

### Architectural Style
- Static-first rendering for content pages
- File-based content management (no database)
- Server components for page composition and content loading
- Client components for interactive UI (search, filters, random recipe, copy actions)

---

## 3. Directory Layout

```text
content/
  recipes/                 # Recipe markdown files (source of truth)
  templates/               # Authoring templates and docs
docs/
  PROJECT_ARCHITECTURE.md  # This document
public/
  recipes/                 # Optional recipe images
src/
  app/                     # App Router pages/layout
  components/              # UI modules (browser, cards, ingredients, method)
  lib/                     # Content parsing + validation
  types/                   # Shared TypeScript types
```

---

## 4. Content and Data Architecture

## 4.1 Recipe Source of Truth

Each recipe is a markdown file in `content/recipes`.
- filename (without `.md`) is the route slug
- frontmatter contains structured metadata
- markdown body stores method instructions

## 4.2 Validation Pipeline

`src/lib/recipes.ts` handles:
- frontmatter parsing via `gray-matter`
- schema validation (required fields, numeric checks, arrays)
- ingredient validation (must include `amount` or `grams`)
- legacy ingredient string parsing fallback
- auto-addition of `quick` tag when `totalMinutes <= 30`

## 4.3 Type System

Shared models in `src/types/recipe.ts`:
- `RecipeIngredient`
- `RecipeFrontmatter`
- `RecipeSummary`
- `Recipe`

---

## 5. Routing and Functional Responsibilities

## 5.1 Top-Level Routes

- `/` Home
  - hero module
  - quick search + random recipe
  - recent recipe cards

- `/recipes` Browse
  - full search console
  - advanced tag filtering with URL-synced tag state (`?tags=...`)
  - random recipe action

- `/recipes/[slug]` Recipe detail
  - recipe metadata/spec panel
  - servings scaler
  - copy shopping list
  - copy full recipe
  - method rendering

- `/about`
  - project context (why / how / philosophy)

- `/tags`
  - redirects to `/recipes`

- `/tags/[tag]`
  - legacy route support
  - validates tag and redirects to `/recipes?tags=<tag>`

## 5.2 Layout-Level Composition

`src/app/layout.tsx` provides:
- top nav: Home | Browse | About
- global footer on all pages

---

## 6. UI Component Architecture

## 6.1 `RecipeBrowser` (`src/components/recipe-browser.tsx`)

Primary interactive module for home and browse contexts:
- query search over title, description, tags, and ingredients
- random recipe dice action
- advanced selected-tag filtering (browse page)
- URL synchronization for selected tags through `useSearchParams` + `router.replace`
- sort mode for browse results

Notes:
- rendered inside `Suspense` on pages that use it (`/` and `/recipes`) to satisfy Next.js requirements for `useSearchParams`

## 6.2 `RecipeCard` (`src/components/recipe-card.tsx`)

Displays recipe summary cards and tag chips.
- tag click behavior routes to `/recipes?tags=...`
- on browse page, clicking a card tag appends to current selected tags

## 6.3 `RecipeIngredientsPanel` (`src/components/recipe-ingredients-panel.tsx`)

Handles ingredient scaling and clipboard actions.
- servings +/- controls adjust ingredient quantities
- "Copy shopping list" includes recipe title + scaled ingredients
- "Copy full recipe" includes title, description, timing, servings, ingredients, and method

## 6.4 `RecipeMethod` (`src/components/recipe-method.tsx`)

Renders markdown method body and supports current section format:
- `Prep (Mise-en-Place)`
- `Execution`

---

## 7. State and URL Strategy

### Server-side state
- markdown content loaded and parsed by `src/lib/recipes.ts`
- pages receive prepared recipe objects from library functions

### Client-side state
- local UI state in components (`useState`, `useMemo`)
- advanced browse selected tags are URL-driven (`tags` query parameter)

### Why URL-driven tags
- deep-linkable filtered views
- back/forward browser navigation consistency
- consistent behavior when coming from Home, Recipe detail, or legacy tag URLs

---

## 8. Styling System

Global design tokens and module styles in `src/app/globals.css`:
- warm background and muted neutrals
- dark navy "console-panel" modules
- amber accent/focus states
- reusable chip and card styling

Design intent:
- technical-manual visual language
- restrained, high-contrast structure
- consistent spacing, borders, and radii

---

## 9. Build and Deployment Lifecycle

## 9.1 Local Development

```bash
npm run dev
```

Runs Next.js dev server (hot reload).

## 9.2 Quality Gates

```bash
npm run lint
npx tsc --noEmit
```

Recommended before commit and push.

## 9.3 Production Build

```bash
npm run build
```

Compiles app for production and validates static generation paths.

## 9.4 Deployment Flow

1. Commit changes to Git branch
2. Push to GitHub
3. Vercel pulls branch and runs:
   - dependency install
   - `npm run build`
4. On success:
   - preview deploy for branch/PR
   - production deploy when merged/promoted (depending on Vercel setup)

---

## 10. Operational Notes and Gotchas

- Client hooks like `useSearchParams` must be inside a Suspense boundary when used in prerendered routes.
- Legacy `/tags/[tag]` pages now redirect; they are compatibility entry points, not independent browsing UIs.
- Content schema mistakes in frontmatter can fail route generation; validation errors originate in `src/lib/recipes.ts`.
- Clipboard actions require browser clipboard support.

---

## 11. Build-to-Function Trace (Quick Reference)

1. Author recipe markdown in `content/recipes`
2. `lib/recipes.ts` validates and parses content
3. App Router pages request summaries/details
4. Interactive client modules apply search/filter/copy behavior
5. Build compiles and prerenders pages
6. Vercel deploys from GitHub commit

This flow keeps authoring lightweight while preserving a structured, predictable runtime.
