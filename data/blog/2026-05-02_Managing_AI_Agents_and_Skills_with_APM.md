---
title: "Managing AI Agents and Skills with APM"
description: >-
  Microsoft's Agent Package Manager brings package.json-style manifests and lockfiles to
  Claude Skills, MCP servers, and other agent artifacts, with hands-on recipes and sharp
  edges we hit in practice (collections path, meta-packages, security).
date: '2026-05-02'
pubDate: '2026-05-02'
categories: []
keywords:
  - "ai agents"
  - "skills"
  - "mcp"
  - "supply chain"
draft: false
tags:
  - "ai agents"
  - "skills"
  - "mcp"
  - "supply chain"
slug: "managing-ai-agents-and-skills-with-apm"
image: ~/assets/images/blog/managing-ai-agents-and-skills-with-apm.png
---

Agents ship as a graph of versioned artifacts now: Claude Skills, MCP servers, prompts, instruction files, chat modes. Most teams still manage that graph by hand. They copy a `SKILL.md` from a colleague's repo, paste a Cursor rule into a project, and pin nothing. A month later the skill that "worked yesterday" breaks because someone upstream tweaked a line in `SKILL.md` the agent had been leaning on. If you remember the pre-`package-lock.json` era, you know the rest: drift, mystery breakage, zero reproducibility.

