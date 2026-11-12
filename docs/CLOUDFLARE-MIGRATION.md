# Cloudflare migration

Production runs on Cloudflare Workers Static Assets with R2 media. `cloudflare/cloudflare.config.ts` declares only `lirantal.com` and `www.lirantal.com` as production custom domains; preview uploads do not attach those domains. Vercel configuration is retained, but Vercel was paused for billing/quota at cutover and must be re-enabled before it can serve as a DNS rollback target. The unused legacy book subdomain was retired after cutover at the owner's request; issue #56 is closed without a landing-page repair. The active book page and purchase links are retained.

## Resources

- Cloudflare account: **default**, `72bac654168b15b354744bf1e8b6762f` (explicitly pinned in configuration).
- Worker: `lirantaldotcom`.
- R2 bucket: `lirantaldotcom-media`. The site only reads objects through its binding; the bucket does not need a public domain.
- Manual preview: `https://cloudflare-migration-lirantaldotcom.liran-72b.workers.dev`.
- Zone: `lirantal.com`, `f719742192b1339446980d33b6aa2d14`.

The preview and future production deployment share the same public, read-only media bucket. Other account resources are outside the migration scope.

## Build and local validation

Use Node 24 and the repository's pinned npm. Install the root dependencies using the established npm policies, then:

```sh
npm run cf:install
npm run build:cloudflare
npm run cf:build
node scripts/upload-cloudflare-media.mjs --local
npm run cf:dev
```

In another terminal:

```sh
npm test
npm run lint
node scripts/check-internal-links.mjs dist
node scripts/check-social-cards.mjs dist
npm run check:cloudflare
PERFORMANCE_BASE_URL=http://127.0.0.1:8787 npm run test:performance
```

`cf:build` bundles the already-built site; run `build:cloudflare` after changing content. The `cloudflare/` tooling package is separate so `cf` bundles the routing Worker rather than detecting Astro and skipping the site's postbuild steps. The pinned `cf` beta uses Wrangler internally as its bundler. Administrative and deployment commands use `cf`.

`build:cloudflare` leaves the complete static site in `dist/` for link and social checks, generates a route manifest, and stages uploadable files in `cloudflare/.cloudflare/assets/`. MP4s are excluded from Static Assets and recorded in a SHA-256 media manifest. Preparation rejects files over 25 MiB or a static file count over 20,000. The eight current videos total about 88 MiB.

Generated output, local R2 state, credentials and dependencies must not be committed. The Cloudflare toolchain pins beta versions explicitly; its isolated `.npmrc` keeps lifecycle scripts disabled. It does not change the root project's dependency policies.

## Routing and headers

`cloudflare/handler.mjs` handles Markdown negotiation, agent mode, published speaking aliases, legacy game URLs, structured API 404s and Markdown/HTML 404s. `cloudflare/http-policy.json` records the existing redirect/header contract from Vercel. Keep these policies aligned while both deployments are supported.

HTML, API and other negotiated requests run through the Worker before static assets. `/_astro/`, `/pagefind/` and `/og/` bypass the Worker and use static delivery. The generated `_headers` sets global isolation headers and year-long immutable caching only for fingerprinted `/_astro/` assets. Worker responses apply headers in code; they do not depend on `_headers` applying to generated responses.

The Worker returns `Vary: Accept, User-Agent` on negotiated representations and explicitly disables shared CDN caching of routed responses. Source assets still use Cloudflare's asset storage/cache. Agent query responses and errors are not browser-cacheable. Do not add a Cache Everything rule or override these cache directives without repeating representation-isolation checks.

R2 videos retain their existing `/images/blog/*.mp4` URLs and stream through the Worker with byte ranges, ETag and Last-Modified. Large videos are never loaded into Worker memory. Upload changed or newly added videos before deploying a build referencing them:

```sh
CLOUDFLARE_ACCOUNT_ID=72bac654168b15b354744bf1e8b6762f node scripts/upload-cloudflare-media.mjs
```

