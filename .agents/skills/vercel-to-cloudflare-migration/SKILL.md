---
name: vercel-to-cloudflare-migration
description: >
  Migrates existing Vercel websites and applications to Cloudflare with preserved
  behavior, automatic Git/PR previews, deployed acceptance checks, scoped domain
  cutover, and rollback evidence. Use when the user says "move my Vercel app to
  Cloudflare", "migrate these domains", "continue the Cloudflare migration",
  "validate the Cloudflare migration preview", or "switch production off Vercel". Trigger for resumed
  or multi-app migrations even when the framework is unspecified. Assess static,
  SSR, authentication, databases, and provider integrations before choosing a target;
  do not assume every app fits a static upload. Do not use for unrelated DNS edits
  or creating a new website from scratch.
license: Apache-2.0
compatibility: >
  Requires repository access, authorized Cloudflare access, HTTPS access to relevant
  providers and deployed hosts, and each project's supported build tools. Prefer
  the official cf CLI where supported. Python 3 runs the optional offline DNS audit.
metadata:
  author: lirantal
  version: 1.0.0
---

# Vercel to Cloudflare migration

# Instructions

Move the existing application to working Cloudflare hosting while preserving its
public and private HTTP behavior, source automation, and unrelated services. Produce
reviewable changes, deployed evidence, a scoped rollback record, and a clear next
step. The lirantal.com migration is a worked example, not a universal architecture.

Follow the user's current authorization and requested pace. Progress through
inspection, implementation, fixes and verification autonomously. Honor an agreed
preview-acceptance gate before production changes; an already-given acceptance or
cutover instruction remains valid. Ask only for missing access, a real architecture
choice, or a required acceptance decision. Do not manufacture approval requirements.

For every phase, execute, inspect the result, fix authorized problems, and verify
again until its completion condition is met. A list of findings alone is not a
completed migration. Respond to follow-up questions without abandoning active work.

### Step 1: Establish scope and resume the actual project

1. Read repository `AGENTS.md`, migration handoffs, build/deploy configuration, and
   relevant project skills before editing. Locate the checkout; inspect branch,
   working tree, current main, PR head and checks. Preserve unrelated local changes.
2. Reuse committed implementation and documentation. Recreate dependencies and
   artifacts as needed; do not assume processes, credentials or old logs survived.
3. Identify the exact authorized Cloudflare account name AND ID, zones, hostnames,
   app resources, and Vercel project. A CLI's default selection is not authorization.
4. Classify each hostname as migrate, retain, defer, or explicitly retire. A
   subdomain with a different origin may belong to another product or vendor.
5. For multiple apps, make an inventory and work through apps independently. Do not
   reuse another app's Worker, bucket, secrets or database merely because it exists.

Read [references/discovery.md](references/discovery.md) for the inventory and runtime
choices. Copy [templates/MIGRATION.md](templates/MIGRATION.md) into the project's
established documentation location and fill it with observed facts.

Done when the current source state, authorized resources, domain boundaries and
remaining work are identified without restarting completed work.

### Step 2: Verify access and make setup reproducible

1. In a managed environment, read its runtime instructions; inspect the selected
   instance's observed policy/readiness and startup policy. Match the environment
   ID. Verify fresh requests to preview, apex, www and needed external providers.
2. Separate a proxy CONNECT denial from an origin response. Preserve inherited
   proxies, NO_PROXY and CA trust; do not bypass policy or disable TLS verification.
3. Use the official `cf` CLI for supported administration/deployment. Discover
   commands with anonymous task descriptions via `cf cli search`, inspect their help
   and current schemas, and use documented APIs only for missing capabilities.
4. Authenticate through an approved device/OAuth flow, such as `cf auth login
   --no-browser` when supported. Keep credentials outside Git. Do not request API
   token values in chat or print secret-bearing configuration.
5. Read the project's engines, package-manager pin, lockfile policy and `.npmrc`.
   Preserve those policies. Pin compatible hosting tools. Isolate tooling if
   framework autodetection would select the wrong build/deploy flow.

Read [references/tooling-and-network.md](references/tooling-and-network.md) when
setting up credentials, handling proxy/browser failures, or inspecting SCM builds.

Done when authorized access is demonstrated and the complete build can be
reproduced, or an exact access blocker is documented while independent work continues.

