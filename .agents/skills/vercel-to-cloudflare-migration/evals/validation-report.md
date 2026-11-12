# Validation record

The package was checked during creation on November 12, 2026.

## Skill and helper checks

- Official skill-creator frontmatter validator passed.
- SKILL.md uses the required workflow/examples/troubleshooting structure and stays below 500 lines.
- Local reference links and portable archive contents were checked.
- The offline DNS auditor passed 14 black-box cases, including protection of root MX/TXT, exact host/type matching, partial pagination, duplicate IDs, renamed records, and value redaction.
- The auditor also accepted the actual cutover and retired-host before/after snapshots with only the explicitly allowed record pairs. Snapshot/credential files are not included in this package.

## Planning scenarios

Three fixture prompts were run with the skill and as no-skill baselines, using six isolated planning agents. All runs were explicitly dry-run only; no cloud access, credential reads or provider mutations were permitted.

| Fixture | With skill | Without skill |
| --- | --- | --- |
| Resume a static migration with proxy-denied preview | 6/6 | 6/6 |
| SSR/auth/Postgres app requiring discovery | 6/6 | 6/6 |
| Accepted cutover with paused Vercel and mixed apex DNS | 6/6 | 4/6 |

Scores reflect manual review of plan text against the expectations in evals.json. The baseline cutover plan did not require verifying the next normal Git deployment or explicitly recording a known-good production Worker rollback version. A previous healthy Cloudflare deployment was mentioned, so this is a narrow missed compound criterion, not a claim the baseline lacked all rollback awareness.

The fixture sample is small and hand-selected. It does not demonstrate live deployment success, universal framework compatibility or a statistically reliable performance advantage. Timing/token data were not supplied and are not invented. Raw outputs and an official-template static review viewer were generated in the task workspace; only the reusable prompts and this summary ship in the package.

Review feedback added partial-host recovery, managed-record audit guidance, a blocked-preview decision tree, and explicit OAuth/session/Postgres/webhook/scheduler checks. The structural/helper tests were rerun after these refinements. Claude-only trigger optimization and human review feedback were not collected.

Version 1.0.1 records the later DNS restoration after an external site's purchase CTA was discovered. It clarifies that searching one repository cannot prove global disuse. This documentation refinement did not change the auditor; package/frontmatter validation was repeated.