This command uploads the build's media objects to this site's bucket only. Preview builds do not automatically overwrite media. Until content-addressed storage is introduced, replacing an existing video affects every deployment using its existing URL.

Vercel Analytics is omitted in Cloudflare builds, and the privacy page identifies Cloudflare hosting. No replacement analytics beacon is enabled by this branch. External game embeds remain on their existing Vercel applications. Canonical URLs continue pointing to https://lirantal.com. Preview responses carry `X-Robots-Tag: noindex, nofollow`.

## Authentication and preview deployment

From `cloudflare/`, authenticate with the official CLI:

```sh
./node_modules/.bin/cf auth login --no-browser
```

Approve the device code in your own browser. OAuth credentials stay outside the repository. `cf` and Wrangler have separate logins; the supported `cf` flow delegates authentication to its build tool. For unattended builds, Cloudflare's SCM integration supplies its managed build token. Do not commit personal API tokens.

After building the site:

```sh
npm run cf:preview
node scripts/check-cloudflare.mjs https://cloudflare-migration-lirantaldotcom.liran-72b.workers.dev
```

The preview name normally follows the Git branch. The manually deployed review preview was named `cloudflare-migration`; pass `--preview-name cloudflare-migration` to `cf previews deploy` from `cloudflare/` to update it explicitly.

Cloudflare must have preview URLs enabled for the Worker. The account subdomain is `liran-72b`. During migration, the Worker's main workers.dev endpoint can stay disabled while preview URLs are enabled. Initial deployment returned empty URL arrays until that setting was enabled.

## Git integration

The Worker is connected to `lirantal/lirantaldotcom`, production branch `main`, with previews enabled. Configure both production and preview builds with:

- Root directory: `/`.
- Build command: `bash .github/scripts/setup-npm.sh && npm install --no-package-lock && npm run cf:install && npm run build:cloudflare`.
- Production deploy: `cd cloudflare && ./node_modules/.bin/cf deploy`.
- Preview deploy: `cd cloudflare && ./node_modules/.bin/cf previews deploy`.
- Build environment: `SKIP_DEPENDENCY_INSTALL=true`, `NODE_VERSION=24`, `CLOUDFLARE_ACCOUNT_ID=72bac654168b15b354744bf1e8b6762f`.

Skipping automatic dependency installation is necessary so the pinned npm setup runs before the engine-strict root install. Do not replace the build command with bare `astro build` or `cf build`; both would miss required postbuild work. CI validates Vercel and Cloudflare builds separately, including the Cloudflare runtime, local R2, HTTP contract and Chromium behavior.

Verify pushes from the scheduled speaking-data workflow trigger Cloudflare builds. It commits to main or creates an empty commit to refresh date-dependent event listings; keep that behavior after migration.

## Handoff status (2026-11-12)

Draft PR: https://github.com/lirantal/lirantaldotcom/pull/55, branch `feat/cloudflare-migration`.

At implementation commit `d75baa602ab5632af6a0ab0d8f0ca5d710bbb9ce`, all PR checks passed: GitHub `test (cloudflare)`, `test (vercel)`, Workers Builds, Vercel deployment, and Vercel Preview Comments. Local verification also passed 35 Node tests, ESLint, link/social checks across 966 pages and 718 PNGs, all 980 normal/Markdown resource routes, all eight video range checks, and nine Chromium behavior tests against `cf dev`.

The manual preview deployment was uploaded successfully. Immutable deployment URL: https://b091e300-lirantaldotcom.liran-72b.workers.dev. Its live response/browser behavior remains **unverified**: the previous running environment stayed on configuration revision 1 and denied outbound access to workers.dev and both production hostnames even after the owner published an updated environment. The published update is intended to allow `*.workers.dev`, `lirantal.com`, and `www.lirantal.com`. A new session must verify its actual active policy and fresh connections before running remote checks. Native branch-preview URLs may differ from the manual preview; obtain the latest URL from the Cloudflare build for the PR's current commit.

