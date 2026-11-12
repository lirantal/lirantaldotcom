# Runtime, credentials and SCM

## Access evidence

Inspect the current selected environment, not an ID copied from a previous session.
In managed Codex Cloud, read its runtime skill and environment status. Require current
observations and an enforced policy before treating a desired allowlist as applied.
Inspect startup policy and make fresh requests to actual hosts. Revision numbers are
local to configuration/instances: revision 1 in a new environment can contain the new
allowlist. Compare instance ID and actual allowed hosts, not revision numbers alone.

Use inherited proxies, NO_PROXY and CA trust. A CONNECT 403, origin HTTP 403, DNS
failure and application HTTP 500 are different failures. Do not disable certificate
verification, unset proxies or select another route to bypass an explicit denial.
Use the environment's supported policy-change mechanism. If an update only applies
to a future instance, use a new environment for a tightly scoped read-only check.
A subagent on the same executor normally shares the same policy.

Request all required main hosts and observed dependencies, including www, workers.dev,
iframes, thumbnails, player origins and vendor application assets. Additional embedded
providers can reveal further hosts; record precisely what is still blocked.

## Blocked-preview decision tree

1. If the inherited proxy itself is unreachable, use the runtime's supported sandbox/
   connectivity diagnostic; a failed proxy connection is not an origin response.
2. If CONNECT is denied, inspect current observed allowed hosts. A future saved policy
   does not establish current access. Request the supported update and retry fresh.
3. If this instance cannot receive it, hand only the blocked read-only checks to a
   new verified environment; continue independent source/build work in the original.
4. If a fresh origin response is reachable, diagnose its actual status/body/browser
   behavior. Record collected evidence separately from proposed checks and unknowns.

## CLI and authentication

Prefer the official `cf` CLI where supported. Discover commands with anonymous
resource/action descriptions, e.g. `cf cli search "list Worker build logs"`. Keep
customer domains, names, IDs and secrets out of semantic/docs search queries. Use
actual verified IDs in scoped administrative commands afterward.

Inspect command help and schemas; do not guess flags from Wrangler or another beta.
Pin compatible versions in the project. The CLI may delegate bundling to Wrangler
internally; this does not require switching administrative workflows to Wrangler.
When a standalone operation is unavailable, read the current official API schema and
use the same authorized account. Record that fallback and the scoped mutation.

Use a supported device flow such as `cf auth login --no-browser`. Share only the
verification URL and short-lived device code; do not ask the user to paste API tokens.
Store credentials outside Git, preferably in task-local configuration, and expect to
refresh them. Do not commit/transfer credential files. CLI and connector credentials
may expire independently; use a working authorized connector instead of repeatedly
failing a CLI. Do not print secret values or dump environment variables.

## Node and Chromium proxies

Where supported by the selected Node version, `NODE_USE_ENV_PROXY=1` makes Node HTTP
clients use inherited proxies. Preserve CA settings. For remote Playwright tests,
normal navigation may work while `route.fetch()` tries direct DNS. An opt-in browser
launch/context proxy can configure both:

```js
proxy: process.env.PLAYWRIGHT_PROXY_SERVER
  ? { server: process.env.PLAYWRIGHT_PROXY_SERVER }
  : undefined
```

Invoke remote checks with `PLAYWRIGHT_PROXY_SERVER="$HTTPS_PROXY"` when needed. Keep
that opt-in unset for loopback/CI tests unless their network setup requires it. Use
proper bypass settings if a single proxied test also calls local services. Do not
repurpose system environment variables or turn off TLS verification.

Try the installed Chromium or install from authorized official sources. Report a
specific browser failure instead of assuming browser tests are unavailable.

## Git integration and preview identity

Capture and verify both production and preview settings:

- Exact repository connection, parent Worker ID/tag and production branch.
- Root directory, complete dependency/build/postbuild command, deploy commands.
- Runtime version, account ID and required non-secret variables.
- Managed build-token mechanism; do not replace it with a personal token in Git.
- Preview enablement, allowed branches/paths, auto-build/delete behavior.

A feature branch can have an internal preview Worker with its own tag and apparent
production branch equal to that feature branch. Resolve the real parent Worker via
its name/ID before calling its build configuration; name and tag are not interchangeable
in every endpoint. Do not overwrite correct parent settings based on a child record.

Use successful build metadata to match source SHA and immutable deployment. Read all
log pages when responses are truncated. Empty preview URL arrays can mean preview URLs
are disabled; inspect that specific setting. A manual preview is not evidence that
Git integration works. A docs-only push still needs its own current status inspection.
An early main failure before migration scripts landed is not the branch build result.

For bot refreshes, observe an actual event. A safe controlled empty commit on the
migration branch, made by the existing bot-authenticated workflow, can prove the
external Cloudflare integration triggers. Preserve scheduled behavior; an optional
manual refresh input can be useful. Do not push test commits to production before
acceptance. Record source `push_event`, commit and author; distinguish queued/started,
cancelled superseded builds and successful deployment rather than conflating them.
