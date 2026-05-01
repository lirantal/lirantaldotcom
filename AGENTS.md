# Agent context: lirantal.com (Astro blog)

This file is for **coding agents** (Cursor, Copilot, etc.): project facts, conventions, and where to change things. Read it before editing layout, navigation, or content.

## What this repo is

Static **Astro 1.x** site for **Liran Tal** — personal homepage plus blog. Production URL: `https://lirantal.com` (`SITE.origin` in `src/config.mjs`).

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Astro 1.9, `output: 'static'`, `trailingSlash: 'never'` |
| Styling | Tailwind 3, `@tailwindcss/typography`, Flowbite |
| Content | Markdown/MDX under `data/blog/` |
| Images (build pipeline) | `@astrojs/image` + Sharp, `Picture.astro` wrapper |
| Search | Pagefind (`npm run postbuild` indexes `dist/`) |
| Optional islands | Solid (`@astrojs/solid-js`), e.g. recognitions changelog |
| Analytics | Vercel Analytics (+ legacy hooks in MetaTags) |
| Aliases | `~` → `src/` (see `astro.config.mjs` → `vite.resolve.alias`) |

**Commands:** `npm run dev` (dev server **port 3001**), `npm run build`, `npm run preview`. Format: `npm run format`. Lint: `npm run lint:eslint`.

## Global configuration

- **`src/config.mjs`** — `SITE` (name, title, description, origin, base path), `BLOG` (paths, posts per page), `PROFILE` (social URLs), `FOOTER` (link columns). Prefer editing this for site-wide strings and footer links rather than hardcoding in components.
- **`src/utils/permalinks.js`** — URL helpers: `getPermalink`, `getBlogPermalink`, `getHomePermalink`, `getCanonical`. Blog routes are derived from `BLOG.blog.pathname`, `BLOG.post.pathname`, `BLOG.tag.pathname`, `BLOG.category.pathname` (all under `config.mjs` → currently `blog`, `blog`, `tag`, `category`).

## Layout hierarchy

1. **`src/layouts/BaseLayout.astro`** — HTML shell, `MetaTags`, Pagefind CSS/JS, global `base.css`.
2. **`src/layouts/PageLayout.astro`** — BaseLayout + `Header` + `<main>` + `Footer`. Use for most marketing pages and blog **posts**.
3. **`src/layouts/BlogLayout.astro`** — PageLayout + centered page title slot (`<slot name="title" />`). Used for blog index, tag, and category listing pages.

**Design tokens:** Tailwind `primary` (blue) and `secondary` (pink), dark mode via `class` on `<html>`, heading font `font-heading` / Inter (see `Fonts.astro`, `tailwind.config.cjs`).

## Blog: how it works

### Source location and loading

- Posts live in **`data/blog/**/*.md`** and **`data/blog/**/*.mdx`** (including `data/blog/archives/` for older imports).
- **`src/utils/posts.js`** loads them with `import.meta.glob`, sorts by **`pubDate`** descending, and **drops posts with `draft: true`** from the public site, RSS, and listings.

### Post identity and URLs

- **`id`** = filename without extension (e.g. `2025-10-15`).
- **`slug`** = frontmatter `slug` if set, otherwise same as `id`.
- **Post URL:** `/blog/<slug>` (from `[...blog]/[slug].astro` + `POST_BASE`).

### Frontmatter (typical)

Use a published post such as `data/blog/2025-10-15.md` as a template. Commonly:

- `title`, `description` (SEO + cards)
- `pubDate` (and often `date` — mirror for consistency)
- `draft: false` to publish
- `tags: ["tag-one", "tag-two"]` — drives `/tag/...` archives; **use lowercase** in YAML so tag pages match filters reliably
- `slug` — stable, URL-safe string
- `image` — **see images section below**
- Optional: `category` (string) for `/category/...` archives, `canonical` for syndication URLs, `excerpt` for teasers

**Reading time:** injected automatically by **`src/utils/remark-frontmatter-extensions.mjs`** (`readingTime` text, e.g. `3 min read`); do not set manually.

### Images — two different places

| Use case | Where to put the file | How to reference |
|----------|------------------------|------------------|
| **Cover / OG / list / hero** on post (frontmatter `image`) | **`src/assets/images/blog/`** | `image: ~/assets/images/blog/your-file.jpg` (must start with `~/assets` — required by **`src/utils/images.js`** → `findImage()`) |
| **Inline markdown** (body screenshots, diagrams) | **`public/images/blog/`** | `![alt](/images/blog/your-file.png)` |

Remote URLs in frontmatter `image` are supported if they start with `http://` or `https://`.

**Homepage “From the blog” cards:** `src/components/blog/HighlightedPosts.astro` lists explicit **`slug`s**; update that file if you want different featured posts.

### Blog routes (files)

| Route | File |
|-------|------|
| Paginated index | `src/pages/[...blog]/[...page].astro` |
| Single post | `src/pages/[...blog]/[slug].astro` |
| Tag archive | `src/pages/[...tags]/[tag]/[...page].astro` |
| Category archive | `src/pages/[...categories]/[category]/[...page].astro` |
| RSS | `src/pages/rss.xml.js` |

Post page layout: **`SinglePost.astro`** (title, tags, share, cover `Picture`, MDX/Markdown body with `prose` classes). Book promo: `BooksHeroEmbed` below the post.

## Non-blog pages (inventory)

