# Agent context: lirantal.com (Astro blog)

This file is for **coding agents** (Cursor, Copilot, etc.): project facts, conventions, and where to change things. Read it before editing layout, navigation, or content.

## What this repo is

Static **Astro 6.x** site for **Liran Tal** — personal homepage plus blog. Production URL: `https://lirantal.com` (`SITE.origin` in `src/config.mjs`). **Node.js 24+** is required (`package.json` `engines`); Vercel uses `NODE_VERSION` in `vercel.json`.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Astro 6, Vite 7, `output: 'static'`, **`@astrojs/vercel`** (default adapter; no `middlewareMode: 'edge'`), `trailingSlash: 'never'` (**`_` prefix segments under `pages/` are not public routes**) |
| Styling | **Tailwind CSS 4** via **`@tailwindcss/vite`** in `astro.config.mjs` (no `@astrojs/tailwind`), **`@tailwindcss/typography`**, **Flowbite 4** (`@import "flowbite/src/themes/default"`, `@plugin "flowbite/plugin"`, `@source` in `src/assets/styles/base.css`) |
| Content | Markdown/MDX under `data/blog/` |
| Images (build pipeline) | Built-in **`astro:assets`** (Sharp via `image.service` in `astro.config.mjs`), `Picture.astro` wrapper |
| Search | Pagefind (`npm run postbuild`: **`dist/client/`** when the build is server-like, else **`dist/`**) |
| Optional islands | Solid (`@astrojs/solid-js`), e.g. recognitions changelog |
| Analytics | Vercel Analytics (`@vercel/analytics/astro` in `VercelAnalytics.astro`) + GA via `@astrolib/analytics` in `MetaTags` |
| Icons | `astro-icon` v1 + Iconify (`@iconify-json/*`); import `{ Icon } from 'astro-icon/components'` |
| MDX embeds | `astro-embed` integration in `astro.config.mjs` (`embed()` before `mdx()`) |
| Aliases | `~` → `src/` (see `astro.config.mjs` → `vite.resolve.alias`) |
| TypeScript / lint | **TypeScript 6**, **ESLint 10** flat config (`eslint.config.mjs`; ignores `dist/`, `.vercel/`, `.astro/`, etc.) |

**Commands:** `npm run dev` (dev server **port 3001**), `npm run build`, `npm run postbuild` (Pagefind), `npm run preview`. Format: `npm run format`. Lint: `npm run lint` (same as `npm run lint:eslint`).

**npm:** `.npmrc` sets `legacy-peer-deps=true` because **`@astrolib/analytics`** peer range does not yet list Astro 6; installs are still valid. Prefer Node 24 locally (devcontainer image is `typescript-node:24`).

**Tailwind theme:** `tailwind.config.mjs` at repo root extends `primary` / `secondary` palettes, Inter `fontFamily`, and prose `typography()` tweaks. Global entry CSS is **`src/assets/styles/base.css`** (imported from `BaseLayout.astro`).

## Global configuration

- **`src/config.mjs`** — `SITE` (name, title, description, origin, base path), `BLOG` (paths, posts per page), `PROFILE` (social URLs), `FOOTER` (link columns). Prefer editing this for site-wide strings and footer links rather than hardcoding in components.
- **`src/utils/permalinks.js`** — URL helpers: `getPermalink`, `getBlogPermalink`, `getHomePermalink`, `getCanonical`. Blog routes are derived from `BLOG.blog.pathname`, `BLOG.post.pathname`, `BLOG.tag.pathname`, `BLOG.category.pathname` (all under `config.mjs` → currently `blog`, `blog`, `tag`, `category`).

## Layout hierarchy

1. **`src/layouts/BaseLayout.astro`** — HTML shell, `MetaTags`, Pagefind CSS/JS, global `base.css`.
2. **`src/layouts/PageLayout.astro`** — BaseLayout + `Header` + `<main>` + `Footer`. Use for most marketing pages and blog **posts**.
3. **`src/layouts/BlogLayout.astro`** — PageLayout + centered page title slot (`<slot name="title" />`). Used for blog index, tag, and category listing pages.

**Design tokens:** Tailwind `primary` (blue) and `secondary` (pink), dark mode via `class` on `<html>`, heading font `font-heading` / **Inter** from `@fontsource/inter` (see `Fonts.astro`, `tailwind.config.cjs`).

## Blog: how it works

### Source location and loading

