# Migration: APP_NAME

## Current state (replace placeholders with observations)

- Repository / branch / head / main / PR:
- Authorized target account name and verified ID:
- Zones and exact hostnames in scope:
- Retained, deferred and retired hostnames/services:
- Current source/deployed state and remaining work:
- Required preview/production acceptance and authorization already given:
- User's requested test depth and manual next step:

## Runtime and architecture

- Framework/version, static vs dynamic routes:
- Auth/session/callback requirements:
- Data, storage, scheduled work, native/runtime dependencies:
- External providers and ownership boundaries:
- Preview side-effect isolation and scheduler/consumer handoff before main deploy:
- Chosen target and compatibility evidence:
- Asset/media count, sizes, limits checked on DATE:
- Risks/choices genuinely requiring user input:

## Reproducible commands

Record exact working dependency setup, build, postbuild, staging, bundling, media
upload, local runtime and validation commands. Respect this repository's package
manager, engines, lockfile and security policies. Keep placeholders until verified.

## HTTP/browser contract

List required routes/methods, redirects, headers/security, MIME, canonical/social,
APIs/auth, discovery, negotiation, query modes, cache policy, search, errors,
external embeds, downloads and media. Link existing targeted tests.

## Environment and authentication

- Selected environment ID, current observations, observed policy/revision/hosts:
- Fresh request results; blocked hosts and unverified behavior:
- Credential mechanism and setup procedure (no values or credential files):
- Disposable dependencies/artifacts to rebuild:

## Scoped resources and SCM

- Parent Worker name/ID/tag and approved bindings:
- Branch-preview identity (distinct from primary, if applicable):
- Exact Git connection, production branch, preview/branch/path settings:
- Root/build/production-deploy/preview-deploy commands:
- Runtime version and non-secret build variable names:
- Source SHA, build ID, outcome, immutable URL and branch alias:
- Actual bot/scheduled-refresh trigger evidence:

## Acceptance evidence

| Source / deployment | Check | Result | Scope and limitations |
| --- | --- | --- | --- |
| FILL | FILL | passed / failed / blocked | FILL |

Record user preview acceptance if required. A local pass does not count as deployed
acceptance. Record blocked external providers without claiming their behavior works.

## Cutover and rollback

- Fresh full DNS/domain/route snapshot: timestamp and private location:
- Scoped website restoration records and exact expected changed pairs:
- Required zone overrides reviewed; shared settings retained:
- Vercel availability checked (do not assume an unpaused/billable project):
- Known-good production Worker version and source:
- Exact domains/routes to apply and preview/main-endpoint behavior:
- Source configuration persistence and expected next automated build:
- Failure handling / Worker rollback / scoped DNS rollback:
- Observation period and retained providers/resources:

Do not restore an entire historical zone, resurrect deliberately retired records,
or route users to a known-disabled provider. Preserve MX/TXT at the same hostname.

## Final handoff

- Current live endpoints, source/build/version and provider evidence:
- Final production smoke results and unchanged DNS comparison:
- Remaining issues and deliberately excluded resources:
- Material limitations and real fallback availability:
- Next user action, or explicitly no further action:
