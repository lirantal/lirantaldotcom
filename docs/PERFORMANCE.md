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

## Validation workflow

- Use Node 24+, install the declared dependencies, and run `ASTRO_TELEMETRY_DISABLED=1 npm run build`. Run the full production command so Pagefind, Markdown twins, and Vercel routing are generated.
- Run `npm test`, `npm run lint`, `npm run check:links`, and `npm run check:social`.
- Inspect cold browser loads at 390px, an intermediate width, and 1440px in light/dark modes. Check image decoding, selected `currentSrc`, transferred bytes, intrinsic dimensions, and absence of overflow.
- Compare sequential mobile Lighthouse runs for the three baseline URLs. Keep raw reports outside the repository; record measured results and limitations here.
- After opening the PR, use the exact Vercel deployment URL for this commit. Verify deployment identity, status codes, asset headers, Pagefind search, Markdown negotiation, diagram rendering, and theme toggling. Local static serving does not emulate Vercel routing or Cloudflare transformations.
- After deployment and a suitable field-data window, inspect Cloudflare LCP by URL, device, country, and traffic volume. Compare like periods; aggregate email summaries cannot identify the responsible URL or element.