- Posts live in **`data/blog/**/*.md`** and **`data/blog/**/*.mdx`** (including `data/blog/archives/` for older imports).
- **`src/utils/posts.js`** loads them with `import.meta.glob('../../data/blog/**/*.{md,mdx}', { eager: true })` (paths relative to that file under `src/utils/`), sorts by **`pubDate`** descending, and **drops posts with `draft: true`** from the public site, RSS, and listings. Each module exposes **`frontmatter`** and **`Content`** (use `<Content />` in `.astro` after assigning to a capitalized variable).

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
| RSS | `src/pages/rss.xml.js` — **`export async function GET`**, `@astrojs/rss` v4; items use title/description/pubDate (full HTML body not inlined) |

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
- Embeds: `astro-embed` is installed and wired via **`embed()`** in `astro.config.mjs` (must run **before** `mdx()`). Use patterns from archive MDX (e.g. `Tweet` from `astro-embed`).

## Data files

- **`src/data/recognitions.json`** — used by recognition-related UI where imported.

## Agents readiness (HTTP discovery)

This overlaps with what some call **agentic SEO**: signals that help automated clients (agents, scanners) find machine-readable and human-oriented documentation without scraping HTML. It is separate from traditional HTML meta and sitemaps.

Normative references: [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) (Web Linking), [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) (api-catalog well-known URI and catalog document), [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264) (`application/linkset+json`).

### Requirements

