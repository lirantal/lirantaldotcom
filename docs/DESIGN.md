# Design guide for lirantal.com

This guide records the editorial direction chosen with Liran during [PR #12](https://github.com/lirantal/lirantaldotcom/pull/12), merged October 18, 2026. Read it before changing the homepage, portfolio pages, or shared visual styles. [AGENTS.md](../AGENTS.md) covers the framework, routes, build pipeline, and content conventions.

The decisions below are the baseline for future work, not a ban on iteration. When a design choice changes, update its rationale here rather than preserving contradictory rules. CSS and components remain the source of truth for current values.

## Direction: editorial, personal, and restrained

Liran chose the **Editorial** concept over the centered alternative: left-aligned writing, a portrait alongside it, visible projects near the top, and clear sections with room to breathe. Keep the existing Inter/blue/neutral identity. Avoid shiny effects, excessive animation, or turning every item into a card. Preserve the established gradients on speaking headings, year bars, the stage-photo frame and invitation panel, the blog title, recognition headings, and 404 text; the owner explicitly requested retaining these accents during review of PR #14.

The homepage should quickly answer: what does Liran work on, what has he made, and where can I read or watch more? Show evidence through real projects, writing, papers, books, and talks rather than adding more biography or promotional claims.

Inspiration came from [tej.as](https://tej.as), [Kent C. Dodds](https://kentcdodds.com), [faziz-dev](https://www.faziz-dev.com), [elie.tech](https://elie.tech), [Dhravya](https://dhravya.dev), and [jdx.dev](https://jdx.dev). These were references for content and structure, not designs to copy. Two explicit preferences were visibly colored, underlined links (elie.tech) and projects shown near the hero (jdx.dev).

## Homepage hierarchy

The current sequence in [index.astro](../src/pages/index.astro) is:

1. Short personal introduction, professional links, recognition badges, portrait, and social icons.
2. “Tools & resources I maintain”: three selected projects, before the long-form sections.
3. **01 / Speaking**: stage photograph, speaking statistics, and links into the speaking hub.
4. **02 / Blog & articles**: recent blog posts and places Liran publishes elsewhere.
5. **03 / Research**: selected co-authored arXiv preprints.
6. **04 / Open source**: dated npm download evidence and a broader project selection.
7. **05 / Books**: a curated bookshelf.
8. Attributed community feedback, followed by the shared footer.

Speaking moved first because it offers a strong visual entry into the work and a useful path for event organizers. Keep the section IDs stable: navigation and external links use anchors such as `/#open-source`. Numbers express reading order; they are not part of the URL.

The header logo is a plain "Liran Tal" wordmark in bold Inter, without an emoji.

### Font loading stability

Inter uses the weight-axis variable files from `@fontsource-variable/inter`. `Fonts.astro` preloads the Latin WOFF2 subset once for all weights; `src/assets/styles/fonts.css` preserves the package's language subsets with `font-display: optional`. This prevents a late font swap from changing text widths and wrapping during a fresh load. On slow connections the system fallback can remain for that page view; cached or promptly loaded fonts use Inter. Keep the preload URL identical to the CSS font URL and retain its anonymous CORS mode. Avoid restoring separate weight downloads or `swap` without checking cold-load layout shifts at mobile and intermediate desktop widths.

Public Markdown images also need space reserved before download. `remark-image-dimensions.mjs` reads local image metadata at build time and emits width/height attributes while retaining responsive CSS sizing. Remote images still need explicit dimensions from their source or component.

`PageFindSearch.astro` reserves the search field's scaled height before Pagefind initializes, preventing the archive list from jumping when its deferred script loads. Keep the reserved height and Pagefind scale aligned.

### The hero groups links by purpose

[ProfileHero.astro](../src/components/widgets/ProfileHero.astro) owns this composition:

- **Identity:** spaced dot separators between “Security researcher”, “Author”, and “Open-source maintainer”. Retain the separators; spacing alone made the roles feel disconnected. The current wrapping treatment clips a leading separator on a new row.
- **Introduction:** one heading and one short paragraph. Both introductory sentences use the same size and weight. Break after “software,” where appropriate, and keep “AI agents” together; avoid a stranded final word. Do not force an exact line count across screen widths.
- **Professional context:** “I head Developer Relations at Snyk”, immediately followed by Read my blog, Invite me to speak, and Bio & press kit.
- **Recognition:** directly below that block, quiet bordered badges with an award icon and the wording “Awarded GitHub Star” and “Awarded OpenJS Security Pathfinder”. Keep the award names linked. There is no separate “Industry recognition” strip.
- **Social profiles:** one horizontal row of X, GitHub, and LinkedIn logos beneath the portrait. No visible names or outgoing arrows here; keep accessible names, hover titles, visible keyboard focus, and generous click targets (currently 44 × 44px). X is important to Liran's public activity; do not omit it.

This grouping distinguishes navigating the site, learning about professional credentials, and connecting elsewhere without adding more headings. An earlier mixed row of internal actions and social links, a triangle of social links, and a detached job/awards strip all made those relationships harder to read.

The full bio belongs in the [speaker press kit](../src/pages/speaking/press-kit.astro), not the homepage. Its display and download both read [liran-tal-bio.txt](../public/press/liran-tal-bio.txt); edit that source once. The short organizer bio lives in [portfolio.ts](../src/data/portfolio.ts). Use personal first-person wording on the homepage and third-person wording in reusable speaker bios.

## Reuse these visual patterns

| Pattern | Use and reasoning | Owner |
| --- | --- | --- |
| Numbered section heading | Large, bold, uppercase semantic `h2`, e.g. “02 / Blog & articles”. The descriptive sentence is secondary. Small eyebrow labels alone did not separate the sections clearly enough. | [Section.astro](../src/components/portfolio/Section.astro) |
| Editorial row | Titles, dates, descriptions, and thin dividing rules for writing and papers. Prefer this to a grid of boxed cards for content that people read sequentially. | `.editorial-row` in [portfolio.css](../src/assets/styles/portfolio.css) |
| Quiet surface | Subtle fill, thin border, modest rounding for a publication sidebar or download summary. Reserve stronger grouping for related information, not every link. | `.surface` in `portfolio.css` |
| Recognition badge | Small neutral surface, award icon, muted “Awarded”, linked award name. Wrap naturally on narrow screens. | `ProfileHero.astro` |
| Book shelf | Real cover art with a common visual height and `object-contain`, not cropped illustrations; titles remain the accessible links. | `index.astro` and `portfolio.ts` |
| Image with context | Real portrait and stage photo, with useful alt text and responsive image output. Avoid generic decoration in place of evidence. | `astro:assets` `Image` in the hero and homepage |

The portfolio wrapper is at most 72rem wide, with 1.5rem horizontal padding (1.25rem on small screens). Its section spacing, rules, typography, and focus treatment live in `portfolio.css`. Reuse those styles inside `.portfolio`; do not accidentally apply their heading sizes to every blog or speaking page.

### Speaking and blog editorial layouts

- Speaking topics use ruled editorial rows, ordered by delivery count descending. At desktop widths, topic names occupy a narrow left column and descriptions occupy the right; mobile stacks each row. Topic stats use neutral ink to distinguish them from the blue linked titles. Keep flagship session titles after “Most requested” without repeat counts.
- Audience feedback uses the original bordered testimonial cards in a responsive grid. The owner prefers this recognizable recommendation format over editorial rows; preserve the quotations and attribution links.
- Speaking sub-navigation marks the current page with an underline and `aria-current`. Type labels use quiet neutral borders; upcoming status remains explicit. Calendar and archive event titles are blue and underlined before hover.
- Blog listings share the homepage's 72rem grid. Use compact text-led rows with blue, underlined titles and small cover thumbnails, rather than full-width covers between entries. Tag and category archives share this layout.
- Post dates, titles, tags, sharing controls, and covers align to that grid's left edge. The article body retains its narrower reading column. After the article, “More writing” lists three recent published posts, excluding the current post, and links to the full archive. Keep this navigation outside Pagefind's indexed article body.
- Pagefind uses Inter, explicit placeholder contrast, visible input focus, and theme tokens. Verify populated results and clearing the query against a production build; dev mode does not generate its assets.
- Cap recent-post descriptions on `/writing` and press-kit bio paragraphs at 65ch. Let text wrap naturally rather than inserting manual line breaks.

### Links and controls

- Portfolio text links are blue and underlined before hover. Color alone should not be the only indication that prose is clickable.
- Directional cues, when used, follow the label: `→` for internal navigation and `↗` for an external destination. They are useful cues, not a requirement on every citation or inline link. Social logos are the deliberate exception.
- Expand/collapse is not navigation. The npm disclosure uses native `details`/`summary` with a right-aligned `+`/`−`; the adjacent external link has its arrow on the right too. Do not restore a leading disclosure triangle beside a trailing external arrow.
- Retain focus outlines, meaningful link names, and keyboard operation. Decorative icons should be hidden from assistive technology.
- Use `PROFILE`, `NAVIGATION`, and `FOOTER` in [config.mjs](../src/config.mjs) for their shared destinations. The footer still groups projects, books, awards, and games; adjust its responsive grid if adding columns. Visible onWidget theme attribution was removed by request; retain the repository's license notices.

## Theme: light by default, soft black by choice

**A visitor without an explicit saved preference sees light mode, even if their OS prefers dark.** The toggle remembers the choice in `localStorage.theme`. Do not reinstate OS-driven theme selection. [BasicScripts.astro](../src/components/core/BasicScripts.astro) owns this behavior; it is rendered in `<head>` so a saved dark preference applies before first paint. The toggle shows a moon in light mode and a sun in dark mode, and exposes the state with `aria-pressed`.

Liran selected **C / Soft black** from the final comparison of two black variants and the earlier preferred option. That label refers to the final comparison, not an arbitrary third palette. The approved direction is near-black, neutral elevated surfaces, readable gray text, and a pale blue accent, without a navy wash or harsh pure-white body text.

### Dark palette reference

| Role | Current value | Token or consumer |
| --- | --- | --- |
| Page | `#090A0C` | `--color-slate-900` |
| Surface | `#181A1E` | `--color-slate-800` |
| Divider | `#353A43` | `--color-slate-700` |
| Heading | `#EDF0F4` | `--color-slate-100` |
| Body | `#CBD0D8` | `--color-slate-300` |
| Secondary text | `#A5ADBA` | `--color-slate-400` |
| Link/accent | `#92B8FF` | `--color-blue-300` / `--color-blue-400` |

These overrides live under `.dark` in [base.css](../src/assets/styles/base.css); gray aliases keep existing shared components aligned. `white` is deliberately **not** overridden: neutral-surface text uses `dark:text-slate-100` (the soft `#EDF0F4`), while white text on colored fills (buttons, the active speaking tab, badges) stays pure `#FFFFFF` so it keeps its contrast. Use `dark:*-slate-100` rather than `dark:*-white` for headings, logos, and hover text on neutral surfaces. Portfolio variables reference the shared tokens. [tailwind.config.mjs](../tailwind.config.mjs) maps primary 300/400 to them and styles inline code; [PageFindSearch.astro](../src/components/widgets/PageFindSearch.astro) maps search surfaces, links, and highlights. Update these consumers together when changing a shared theme.

The speaking hub and blog retain their established blue-to-pink gradients on headline accents, speaking year bars, the stage-photo frame, and the "Tell me about your event" panel. Recognition headings retain their red-to-purple gradient, and the 404 heading retains its blue-to-pink gradient. These are owner-approved accents; do not replace them with solid colors during design cleanup. Shared chrome remains restrained, with a blue (not pink) book promo after posts. Icon controls use the primary focus outline (`focus-visible:outline-primary-600`, inset inside the scrollable header nav), not the template's faint gray ring. Blog post prose is capped at `max-w-2xl` (about 73 characters per line at 18px).

Light mode retains its existing white/blue/neutral styling. Portfolio-specific light values are `--ink-muted: #526075`, `--line: #E2E8F0`, `--link: #1D4ED8`, and `--wash: #F8FAFC`. Reuse these variables instead of scattering palette literals through components. A dark-only change should not recolor the light site.

Measure contrast against actual rendered backgrounds, including cards and selected controls. Check muted copy, links, inline code, search highlights, and focus indicators—not just the hero heading. Automated visual commentary can misread colors; confirm a suspected defect with the screenshot and computed styles before changing the palette.

## Content should support its claims

- **Blog:** `/writing` is labeled “Blog” in navigation and is the directory across lirantal.com, Node.js Security, and Snyk; `/blog` remains the local archive. Its recent local posts appear first and include their cover images when available. Homepage recent posts come from `fetchPosts()`, not a second curated list.
- **Research:** verify authorship and destinations, credit co-authors, and label arXiv work as preprints. Presence on arXiv is not a claim of peer review. Keep primary-source links such as the abstract, PDF, and DOI.
- **npm impact:** use [npm-downloads.json](../src/data/npm-downloads.json), show its date range and package scope, and retain “downloads, not unique developers” plus the dependency-install caveat. The total is computed, not manually advertised. Refresh all packages and both dates together; the procedure is in `AGENTS.md`. Do not turn this into a live client-side counter or imply it includes every package Liran maintains.
- **Projects:** make the purpose understandable in a sentence. Include useful curated resources and best-practice guides alongside executable tools. The homepage selection is not an exhaustive GitHub inventory.
- **Books:** Code Injection is first in the current five-book shelf, followed by Command Injection, Path Traversal, HTTP Security Headers, and Serverless Security. Essential Node.js Security was removed from this shelf to make room, not removed from the whole site. Use authentic cover assets and verified destinations.
- **Speaking:** use the speaking data model and its build-time statistics, not hand-entered totals. The upstream public-speaking repository remains the data source, with a local fallback; see `AGENTS.md`.
- **Endorsements:** retain attribution and a link to the original statement. Keep claims concrete rather than expanding them into unverified guarantees.

## Review workflow and lessons

1. **Start from the current component and data source.** Check the active layout before acting on a report. For example, the legacy `BooksHeader` breakpoint warning did not affect the live book page, which uses `PageLayout`; changing the active 1024px menu reset to match unused code would have been wrong.
2. **Use mocks for genuine design choices.** Label alternatives and show palette swatches with hex values. Liran found side-by-side comparisons and the swatches useful. Carry the selected option forward; mock images are references, not verification of implementation. Small, specific portal corrections usually need direct implementation rather than a new design round.
3. **Build and inspect the real page.** Run `npm run build` (including Pagefind and Markdown generation), plus `npm run lint` for code changes. Documentation-only changes need source/link checks, not a visual rebuild. If a build runs out of memory in a small orb, close browsers and stop dev servers first; this session used `NODE_OPTIONS=--max-old-space-size=3072 npm run build` on a 4GB orb.
4. **Exercise responsive and non-default states.** Check desktop, an intermediate width near the reported 1073px viewport, and narrow widths such as 390px and 320px. Check both sides of the active header's 1024px breakpoint when touching navigation. Long award names, wrapped role separators, and link groups should fit without horizontal overflow.
5. **Check shared-theme consumers.** For a palette change, inspect the homepage, Blog directory, speaking, a blog article with inline code, and populated Pagefind results. Test fresh light default under dark OS preference, explicit dark selection, and persistence after reload. Exercise open menus, selected filters, disclosures, and keyboard focus when those controls are affected.
6. **Inspect captures, not just successful commands.** Take representative screenshots in both themes; use a short pointer/keyboard recording for interaction changes. Compare DOM facts such as accessible names, destinations, and click-target sizes too. A responsive Chromium viewport is not proof of real-device touch behavior.
7. **Use a review portal for element-specific feedback.** Run a supervised orb service and share its registered portal URL. The floating review control sends element text, selectors, and viewport details back to the thread. If Vite blocks the portal hostname, allow that exact trusted host through its host configuration or `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`; do not disable host validation globally or commit an ephemeral orb hostname as a site default.
8. **Separate local, preview, and production evidence.** A portal may serve an older static build until rebuilt. For a reported missing image, inspect the requested URL and responsive `srcset`, status codes, and browser decoding before replacing the asset. A passing Vercel preview is not proof of production deployment or a fresh bot review. Keep those distinctions in delivery reports.

Update this guide when a later review changes a design decision. Keep short, durable rules in `AGENTS.md`; keep rationale, alternatives, and visual conventions here rather than duplicating the full guide in agent instructions.
