# Performance maintenance

Read this before changing image delivery, diagram rendering, or cache policies. Preserve the approved [design](DESIGN.md), intrinsic image dimensions, eager/high-priority LCP images, and HTML/Markdown content negotiation. Each numbered section corresponds to a separate optimization commit.

## Baseline: November 5, 2026

Mobile Lighthouse against production through the managed environment proxy measured:

| Page | Score | LCP | TBT | CLS |
| --- | --- | --- | --- | --- |
| `/` | 98 | 2.4 s | 60 ms | 0 |
| `/blog/self-host-hermes-agent-matrix-e2ee-proxmox` (repeat) | 97 | 1.8 s | 170 ms | 0 |
| `/blog/practical-second-brain-llm-markdown-knowledge-graph` | 84 | 2.0 s | 610 ms | 0 |

These are lab samples, not field percentiles or proof that the historical Cloudflare p75 LCP of 6.06 s is resolved. The environment blocks the external Cloudflare analytics beacon. Initial concurrent browser runs varied substantially in TBT; compare sequential repeated runs with identical settings and disclose geography, proxy, and third-party limitations.

## 1. Homepage portrait

`src/components/widgets/ProfileHero.astro` uses Astro's build-time Picture pipeline with AVIF, WebP, and a WebP fallback at quality 45. Widths of 220, 320, 440, 660, and 960 cover the existing 220px mobile and 320px desktop slots at common pixel densities. The 660px fallback avoids an original-size download when responsive sources are unavailable. Keep the lossless transparent PNG as the source for future encodes and other consumers, including social cards.

Previously, mobile Lighthouse selected a 640px WebP of 109,476 bytes. Sharp's 440px AVIF at the new quality is 28,533 bytes; actual selection depends on viewport, device pixel ratio, and browser support. Keep the portrait eager and high priority: it was the homepage LCP element in both mobile and desktop browser samples. Do not lazy-load it to improve a transfer-size score. Keep the current CSS dimensions, transparent edges, rounded mask, and social-row placement; inspect both themes at mobile and desktop sizes when adjusting encoding quality.

## 2. Mermaid diagrams

`src/scripts/mermaid-post-client.ts` observes diagram fences with a 600px viewport margin. It imports Mermaid only when a diagram approaches the reader, and serializes rendering so multiple intersections and theme changes cannot race Mermaid's global configuration. The Second Brain baseline transferred about 170 KiB for Mermaid core alone and spent about 0.9 s evaluating its script under mobile CPU simulation; below-the-fold diagrams do not need that work at navigation time.

Source fences remain in place until SVG generation succeeds. Rendering uses an invisible, out-of-flow measurement container, removed on success or failure. Invalid diagrams and failed downloads leave readable source; one failure does not stop other diagrams. MutationObserver watches the actual document theme, so visible diagrams update even when the theme changes during an import/render; offscreen diagrams update when approached again. Browsers without IntersectionObserver use sequential eager rendering, and JavaScript-disabled readers retain the original source. Keep Mermaid's `securityLevel: 'strict'`.

Do not restore an eager import, preload the Mermaid bundle, render every diagram at DOMContentLoaded, or reset all diagrams to raw source when changing themes. Verify the deferred download, scrolling, theme changes, failure fallback, and observer-less behavior using the browser regression suite.

## 3. Article cover sizes

`src/components/blog/SinglePost.astro` offers 360, 480, 640, 768, 960, and 1200px candidates through the existing AVIF/WebP Picture wrapper. The `sizes` attribute describes the actual article width: viewport minus 40px up to 760px, viewport minus 56px until the 960px article cap is reached at 1016px, and 960px above that. Keep these hints aligned with `.forma-wrap` and `.forma-article` if the layout changes.

The previous two candidates (640 and 1200px), combined with a mobile `100vw` hint, caused the Second Brain mobile Lighthouse run to select 1200px for a 372px slot. Lighthouse estimated 24 KiB of avoidable transfer. Intermediate widths reduce overfetch without reducing the maximum existing resolution or changing compression, crop, layout, alt text, or loading priority. This is scoped to article covers; other Picture consumers retain their own sizing policies. Remote string images remain subject to the existing plain-image fallback.