[APM, the Agent Package Manager](https://microsoft.github.io/apm/) from Microsoft maps the npm idea onto that stack. You declare dependencies in `apm.yml`, run `apm install`, and you get a lockfile plus a populated runtime directory (`.github/skills/`, `.claude/`, `.cursor/`, depending on what the tool finds on disk). npm already spent years solving this for JavaScript; the agent side does not need to suffer the same lesson in slow motion.

What follows is what APM is, recipes that worked, failures that did not look like failures at first, and the supply-chain weight you pick up when agents install arbitrary GitHub repos as dependencies.

## Background and prior art

A few primitives dominate the agent stack today, and each has its own loading convention. [Claude Skills](https://docs.claude.com/en/docs/claude-code/skills) live in folders containing a `SKILL.md` file with frontmatter; agents load them when their description matches the user's request. [MCP servers](https://modelcontextprotocol.io/) are processes (stdio, HTTP, or SSE) that expose tools and resources to a model, and they get configured per-runtime in JSON files like `.mcp.json` or `.cursor/mcp.json`. Copilot, Cursor, OpenCode, and Gemini each have their own twist on prompts, instructions, agents, and chat modes.

The fragmentation matters because there is no single answer to "how do I share an agent setup with my team." Cursor users hand-paste rules; Claude Code users `git clone` skill repos into `~/.claude/skills/`; Copilot users curate `.github/instructions/`. None of those flows give you a manifest, a lockfile, or a way to say "give me the same thing my teammate has."

npm solved the same shape of problem for Node with `package.json`, `package-lock.json`, a registry, and integrity checks: loose ranges in the manifest, exact pins in the lockfile, verify on install. APM copies that onto agent artifacts, with one big fork: there is no registry. GitHub repos are the registry. Every dependency string ends up as `git clone` plus a path.

## How APM works

If you know npm, the mapping is almost one-to-one:

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

When you run `apm install`, the CLI resolves the dep graph, downloads each package into `apm_modules/`, computes a SHA-256 hash of the resolved content, and writes everything into `apm.lock.yaml`. It then performs a *runtime integration step*: copying or symlinking primitives from `apm_modules/` into your project's runtime directories. If `.claude/` exists in your project, skills land in `.claude/skills/`. If `.github/` exists (Copilot default), they land in `.github/skills/`. The lockfile records `deployed_files` so subsequent installs can reconcile drift.

The auto-detection is convenient but worth understanding. APM picks runtime targets from on-disk presence, falling back to `.github/` if nothing is detected. You can override with `--target claude,cursor` or `--runtime copilot`.

## Trade-offs and alternatives

People solve "share my agent setup" a few different ways, with different governance and ergonomics:

| Approach | Manifest | Lockfile | Registry | Cross-runtime | Audit story |
|---|---|---|---|---|---|
| Hand-managed (`git clone` + copy) | None | None | GitHub | Manual per-runtime | Human review |
| [awesome-copilot](https://github.com/github/awesome-copilot) curation lists | None | None | GitHub | Copilot only | List curators |
| APM | `apm.yml` | `apm.lock.yaml` | GitHub direct | Auto-detect | `apm audit` (Unicode) |
| Claude Code [plugins](https://docs.claude.com/en/docs/claude-code/plugins) | `plugin.json` | None | Marketplace | Claude only | Marketplace review |

Centralized registry vs. distributed Git is the real trade. npm's registry buys scanning, popularity signals, deprecations, [Sigstore-backed provenance](https://docs.npmjs.com/generating-provenance-statements), and one place to scream when things break. APM gives that up for permissionless publishing: any GitHub repo is already a package, no namespace lottery, no review queue. That is close to how Go modules think about the world, and the security section goes into what that costs you.

## Applications and examples

Recipes below go from simple to annoying, each with something you can run to prove it. The example repo [`lirantal/skills`](https://github.com/lirantal/skills) is real; the transcripts match what I saw locally.

### Recipe 1: Install a single skill from a monorepo

One skill from someone else's repo, nothing fancy.

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

### Recipe 2: Build a meta-package that bundles skills and MCPs

Meta-packages are the payoff: one *named, installable bundle* (say, a writing toolkit) that pulls your skills, third-party skills, and MCP servers in one shot. In npm terms, it is a package whose only job is to list other packages.

Typical layout: meta-package lives in a subfolder of your skills repo with its own `apm.yml`:

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

Three packages (the meta-package plus two transitive skills) resolve, hash, and install together. The lockfile records each with its commit and SHA-256 content hash.

This is the recipe that feels closest to npm: you publish a bundle once, consumers add one line to their manifest.

### Recipe 3: The `/collections/` path trap

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

Ignore the "Authentication failed" hint here. Auth is fine; the same token installs `lirantal/skills` and `lirantal/skills/skills/writing-style-explainer`. The object form surfaces the real error:

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

APM's path classifier hard-routes any virtual path containing `/collections/` to a separate parser ([`src/apm_cli/deps/collection_parser.py`](https://github.com/microsoft/apm/blob/main/src/apm_cli/deps/collection_parser.py)). That parser expects a flat `<name>.collection.yml` listing in-repo primitive *files* with `kind ∈ {prompt, instruction, chat-mode, agent, context}`, the curation shape from `github/awesome-copilot`. It ignores `apm.yml` and cannot express transitive deps, MCP servers, or skill packages.

Renaming `collections/` to `bundles/` (or any non-reserved segment) bypasses the classifier. The full debugging walkthrough is captured in [microsoft/apm issue #1094](https://github.com/microsoft/apm/issues/1094).

### Recipe 4: The empty `.apm/` directory workaround

After the rename, `apm install lirantal/skills/bundles/writing` resolves transitive deps correctly, then still throws a non-fatal error and exits non-zero:

```
Failed to download dependency lirantal/skills: Subdirectory is not a valid APM
package or Claude Skill: Not a valid APM package: writing has apm.yml but is
missing the required .apm/ directory.
[!] Installed 2 APM dependencies with 1 error(s).
```

The validator currently rejects an `apm.yml` that only declares dependencies. It wants either a `.apm/` directory with primitives or a `skills/<name>/SKILL.md` skill bundle. A pure meta-package fails the check.

The workaround is a single committed empty directory:

```bash
mkdir -p bundles/writing/.apm
touch bundles/writing/.apm/.gitkeep
git add bundles/writing/.apm/.gitkeep
git commit -m "satisfy apm validator"
```

After this, the install reports `[*] Installed 3 APM dependencies.` cleanly. The `.gitkeep` is a wart: you commit an empty folder to satisfy a structural check that does not match how people think about pure bundles. Same issue thread (#1094) calls this out.

### Recipe 5: Lockfile hygiene for libraries vs. applications

The npm convention transposes directly: applications commit their lockfile, libraries do not. A meta-package like `bundles/writing/` is a library, consumed by other projects. Its own lockfile would only matter if someone ran `apm install` *inside that directory*, which is not the intended use. Consumer projects generate their own lockfile against their own manifest.

```bash
# Inside a meta-package repo: remove the lockfile if it slipped in
git rm bundles/writing/apm.lock.yaml
git commit -m "remove lockfile from meta-package"
```

Validate by running `apm install` from a fresh consumer project and inspecting the generated `apm.lock.yaml`. It should still pin the same commits, because pinning happens consumer-side at resolve time, not from a published lockfile.

### Recipe 6: Editing `apm.yml` by hand

There is no `apm deps add`. `apm install <pkg>` always resolves, fills `apm_modules/`, writes `apm.lock.yaml`, and touches runtime dirs, which is noisy when you only wanted a one-line manifest tweak on a meta-package.

So you edit `apm.yml` in the editor and add the dependency by hand. The schema is small enough that this is usually faster than fighting the CLI for a single line. To sanity-check without writing state:

```bash
apm install --dry-run
```

This resolves the dep graph and reports what would be installed, without writing the lockfile or runtime files. Useful when reviewing a manifest change in a pull request.

## Validation and measurement

Reproducibility is why the lockfile exists. APM exposes a few commands worth knowing:

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

For CI: commit the lockfile in the application repo, then run `apm install` in the pipeline. If resolved content does not match `content_hash`, the install fails. Same vibe as `npm ci`.

`apm outdated` lists deps whose tracked refs have newer commits. A weekly Actions job on that output is a poor person's dependabot for agent deps.

## Security and performance considerations

APM starts from npm-shaped risks and then piles on agent-specific ones. A bad dependency in a Node app is bad; a bad dependency that the model treats as instructions can go sideways faster.

### No central registry, no review

`someone/cool-skill` means `git clone` whatever lives at `https://github.com/someone/cool-skill` at install time. No malware scanning, no [npm provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/), no Sigstore line, no popularity score, no deprecation bit. Trust looks like Go modules: you trust Git to mean what a path says. Account takeovers, repo transfers, and force-pushes on mutable refs are all in play.

### Mutable refs by default

Skip `#tag` or `#sha` and you float on the default branch. `--verbose` may warn ("dependency has no pinned version") but installs still proceed. Pin SHAs in anything production-shaped. Registry-hosted npm tags behave differently from Git tags; Git tags are not your friend for immutability.

### SKILL.md as prompt-injection surface

A skill is mostly markdown the agent reads as instructions. A hostile `SKILL.md` can steer the model toward exfiltrating env vars, writing attacker-controlled code, or walking past guardrails. That is not the same threat as shipping malicious JavaScript in `postinstall`: the dependency body is instructions to a stochastic system. Eyeballing the file yourself does not equal what the model does with it. Read [Anthropic on Skills security](https://www.anthropic.com/engineering/skills) if you only read one external link from this section.

### MCP servers run code

Installing an MCP dep ends with your runtime spawning a subprocess. Think `npm run` for tools. `--trust-transitive-mcp` exists because transitive MCP trust worried the designers too: by default consumers re-declare transitive MCP servers. Leave that default. Review MCP packages the way you would review install scripts: read the code, pin commits, avoid random publishers.

### `--allow-insecure` and HTTP deps

Plain HTTP URLs sit behind a flag. Leave it off in CI. There is no good reason for production manifests to pull deps over HTTP.

### Token scope

Auth goes through `git-credential-fill` or per-org `GITHUB_APM_PAT_<ORG>`. A classic [GitHub PAT](https://github.com/settings/tokens) with `repo` is a blunt instrument (read/write across private repos you can touch). [Fine-grained PATs](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/) scoped to specific orgs are a better match. Per-org overrides like `GITHUB_APM_PAT_LIRANTAL=...` are the primitive you actually want.

### What `apm audit` does (and does not)

Today it hunts hidden Unicode in installed trees, which matters for [Trojan Source](https://trojansource.codes/)-style games. It does not catch clever prompt injection, weird tool behavior, or "this maintainer went rogue." Treat it as one signal next to human review, not a green badge.

### Lockfile hashes are not signatures

`content_hash` stops drift between installs; it does not prove the first fetch was honest. First install trusts the commit you resolved; later installs compare to the saved hash. Nothing like [npm registry signatures](https://docs.npmjs.com/about-registry-signatures) yet.

### Performance

Downloads default to sequential; `--parallel-downloads` exists. For a handful of deps, GitHub rate limits hurt more than bandwidth. Same ballpark as small npm installs, not a ops crisis.

Net: APM feels like early npm, useful and light on supply-chain hardening. Pin SHAs, use narrow PATs, review MCP servers yourself, and assume any installed skill can whisper bad ideas to the model.

## Limitations and future work

A few gaps showed up while writing the recipes:

### Meta-packages need a fake `.apm/` dir

The empty `.apm/` workaround is silly. A deps-only bundle is a normal pattern in npm land; APM should accept it without a placeholder directory.

### The `/collections/` classifier

Virtual paths containing `/collections/` get forced through a parser built for `awesome-copilot`-style curation files, not arbitrary `apm.yml` bundles. Details and a proposed fix (prefer `apm.yml` when present) live in [microsoft/apm#1094](https://github.com/microsoft/apm/issues/1094).

### No SemVer ranges

You pin exact tag, exact SHA, or ride a branch. No `^1.2.0` story yet. Given how loosely versioned most agent artifacts are today, that is understandable, but it also means less automation for safe updates.

### No registry metadata layer

No deprecations, no advisory stream, no "maintainer went quiet" signal. [GitHub Advisory Database](https://github.com/advisories) covers traditional packages, not skills or MCP servers as first-class citizens.

## FAQ

**Do I need both `apm.yml` and `apm.lock.yaml` every time?** Apps: yes, commit both (intent vs frozen graph). Library or meta-package repos: manifest only; consumers own their own lockfile.

**How do I pin so nothing drifts?** Append `#<sha>`: `lirantal/skills/skills/foo#a3a2819`. Tags work (`#v1.0.0`) but Git tags can move; SHAs cannot.

**APM in CI without leaking a PAT?** Public repos can install anonymously. Private deps want `GITHUB_APM_PAT_<ORG>` as a secret, ideally a fine-grained PAT scoped to that org. Skip personal classic PATs in shared pipelines.

**Skill vs MCP in this model?** Skill: files the model reads when relevant. MCP: long-lived process for tools/resources. APM installs both but wires skills into `.github/skills/` (or the detected runtime) and MCP into that runtime's MCP config.

**Commit `apm_modules/`?** No. APM adds it to `.gitignore`. Same story as `node_modules/`: regenerate from the lockfile.

## One concrete next step

Run `apm install lirantal/skills/bundles/writing` in a throwaway directory, open `.github/skills/` and `apm.lock.yaml`, and see if the layout matches your mental model. If it does, try porting one real Cursor or Claude setup to `apm.yml` with every dep on a SHA and notice how much quieter "works on my machine" becomes.

Issues you hit along the way belong in [microsoft/apm](https://github.com/microsoft/apm/issues); several of the behaviors above already trace back to that thread. For day-to-day noise from me: [@liran_tal](https://x.com/liran_tal), code and experiments on [GitHub](https://github.com/lirantal).