The source, configuration, tests and procedures are committed. Build directories, dependencies, local R2 state and scratch logs are disposable and reproducible. Cloudflare OAuth credentials were stored outside the checkout, under a task-local XDG config directory, and are not part of Git. Expect to authenticate again in a new environment using `cf auth login --no-browser`; never transfer credentials through the handoff prompt or repository. No production domains are attached to this Worker and no production DNS records have been changed.

Next work is deployed-preview acceptance, remaining zone/Page Rule and book-subdomain inspection, then the reviewed production cutover and rollback verification described below. The early failure of an initial `main` build occurred before main contained these migration scripts and is distinct from the successful migration-branch builds.

## Observed zone settings

Read-only inspection on 2026-11-12 found Browser Cache TTL at 14,400 seconds (four hours), email obfuscation enabled, and cache level `aggressive`. The ruleset inventory contained managed normalization/firewall/DDoS rulesets and no custom cache ruleset. No settings were changed. Keep the email opt-out markers, verify the actual custom-domain cache headers after cutover, and review legacy Page Rules separately before concluding that no cache overrides exist.

## Acceptance and cutover

Before switching production:

1. Run `check-cloudflare` against the deployed PR preview, then the Chromium suite against that same URL. Test mobile/desktop navigation, light/dark themes, Pagefind, all eight videos, embeds and downloadable files.
2. Confirm repeated HTML/Markdown/agent-mode requests never share cached representations. Verify direct Markdown MIME types, API discovery, CORS, RSS, robots, OG images, legacy redirects and true error statuses.
3. Inspect the zone's Cache Rules, Browser Cache TTL, redirect/transform rules, bot policies and email rewriting. Preserve `email_off` markers and confirm deployed pages have no broken `/cdn-cgi/l/email-protection` links. Do not disable account-wide settings to accommodate this site.
4. Review and merge the migration only after preview acceptance. Build/deploy the accepted commit to the Cloudflare Worker. Verify before attaching domains.
5. Add the intended production custom domains in the Worker configuration and apply them using `cf`. The current zone already uses Cloudflare nameservers, so no registrar/nameserver change is needed. Explicitly review replacing the existing website A/CNAME records when attaching domains. Preserve MX, TXT and unrelated subdomains.
6. Repeat production checks on apex and www, and the book subdomain's root/checkout redirects. Verify TLS and Cloudflare edge headers. Keep Vercel deployed during the observation period.

Website DNS observed before migration (2026-11-12):

| Host | Type | Target | Proxy |
| --- | --- | --- | --- |
| `lirantal.com` | A | `76.76.21.21` | enabled |
| `www.lirantal.com` | CNAME | `cname.vercel-dns.com` | enabled |
| `nodejs-secure-coding.lirantal.com` | A | `3.33.255.208` | enabled |

The book subdomain currently points to a different IP from the apex. Verify its live ownership and checkout behavior before deciding whether it should move with the main site.

Re-read DNS immediately before cutover and retain the full then-current snapshot. To roll back, remove this Worker's custom-domain bindings and restore only the changed website records from that snapshot. Restore Vercel as the serving host, repeat health/HTML/API checks, and investigate before retrying. No production domain attachment or DNS cutover has been performed by the migration branch.

## Resumed deployed validation (2026-11-12)

The fresh environment has an enforced allowlist for workers.dev, apex and www; fresh HTTPS requests to all three succeed. Apex/www still serve Vercel. Against the manual preview, the complete HTTP checker passed all 980 negotiated routes, alternating representations, discovery, redirects, true errors, HEAD requests, and all eight R2 byte ranges. All nine Chromium regression tests passed. Additional Chromium checks passed mobile navigation, persistent dark mode, real Pagefind results at `/blog`, speaking recording filters (149 to 91 talks), and metadata loading plus midpoint seeking for all eight videos.

