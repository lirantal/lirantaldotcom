# Design guide for lirantal.com

This guide records the editorial direction chosen with Liran during [PR #12](https://github.com/lirantal/lirantaldotcom/pull/12), merged October 18, 2026. Read it before changing the homepage, portfolio pages, or shared visual styles. [AGENTS.md](../AGENTS.md) covers the framework, routes, build pipeline, and content conventions.

The decisions below are the baseline for future work, not a ban on iteration. When a design choice changes, update its rationale here rather than preserving contradictory rules. CSS and components remain the source of truth for current values.

## Current production direction: Forma Refined

The owner selected Forma Refined for a full-site rollout in PR #30, rebased onto main at `9f5c346`. [The rollout plan and validation](design-review/FORMA-ROLLOUT.md) describe the scope. This supersedes the earlier Inter/blue editorial and exploration rules below; those sections remain historical context. Speaking retains its specifically approved rich color accents and components within the new neutral shared chrome.

Use the shared `forma-tokens.css` roles: paper `#FFFFFF`, ink/accent `#171717`, muted `#626262`, surface `#F7F7F7`, rule `#DFDFDF`, footer `#181818`. Inter's existing preloaded variable font and font-display policy are retained. Default light mode and explicit saved dark preference remain intact; the theme tokens adapt to the soft-black palette in dark mode. Buttons are clear filled/outlined controls; content frames and controls use restrained rounding. Neutral shared links are underlined where the text needs an affordance, while speaking-specific blue/gradient and semantic severity/type colors remain local.

The homepage uses the approved asymmetric hero and transparent rounded portrait/social row with latest main's Software engineer wording and Hire Me link. Research and real Blog cards follow the chosen hierarchy. Keep the featured tools, full dated npm/GitHub impact panel with disclosures, complete project list, Beyond This Blog publication references, three primary books plus four cover thumbnails, and all Better Together quotes/attribution. Reuse real content data rather than a reduced specimen set. Stable homepage anchors and the WebMCP registration/Person schema remain present.

At widths up to 760px, center the entire homepage hero: headline, supporting copy, primary and secondary actions, portrait, and social row. Keep the supporting paragraph within its existing readable measure, let the primary actions wrap when space is tight, and use a compact 24px gap before the portrait so the introduction feels connected. Recognition links below the hero remain left aligned. Wider screens retain the asymmetric two-column composition.

Use real PageLayout/Header/Footer throughout. `src/components/forma` owns reusable production cards, recognition, projects, books, impact and community. Archive/tag/category results retain Pagefind, pagination, reading metadata and tag navigation. Articles retain tags, sharing, readable code/prose, diagrams, related writing and the book promotion. Hire Me keeps its newest FAQ/experience content. Speaking keeps its overview, calendar, event/talk details, recordings, podcasts, press kit, filters and invitation flow; Research keeps all topics and disclosure filters. Footer retains all navigational groups and a contrasting RSS CTA. The mockup routes, toolbar, alternate fonts and gallery assets are retired.

Homepage refinements retain clickable article cards without a repeated “Read article” label. Use “Read the blog” for blog CTAs, and bold underlined text for secondary section actions. Center the impact metrics; group npm and GitHub date/scope/source disclosures separately, with link icons next to their labels. The four secondary book covers form a compact two-by-two grid spanning the full height of the three primary books, including their titles.

The impact panel shows npm downloads, selected-repository GitHub stars, and yearly GitHub profile contributions (not a commit-only count). Keep contributions in a dated, sourced snapshot in `src/data/github-contributions.json`; do not fetch at build or page load. Use 48px between stacked metrics so each caption stays visually grouped with its value. Show package download counts and repository star/fork counts directly, without disclosure controls, with a regular-weight inline period label beside each bold source heading: “monthly, YEAR” for npm and “snapshot, YEAR” for GitHub. Derive years from the snapshots; keep precise dates in the data files. Package names link to their npm package pages. Center each secondary book cover horizontally and vertically within its existing grid cell so differing aspect ratios have balanced whitespace.

The external-publications panel uses the quieter 16px, medium-weight heading “Liran’s writing on the web”, with no local RSS link. The Books section action uses the shared outlined button style.

Speaking’s neutral labels, body text, section links, navigation and booking panel follow Forma Refined. Keep the blue-to-pink hero-title gradients, speaker photograph/frame, year bars, calendar event rows, country lists and colored status/type/filter pills. Topic rows retain their layout with neutral 21px titles, 14px descriptions and 12px metadata. The shared booking CTA uses a neutral surface, a filled primary action and outlined secondary actions. `BOOKING_YEAR` is computed six months ahead at build time; static deployments need a rebuild to update it.

### Hire Me question teasers

Break up the two FAQ lists with five short, first-person highlights, placed deliberately after groups of three to five questions within each section. Keep each teaser attached to its question data so it stays with the relevant topic when questions move. Use larger, medium-weight Inter text, generous vertical whitespace, and a small descriptive evidence link, with the shared ink/link tokens in both themes. The humor comes from real experience (dial-up communities, growth, security research, books, and live demos). Keep the teasers visible between collapsed answers without adding another card or animation. In-page evidence links target the answer inside its disclosure so the browser reveals it on navigation.

### Social sharing images

The approved OpenGraph family uses light Forma Refined colors, Inter, a white content area and a pale gray identity rail separated by a fine vertical rule. Every card has the original portrait in a 200px circular crop, followed by “Liran Tal”, “Developer Relations”, and “& Security Research”. The homepage has no “Home” subtitle. Section labels and real titles distinguish blog articles, speaking, talks, events, research, preprints, reports, and media. Full paper co-author credits and preprint status must remain visible. Long titles fit using font measurements rather than truncation.

`src/utils/social-cards.ts` selects the card from the local page path (not a syndicated canonical URL). `src/utils/render-social-card.ts` renders the shared design at build time; `src/pages/og/[...card].png.ts` emits 1200 × 630 PNGs with content-versioned URLs. Update `SOCIAL_CARD_VERSION` when changing the layout, portrait, or fonts. No runtime image service or external font/image requests are required. Blog frontmatter images remain the article/list covers; social cards are independent. Explicit `meta.image` overrides remain supported.

Papers currently link directly to arXiv; local card files under `/og/papers/<arxiv-id>-<hash>.png` are generated for reuse, but this site cannot alter arXiv’s sharing metadata. The local `/research/papers` listing has its own card. Inspect generated cards after changes and run `npm run check:social` after the production build to verify deployed images and OG/Twitter metadata.

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
5. **03 / Research**: recent co-authored arXiv preprints and links to the dedicated Research hub and disclosure archive.
6. **04 / Open source**: dated npm download evidence and a broader project selection.
7. **05 / Books**: a curated bookshelf.
8. Attributed community feedback, followed by the shared footer.

Speaking moved first because it offers a strong visual entry into the work and a useful path for event organizers. Keep the section IDs stable: navigation and external links use anchors such as `/#open-source`. Numbers express reading order; they are not part of the URL.

Homepage section headings omit generic subtitles. Let the talks, articles, research summary, projects, and books supply the context; add a subtitle only when it contributes specific information beyond the heading and section content.

The header logo is a plain "Liran Tal" wordmark in bold Inter, without an emoji.
The header omits the duplicate GitHub icon; the profile's social row remains the connection point.

### Font loading stability

Inter uses the weight-axis variable files from `@fontsource-variable/inter`. `Fonts.astro` preloads the Latin WOFF2 subset once for all weights; `src/assets/styles/fonts.css` preserves the package's language subsets with `font-display: optional`. This prevents a late font swap from changing text widths and wrapping during a fresh load. On slow connections the system fallback can remain for that page view; cached or promptly loaded fonts use Inter. Keep the preload URL identical to the CSS font URL and retain its anonymous CORS mode. Avoid restoring separate weight downloads or `swap` without checking cold-load layout shifts at mobile and intermediate desktop widths.

Public Markdown images also need space reserved before download. `remark-image-dimensions.mjs` reads local image metadata at build time and emits width/height attributes while retaining responsive CSS sizing. Remote images still need explicit dimensions from their source or component.

`PageFindSearch.astro` reserves the search field's scaled height before Pagefind initializes, preventing the archive list from jumping when its deferred script loads. Keep the reserved height and Pagefind scale aligned.

### The hero groups links by purpose

[ProfileHero.astro](../src/components/widgets/ProfileHero.astro) owns this composition:

- **Identity:** spaced dot separators between “Software engineer”, “Security researcher”, and “Open-source maintainer”, in that order. “Maintainer” emphasizes hands-on responsibility for the projects below. Retain the separators; spacing alone made the roles feel disconnected. The current wrapping treatment clips a leading separator on a new row.
- **Introduction:** “Securing the agentic future.” leads with the work; the header retains the personal name. The supporting paragraph is “I research emerging threats and build open-source defenses for AI agents, the software they write, and the tools they trust.” Let both wrap naturally without forcing an exact line count across screen widths.
- **Professional context:** “Leading Developer Relations at Snyk”, immediately followed by Read my blog, Invite me to speak, and Bio & press kit.
- **Recognition:** directly below that block, quiet bordered badges with an award icon and the wording “Awarded GitHub Star” and “Awarded OpenJS Security Pathfinder”. Keep the award names linked. There is no separate “Industry recognition” strip.
- **Social profiles:** one horizontal row of X, GitHub, and LinkedIn logos beneath the portrait. Match the footer’s 20px icons, gray-500 light / gray-400 dark colors, and neutral hover backgrounds. No visible names or outgoing arrows here; keep accessible names, hover titles, visible keyboard focus, and generous click targets (currently 44 × 44px). X is important to Liran's public activity; do not omit it.
- The homepage X icon has a small static blue dot at its upper right, styled like a notification indicator. This owner-requested decoration has no unread count or live message state. Keep its surrounding ring aligned with the current light/dark or hover background.
- **Responsive order:** on narrow screens, show the introduction before the portrait and social links so the visible sequence matches the markup and keyboard focus order. On desktop, keep the portrait and social row alongside the introduction.

This grouping distinguishes navigating the site, learning about professional credentials, and connecting elsewhere without adding more headings. An earlier mixed row of internal actions and social links, a triangle of social links, and a detached job/awards strip all made those relationships harder to read.

The full bio belongs in the [speaker press kit](../src/pages/speaking/press-kit.astro), not the homepage. Its display and download both read [liran-tal-bio.txt](../public/press/liran-tal-bio.txt); edit that source once. The short organizer bio lives in [portfolio.ts](../src/data/portfolio.ts). Use personal first-person wording on the homepage and third-person wording in reusable speaker bios.

The press kit includes the CFP title “Senior Director of Developer Relations, Snyk” in At a glance, with no Languages field. Copy controls use the same bio sources: the short-bio icon sits at the card's top right and appears on hover or keyboard focus, while touch screens keep it visible. The full-bio icon stays beside its download link. Both controls have accessible names, visible focus, and success or failure feedback; copied text contains only the bio, with paragraph breaks retained.

## Reuse these visual patterns

| Pattern | Use and reasoning | Owner |
| --- | --- | --- |
| Numbered section heading | Large, bold, uppercase semantic `h2`, e.g. “02 / Blog & articles”. Descriptions are optional and omitted on the homepage. Small eyebrow labels alone did not separate the sections clearly enough. | [Section.astro](../src/components/portfolio/Section.astro) |
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

### Recognitions

- `/recognitions` opens with a compact left-aligned introduction and in-page links to awards and community appreciation. Retain the approved red-to-purple heading accent.
- The three local award photographs use responsive rectangular frames on the shared 72rem grid. Keep the original award descriptions, OpenJS quotation, and source links.
- Community appreciation follows the speaking testimonial pattern: bordered cards, one column on mobile, two at intermediate widths, and three on desktop. Render all entries statically; progressively enhance category checkboxes with a live result count, an empty state, and a reset action. Filtering preserves newest-first date order.
- Portraits use committed local assets in `public/images/blog/`, with initials for people without a verified local portrait. Do not restore runtime avatar proxies. Keep source-post links and historical attribution roles.
- The shared footer uses two link columns on narrow screens and five proportional columns on desktop, with the identity block above the links on mobile and a ruled social/copyright row.

### Recognition milestones

The Recognitions page separates Awards, Milestones, and Appreciation, with in-page links to each. Preserve the existing `community-heading` anchor and all community posts and filters. Milestones currently features GitHub Trending: a neutral surface pairs the introduction with locally rendered laurel badges, followed by archived appearances in newest-first date order. Use shared Forma tokens in both themes and stack the feature on smaller screens.

The bottom of the feature’s introductory surface contains a horizontal row of compact repository badges beneath the introduction and developer badges. Keep them in newest-first order and allow wrapping on smaller screens. Each badge includes its project, language scope or roundup label, date, and evidence link; the roundup uses a star rather than a numeric rank.

Both developer and compact repository badges share `TrendingLaurel.astro`, an open-center laurel with separate branches and tabular numerals. Center each rank with a grid overlay, keeping clear space around the hash and digits. Scale the larger emblem down to its available width on mobile instead of positioning the number with a fixed offset.

The introductory feature has no redundant anchor link to the immediately following history. On the homepage, place a short GitHub Trending link on a second line beneath the GitHub Star award. Derive its rank and year from the latest archived developer appearance across all languages, use the same laurel icon at the existing 20px recognition-icon size, and link to the Milestones section. Keep the other award links aligned with the first line.

`src/data/github-trending.ts` owns dates, repository/developer identity, language filters, ranks, and evidence links. Badges derive from those records, with no third-party badge images, requests, or Trendshift profile links. Every rank is scoped to its captured daily list; the February 2020 roundup has no numeric rank and its date is the publication date. Keep immutable GitHub archive links, distinguish all-language from language-specific rankings, and describe 2018 as the earliest evidence found rather than a proven first appearance. Add future milestones only with dated evidence.

### Research hub and archives

Research now has its own `/research` hub, following Speaking's overview/subpage model while retaining the portfolio's restrained typography, rules, and blue underlined links. The homepage keeps its stable `#research` anchor and offers a compact preview; the main menu opens the hub. Research navigation uses an underline and `aria-current` for the current page, and wraps on narrow screens so every destination remains discoverable without horizontal scrolling.

The overview opens with counts derived from the listed preprints and the dated advisory snapshot, plus the year of the original lockfile research. Google Scholar is linked for citations and h-index; unavailable metrics are not displayed as numeric estimates. Research areas use text-led entries separated by rules. Detail pages keep the main reading column near 68ch and place factual context in one quiet sidebar, with primary sources and related research below.

The disclosure archive renders every record statically and progressively adds search, severity, and status filters. Withdrawn entries remain available with an explicit label, and are excluded from the active and critical totals. Filtering reports the visible count and provides an empty state and reset action. Keep long package names and identifiers within the viewport in both themes.

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
- **Project sources and GitHub impact:** source pills link to npm (red) and GitHub (neutral), with both shown for published packages. The dated `src/data/github-impact.json` snapshot covers the six featured repositories. Sum stars and forks separately, retain per-repository links and counts, and do not imply unique people or all repositories. Refresh every repository together from its public GitHub page (`stargazerCount` and `forksCount` in the embedded data); write a new date only after every fetch succeeds. No visitor or build-time API requests are needed.
- **Books:** Code Injection is first in the current five-book shelf, followed by Command Injection, Path Traversal, HTTP Security Headers, and Serverless Security. Essential Node.js Security was removed from this shelf to make room, not removed from the whole site. Use authentic cover assets and verified destinations.
- **Speaking:** use the speaking data model and its build-time statistics, not hand-entered totals. The upstream public-speaking repository remains the data source, with a local fallback; see `AGENTS.md`.
- **Endorsements:** retain attribution and a link to the original statement. Keep claims concrete rather than expanding them into unverified guarantees.
- **Homepage community:** four compact editorial quotes use the existing local portraits and testimonials, selected in `src/data/community.ts`. Keep attribution inline after the quote, including name, historical role, and original-post link. The local portraits avoid a runtime dependency on X or an avatar proxy; no automatic freshness is implied.

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

## Theme exploration

The owner requested visibly different themes after reverting PR #27. The isolated `/design-lab` gallery compares Fieldnotes, Signal, and After Hours across homepage, blog listing, and article views using Anthropic’s frontend-design skill. [The exploration brief and review](design-review/FRONTEND-CONCEPTS.md) authorize deviations from the incumbent type, palette, and composition on those routes only. No proposed theme has been selected for production.

The second round follows owner feedback: keep Manrope from After Hours, use compact sections, focus on light mode, avoid decorative divider lines, and reject the newspaper direction. That round compared Prism, Atlas, and Lumen; first-round proposals remain in an expandable history section. [Round-two plans and review](design-review/ROUND-TWO.md) record this exploration; no production theme is selected.

The third round supersedes the second: the owner rejected cosmetic variations and retired Atlas and Lumen. That round compared a redesigned **Prism** (evergreen hero, prominent linked recognition, full-width Research first and Blog last), **Structured** (the incumbent Inter/blue identity and numbered sequence in consistently aligned panels), and **Navigator** (a persistent section menu with a single active workspace, Research initially). Use literal section names; Research must not become a Blog sidebar, and awards must link to recognition sources. Navigator supports keyboard tabs, deep links, and readable anchor sections without JavaScript. [Round-three plans and review](design-review/ROUND-THREE.md) record the decision and verification. Light-mode prototypes remain isolated; no production direction has been selected.

The fourth round compared three options. The owner prefers Prism’s general hierarchy and visible CTAs but rejected its toy-like rounded multicolor containers. [The fourth-round brief and rendered review](design-review/ROUND-FOUR.md) specify **Prism** (restrained full-width chapters and violet accents), **Forma** (centered monochrome technical portfolio, explicitly informed by shadcn/Vercel), and **Studio** (personal masthead, wide stage photography, asymmetric section alignment). Use section-scale background changes and whitespace rather than a box around every component; clear filled/outlined button CTAs; whole-article hover and keyboard-focus states; and a contrasting full-width footer with an actual RSS destination. Structured and Navigator are retired. The example filiphric.com is a reference for these specific affordances, not a template to copy. The current light prototypes remain isolated from production.

The fifth round consolidates the owner’s browser annotations into one **Forma Refined** proposal alongside the unchanged **Forma** baseline. [Round-five plans and review](design-review/ROUND-FIVE.md) record the precise choices. Keep Forma’s Inter type scale, monochrome colors, clean menu, button treatment, side-by-side Research frame/source links, Blog tiles, and article reading layout. Use Prism’s asymmetric hero composition in the proposal, with a separate transparent portrait asset and one row of neutral X/GitHub/LinkedIn icons under it. Recognition becomes compact single-line icon/name links with no arrows or repeated labels. Projects omit generic symbols, put categories in small neutral pills in aligned rows below titles, and use tightly grouped icon-only GitHub/npm source links with accessible names. Prism, Studio, and earlier explorations are removed from the gallery and public preview route manifest. No production design is adopted yet.

Follow-up annotations refine Forma Refined without changing its type or palette: use a softly rounded portrait mask, omit the repeated name in the role line, show compact “Awarded” links followed by a vertical separator and “All recognitions” on the same row, and align project badges and visible source icons with the description text. Dedicated badge rows and shared project grid tracks keep alignment consistent as titles wrap. The Forma baseline remains unchanged.

The latest Forma Refined annotation replaces its three project cards with one framed list: aligned project identity/category, description, and source-icon columns, with a compact stacked arrangement on mobile. Its bookshelf preserves the first three Node.js Secure Coding entries exactly and replaces the remaining full book entries with a cover-only 2×2 group: HTTP Security Headers, Serverless Security, Essential Node.js Security, and Bun Security Essentials. Use authentic assets and verified existing destinations; the Forma baseline and production shelf remain unchanged.
