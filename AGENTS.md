# Agent context: lirantal.com (Astro blog)

This file is for **coding agents** (Cursor, Copilot, etc.): project facts, conventions, and where to change things. Read it before editing layout, navigation, or content.

## Design guidance

Read **[docs/DESIGN.md](docs/DESIGN.md)** before changing layout, shared colors, or portfolio content. It records the owner-approved editorial direction, component patterns, palette, rationale, and visual-review lessons from PR #12. Keep detailed design decisions there; update it when a later review changes them.

- Preserve the restrained **Inter / blue / neutral editorial style**, clear numbered section headings, and colored, underlined portfolio text links.
- Keep the homepage bio short. Group the DevRel line, internal actions, and recognition badges together; keep social logos in one row under the portrait. The full bio belongs in the speaking press kit.
- **Light is the default**, regardless of OS preference. Honor an explicit saved dark-mode choice. The approved **soft-black** palette uses shared tokens in `base.css`, not independent per-page palettes.
- Verify content claims with sources: dated npm downloads are not unique users; arXiv entries are co-authored preprints, not automatically peer-reviewed papers.
- For visual changes, inspect rendered light/dark and responsive states. For shared theme or interaction changes, also check affected search, prose, focus, menu, and filter states. Build success alone does not verify appearance.

### Design reviews with the impeccable skill

