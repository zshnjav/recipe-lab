# Agent Instructions — recipe-lab

## Project Goal
This is a personal recipe blog site designed to be:
- Fast (static-first)
- Low-friction to maintain
- Easy to share publicly
- Built as a learning project for OpenAI Codex + GitHub + Vercel

Primary use case:
Store and search recipes I’ve cooked and want to remake.

---

## Tech Stack (Do Not Change Without Asking)
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel via GitHub auto-deploy

No backend services unless explicitly requested.

---

## Content Architecture
Recipes are stored as individual Markdown files:

/content/recipes/*.md

Each recipe uses frontmatter:

- title: string
- date: YYYY-MM-DD
- description: string
- tags: string[]
- prepMinutes: number
- cookMinutes: number
- totalMinutes: number
- servings: number
- ingredients: string[] (plain text lines)

Markdown body contains steps + notes.

---

## MVP Pages
- /            Home with search + recent recipes
- /recipes     All recipes list with filters/tags
- /recipes/[slug]  Recipe detail page
- /tags/[tag]  Tag browsing

---

## Features Allowed (Tier 1 + Tier 2 Only)

### Tier 1 (Core)
- Full-text search (title + ingredients + tags)
- Tag filtering
- Clean recipe detail layout

### Tier 2 (Fun but lightweight)
- Favorites (“Make again”) stored in localStorage
- Random recipe button
- Pantry mode (ingredient keyword matching)
- Shopping list builder (copy/paste)
- Servings scaler (basic multiplier)

---

## Explicit Non-Goals (Avoid Bloat)
Do NOT add:
- User accounts or authentication
- Databases
- Comments or ratings
- Full CMS admin panels
- Heavy UI libraries unless necessary

Keep it simple and readable.

---

## Development Rules
- Prefer small, incremental changes
- After each task:
  1. Run locally (`npm run dev`)
  2. Ensure no TypeScript errors
  3. Keep code minimal and understandable
- Do not refactor unrelated code
- Ask before introducing new dependencies

---

## Git Workflow
Work in small commits:
- feature branches for major work
- push frequently so Vercel previews can be used