Playwright's `route.fetch()` uses a separate HTTP client; in a managed proxy environment, pass `PLAYWRIGHT_PROXY_SERVER="$HTTPS_PROXY"` in addition to `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Ordinary Chromium navigation worked without this, while intercepted fetches otherwise failed with direct-DNS `EAI_AGAIN`. The optional proxy setting leaves local/CI test defaults unchanged. Node HTTP checks use `NODE_USE_ENV_PROXY=1` where needed.

Rebuilt Cloudflare output and bundle passed; 35 Node tests, lint, internal links (966 pages) and social metadata (966 pages, 718 PNGs) passed. Local build used the committed speaking snapshot when the live source fetch failed; this does not establish remote build output parity.

Read-only account inspection found no legacy Page Rules and only managed zone rulesets, with no custom cache/redirect/transform rulesets. Bot Fight Mode, JavaScript bot detection and listed AI crawler blocks are disabled; robots.txt is not managed. Fresh DNS still has the documented Vercel apex/www records and separate book origin. No DNS or zone settings changed. The book subdomain is denied by this environment's outbound policy; its live ownership/checkout remains unverified and it must remain outside the website cutover.

For SCM inspection, use the primary Worker's script tag `7a26bce7fe21463da7baf04fbe5295de`: it watches `main`, with auto builds and previews enabled and the documented production/preview commands. A branch preview has a separate internal script tag (`de0d3008f4df4b22a7d1e4cdd071dc3b` for this branch); its branch-specific settings are not the primary production configuration. Build `e33cb4c0-8784-4ff6-b0f0-8346c138967d` corresponds to commit `725db55`; obtain its successful deployment URL before claiming SCM-preview acceptance.

Pending: latest SCM-preview HTTP/browser acceptance, scheduled bot-push build evidence, preview owner acceptance, and production cutover. No merge or production binding has been authorized by preview acceptance yet.

### SCM and bot-push evidence

SCM build `e33cb4c0-8784-4ff6-b0f0-8346c138967d` succeeded for `725db55`. Its branch URL is https://feat-cloudflare-migration-lirantaldotcom.liran-72b.workers.dev and immutable deployment is https://07ff790b-lirantaldotcom.liran-72b.workers.dev. That immutable deployment passed all 980 HTTP negotiated-route checks, all nine Chromium regressions, mobile menu/theme persistence, Pagefind, and speaking filters. Additional live checks passed canonical/OG images, immutable fingerprinted CSS, negotiated Markdown token headers, repeated HTML/Markdown/crawler/agent JSON alternation, email opt-out markers without generated email-protection links, press downloads, video suffix/midpoint/invalid ranges and ETag conditional requests. Direct Markdown URLs preserve their MIME type; token headers apply to negotiated representations.

The speaking-data workflow now accepts an optional `force_rebuild` boolean for manual dispatch. Its schedule and normal changed-data/stale-event behavior remain unchanged. Dispatching it on `feat/cloudflare-migration` produced empty commit `6c18936ea3dd8323e09e40456571e03ddb06faf9` by `github-actions[bot]`, with an unchanged Git tree. Cloudflare automatically created and started build `c04dfd4a-9b91-4531-9fd0-7b277f1c1154` with `build_trigger_source: push_event` and the bot as author. This directly confirms bot-authenticated empty pushes trigger Workers Builds. GitHub Actions' normal push tests do not rerun for its own token-generated commit; that restriction does not prevent Cloudflare's integration from triggering. Workflow dispatch run: https://github.com/lirantal/lirantaldotcom/actions/runs/43213797637.

Fresh settings remain browser TTL 14,400 seconds, cache level aggressive, email obfuscation on and security level medium. No zone settings were changed. The environment also denies the two external game iframe origins (`v0-chat-gpt-meme-generator.vercel.app`, `v0-chat-gpt-clone-website-nu.vercel.app`); live embed verification awaits allowlist access, not a website fix. Requests to the book subdomain likewise receive proxy CONNECT 403. Do not bypass those policy denials or claim those checks passed.

