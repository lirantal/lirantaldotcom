# Cloudflare migration

The migration branch keeps the current Vercel deployment available while a Cloudflare preview is validated. Production domains are deliberately absent from `cloudflare/cloudflare.config.ts`; deploying this branch does not switch lirantal.com.

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

`cloudflare/handler.mjs` handles Markdown negotiation, agent mode, published speaking aliases, host-specific book redirects, legacy game URLs, structured API 404s and Markdown/HTML 404s. `cloudflare/http-policy.json` records the existing redirect/header contract from Vercel. Keep these policies aligned while both deployments are supported.

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

Re-read DNS immediately before cutover and retain the full then-current snapshot. To roll back, remove this Worker's custom-domain bindings and restore only the changed website records from that snapshot. Restore Vercel as the serving host, repeat health/HTML/API checks, and investigate before retrying. No production domain attachment or DNS cutover has been performed by the migration branch.