The browser suite decodes the actual selected image and checks pixel widths at 390px/1×, 390px/1.75×, 412px/1.75×, 1000px/1×, and 1440px/1×, as well as the rendered aspect ratio and priority. Do not infer selected image resolution from `naturalWidth` alone: browsers can report a density-corrected value. Inspect `currentSrc`, its decoded bitmap dimensions, and transferred bytes.

## 4. Fingerprinted asset caching

`vercel.json` explicitly sets `Cache-Control` and `Cloudflare-CDN-Cache-Control` to `public, max-age=31536000, immutable` only for `/_astro/`. Astro/Vite fingerprints files in that directory, so changed content gets a new URL. The adapter generates the same browser policy, but inspection of the real build found it **after** `{ handle: 'filesystem' }`, where existing static files can bypass it. `scripts/generate-markdown-pages.mjs` now moves that policy before filesystem handling, adds Cloudflare's dedicated edge directive, and removes duplicate asset policies on repeat runs. The root configuration records the same intended contract. Keep plain public images, Pagefind entry points, HTML, JSON APIs, agent mode, Markdown twins, and discovery files outside this rule. Never use a blanket “Cache Everything” rule for HTML: the same URL can negotiate HTML or Markdown, and `/?mode=agent` has separate semantics.

The production baseline returned a four-hour browser cache policy for sampled assets even though the adapter generated a year-long immutable rule. The unreachable generated rule is a concrete ordering defect; it does not establish Cloudflare’s effective dashboard configuration. Cloudflare Browser Cache TTL and Cache Rules may override origin headers, and a dedicated CDN header does not override every dashboard rule. After deploying, compare the exact hashed asset on Vercel preview versus the custom domain. Inspect `Cache-Control`, `Age`, `CF-Cache-Status`, and `x-vercel-cache` over repeated requests. If the custom domain still returns four hours, inspect Cloudflare's matching cache rules and Browser Cache TTL; prefer respecting the origin for `/_astro/*`. Verify an actual MISS-to-HIT transition where possible; repeated proxy-served headers alone do not establish independent edge-cache observations.

The fast regression suite protects the narrow cache scope and confirms the Markdown postbuild preserves the adapter cache route before filesystem handling, keeps negotiation separate, and remains idempotent. The optional agent-query fixture now copies its redirect helper, fixing a pre-existing test-fixture import failure so those routing checks can run as well. GitHub Actions runs the Chromium performance behavior suite after the production build.

## Implementation validation: November 5, 2026

Compared baseline commit `8f2238b` and the optimized production builds using the same installed dependencies, Chromium, mobile Lighthouse defaults, and local static server implementation. Medians of three alternating baseline/optimized runs:

| Page | Score before → after | LCP before → after | TBT before → after | Initial transfer before → after |
| --- | --- | --- | --- | --- |
| Homepage | 90 → 94 | 3.30 → 2.85 s | 0 → 0 ms | 439 → 361 KiB |
| Second Brain article | 86 → 95 | 2.70 → 2.70 s | 357 → 0 ms | 1,124 → 331 KiB |

CLS was 0 in every comparison. Local static serving does not gzip text or emulate CDN latency, so these scores are useful for comparing the two revisions, not as production performance predictions. The Mermaid savings apply to initial navigation: its code and rendering still incur a cost if the reader scrolls to a diagram. No claim is made that this resolves Cloudflare's historical field LCP.

The browser selected the new 440px AVIF portrait at 28,533 bytes versus the production baseline's 109,476-byte WebP, a 74% reduction. A 3× mobile viewport selected 660px at 52,932 bytes. Both themes and the 280px intermediate/320px desktop slots decoded correctly without overflow. Cover selection checks verified 360/640/768/960px choices at the tested viewport/density combinations while preserving eager loading and the 2:1 displayed crop.

Validation completed: production builds, 29 fast Node tests, eight Chromium behavior tests, lint, internal links across 956 pages/7,379 deployed files, OG/Twitter metadata across 956 pages/708 PNGs, and the Impeccable source detector (no findings). Rendered portrait and diagram captures were inspected in light/dark modes. The real generated Vercel config now has exactly one asset policy before filesystem handling, and repeat postbuilds preserve it. The browser suite runs in CI; `npm test` now includes the previously separate Node suites.