Final acceptance must use the successful SCM build for the latest PR head, then the owner must accept the preview before merge/custom-domain cutover. Any superseded in-flight build can be cancelled to prioritize that head; cancellation is not a deployment failure. No production DNS or bindings changed during these checks.


## Production cutover (2026-11-12)

The owner accepted the deployed preview and merged PR #55 as `2fa777346436f77cd1cea5825326d6ed698ef557`. Cloudflare production build `82b6422f-8d06-42d5-ae8a-9bb2fbf080ce` succeeded. A light smoke test passed against its temporary main workers.dev endpoint before attaching domains; the exhaustive preview suite was not repeated.

Vercel had paused the project for billing/over-quota, and fresh apex/www requests returned HTTP 402 `DEPLOYMENT_DISABLED` while DNS still pointed to Vercel. The owner explicitly directed proceeding with the Cloudflare switch. Vercel has not been deleted or disconnected, but DNS rollback to Vercel will not restore service until that restriction is resolved.

A fresh complete DNS/domain/route snapshot was captured at `2026-11-12T17:10:48.470Z`. The website-only restoration records are committed in [CLOUDFLARE-ROLLBACK.json](CLOUDFLARE-ROLLBACK.json). The full operational snapshot remains outside Git. Cloudflare's Custom Domains API required removing the two conflicting website records before attaching the domains. Only the apex A (`76.76.21.21`) and www CNAME (`cname.vercel-dns.com`) were replaced. Cloudflare created managed, proxied AAAA records pointing to `100::` for both hostnames; these are Workers routing records, not conventional origin addresses.

Both hostnames are bound to Worker `lirantaldotcom` in account `default`, with production hostname routing enabled and custom-domain preview routing disabled. There are no zone-wide Worker routes. The main workers.dev endpoint is disabled again; workers.dev preview URLs remain enabled. No nameservers, zone settings, media objects, mail configuration, or unrelated subdomains were changed. All 11 unrelated pre-existing DNS records were compared with the fresh snapshot and remained unchanged, including mail records and the separate book origin.

Post-cutover light checks passed: apex 200, www 308 preserving path/query, verified HTTPS, homepage image/mobile navigation, real Pagefind search, health/posts API, discovery headers, HTML/Markdown/agent representation isolation, Markdown token headers, true HTML/API 404s, a legacy speaking redirect, and an R2 byte-range request. Homepage email opt-out markers remain present, with no generated email-protection links or Vercel Analytics script, and production is not marked noindex.

The initial known-good production Worker version is `e3c65b75-3e4e-4c87-bc82-3ef555147887` (deployment `666fe4d8-e5a1-4a7b-a45d-f8a64efd179a`). For a later Worker regression, prefer rolling back to a known-good production Worker version while preserving domain bindings; do not route traffic back to disabled Vercel. The production domain declarations in configuration keep subsequent Git-based deployments aligned with the applied account state.


## Legacy book hostname retired (2026-11-12)

After confirming that no active website links use `nodejs-secure-coding.lirantal.com`, the owner explicitly retired the hostname and cancelled the proposed repair in issue #56. The single proxied A record to `3.33.255.208` was removed from zone `lirantal.com` in account `default`. All other DNS records, including the production apex/www Workers records and mail, were preserved. Do not recreate that record as part of website rollback or migration follow-up. Earlier references to preserving this record describe the pre-retirement cutover history.

The obsolete host-specific root and `/checkout/:path*` redirects were removed from both `vercel.json` and `cloudflare/http-policy.json`, with their regression expectations updated. The live `/books/nodejs-secure-coding` page, homepage book links, and direct Lemon Squeezy purchase links remain unchanged. No Lemon Squeezy products, store domains, or external checkout services were modified.