### Step 3: Select architecture from runtime requirements

1. Classify generated pages/assets, dynamic handlers, SSR, authentication/cookies,
   databases, queues, cron jobs, websockets, native dependencies and third parties.
2. Check current framework/adapter support, Node compatibility and Cloudflare plan
   limits. Inspect actual build output; framework labels alone are insufficient.
3. For static apps, consider Workers Static Assets plus a small routing Worker when
   negotiation, rewrites, headers or errors need application logic. Keep expensive
   image/social-card processing at build time when the app already supports that.
4. For SSR/authenticated apps, evaluate the supported runtime adapter and external
   services; test cookies, callbacks, sessions, webhooks and database connectivity.
   Do not force a static export or invent a database migration to D1.
5. Audit file sizes/counts and media needs. Put oversized or range-dependent media
   in approved object storage when appropriate. Recheck current limits rather than
   treating the case-study's numbers as permanent platform rules.

Done when the chosen architecture explains every required behavior and dependency,
with unsupported features or consequential choices resolved before provisioning.

### Step 4: Preserve the HTTP contract and build pipeline

1. Inventory Vercel configuration, platform-provided behavior, observed production
   responses, aliases and external origins. Include meaningful security/header
   defaults rather than assuming a configuration file is the entire contract.
2. Preserve relevant negotiation, redirects, canonical URLs, APIs, MIME types,
   discovery headers, CORS, errors and HEAD behavior. Keep private content protected;
   public CORS and Markdown generation are not appropriate for every endpoint.
3. Implement provider-specific routing around the existing application. Do not
   replace its UI or convert a static app to SSR without a runtime requirement.
4. Encode a complete build: dependency setup, framework build, generated content,
   search indexing, image/social output, routing manifest, asset staging and bundling.
   A bare framework build or bare `cf build` may omit required steps.
5. Preserve the old hosting build/configuration for rollback unless the user directs
   otherwise. Treat analytics and privacy disclosures as explicit migration choices;
   do not silently add a replacement tracking beacon.
6. Keep credentials, generated artifacts and runtime state out of Git. Add targeted
   tests for meaningful changed behavior; reuse existing checks instead of writing
   tests that merely restate configuration.

Read [references/acceptance.md](references/acceptance.md) while implementing the
contract and planning validation. For a comparable static Astro app, read
[references/lirantal-case-study.md](references/lirantal-case-study.md) and inspect the
linked implementation rather than copying it blindly.

Done when the old and new deployment contracts are accounted for and the complete
new build and appropriate local checks pass.

### Step 5: Provision scoped resources and automatic previews

1. Provision only approved app resources in the verified account. Separate media
   uploads from builds when required; overwriting shared object keys affects every
   deployment using them. Snapshot/coordinate changes to shared data or media.
2. Configure the Git integration's production branch, preview behavior, root,
   complete build command, deploy commands and non-secret environment variables.
   Verify both production and preview settings and their different preview flags.
3. Look up the primary Worker ID/tag. A branch preview can have its own internal
   Worker tag/settings; do not misdiagnose those as the parent's production settings.
4. Verify preview URLs are enabled and obtain the URL from the successful build
   for the exact current commit. Record its immutable URL, not only a mutable alias.
5. Confirm scheduled jobs and bot-authenticated pushes, including empty refresh
   commits where used, actually trigger Cloudflare builds. A GitHub Actions token's
   workflow-recursion restriction does not establish an external app's behavior.

Done when a real repository event deploys the correct commit to a reachable preview
and the automation matches the app's refresh/deployment requirements.

### Step 6: Validate the deployed preview and get the agreed acceptance

1. Run appropriate local checks, then actual deployed HTTP and browser checks. Local
   success does not establish remote behavior. Fix failures and repeat affected checks.
2. Alternate HTML, Markdown, crawler and agent/API representations where supported.
   Inspect bodies, types and cache directives; `Vary` alone is not proof of isolation.
3. Exercise responsive navigation, saved themes, real search/filter interactions,
   downloads, metadata, APIs, errors and media playback/seeking as applicable.
4. Test external embeds from the parent page, not only their iframe attributes.
   Report blocked provider dependencies separately from proven site failures.
