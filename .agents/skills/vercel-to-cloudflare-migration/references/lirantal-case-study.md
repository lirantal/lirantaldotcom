# Worked example: lirantal.com, November 12, 2026

This is evidence and implementation context, not a template of resources to reuse.
No account IDs, credentials or secret values are required to apply the workflow.

## Architecture selected after inspection

Astro 6 generated Markdown/MDX blog/portfolio pages, static JSON APIs and browser-side
Pagefind search. Sharp image processing and Satori/Resvg social cards ran at build time.
There was no application database, authentication system or backend to migrate.

Workers Static Assets served generated files. A small Worker preserved negotiation,
agent mode, header/MIME policies, published aliases, redirects and structured errors.
Eight MP4s used a read-only R2 binding through their existing `/images/blog/*.mp4` paths.
They totalled about 88 MiB, with a largest file of 43.16 MiB. At the time, the observed
Static Assets limit was 25 MiB per file and the free asset-count guard was 20,000;
video range support also required deliberate handling. Recheck current limits for
other apps. The Worker streamed R2 bodies/ranges instead of buffering full videos.

## Pipeline and preserved behavior

Vercel remained the default build for migration/rollback. A `build:cloudflare` target
selected adapter-free static Astro output and ran all postbuild work: search,
Markdown twins, route manifest and asset staging without MP4s. The isolated pinned
Cloudflare tooling avoided framework autodetection bypassing required steps.

Versions used then: Node 24, project npm 11.21.0, cf 1.0.0-beta.30, Wrangler 4.160.1.
They are historical compatibility facts, not required versions for future projects.
The project deliberately had no package lockfile and retained its root npm policies.

Preserved behavior included Accept/crawler Markdown negotiation, token headers,
`/?mode=agent` JSON, discovery Link/catalogs, static APIs/pagination, special MIME/CORS,
legacy speaking/game redirects, real HTML/Markdown/JSON errors, canonical/social
metadata and Pagefind. Shared CDN caching was disabled for routed representations;
only fingerprinted `/_astro/` assets received immutable year-long caching.

Cloudflare builds omitted Vercel Analytics and updated privacy hosting disclosures;
no new beacon was enabled. Email opt-out markers prevented Cloudflare rewriting
mail/code examples into broken email-protection links.

## Acceptance evidence

- 35 Node regression tests and lint.
- Internal links across 966 HTML pages and social metadata across 966 pages/718 PNGs.
- 980 negotiated resource routes plus HTTP contract checks.
- Nine Chromium regressions covering responsive themes/images, search and diagrams.
- Real Pagefind/filter/navigation checks and all eight videos' decoded playback/seeking.
- A controlled bot-authenticated empty commit triggered Cloudflare Workers Builds.
- Actual SCM preview URLs were taken from successful builds for the current PR head.

These counts describe that content snapshot. Do not require the same counts elsewhere
or use a local pass as proof that a remote check passed.

## Operational discoveries

The old running environment could not reach workers.dev or production domains even
after a future environment configuration was published. A new instance had the proper
allowlist. A scoped companion check verified external game iframes; YouTube/provider
assets remained partly blocked and playback was not claimed verified there.

Playwright navigation worked while intercepted `route.fetch()` failed with direct-DNS
EAI_AGAIN. An opt-in explicit inherited proxy fixed the test without changing local CI.
Branch preview Worker tags were distinct from the primary Worker tag; inspecting the
child initially appeared to contradict the parent's correct main/preview settings.

After preview acceptance and main merge, Vercel paused production for billing/quota.
Fresh apex/www requests returned 402 DEPLOYMENT_DISABLED before any Cloudflare DNS
change. The owner knowingly directed cutover. Main Cloudflare was smoke-tested first,
then only apex/www website records were replaced with native custom-domain bindings.
Cloudflare created managed proxied AAAA `100::` records. Mail and all unrelated DNS
were checked unchanged, temporary workers.dev hosting was disabled, and source
configuration was persisted and verified through the next normal deployment.

The separate `nodejs-secure-coding.lirantal.com` origin pointed to Lemon Squeezy and
returned 404. It was initially excluded and tracked separately, not blindly migrated.
After the owner confirmed it was unused, its single DNS record and obsolete redirects
were removed, all other records were compared unchanged, and the repair issue was
closed as not planned. Active book pages and direct checkout links were retained.
The owner later discovered a `/buy/*` purchase link on the separate nodejs-security.com
site and reversed retirement. The exact original proxied A record was restored; all
other DNS remained unchanged. The old website redirects stayed removed so vendor buy
paths/query parameters could reach the vendor. Checkout behavior remained proxy-blocked
in the original environment and was not claimed verified. Absence of links in one
repository does not prove global disuse: inventory known related sites and external
consumers, preserve restoration evidence, and follow the latest owner decision.
Historical snapshots/retirement notes are not the current desired state after a reversal.

## Source evidence

- [Application migration PR #55](https://github.com/lirantal/lirantaldotcom/pull/55)
- [Production configuration/rollback PR #57](https://github.com/lirantal/lirantaldotcom/pull/57)
- [Historical legacy-host retirement PR #58](https://github.com/lirantal/lirantaldotcom/pull/58)
- [Book-host investigation and subsequent owner decisions #56](https://github.com/lirantal/lirantaldotcom/issues/56)
- [Current handoff](https://github.com/lirantal/lirantaldotcom/blob/main/docs/CLOUDFLARE-MIGRATION.md)

Inspect the repository's `cloudflare/`, build preparation/media/HTTP-check scripts,
CI and browser tests for working examples. Adapt to each app's framework and policies;
do not reuse this site's live Worker, bucket, domains or bindings for another app.
