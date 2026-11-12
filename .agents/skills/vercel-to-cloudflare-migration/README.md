# Reuse the migration workflow

Use this skill to move an existing Vercel application to verified Cloudflare hosting
without losing runtime behavior or changing unrelated services. It captures the
lirantal.com migration and generalizes the decisions for static, SSR/authenticated,
and multi-app projects.

## Use in a new chat

Copy [templates/new-session-prompt.txt](templates/new-session-prompt.txt), fill in the
repository/domains and any existing handoff, and give it to the next agent. It links
to the skill on GitHub and tells the agent to read supporting references as needed.
Use the provided source branch URL until the skill is merged to main.

Reading a URL does not globally install a skill or add it to every chat's skill
catalog. The new agent must be able to read GitHub/the referenced resources. It can
use the linked instructions directly or install the whole folder in its project.

## Install into another repository

Copy the complete `vercel-to-cloudflare-migration/` directory, including references,
templates and scripts, into that repository's `.agents/skills/` directory. Check
that client's skill-discovery conventions. Do not copy just SKILL.md and lose its
supporting files. Installation affects that project; global/user-home installation
is a separate user choice.

A packaged `.skill` file is a ZIP with the skill folder at its root. Clients with
skill-import support can import it; otherwise extract it into the target repository:

```sh
python -m zipfile -e vercel-to-cloudflare-migration.skill TARGET_REPO/.agents/skills
```

The package is distributed at `.agents/skill-packages/vercel-to-cloudflare-migration.skill`
in the source repository. It contains no credentials or live-state snapshots.

## Contents and completion

- `SKILL.md`: executable phases, done conditions, examples and troubleshooting.
- `references/`: discovery, network/CLI/SCM, acceptance, cutover/rollback and worked example.
- `templates/`: durable handoff, narrow external check and new-session prompt.
- `scripts/audit_dns_changes.py`: offline before/after DNS audit, with exact name/type allowances.
- `evals/evals.json`: dry-run migration scenarios and expected decisions.
- [evals/validation-report.md](evals/validation-report.md): checks actually performed and their limits.

The skill drives implementation and verification, not a claim that every app uses
Workers Static Assets. Accounts, limits, adapters and CLI schemas must be verified
for each project. Case-study versions/counts are dated observations, not defaults.

## Verify DNS changes without touching an account

```sh
python scripts/audit_dns_changes.py before.json after.json \
  --allow-record example.com:A --allow-record example.com:AAAA \
  --allow-record www.example.com:CNAME --allow-record www.example.com:AAAA
```

Run from the skill directory (or use an absolute script path). Exit 0 means all
observed changes matched the explicit allowed pairs; exit 1 means unexpected DNS
changes; exit 2 means invalid input. Output excludes record values, which may include
verification tokens. The script performs no network requests or DNS mutations and does
not establish that the new site works. It protects apex MX/TXT independently of A/AAAA.

Reproduce the 14 synthetic safety checks with:

```sh
python scripts/test_audit_dns_changes.py
```

The test uses temporary JSON fixtures under a local `work/` directory and does not
contact any provider.

## Validation scope

Package structure, frontmatter, links, archives and the DNS auditor are checked
locally. The scenarios are dry runs: they do not migrate other live apps. Consult
the accompanying PR/report for which agent evaluations were actually run; no provider
availability, universal adapter support, or future deployment success is guaranteed.

Authored from the observed migration workflow, using the repository's
`skill-creator-extra` guide and the official skill-creator guidance for structure and
review. New environments must establish their own access and authorizations.