| Path | Source | Notes |
|------|--------|--------|
| `/` | `src/pages/index.astro` | `PageLayout`: **ProfileHero** (bio / “about”), **Features**, **HighlightedPosts** |
| `/recognitions` | `src/pages/recognitions.astro` | `RecognitionAwards` + **Solid** `Changelog` (`client:visible`) |
| `/books/nodejs-secure-coding` | `src/pages/books/nodejs-secure-coding.astro` | Long book landing; book covers from `~/assets/images/book-cover-*` |
| `/games/chatgpt-chat-meme-generator` | `src/pages/games/...` | iframe embed |
| `/games/chatgpt-security-models-ui` | `src/pages/games/...` | iframe embed |
| `/rss.xml` | `src/pages/rss.xml.js` | Feed from `fetchPosts()` |
| 404 | `src/pages/404.astro` | |

There is **no separate `/about` route**; the main bio lives in **`ProfileHero.astro`**.

## Navigation and footer

- **Header:** `src/components/widgets/Header.astro` — logo → home, links to book page and blog; theme toggle; Twitter/GitHub from `PROFILE`.
- **Footer:** `src/components/widgets/Footer.astro` — “Recognitions” link, columns from **`FOOTER`** in `config.mjs`, RSS icon.

Adding a **new top-level page**: create `src/pages/<name>.astro` (or a folder with `index.astro`), use **`PageLayout`** with a `meta` object (`title`, `description`, `canonical` via `getCanonical(...)`), then **add a link in `Header.astro` and/or `Footer.astro` / `config.mjs`** as appropriate.

## Markdown / MDX

- Shiki theme: **github-dark**, wrap enabled (`astro.config.mjs`).
- MDX enabled for `.mdx` posts.
- Embeds: `astro-embed` is a dependency (use where already patterned in posts).

## Data files

- **`src/data/recognitions.json`** — used by recognition-related UI where imported.

## Agents readiness (HTTP discovery)

This overlaps with what some call **agentic SEO**: signals that help automated clients (agents, scanners) find machine-readable and human-oriented documentation without scraping HTML. It is separate from traditional HTML meta and sitemaps.

### Requirement

The **production homepage** response (`GET /` on `SITE.origin`) should expose at least one HTTP **`Link`** header ([RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)) whose targets use **registered link relation types** where applicable—for example `api-catalog`, `describedby`, `service-desc`, and `service-doc` ([RFC 9727 §3](https://www.rfc-editor.org/rfc/rfc9727#section-3), [IANA link relations](https://www.iana.org/assignments/link-relations/)).

### How this site implements it

| Piece | Role |
|--------|------|
| **`vercel.json`** → `headers` for `"/"` | Injects a single comma-separated **`Link`** header on the homepage only (Vercel edge). |
| **`vercel.json`** → `headers` for `"/.well-known/api-catalog"` | Sets **`Content-Type: application/linkset+json`** with the RFC 9727 **profile** so the catalog document matches [RFC 9727 §4.2](https://www.rfc-editor.org/rfc/rfc9727#section-4.2). |
| **`public/.well-known/api-catalog`** | **API catalog** (linkset JSON): lists the public **RSS** URL as the main machine-oriented surface and ties **`service-desc`** / **`service-doc`** to that anchor. Copied to **`dist/`** at build time. |
| **`public/.well-known/site-for-agents.json`** | **`describedby`** target: short JSON with site name, RSS, sitemap, repo, and pointers to this file and the catalog. |
| **`public/docs/agents.md`** | **`service-doc`** target: human-readable stub that points agents at **this `AGENTS.md`** in the repo. |

The **`Link`** header currently advertises: **`api-catalog`** → `/.well-known/api-catalog`, **`describedby`** → `/.well-known/site-for-agents.json`, **`service-desc`** → `/rss.xml`, **`service-doc`** → `/docs/agents.md`.

### Expected results

- Third-party **discoverability** checks that look for homepage **`Link`** headers (for example [isitagentready.com](https://isitagentready.com/) → `POST /api/scan` with `{"url":"https://lirantal.com"}`) should report **`checks.discoverability.linkHeaders`** (or equivalent) as **pass** after a successful **Vercel** deploy. Those headers are **not** emitted by `npm run dev` or `astro preview`; use **`vercel dev`** or production to verify response headers.
- **`GET /.well-known/api-catalog`** should return **200** with **`Content-Type: application/linkset+json`** (including the RFC 9727 profile parameter) and a parseable **linkset** body.
- If **`SITE.origin`** in **`src/config.mjs`** ever changes, update **absolute `https://` URLs** inside **`public/.well-known/api-catalog`** (and any other hardcoded origin strings in **`site-for-agents.json`**) so they stay aligned with production.

## Checklist: new blog post

1. Add **`data/blog/YYYY-MM-DD.md`** (or `YYYY-MM-DD_short-title.md`).
2. Fill frontmatter; set **`draft: false`** to publish.
3. Add cover asset under **`src/assets/images/blog/`** and set **`image: ~/assets/images/blog/...`**.
4. Add inline images to **`public/images/blog/`**; reference as **`/images/blog/filename.png`**.
5. Run **`npm run build`** locally to confirm Pagefind and static paths (optional: `npm run dev`).
6. Optionally update **`HighlightedPosts.astro`** slugs for the homepage.

## Conventions for agents

- Match existing **Tailwind** and **component** patterns; prefer **`PageLayout`** + widgets over one-off full HTML pages.
- Prefer **`config.mjs`** for site name, URLs, and footer columns.
- Do not rely on drafts appearing on the site — they are filtered in **`posts.js`**.
- Keep **slug** stable after publish (URLs and external links).