5. Present commit, immutable preview, results, limits and unresolved blockers. Obtain
   preview acceptance once if that is the agreed gate. "Looks good; proceed" is an
   acknowledgment, not a product-specific Accept button.

If the running environment cannot receive a policy update, provide a narrow,
read-only follow-up prompt using [templates/external-attestation.txt](templates/external-attestation.txt).
A subagent sharing the same executor does not acquire a new network policy.

Done when the agreed checks pass on the actual preview and required acceptance is
recorded. Do not claim blocked checks passed or turn deferred unrelated work into
an unrequested cutover target.

### Step 7: Verify main production before switching traffic

1. Plan the handoff of production schedulers/consumers and isolate preview side
   effects before deploying main, so retaining Vercel does not duplicate processing.
   Recheck the accepted source/checks, merge status and successful main deployment.
   Keep production domains absent until the agreed cutover point.
2. Smoke-test the actual main build/version before attaching domains. If the user
   requests a light pass on an unchanged accepted app, test representative HTTP/UI
   behavior; do not rerun an exhaustive preview suite without a material reason.
3. Recheck Vercel's live availability. A retained project may be paused for billing
   or quota. If it returns 402 DEPLOYMENT_DISABLED, state that rollback is not usable
   and resolve the restriction or obtain the user's informed instruction to proceed.

Done when the intended production build is identified and its smoke test passes,
with the real rollback capability accurately reported.

### Step 8: Snapshot and apply the scoped domain cutover

Read [references/cutover-and-rollback.md](references/cutover-and-rollback.md) before
any DNS/domain mutation.

1. Capture fresh full DNS, domain bindings, routes and relevant zone overrides. Keep
   a scoped restoration record for changed website records and a known-good
   production Worker version. Re-read exact records immediately before mutation.
2. Preserve MX, TXT, mail, unrelated subdomains and applications. Do not change
   nameservers when Cloudflare already hosts the zone. Avoid wildcard zone routes
   that capture unrelated services.
3. Declare only the approved custom domains. Understand whether preview deployments
   apply parent hosting changes in the chosen tooling version.
4. Apply custom-domain bindings to the verified production Worker. If Cloudflare
   reports conflicting externally managed DNS, remove only the reviewed A/AAAA/CNAME
   records for those hostnames and attach the bindings. Preserve records of other
   types even when they share the apex name. Restore the scoped DNS if binding fails.
5. Use current CLI/API documentation and verified account/zone IDs. Do not copy
   deprecated request fields, stale IDs, DNS targets or account resources from examples.

Use [scripts/audit_dns_changes.py](scripts/audit_dns_changes.py) to compare JSON DNS
snapshots with exact allowed name/type pairs. It is an offline verifier, not a
provisioner, deletion script or substitute for a current snapshot.

Done when only approved hostnames route to the intended Worker and DNS comparison
shows no unapproved changes. A saved snapshot alone does not prove rollback works.

### Step 9: Verify production, persist state and observe

1. Test fresh HTTPS on apex/www (as applicable), redirects with path/query, canonical
   metadata, indexing flags, headers, cache isolation, errors, API/health, real search
   and representative media. Check platform transformations such as email rewriting.
2. Disable temporary public endpoints if intended, preserving preview URLs. Keep
   unrelated zone-wide security, cache, bot and email settings intact.
3. Persist applied domain/hosting settings in Git so the next normal deployment does
   not undo manual account changes. Use reviewable changes, expected-head safeguards
   and repository protections; do not bypass failing required checks.
4. Verify the normal Git-triggered production deployment succeeds with the persisted
   settings, then repeat the relevant smoke checks and DNS comparison.
5. Keep Vercel and a known-good production Worker version during observation. For
   Worker regressions, prefer a known-good production version while retaining domains;
   do not send users back to a known-disabled origin.

Done when production works, a normal automated deploy retains the intended state,
rollback evidence is saved, and the user knows their next manual action (or that none
is needed). Report provider billing failures separately from application CI failures.

### Step 10: Leave a durable handoff and handle deferred cleanup

1. Commit commands, account/resource scope, relevant state, URLs, exact source/build
   evidence, tests, limits, known-good version and rollback instructions. Keep secrets
   and full sensitive operational snapshots out of public documentation.