Vercel preview and custom-domain checks remain separate from this local evidence. Record the PR deployment identity and any remaining network or deployment-protection limitations after publishing the branch. Cloudflare cache configuration and URL/device/country field breakdowns require access to that account; no dashboard settings were changed by these repository commits.

## PageSpeed accessibility follow-up

The November 5, 2026 [mobile PageSpeed sample](https://pagespeed.web.dev/analysis/https-lirantal-com/qmhzwma0eg?form_factor=mobile) reported 97 performance, 1.4s LCP, 0ms TBT, and zero CLS. Its definition-list and Agentic Browsing failures identified the same markup issue in `src/components/forma/Impact.astro`: supporting captions were paragraph siblings of the metric terms and definitions. Each metric group now has one `dt` followed by two `dd` elements (value and supporting context), preserving the caption classes and visual layout. Keep supporting text within a definition when editing these groups; a grouping `div` inside `dl` must itself contain valid term/definition groups. Axe's `definition-list` audit reproduced the failure before the fix and passed afterward at 390px, 1000px, and 1440px in light/dark modes; text, typography, and element geometry were unchanged. Re-run PageSpeed after deployment to confirm its accessibility and experimental Agentic Browsing results. The 450ms render-blocking estimate is a diagnostic opportunity, not a measured reduction to subtract from LCP; preserve the existing critical styles and font-loading policy unless further measurements justify a change.

## PageSpeed dependency-chain follow-up

The expanded report showed a homepage script importing the script entry generated by `BlogAgentSearch.astro`, adding a request before WebMCP registration could run. Both pages now render `BlogSearchRegistration.astro`, a single shared Astro script entry. The verified production build automatically inlines its 3,018-byte module using Astro's normal small-script optimization, removing both external registration-script requests and their dependency edge. This puts the small script in each page's HTML instead of a separately cached asset. Keep the shared entry on the homepage and in the writing search component; preserve registration when no visible form exists, and continue fetching the post index only when a search executes. The browser suite checks exactly one usable registration on each page, lazy index fetching, and index reuse by the writing form. This is not a claim of a 450ms LCP reduction.

The two blocking CSS bundles are retained. The smaller `permalinks`-named bundle contains embed styles collected through the eager article-content imports, not permalink JavaScript or unused font downloads. Splitting those styles safely needs content/dependency isolation and checks on actual embedded articles. Do not use a nonblocking stylesheet trick for shared critical CSS merely to clear the audit. There are no useful additional preconnect origins in this report.

## Validation workflow

- Use Node 24+, install the declared dependencies, and run `ASTRO_TELEMETRY_DISABLED=1 npm run build`. Run the full production command so Pagefind, Markdown twins, and Vercel routing are generated.
- Run `npm test`, `npm run lint`, `npm run check:links`, and `npm run check:social`.
- Serve the completed `dist/` build on port 4321 (for example, `python -m http.server 4321 --directory dist`) and run `npm run test:performance`. Install Playwright's Chromium with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` when using the system browser. Set `PERFORMANCE_BASE_URL` to test a Vercel preview instead. This suite is separate from the fast Node tests and requires a running website.
- Inspect cold browser loads at 390px, an intermediate width, and 1440px in light/dark modes. Check image decoding, selected `currentSrc`, transferred bytes, intrinsic dimensions, and absence of overflow.
- Compare sequential mobile Lighthouse runs for the three baseline URLs. Keep raw reports outside the repository; record measured results and limitations here.
- After opening the PR, use the exact Vercel deployment URL for this commit. Verify deployment identity, status codes, asset headers, Pagefind search, Markdown negotiation, diagram rendering, and theme toggling. Local static serving does not emulate Vercel routing or Cloudflare transformations.
- After deployment and a suitable field-data window, inspect Cloudflare LCP by URL, device, country, and traffic volume. Compare like periods; aggregate email summaries cannot identify the responsible URL or element.
