# Production cutover and rollback

## Preconditions and snapshots

Use the agreed preview acceptance and production authorization; do not ask again when
already given. If either is genuinely missing, finish the reviewable preparation and
present exact changes before the necessary decision. "Accept the preview" normally
means the owner's acknowledgment, not an Accept button in Cloudflare.

Verify the merged main deployment before attaching domains. A temporary workers.dev
endpoint or immutable version may help; preserve intended indexing and disable a
temporary endpoint after checks while keeping authorized previews available.

Immediately before mutations, capture:

- Correct account name/ID and zone IDs; current bindings and Worker routes.
- All current DNS records, including IDs, TTL, proxy, priority, comments, tags/settings.
- Effective cache, redirect, transform, bot and email policies relevant to this site.
- Current website origin availability and a known-good production Worker version.
- Exact source commit, build and desired hostname list; restoration steps.

Store complete sensitive snapshots outside public Git. A committed restoration file
can contain only the approved website records and necessary non-secret instructions.
A full snapshot is evidence, not permission to restore an entire historical zone.
Later intentional retirements supersede old snapshots for those resources.

Re-read live website records and compare with the snapshot before deleting anything.
If another actor changed them, inspect the change rather than overwriting it blindly.

## Domain attachment

Prefer native custom-domain bindings for an app that owns a hostname. Choose routes
instead only for a demonstrated architecture need; avoid wildcard routes capturing
other applications. Do not change registrar nameservers when the zone is already on
Cloudflare. Preserve external products and independently hosted subdomains.

In the pinned cf release used in the worked example, `worker.domains` string entries
selected production traffic only, and preview uploads did not apply parent domains.
Confirm current types/behavior before relying on this in a new version. Persist the
intended main workers.dev and preview URL settings too.

When cf lacks a standalone binding operation, consult current official API docs. The
2026-11-12 API used PUT `/accounts/{account_id}/workers/domains` with hostname, service,
zone_id, enabled and previews_enabled. Request/response fields such as environment
have changed over time; do not copy an old payload without checking the current schema.

An externally managed DNS conflict can require deleting the reviewed A/AAAA/CNAME
record before attachment. Treat this as a narrow replacement transaction:

1. Save/re-read exact records and verify hostname, type, content, ID and scope.
2. Attempt the supported binding operation; inspect any real conflict response.
3. Delete only the approved conflicting website records, never root MX/TXT merely
   because their hostname matches the website apex.
4. Attach to the verified Worker, production hostname enabled, preview routing as
   intended. If attachment fails, check whether a binding was actually created;
   restore the scoped records when it was not, and verify before proceeding.
5. Check HTTPS, response/redirect and domain ownership. Inspect resulting managed DNS.
6. Compare every unapproved record with the before snapshot and check zone routes.

Cloudflare-managed Workers records may appear as proxied AAAA `100::`. That is a
platform routing representation, not an origin IP to replace manually. Verify the
actual binding and response rather than inventing another DNS target.

## Partial success and provider-created DNS

Attach the canonical hostname before redirect-only hostnames where possible, so the
new redirect does not send traffic to an unready canonical host. Track each hostname
separately: previous records, deletions, binding ID, certificate/routing state and
smoke result. If one succeeds and another fails, preserve the known-good hostname
unless a reviewed all-or-nothing rollback is safer. Restore only failed/unbound
hostname records; inspect ambiguous API failures before creating conflicting DNS.
Report partial completion accurately and retry/fix the affected hostname.

Managed AAAA additions must be reviewed alongside the removed A/CNAME pairs. The
example audit explicitly permits those same website hostnames' AAAA records. If the
provider proposes other validation records, verify their role/ownership and required
scope before expanding the allowance. Do not blanket-allow every type at the apex.

## Offline DNS audit

The bundled verifier accepts a raw record array, a Cloudflare response containing
`result`, or a snapshot containing `dns`:

```sh
python scripts/audit_dns_changes.py before.json after.json \
  --allow-record example.com:A --allow-record example.com:AAAA \
  --allow-record www.example.com:CNAME --allow-record www.example.com:AAAA
```

Run from the skill folder or use the script's absolute path. Allow only pairs in the
reviewed plan. Names are exact, not glob patterns. The verifier still protects MX/TXT
at `example.com`; a hostname-wide allowlist would miss that error. For a retired host,
allow only its approved record type. Output omits record values and exits nonzero for
unexpected changes. It performs no network requests or mutations.

## Persistence and the last deployment

Commit the applied domain declarations and relevant hosting settings promptly, using
normal review/merge safeguards. During an acknowledged outage, binding an already-
verified production version before the source-only hosting update finishes can be
appropriate within the user's authorization. Do not claim the Git workflow is done
until a normal deployment retains the desired state and the relevant smoke passes.
Do not override repository protections or unrelated live edits to make it happen.

Keep DNS/account changes sequential and scoped. Verify main endpoint disabled versus
preview endpoints enabled separately; confusing them can remove review access.

## Rollback has to be real

A retained Vercel project can still be unavailable. Check fresh requests; a provider
402 DEPLOYMENT_DISABLED or blocked account is not a functioning fallback. Explain the
limitation and follow the user's decision; do not unilaterally buy/upgrade services.
Keep provider billing failures separate from build/test failures.

For a bad Worker release, restore a recorded known-good **production** Worker version
while keeping domains. An accepted preview version may contain preview-only bindings
or noindex flags; do not assume it is a drop-in production rollback.

For DNS rollback:

1. Confirm Vercel is reachable and can actually serve the intended app again.
2. Coordinate/disable the Cloudflare cutover declarations or automatic redeployment
   as appropriate, so account state and source do not fight the rollback.
3. Remove only this app's new custom-domain bindings, then restore only changed
   website records from the fresh approved snapshot, including TTL/proxy settings.
4. Preserve mail, unrelated domains and later intentional changes/retirements.
5. Verify HTTPS, HTML, health/API and provider identity; inspect failures before retry.

Do not test rollback by intentionally sending live users to a known-disabled origin.
Continue observation with the retained project/version until the user chooses cleanup.