2. Mark historical observations as historical. Do not restore intentionally retired
   records from an old migration snapshot during a later cleanup or rollback.
3. If the user explicitly retires an unused hostname, verify website references and
   current DNS, remove only its approved records and obsolete rules, verify all others
   unchanged, and close the issue with the actual decision. Do not delete external
   vendor products or working purchase links as a side effect.
4. End with deployed status, material limitations, retained rollback capability and
   the next action. Do not imply global skill installation or unseen tests occurred.

## Examples

User says: "I've got several Vercel apps. Let's move them to Cloudflare."

Actions:
1. Inventory each app, account, domain, runtime and dependency; classify scope.
2. Migrate one app through preview, the agreed acceptance gate and production.
3. Verify/persist its state, then repeat for the next authorized app.

Result: Independently verified migrations with scoped resources and rollback records.

User says: "Continue from this branch. The preview was blocked by the old proxy."

Actions:
1. Read committed handoff/source and inspect the current environment's actual policy.
2. Test fresh connections; rebuild disposable artifacts and inspect the current SCM build.
3. Validate the reachable exact preview, or request missing access while continuing independent work.

Result: A resumed migration with honest remote evidence rather than a restart.

User says: "It's a Next.js app with sessions and Postgres; move it off Vercel."

Actions:
1. Inventory runtime handlers, Node/native dependencies, auth callbacks and data connections.
2. Choose and test a supported SSR adapter/runtime, preserving session and data behavior.
3. Repeat preview checks/fixes until the dynamic app works before any production cutover.

Result: A runtime-compatible migration, not a broken static export or assumed D1 move.

User says: "Preview accepted. Vercel is quota-paused; go ahead with the switch."

Actions:
1. Record the limited Vercel rollback capability and smoke-test the main Cloudflare build.
2. Snapshot and replace only approved website records; attach the domains and verify HTTPS.
3. Persist settings, verify the next Git deploy and retain a known-good Worker version.

Result: Working production with accurate fallback information and no repeated permission loop.

User says: "That old book domain is unused. Close the issue and remove its DNS."

Actions:
1. Verify active links and the exact record in the approved account/zone.
2. Remove only that record and obsolete host rules; audit all remaining DNS.
3. Close the repair issue as no longer planned and document intentional retirement.

Result: Retired legacy hosting without disrupting the active book page, checkout or mail.

## Troubleshooting

Error: CONNECT 403 / ERR_TUNNEL_CONNECTION_FAILED.
Cause: The environment proxy denied a destination; this does not establish a site failure.
Solution: Inspect the active policy, request the supported update or a scoped new-environment
attestation, then retry a fresh connection. Do not route around the denial.

Error: Playwright route.fetch reports EAI_AGAIN while normal navigation works.
Cause: Its HTTP client may not inherit the browser/system proxy.
Solution: Configure the test's explicit proxy option from inherited settings for remote
checks; leave local loopback tests unproxied and keep TLS verification enabled.

Error: No preview URLs are returned.
Cause: Preview URLs may be disabled, or the wrong build/Worker was inspected.
Solution: Verify the primary Worker, preview settings and exact successful build; enable
scoped previews when authorized and test the emitted URL.

Error: A build tag appears to watch the feature branch with previews disabled.
Cause: It may be an internal branch-preview Worker, not the parent Worker.
Solution: Resolve the primary tag through the site's actual Worker and inspect both roles.

Error: Custom-domain attachment returns a DNS conflict / HTTP 409.
Cause: A website A/AAAA/CNAME already occupies the hostname.
Solution: Snapshot/re-read it, remove only the reviewed name/type record, attach the domain,
and verify. Do not delete apex MX/TXT or restore a retired unrelated origin.

Error: Production returns Vercel 402 DEPLOYMENT_DISABLED.
Cause: The old provider may have paused the deployment/account for quota or billing.
Solution: Verify the origin, disclose the unusable fallback and act on the user's decision;
do not claim that retaining the project alone provides working rollback.

Error: cf or gh authentication expires mid-session.
Cause: CLI, connector and delegated tooling may have distinct credentials/lifetimes.
Solution: Use an authorized working connector or refresh the supported login flow. Keep
credentials local; do not transfer them between sessions or request tokens in chat.
