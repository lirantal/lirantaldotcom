# Discover the real application

Complete an inventory before choosing an architecture or touching DNS.

| Area | Inspect | Migration implication |
| --- | --- | --- |
| Source | AGENTS.md, branch/PR/main, handoff, generated vs tracked files | Resume committed work; preserve local changes |
| Build | Engines, package manager, lockfiles, npm policies, hooks, adapters | Reproduce the entire pipeline |
| Public HTTP | Routes, redirects, headers including meaningful provider defaults, errors, methods | A dist upload may lose behavior |
| Runtime | SSR, route handlers, middleware, streaming, server actions, native modules | Verify runtime/adapter support |
| Data | Database, storage, queues, scheduled work, websocket state | Preserve or separately plan each dependency |
| Auth | Sessions/cookies, OAuth callbacks, CSRF, CORS, trusted hosts | Test previews and production origins explicitly |
| Integrations | Email, payments, webhooks, analytics, embeds | Preserve signatures, destinations and consent/disclosures |
| Assets | Output counts, maximum sizes, generated variants, media | Verify current plan limits and range needs |
| Domains | Account/zone IDs, bindings, origins, ownership, mail | Separate independent products/subdomains |
| Automation | Git integration, branch rules, bot pushes, refresh schedules | Prove actual event-to-deploy behavior |

## Choose from evidence

- **Static output:** Workers Static Assets may fit. A routing Worker can preserve
  negotiation, query modes, headers, rewrites and structured errors. Keep build-time
  Sharp/Satori/native processing in the build when possible.
- **SSR/framework runtime:** Select a currently supported adapter and validate its
  exact version/Node compatibility. For Next.js, investigate current Cloudflare/
  OpenNext guidance rather than assuming a Vercel build or static export is portable.
- **Backend/data:** Keep an existing database external if compatible and appropriate.
  Evaluate drivers, connection pooling, TCP access and runtime limits. A data migration
  needs its own backup, consistency and rollback plan; it is not implied by hosting.
- **Long-lived/native workloads:** Check CPU, memory, execution duration, filesystem,
  native addons, sockets and state. Workers, Containers or another target may have
  different tradeoffs. Surface a genuinely unsupported requirement before changing
  architecture or provisioning paid services.

Do not copy account IDs, buckets, namespaces, databases or domain bindings from the
worked example. Existing resources can belong to another app in the same account.

## Scope table

For each hostname, record owner/service, current DNS/origin, dependency on the app,
intended disposition and authorization. Use `migrate`, `retain`, `defer` or `retire`.
A 404 or unfamiliar origin is a finding to investigate, not permission to delete it.
Retirement requires the owner's decision. Check source, content and rendered links
before concluding an old hostname is unused; external bookmarks cannot be disproven.

## Build reproducibility

Preserve a committed lockfile if the project uses one. If it intentionally has none,
follow that policy rather than generating one. Respect lifecycle-script, peer, engine
and package-age policies. Document any required explicit native dependency setup.

Represent all postbuild stages in commands/CI: search indexing, Markdown/API twins,
images, manifests, redirects, copying into the real deploy bundle, media exclusion and
asset-limit checks. Verify the deployed artifact, not merely the framework's dist.

For static media, inventory size, content type, SHA-256, object key and URL. Verify
current Static Assets size/count/range behavior. An object-store binding can retain
existing public paths through a Worker without requiring a public bucket domain.
Replacing an existing key is a shared content change across previews and production.

## Dynamic-app verification checklist

- **OAuth and sessions:** Plan exact preview callback origins, provider restrictions,
  state/CSRF checks, trusted proxy handling and cookie Domain/Path/Secure/HttpOnly/
  SameSite flags. Preserve compatible session signing/encryption keys and session
  storage through approved secret mechanisms; do not accidentally log out users or
  expose private responses in a shared cache. Test anonymous and cross-user isolation.
- **Postgres:** Verify the actual driver's runtime/TLS support, private-network reach,
  pooling/connection limits, transaction behavior and failure recovery. Treat a proxy
  or pooling service as a separate approved resource; retain data/schema unless a
  separately backed-up data migration is authorized.
- **Payments/webhooks:** Use approved test-mode events. Preserve raw-body signature
  verification, reject invalid signatures, and test retries/deduplication/idempotency
  and response deadlines without real purchases or unapproved side effects.
- **Schedulers/queues:** Identify which provider owns each job/consumer. Deploying a
  main Worker before DNS cutover can start background triggers. Plan the handoff
  before that deployment so old and new providers do not both perform production
  work. Disable/isolate preview side effects, preserve retries/idempotency, and test
  one authoritative production scheduler. Retaining Vercel does not mean leaving
  duplicate cron processing enabled.

For current asset limits, start with the official Workers Static Assets platform
limits documentation: https://developers.cloudflare.com/workers/static-assets/platform/limits/ .
Record the retrieval date, plan and relevant size/count/range capabilities. Do not
substitute this case study's dated 25 MiB/20,000 observations for a current lookup.