- **Homepage `Link` header (production).** A `GET /` response on `SITE.origin` must include an HTTP **`Link`** header with **registered** relation types where applicable: at minimum **`api-catalog`**, **`describedby`**, **`service-desc`**, and **`service-doc`** ([RFC 9727 Section 3](https://www.rfc-editor.org/rfc/rfc9727#section-3), [IANA link relations](https://www.iana.org/assignments/link-relations/)). Targets should be path-absolute URIs in the header (e.g. `</.well-known/api-catalog>; rel="api-catalog"`).
- **API catalog URL and media type.** `GET /.well-known/api-catalog` must return **200** and **`Content-Type: application/linkset+json`** with the RFC 9727 **profile** parameter `profile="https://www.rfc-editor.org/info/rfc9727"` ([RFC 9727 Section 4.2](https://www.rfc-editor.org/rfc/rfc9727#section-4.2), [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264)). The catalog file in the repo has **no filename extension** so Vercel can set this type via **`vercel.json`**; do not rename it to `.json` without adjusting headers.
- **Catalog body (linkset).** The JSON must contain a top-level **`linkset`** array. Each listed “API” for this site is modeled in [RFC 9727 Appendix A.1](https://www.rfc-editor.org/rfc/rfc9727#appendix-A) style: an **`anchor`** URL (here the public **RSS** feed), **`service-desc`** (machine-oriented description of that surface; we use the RSS URL and `application/rss+xml`), **`service-doc`** (human-oriented docs; we use `/docs/agents.md`), and **`status`** (health / liveness; we use **`/health.json`** with `application/json`). Validators such as [isitagentready.com — API catalog skill](https://isitagentready.com/.well-known/agent-skills/api-catalog/SKILL.md) expect this shape for automated discovery checks.
- **Health endpoint.** **`public/health.json`** must remain deployed at **`/health.json`** so the catalog’s **`status`** link resolves (minimal JSON body, e.g. `{"status":"ok"}`).
- **`describedby` and `service-doc` targets.** **`public/.well-known/site-for-agents.json`** and **`public/docs/agents.md`** must stay consistent with the homepage **`Link`** header targets and with what the catalog describes.
- **robots.txt and Content Signals.** **`GET /robots.txt`** must be served from **`public/robots.txt`** (copied into the build output: **`dist/client/`** when a server-like build is used, otherwise **`dist/`**). Under **`User-agent: *`**, include a **`Content-Signal:`** line that declares **`ai-train`**, **`search`**, and **`ai-input`** explicitly ([Content Signals](https://contentsignals.org/), [IETF draft](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/)). Current site-wide policy: **`Content-Signal: ai-train=no, search=yes, ai-input=no`** (classic search indexing allowed; no permission for model training or for AI input such as RAG / grounding / generative search answers). Do not drop this line when editing crawl rules or the sitemap URL. Validator reference: [isitagentready.com — Content Signals skill](https://isitagentready.com/.well-known/agent-skills/content-signals/SKILL.md).
- **Markdown for agents (`Accept: text/markdown`).** This repo **does not** implement Markdown content negotiation on the live **Vercel** static deployment. Prior attempts (Astro **`src/middleware.ts`** + **`middlewareMode: 'edge'`**, Turndown, on-demand shim routes, **`prerender: false`** on the homepage) hit adapter limits ([withastro/astro#10536](https://github.com/withastro/astro/issues/10536): middleware does not run for prerendered pages), **SSR-only `/` caused production 404**, and on-demand API paths returned **500**. Agents and scanners should treat HTML pages as **HTML** only unless you add a **different** layer (e.g. platform-native edge middleware outside Astro, or a host that negotiates Markdown without breaking static routing). Normative background: [HTTP negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation), [Cloudflare: Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/), [isitagentready — markdown negotiation skill](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md).

### How this site implements it

| Piece | Role |
|--------|------|
| **`vercel.json`** → `headers` for `"/"` | Injects a single comma-separated **`Link`** header on the homepage only (Vercel edge). |
| **`vercel.json`** → `headers` for `"/.well-known/api-catalog"` | Sets **`Content-Type: application/linkset+json`** with the RFC 9727 **profile** so the catalog document matches [RFC 9727 Section 4.2](https://www.rfc-editor.org/rfc/rfc9727#section-4.2). |
| **`public/.well-known/api-catalog`** | **API catalog** (linkset JSON): one entry anchored at the production **RSS** URL with **`service-desc`**, **`service-doc`**, and **`status`** per Appendix A.1. Copied into the build output (**`dist/client/`** or **`dist/`** depending on build mode) at build time. |
| **`public/health.json`** | **Status** target for the catalog entry (`GET /health.json` → static liveness JSON). |
| **`public/.well-known/site-for-agents.json`** | **`describedby`** target: short JSON with site name, RSS, sitemap, repo, and pointers to this file and the catalog. |
| **`public/docs/agents.md`** | **`service-doc`** target: human-readable stub that points agents at **this `AGENTS.md`** in the repo. |
| **`public/robots.txt`** | **`robots.txt`**: **`Allow`**, **`Sitemap`**, and **`Content-Signal`** under **`User-agent: *`** for crawler and AI-usage preferences. |

The **`Link`** header currently advertises: **`api-catalog`** → `/.well-known/api-catalog`, **`describedby`** → `/.well-known/site-for-agents.json`, **`service-desc`** → `/rss.xml`, **`service-doc`** → `/docs/agents.md`.

### Expectations

- **After a Vercel deploy**, third-party scans (e.g. `POST https://isitagentready.com/api/scan` with `{"url":"https://lirantal.com"}`) should report **`checks.discoverability.linkHeaders`** as **pass** (homepage **`Link`** relations present), **`checks.discovery.apiCatalog`** as **pass** (catalog URL, content-type, and **`linkset`** structure), and **`checks.botAccessControl.contentSignals`** as **pass** (**`Content-Signal`** declares **`ai-train`**, **`search`**, and **`ai-input`** on **`robots.txt`**). **`checks.contentAccessibility.markdownNegotiation`** may **fail** or **warn**: Markdown negotiation is **not** implemented on this stack (see requirement bullet above).
- **`GET /health.json`** in production should return **200** and **`application/json`** with a small JSON body suitable for liveness checks.
- **Local dev** (`npm run dev`, `astro preview`) does **not** apply **`vercel.json`** headers; use **`vercel dev`** or production for an environment that matches deployed edge headers.
- If **`SITE.origin`** in **`src/config.mjs`** ever changes, update **absolute `https://` URLs** inside **`public/.well-known/api-catalog`** (and any other hardcoded origin strings in **`site-for-agents.json`**) so anchors and `href` values stay aligned with production.

## Checklist: new blog post

1. Add **`data/blog/YYYY-MM-DD.md`** (or `YYYY-MM-DD_short-title.md`).
2. Fill frontmatter; set **`draft: false`** to publish.
3. Add cover asset under **`src/assets/images/blog/`** and set **`image: ~/assets/images/blog/...`**.
4. Add inline images to **`public/images/blog/`**; reference as **`/images/blog/filename.png`**.
5. Run **`npm run build`** locally to confirm Pagefind (**`postbuild`** uses **`dist/client/`** or **`dist/`** automatically) and paths (optional: `npm run dev`).
6. Optionally update **`HighlightedPosts.astro`** slugs for the homepage.

## Conventions for agents

- Match existing **Tailwind** and **component** patterns; prefer **`PageLayout`** + widgets over one-off full HTML pages.
- Prefer **`config.mjs`** for site name, URLs, and footer columns.
- Do not rely on drafts appearing on the site — they are filtered in **`posts.js`**.
- Keep **slug** stable after publish (URLs and external links).