The [impeccable](https://github.com/pbakaus/impeccable) design skill is installed with [apm](https://github.com/microsoft/apm) (`apm.yml` → `.agents/skills/impeccable`; restore with `apm install`). Agents load it as the `impeccable` skill and run its commands as `/impeccable <command> <target>`:

- **`critique <target>`**: design review (Nielsen heuristics, specificity, personas). Runs a design-review agent and a detector agent in isolation, then writes a report to `.impeccable/critique/` (tracked).
- **`audit <target>`**: technical checks (accessibility, performance, theming, responsive).
- **`polish <target>`**: refinement pass that preserves the incumbent design; it reads the latest critique report.

Start each session with `.agents/skills/impeccable/scripts/impeccable context --target <file>`; there is no `PRODUCT.md`, so it treats `docs/DESIGN.md` and the code as the brief. The deterministic detector is `.agents/skills/impeccable/scripts/impeccable detect --json <files-or-url>`; URL scans need a Chromium, e.g. `IMPECCABLE_BROWSER=$(ls -d ~/.agent-browser/browsers/chrome-*/chrome | head -1)` in an orb. Inter, the numbered headings, and eyebrow labels are owner-approved, so treat `overused-font` and `kicker-above-heading` findings as sanctioned rather than defects.

## What this repo is

Static **Astro 6.x** site for **Liran Tal** — personal homepage plus blog. Production URL: `https://lirantal.com` (`SITE.origin` in `src/config.mjs`). **Node.js 24+** is required (`package.json` `engines`); Vercel uses `NODE_VERSION` in `vercel.json`.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Astro 6, Vite 7, `output: 'static'`, **`@astrojs/vercel`** (default adapter; no `middlewareMode: 'edge'`), `trailingSlash: 'never'` (**`_` prefix segments under `pages/` are not public routes**) |
| Styling | **Tailwind CSS 4** via **`@tailwindcss/vite`** in `astro.config.mjs` (no `@astrojs/tailwind`); **`@config`** in `base.css` loads **`tailwind.config.mjs`** (theme colors, fonts, typography overrides); **`@tailwindcss/typography`** and **Flowbite 4** loaded via `@plugin` directives (`@import "flowbite/src/themes/default"`, `@plugin "flowbite/plugin"`, `@source` in `src/assets/styles/base.css`) |
| Content | Markdown/MDX under `data/blog/` |
| Images (build pipeline) | Built-in **`astro:assets`** (Sharp via `image.service` in `astro.config.mjs`), `Picture.astro` wrapper |
| Search | Pagefind: **`npm run build`** runs **`scripts/postbuild.sh`**, which indexes **`dist/client/`** or **`dist/`** then copies **`pagefind/`** into **`.vercel/output/static/`** when that folder exists (the Vercel adapter copies **`dist/`** before Pagefind runs, so this sync is required for live **`/pagefind/*`**). |
| Optional islands | Solid (`@astrojs/solid-js`), e.g. recognitions changelog |
| Analytics | Vercel Analytics (`@vercel/analytics/astro` in `VercelAnalytics.astro`) + optional GA via `@astrolib/analytics` in `MetaTags` when `SITE.googleAnalyticsId` is set (**no** `@astrojs/partytown`: it injected `~partytown/` URLs that crawlers requested as pages and saw **404** for virtual `partytown-sandbox-sw` scopes). Re-add Partytown only if you enable GA and want worker offload. |
| Icons | `astro-icon` v1 + Iconify (`@iconify-json/*`); import `{ Icon } from 'astro-icon/components'` |
| MDX embeds | `astro-embed` integration in `astro.config.mjs` (`embed()` before `mdx()`) |
| Aliases | `~` → `src/` (see `astro.config.mjs` → `vite.resolve.alias`) |
| TypeScript / lint | **TypeScript 6**, **ESLint 10** flat config (`eslint.config.mjs`; ignores `dist/`, `.vercel/`, `.astro/`, etc.) |

**Commands:** `npm run dev` (dev server **port 3001**), `npm run build` (runs **`astro build`** then **`scripts/postbuild.sh`** in one step—do not use bare **`astro build`** for production), `npm run postbuild` (Pagefind only, after a standalone **`astro build`**), `npm run preview`. **`vercel.json`** sets **`buildCommand`** to **`npm run build`**. Format: `npm run format`. Lint: `npm run lint` (same as `npm run lint:eslint`).

**npm:** `.npmrc` sets `legacy-peer-deps=true` because **`@astrolib/analytics`** peer range does not yet list Astro 6; installs are still valid. Prefer Node 24 locally (devcontainer image is `typescript-node:24`).

**Tailwind theme:** `tailwind.config.mjs` at repo root extends `primary` / `secondary` palettes, Inter `fontFamily`, and prose `typography()` tweaks. Global entry CSS is **`src/assets/styles/base.css`** (imported from `BaseLayout.astro`).

## Global configuration

- **`src/config.mjs`** — `SITE` (name, title, description, origin, base path), `BLOG` (paths, posts per page), `PROFILE` (social URLs), `FOOTER` (link columns). Prefer editing this for site-wide strings and footer links rather than hardcoding in components.
- **`src/utils/permalinks.js`** — URL helpers: `getPermalink`, `getBlogPermalink`, `getHomePermalink`, `getCanonical`. Blog routes are derived from `BLOG.blog.pathname`, `BLOG.post.pathname`, `BLOG.tag.pathname`, `BLOG.category.pathname` (all under `config.mjs` → currently `blog`, `blog`, `tag`, `category`).

## Layout hierarchy

1. **`src/layouts/BaseLayout.astro`** — HTML shell, `MetaTags`, theme script, skip link, global `base.css`. Pagefind CSS/JS load only from `PageFindSearch.astro` (pages that render search), and only post articles (`data-pagefind-body` in `SinglePost.astro`) are indexed.
2. **`src/layouts/PageLayout.astro`** — BaseLayout + `Header` + `<main>` + `Footer`. Use for most marketing pages and blog **posts**.
3. **`src/layouts/BlogLayout.astro`** — PageLayout + centered page title slot (`<slot name="title" />`). Used for blog index, tag, and category listing pages.

**Design tokens:** Tailwind `primary` (blue) and `secondary` (pink), variable **Inter** from `@fontsource-variable/inter` (see `Fonts.astro`, `fonts.css`, `tailwind.config.mjs`). Dark mode uses a `class` on `<html>`, with shared soft-black token overrides in `src/assets/styles/base.css`. Portfolio-specific layout and styling live in `src/assets/styles/portfolio.css`; palette values and usage are documented in `docs/DESIGN.md`.

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

**Large raster files:** run **`npm run blog:compress-images`** (Sharp: JPEG/PNG/WebP/GIF, resize + quality; tune with env vars in **`scripts/compress-large-blog-images.mjs`**). Ahrefs CSV exports are often **UTF-16**; pass the path as the first argument to only process **`/images/blog/*`** URLs from the file (sources under **`public/images/blog/`**). **`/_astro/*`** image URLs in reports are **built** assets from **`src/assets/images/blog/`**—compress sources, then **`npm run build`** so new hashed files deploy.

Remote URLs in frontmatter `image` are supported if they start with `http://` or `https://`.

**Homepage Blog & articles:** `src/pages/index.astro` shows the three most recent published posts from `fetchPosts()`. `/writing` (labeled **Blog**) shows eight local posts with their cover images when available, plus archive, RSS, and external publication links.

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
| `/` | `src/pages/index.astro` | Short **ProfileHero**, featured projects, speaking, Blog & articles, research, open source, books, and community quote |
| `/writing` | `src/pages/writing.astro` | Blog directory (labeled **Blog**), recent local posts, archive and RSS links, publication links, and selected external articles |
| `/speaking/press-kit` | `src/pages/speaking/press-kit.astro` | Short/full bios, downloadable bio and portrait, organizer details |
| `/recognitions` | `src/pages/recognitions.astro` | `RecognitionAwards` + **Solid** `Changelog` (`client:visible`) |
| `/books/nodejs-secure-coding` | `src/pages/books/nodejs-secure-coding.astro` | Long book landing; book covers from `~/assets/images/book-cover-*` |
| `/games/chatgpt-chat-meme-generator` | `src/pages/games/...` | iframe embed |
| `/games/chatgpt-security-models-ui` | `src/pages/games/...` | iframe embed |
| `/rss.xml` | `src/pages/rss.xml.js` | Feed from `fetchPosts()` |
| `/speaking` (+ `/talks`, `/talks/<slug>`, `/events`, `/events/<slug>`, `/recordings`, `/podcasts`) | `src/pages/speaking/**` | `SpeakingLayout` (sub-nav + invite CTA); see **Speaking pages** below |
| 404 | `src/pages/404.astro` | |

There is **no separate `/about` route**; the full bio lives in **`public/press/liran-tal-bio.txt`**, displayed and downloadable from the speaking press kit.

## Portfolio content

- **`src/data/portfolio.ts`** holds curated papers (with full co-author credits and arXiv IDs), projects, books, publications, external writing, and the short bio. These are selections, not exhaustive lists. Verify authorship and links before adding entries; arXiv papers are labeled preprints, not peer-reviewed publications.
- **`src/data/npm-downloads.json`** is a dated snapshot for five selected maintained packages. Counts come from `https://api.npmjs.org/downloads/point/<start>:<end>/<package>`. To refresh, fetch `last-month` for every listed package and replace all counts and both dates together, only when every response succeeds and covers the same window. The displayed total is computed from this file. It measures package downloads (including dependency installs), not people; no npm API calls happen during builds or page visits.
- **`src/assets/styles/portfolio.css`** scopes editorial styles to `.portfolio` on the homepage, Blog directory, and press kit. Existing blog and speaking layouts retain their styles.
- The local **`liran-tal-portrait.jpg`** comes from `https://github.com/lirantal.png`; **`path-traversal-book-cover-light.png`** comes from `https://www.nodejs-security.com/images/book/book-path-traversal-cover-light.png`. The **Code Injection** cover also comes from nodejs-security.com. Other covers and the stage photo reuse existing assets. Keep authentic cover art; the current shelf order and image treatment are documented in `docs/DESIGN.md`.

## Speaking pages

- **Data source:** `README.json` from [`lirantal/public-speaking`](https://github.com/lirantal/public-speaking) (generated by gigsboat). **`src/utils/speaking.js`** → `getSpeaking()` fetches `SPEAKING.dataURL` (`src/config.mjs`) once per build and falls back to the committed snapshot **`src/data/speaking.json`** if the fetch fails. Refresh the snapshot occasionally by downloading that URL over the file. Do not edit speaking data here; change it in the public-speaking repo.
- **Model:** each item becomes an **event** (`/speaking/events/<YYYY-MM-DD>-<name-slug>`). Conference, meetup, webinar and workshop items with the same normalized title are grouped into a **talk** (`/speaking/talks/<title-slug>`). Podcasts and articles are listed on `/speaking/podcasts`. Items with `status: opted-out` are dropped. "Upcoming" is computed at build time, so the schedule is only as fresh as the last deploy.
- **Freshness:** **`.github/workflows/sync-speaking-data.yml`** runs every 6 hours. When README.json `items` differ from the snapshot it commits the new `src/data/speaking.json` to `main`; when an upcoming event has passed since the latest commit it pushes an empty commit. Either push triggers the normal Vercel Git deploy (no deploy hooks or Vercel tokens).
- **Topics** are inferred from talk titles by the regexes in `TOPICS` (first match wins; the last entry is the catch-all). Adjust those rules to re-classify talks.
- **Components:** `src/components/speaking/*` (stats band, event rows, talk items, video cards, client-side `Filters` that read `data-filter-item` / `data-<name>` attributes and sync to the query string, e.g. `/speaking/events?type=workshop`).
- **Invite links** point at `SPEAKING.inviteURL` (LinkedIn) and `SPEAKING.inviteXURL` (X) in `src/config.mjs`.

## Navigation and footer

- **Header:** `src/components/widgets/Header.astro` — logo → home, links from `NAVIGATION` in `config.mjs`; theme toggle and GitHub. Research, Open source, and Books link to homepage sections; Blog links to the publication hub (with `/blog` archive access). Mobile navigation closes on selection or Escape.
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
- **Markdown for agents (`Accept: text/markdown`).** HTML remains the browser default, but production **Vercel output routes** serve generated Markdown when a request includes **`Accept: text/markdown`**. **`scripts/generate-markdown-pages.mjs`** converts built HTML pages into **`dist/_markdown/**/*.md`** during **`npm run build`** after Pagefind runs, copies those files into **`.vercel/output/static/_markdown`** through **`scripts/postbuild.sh`**, and patches **`.vercel/output/config.json`** with per-page routes before the filesystem handler. Markdown responses must include **`Content-Type: text/markdown; charset=utf-8`**, **`Vary: Accept`**, and an estimated **`x-markdown-tokens`** header. Do not replace this with Astro **`src/middleware.ts`** unless prerendered static routing has been retested; prior Astro middleware / SSR attempts broke Vercel static routing. Normative background: [HTTP negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Content_negotiation), [Cloudflare: Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/), [isitagentready — markdown negotiation skill](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md).

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
| **`scripts/generate-markdown-pages.mjs`** + **`.vercel/output/config.json`** | **Markdown negotiation**: built HTML pages are converted into hidden static Markdown files and returned from the original URL only when the request includes **`Accept: text/markdown`**. |

The **`Link`** header currently advertises: **`api-catalog`** → `/.well-known/api-catalog`, **`describedby`** → `/.well-known/site-for-agents.json`, **`service-desc`** → `/rss.xml`, **`service-doc`** → `/docs/agents.md`.

### Expectations

- **After a Vercel deploy**, third-party scans (e.g. `POST https://isitagentready.com/api/scan` with `{"url":"https://lirantal.com"}`) should report **`checks.discoverability.linkHeaders`** as **pass** (homepage **`Link`** relations present), **`checks.discovery.apiCatalog`** as **pass** (catalog URL, content-type, and **`linkset`** structure), **`checks.botAccessControl.contentSignals`** as **pass** (**`Content-Signal`** declares **`ai-train`**, **`search`**, and **`ai-input`** on **`robots.txt`**), and **`checks.contentAccessibility.markdownNegotiation`** as **pass** (**`Accept: text/markdown`** returns Markdown with **`Content-Type: text/markdown`**).
- **`GET /health.json`** in production should return **200** and **`application/json`** with a small JSON body suitable for liveness checks.
- **Local dev** (`npm run dev`, `astro preview`) does **not** apply **`vercel.json`** headers or generated **`.vercel/output/config.json`** routes; verify Markdown negotiation by inspecting **`.vercel/output/config.json`** after **`npm run build`** or by testing the production deployment.
- SEO crawlers may flag **broken JavaScript** and **broken CSS** on many pages for the same reason: **`/pagefind/pagefind-ui.js`** and **`/pagefind/pagefind-ui.css`** (loaded by [PageFindSearch.astro](src/components/widgets/PageFindSearch.astro) on blog listing pages) are emitted together by Pagefind into **`pagefind/`**; if either **404**s, the whole bundle is missing from the deploy output. **`www`** vs apex are duplicate reports for the same assets.
- If **`SITE.origin`** in **`src/config.mjs`** ever changes, update **absolute `https://` URLs** inside **`public/.well-known/api-catalog`** (and any other hardcoded origin strings in **`site-for-agents.json`**) so anchors and `href` values stay aligned with production.

## Checklist: new blog post

1. Add **`data/blog/YYYY-MM-DD.md`** (or `YYYY-MM-DD_short-title.md`).
2. Fill frontmatter; set **`draft: false`** to publish.
3. Add cover asset under **`src/assets/images/blog/`** and set **`image: ~/assets/images/blog/...`**.
4. Add inline images to **`public/images/blog/`**; reference as **`/images/blog/filename.png`**.
5. Run **`npm run build`** locally to confirm **`dist/.../pagefind/`** (and **`.vercel/output/static/pagefind/`** after a Vercel adapter build) and paths (optional: `npm run dev`).
6. Published posts automatically appear in the homepage and Blog directory's recent-post lists.

## Conventions for agents

- Match existing **Tailwind** and **component** patterns; prefer **`PageLayout`** + widgets over one-off full HTML pages.
- Prefer **`config.mjs`** for site name, URLs, and footer columns.
- Do not rely on drafts appearing on the site — they are filtered in **`posts.js`**.
- Keep **slug** stable after publish (URLs and external links).
