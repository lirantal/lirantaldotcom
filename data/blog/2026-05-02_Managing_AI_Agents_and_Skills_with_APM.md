# Managing AI Agents and Skills with APM: An npm-Style Workflow for the Agent Stack

Agents now ship as a graph of versioned artifacts — Claude Skills, MCP servers, prompts, instruction files, chat modes — and most teams manage that graph by hand. They copy a `SKILL.md` from a colleague's repo, paste a Cursor rule into a project, and pin nothing. A month later, the skill that "worked yesterday" no longer works because someone upstream rewrote a sentence in `SKILL.md` that the agent was relying on. The result is a familiar failure mode for anyone who lived through the pre-`package-lock.json` era: drift, mystery breakage, and zero reproducibility.

[APM, the Agent Package Manager](https://microsoft.github.io/apm/) from Microsoft, ports the npm mental model onto that stack. You declare dependencies in `apm.yml`, run `apm install`, and get a lockfile plus a populated runtime directory (`.github/skills/`, `.claude/`, `.cursor/`, depending on what your project targets). The premise is that the npm ecosystem solved this problem for JavaScript twenty years ago, and the agent ecosystem should not relearn the lesson the slow way.

This post is a hands-on tour. It covers what APM is, the recipes that work, the ones that fail in non-obvious ways, and the supply-chain implications you inherit when your AI agents start consuming dependencies from random GitHub repositories.

## Background and Prior Art

Three primitives dominate the agent stack today, and each has its own loading convention. [Claude Skills](https://docs.claude.com/en/docs/claude-code/skills) live in folders containing a `SKILL.md` file with frontmatter; agents load them when their description matches the user's request. [MCP servers](https://modelcontextprotocol.io/) are processes (stdio, HTTP, or SSE) that expose tools and resources to a model, and they get configured per-runtime in JSON files like `.mcp.json` or `.cursor/mcp.json`. Copilot, Cursor, OpenCode, and Gemini each have their own twist on prompts, instructions, agents, and chat modes.

The fragmentation matters because there is no single answer to "how do I share an agent setup with my team." Cursor users hand-paste rules; Claude Code users `git clone` skill repos into `~/.claude/skills/`; Copilot users curate `.github/instructions/`. None of those flows give you a manifest, a lockfile, or a way to say "give me the same thing my teammate has."

npm solved an isomorphic problem for Node packages with `package.json` plus `package-lock.json`, plus a registry, plus integrity hashes. The mechanics are well-understood: declare loose ranges in the manifest, freeze exact resolutions in the lockfile, verify via integrity hashes on install. APM transposes all of that onto agent artifacts, with one notable architectural choice — there is no registry. GitHub repos are the registry. Every dependency string resolves to `git clone` plus a path.

## How APM Works

The mechanism mirrors npm closely enough that the analogies are nearly one-to-one:

| npm | APM | Role |
|---|---|---|
| `package.json` | `apm.yml` | Manifest declaring deps |
| `node_modules/` | `apm_modules/` | Local resolved dep tree |
| `package-lock.json` | `apm.lock.yaml` | Pinned commit + content hash |
| `npm install` | `apm install` | Resolve, fetch, install |
| `npmjs.com` registry | GitHub repos directly | Source of truth |
| Install scripts | Runtime integration step | Side effects on install |

A minimal `apm.yml` looks like this:

```yaml
name: my-project
version: 0.1.0
dependencies:
  apm:
    - lirantal/skills/skills/writing-style-explainer
    - blader/humanizer#main
  mcp:
    - io.github.github/github-mcp-server
includes: auto
```

The shorthand `owner/repo` resolves to `https://github.com/owner/repo.git`. A subpath like `owner/repo/skills/foo` targets a folder inside the repo. A `#tag` or `#sha` pins a specific ref. The [manifest schema reference](https://microsoft.github.io/apm/reference/manifest-schema/) describes the full grammar, including an object form (`git:`, `path:`, `ref:`, `alias:`) for ambiguous cases.

When you run `apm install`, the CLI resolves the dep graph, downloads each package into `apm_modules/`, computes a SHA-256 hash of the resolved content, and writes everything into `apm.lock.yaml`. It then performs a *runtime integration step* — copying or symlinking primitives from `apm_modules/` into your project's runtime directories. If `.claude/` exists in your project, skills land in `.claude/skills/`. If `.github/` exists (Copilot default), they land in `.github/skills/`. The lockfile records `deployed_files` so subsequent installs can reconcile drift.

The auto-detection is convenient but worth understanding. APM picks runtime targets from on-disk presence, falling back to `.github/` if nothing is detected. You can override with `--target claude,cursor` or `--runtime copilot`.

## Trade-offs and Alternatives

Three approaches dominate the "share my agent setup" problem today, with different governance and ergonomics profiles:

| Approach | Manifest | Lockfile | Registry | Cross-runtime | Audit story |
|---|---|---|---|---|---|
| Hand-managed (`git clone` + copy) | None | None | GitHub | Manual per-runtime | Human review |
| [awesome-copilot](https://github.com/github/awesome-copilot) curation lists | None | None | GitHub | Copilot only | List curators |
| APM | `apm.yml` | `apm.lock.yaml` | GitHub direct | Auto-detect | `apm audit` (Unicode) |
| Claude Code [plugins](https://docs.claude.com/en/docs/claude-code/plugins) | `plugin.json` | None | Marketplace | Claude only | Marketplace review |

The key trade-off is registry centralization vs. distribution. npm's central registry buys you malware scanning, popularity signals, deprecation flags, [Sigstore-backed provenance](https://docs.npmjs.com/generating-provenance-statements), and a single throat to choke when something goes wrong. APM trades all of that for permissionless publishing — anyone with a GitHub repo is already a publisher, no namespace to claim, no review queue. That is a deliberate design choice that mirrors how Go modules work, and it has the same security implications, which the security section unpacks.

## Applications and Examples

The remainder of the post is a sequence of recipes, ordered roughly by complexity. Each ends with verification — the commands or output that confirm the recipe actually worked. Treat them as runnable; the example repo at [`lirantal/skills`](https://github.com/lirantal/skills) is real, and the commands below produce the output shown.

### Recipe 1: Install a Single Skill From a Monorepo

The simplest case. Your project wants one skill from someone else's repo.

```bash
mkdir my-agent-project && cd my-agent-project
apm install lirantal/skills/skills/writing-style-explainer
```

Expected output (abridged):
```
[+] github.com/lirantal/skills/skills/writing-style-explainer
|-- Skill integrated -> .github/skills/
[*] Installed 1 APM dependency.
```

The subpath form `owner/repo/skills/<name>` is a virtual subdirectory package. APM downloads the targeting folder (containing `SKILL.md`), records the resolved commit in `apm.lock.yaml`, and integrates the skill into the runtime directory. Pin the version with `#main` or, better, `#<sha>` for true reproducibility:

```bash
apm install lirantal/skills/skills/writing-style-explainer#a3a2819
```

Quick check: open `apm.lock.yaml` and confirm `resolved_commit` matches the SHA you pinned.

### Recipe 2: Build a Meta-Package That Bundles Skills and MCPs

This is where APM earns its weight. You want a *named, installable bundle* — say, "the writing toolkit" — that pulls in your own skills, third-party skills, and MCP servers in one shot. In npm terms, this is a package whose only job is to declare dependencies on others.

The intuitive layout puts the meta-package in a subfolder of your skills repo, with its own `apm.yml`:

```
lirantal/skills/                    (one repo)
├── skills/
│   ├── writing-style-explainer/    (single SKILL.md skill)
│   └── gh-bulk-repo-edit/
└── bundles/
    └── writing/
        ├── apm.yml                 (meta-package manifest)
        └── .apm/.gitkeep           (placeholder, see Recipe 4)
```

The manifest at `bundles/writing/apm.yml`:

```yaml
name: writing
version: 1.0.0
description: Curated writing skills and tooling
dependencies:
  apm:
    - lirantal/skills/skills/writing-style-explainer
    - blader/humanizer
  mcp: []
includes: auto
```

Consumers install with one command:

```bash
apm install lirantal/skills/bundles/writing
```

Expected output:
```
[+] github.com/lirantal/skills/bundles/writing (cached)
[+] blader/humanizer (cached)
|-- Skill integrated -> .github/skills/
[+] github.com/lirantal/skills/skills/writing-style-explainer (cached)
|-- Skill integrated -> .github/skills/
[*] Installed 3 APM dependencies.
```

Three packages — the meta-package itself plus the two transitive skills — all resolved, hashed, and installed. The lockfile records each with its commit and SHA-256 content hash.

In practice, this is the recipe that maps cleanest onto the npm experience. You publish a "framework bundle" once, and any project that wants the bundle declares one line in its manifest.

### Recipe 3: The `/collections/` Path Trap

The recipe above hides a sharp edge that cost real debugging time. The original folder name was `collections/writing/`, not `bundles/writing/`. From a fresh project:

```bash
apm install lirantal/skills/collections/writing --verbose
```
```
[*] Validating 1 package...
  Auth resolved: host=github.com, org=lirantal, source=git-credential-fill
  Authentication failed for accessing lirantal/skills/collections/writing
[x] lirantal/skills/collections/writing -- not accessible or doesn't exist
```

The "Authentication failed" hint is misleading. Auth is fine; the same token successfully installs `lirantal/skills` and `lirantal/skills/skills/writing-style-explainer`. The object form exposes the real cause:

```yaml
dependencies:
  apm:
    - git: https://github.com/lirantal/skills
      path: collections/writing
```
```
Failed to download dependency: Collection manifest not found:
collections/writing.collection.yml (also tried .yaml)
```

APM's path classifier hard-routes any virtual path containing `/collections/` to a separate parser ([`src/apm_cli/deps/collection_parser.py`](https://github.com/microsoft/apm/blob/main/src/apm_cli/deps/collection_parser.py)). That parser expects a flat `<name>.collection.yml` file listing in-repo primitive *files* with `kind ∈ {prompt, instruction, chat-mode, agent, context}` — a curation format inherited from `github/awesome-copilot`. It does not honor `apm.yml` and cannot express transitive deps, MCP servers, or skill packages.

Renaming `collections/` to `bundles/` (or any non-reserved segment) bypasses the classifier. The full debugging walkthrough is captured in [microsoft/apm issue #1094](https://github.com/microsoft/apm/issues/1094).

### Recipe 4: The Empty `.apm/` Directory Workaround

After the rename, `apm install lirantal/skills/bundles/writing` resolves transitive deps correctly — but emits a non-fatal error and exits with a non-zero status:

```
Failed to download dependency lirantal/skills: Subdirectory is not a valid APM
package or Claude Skill: Not a valid APM package: writing has apm.yml but is
missing the required .apm/ directory.
[!] Installed 2 APM dependencies with 1 error(s).
```

The validator currently rejects an `apm.yml` whose only role is declaring dependencies — it requires either a `.apm/` directory with primitives or a `skills/<name>/SKILL.md` skill bundle. A pure meta-package fails the check.

The workaround is a single committed empty directory:

```bash
mkdir -p bundles/writing/.apm
touch bundles/writing/.apm/.gitkeep
git add bundles/writing/.apm/.gitkeep
git commit -m "satisfy apm validator"
```

After this, the install reports `[*] Installed 3 APM dependencies.` cleanly. The `.gitkeep` is a wart — the user has to commit a placeholder file to humor a structural check that does not reflect any real requirement. This is also tracked in issue #1094 as a separate gap.

### Recipe 5: Lockfile Hygiene for Libraries vs. Applications

The npm convention transposes directly: applications commit their lockfile, libraries do not. A meta-package like `bundles/writing/` is a library, consumed by other projects. Its own lockfile would only matter if someone ran `apm install` *inside that directory*, which is not the intended use. Consumer projects generate their own lockfile against their own manifest.

```bash
# Inside a meta-package repo — remove the lockfile if it slipped in
git rm bundles/writing/apm.lock.yaml
git commit -m "remove lockfile from meta-package"
```

Validate by running `apm install` from a fresh consumer project and inspecting the generated `apm.lock.yaml` — it should still pin the same commits, because pinning happens consumer-side at resolve time, not from a published lockfile.

### Recipe 6: Editing `apm.yml` By Hand

APM has no `apm deps add` subcommand. Every modification to the manifest goes through `apm install <pkg>`, which also resolves, downloads to `apm_modules/`, writes `apm.lock.yaml`, and scaffolds runtime targets. For a meta-package, that is mostly noise — you want to add a dependency to the manifest without producing artifacts.

The honest answer: open `apm.yml` in your editor and add the line. The schema is small enough that hand-editing is faster than running the CLI for a single dependency. To validate without persisting state, use the dry-run flag:

```bash
apm install --dry-run
```

This resolves the dep graph and reports what would be installed, without writing the lockfile or runtime files. Useful when reviewing a manifest change in a pull request.

## Validation and Measurement

Reproducibility is the whole point of a lockfile, and APM gives you several commands to verify it:

```bash
# What does the dep graph look like?
apm deps tree

# Are all installed packages present and intact?
apm install   # idempotent; no-op if lockfile and apm_modules/ agree

# Does any installed file contain hidden Unicode characters
# (trojan-source attacks)?
apm audit
```

The lockfile itself is the strongest verification artifact. Each entry pins `resolved_commit` (a Git SHA) and `content_hash` (SHA-256 of resolved content):

```yaml
- repo_url: blader/humanizer
  host: github.com
  resolved_commit: 8b3a17889fbf12bedae20974a3c9f9de746ed754
  package_type: claude_skill
  deployed_files: [.github/skills/humanizer]
  content_hash: sha256:b813857f183da05d08d5a80adac671df94c139f855809bd47ab8b7bb245546a2
```

To validate a CI install, commit the lockfile in your application repo, then run `apm install` in CI. If the resolved content does not match the recorded `content_hash`, the install fails. This is the moral equivalent of `npm ci`.

For drift detection, `apm outdated` reports dependencies that have newer commits available on their tracked refs. Wire it into a weekly GitHub Actions job and you have a mini-dependabot for your agent stack.

## Security and Performance Considerations

APM inherits npm's threat model and adds two new attack surfaces. The threat model is worth examining carefully because the consequences of a compromised dependency are arguably *more severe* in the agent stack than in a typical Node application.

**No central registry, no review.** A dependency string like `someone/cool-skill` resolves to a `git clone` of whatever happens to live at `https://github.com/someone/cool-skill` at install time. There is no malware scanning, no [npm provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/), no Sigstore signatures, no popularity signal, no deprecation flag. The trust model is exactly Go modules — you trust the upstream Git host to be honest about what's at a given path. Account takeovers, repo transfers, and force-pushes to mutable refs are all in-scope.

**Mutable refs by default.** A dependency without `#tag` or `#sha` floats on the default branch. APM warns about this in `--verbose` diagnostics ("dependency has no pinned version") but does not block installs. Pin to a SHA in production manifests. This matters more than in npm because npm tags are immutable on the registry side, while Git tags are not.

**SKILL.md is a prompt-injection vector.** A skill is, at its core, a markdown file that an AI agent reads as instructions. A malicious upstream `SKILL.md` can instruct the consuming agent to exfiltrate environment variables, write attacker-controlled code, or bypass safety guardrails. This is fundamentally a new class of supply-chain attack that does not exist in traditional package managers — the dependency content *is* executable instructions to a probabilistic system. There is no analog of "I'll just read the source." Reading the markdown does not protect you because the agent reads it differently than you do. [Anthropic's recent post on Skills security](https://www.anthropic.com/engineering/skills) is essential reading here.

**MCP servers are arbitrary code execution.** When APM installs an MCP dependency, the consuming runtime spawns the server as a subprocess. That is `npm run` semantics for agent tools. The `--trust-transitive-mcp` flag explicitly exists, which tells you Microsoft also considers transitive MCP trust a concern; by default, transitive MCP servers must be re-declared by the consumer to install. Keep that default. Audit MCP servers like you would audit npm install scripts — read the code, pin the version, and avoid unfamiliar publishers.

**The `--allow-insecure` HTTP flag.** APM permits HTTP (not HTTPS) URLs as dependencies behind a CLI flag. Treat this as a never-in-CI footgun. There is no scenario in which a production manifest should resolve a dependency over plain HTTP, and the flag should be off in any CI pipeline.

**Token scope.** The CLI authenticates via `git-credential-fill` or per-org `GITHUB_APM_PAT_<ORG>` env vars. The classic `repo` scope on a [GitHub PAT](https://github.com/settings/tokens) is broad — read/write access to all your private repos. The [fine-grained PAT model](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/) is a much better fit: scope the token to the specific orgs you install from. The per-org override (`GITHUB_APM_PAT_LIRANTAL=…`) is the right primitive; use it.

**`apm audit` is narrow.** The current audit command scans for hidden Unicode characters in installed packages — defending against the [Trojan Source](https://trojansource.codes/) class of attacks. That is genuinely useful but does not cover prompt-injection patterns, suspicious tool calls, or known-bad publishers. There is room for a much richer audit story; in the meantime, treat `apm audit` as one input alongside human review and content scanning.

**Lockfile integrity is unsigned.** The `content_hash` field protects against drift between install runs but does not assert that the original content was authentic. A first-time install pulls whatever is at the resolved commit; only subsequent installs verify against the recorded hash. There is no equivalent of [npm's signed package metadata](https://docs.npmjs.com/about-registry-signatures) yet.

**Performance is fine.** APM downloads are sequential by default with `--parallel-downloads` configurable up to your network ceiling. For a project with a dozen deps, install time is dominated by GitHub API rate-limiting more than transfer. This is well within npm's range and not a meaningful operational concern.

The composite picture: APM is at a security maturity comparable to early npm — usable, useful, and missing the supply-chain hardening that took npm a decade and several high-profile incidents to acquire. Pin by SHA, prefer fine-grained PATs, audit your MCP servers manually, and assume any skill you install can read a malicious instruction into the consuming agent.

## Limitations and Future Work

Three concrete gaps stand out from working through the recipes above:

**No first-class meta-package shape.** The empty `.apm/` workaround is a wart. A pure dependency-only package is a legitimate use case (npm calls them "framework bundles" and treats them as ordinary packages); APM should accept it without filesystem placeholders.

**The `/collections/` path-segment classifier is greedy.** It hard-routes virtual paths to a parser that cannot express what most authors want. Tracked in [issue #1094](https://github.com/microsoft/apm/issues/1094). The fix proposed there — let `apm.yml` take priority when present — is straightforward.

**No SemVer ranges.** Dependencies pin by exact tag, exact SHA, or float on a branch. There is no `^1.2.0` equivalent that allows automatic patch updates within a major. Given that most agent artifacts do not yet adopt SemVer rigorously, this is defensible — but it limits update tooling.

**No registry-side metadata.** No deprecation flags, no advisory feed, no "this maintainer is no longer active" signals. The [GitHub Advisory Database](https://github.com/advisories) covers code packages but not skills or MCP servers as separate entities.

## FAQ

**Q: Do I need both `apm.yml` and `apm.lock.yaml` in every project?**
A: Yes for applications, no for libraries. Application repos commit both — the manifest declares intent, the lockfile freezes resolution. Library/meta-package repos commit only the manifest; consumers generate their own lockfile.

**Q: How do I pin a dependency so it cannot drift?**
A: Append `#<sha>` to the dependency string: `lirantal/skills/skills/foo#a3a2819`. Tags work too (`#v1.0.0`) but Git tags are mutable, while SHAs are not. Prefer SHAs for production manifests.

**Q: Can I use APM in CI without exposing a PAT?**
A: For public repos, yes — APM falls back to anonymous GitHub access. For private deps, set `GITHUB_APM_PAT_<ORG>` as a GitHub Actions secret, scoped to the relevant org via a fine-grained PAT. Avoid using a personal classic PAT in CI.

**Q: What is the difference between a Skill and an MCP server in this model?**
A: A skill is content (markdown instructions plus assets) the agent reads when relevant. An MCP server is a process the agent communicates with at runtime to call tools or fetch resources. APM installs both as dependencies but integrates them differently — skills land in `.github/skills/` (or runtime equivalent), MCP servers register in your runtime's MCP config.

**Q: Should I commit `apm_modules/`?**
A: No. APM auto-adds it to `.gitignore` on first install. Treat it like `node_modules/` — regenerated from the lockfile, never the source of truth.

## Next Steps

Pick one of the following and report findings:

1. Install the bundle from the live example: `apm install lirantal/skills/bundles/writing` in a fresh directory and inspect what lands in `.github/skills/` and `apm.lock.yaml`.
2. Convert one of your existing Cursor/Claude/Copilot setups into an `apm.yml`. Pin every dependency to a SHA. Compare reproducibility before and after.
3. Read [APM's anatomy doc](https://microsoft.github.io/apm/introduction/anatomy-of-an-apm-package/) and decide whether a meta-package or an `.apm/`-layout package fits your team's distribution model better.
4. File issues on [microsoft/apm](https://github.com/microsoft/apm/issues) for any gaps you hit. The maintainers respond quickly, and several of the recipes above came from upstream feedback.
5. Pilot `apm audit` and a weekly `apm outdated` job in a non-critical project before rolling it into shared infrastructure.

Follow [@liran_tal](https://x.com/liran_tal) on X/Twitter for updates and explore related work on [GitHub](https://github.com/lirantal).
