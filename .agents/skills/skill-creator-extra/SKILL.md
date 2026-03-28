---
name: skill-creator-extra
description: >
  Creates high-quality agent skills by running the official Claude skill creator plugin
  and then applying a structured set of enhancement phases covering use-case design,
  frontmatter completeness, body structure, writing quality, and progressive disclosure
  architecture. Use this skill when the user wants to create a new skill, improve an
  existing SKILL.md, or asks "how do I write a good skill", "help me make a skill for X",
  "review my SKILL.md", or "turn this workflow into a skill". Trigger even if the user
  just says "let's make a skill" or describes a workflow they want to capture.
license: Apache-2.0
metadata:
  author: lirantal
  version: 1.0.0
---

# Skill Creator Extra

# Instructions

A great skill is not just documentation — it's a set of instructions that drives
an agent to a concrete outcome without requiring the user to direct every step.
This skill layers structured enhancement phases on top of the official Claude skill
creator to produce skills that are well-designed, properly structured, and
immediately useful.

The official skill creator plugin handles the core loop of draft → test → evaluate
→ improve. These phases pick up where it leaves off, adding the craft that turns a
functional skill into an excellent one.

---

### Phase 1: Start with the official skill creator

Begin every new skill by running the official Claude skill creator plugin:
https://claude.com/plugins/skill-creator

It handles:
- Capturing intent and interviewing the user
- Drafting the initial SKILL.md
- Writing test cases and running evals
- Iterating based on qualitative and quantitative feedback
- Optimizing the description for triggering accuracy
- Packaging the final skill

Complete this phase fully before moving to the enhancement phases below.
The enhancements are most useful once a working draft exists.

---

### Phase 2: Design around concrete use-cases

The most common failure mode in skill design is writing a reference document instead
of a workflow. A reference document tells Claude what tools exist. A workflow tells
Claude what to *do* with them and when it's *done*.

Review the draft skill and ask: does it have 2–3 concrete use-cases, or does it
read like a CLI manual?

Each use-case must answer three questions:
- **What is the goal?** — the outcome the user wants, stated plainly
- **What are the steps?** — numbered, specific, executable
- **When is it done?** — a clear completion condition that Claude can verify

The step pattern that works for most agentic skills:

```
1. Prepare — gather what's needed, verify prerequisites
2. Execute — run the main action
3. Analyze — understand what the output means
4. Fix/Act — take the action that resolves the finding or advances the goal
5. Verify — confirm the action worked
6. Repeat steps 3–5 — loop until the done condition is met
```

The loop (execute → analyze → fix → verify → repeat) is what makes a skill actually
useful rather than a prompt that stops after one command. Without an explicit repeat
step, Claude will often report findings and wait rather than driving to resolution.

**Done when:** Every use-case in the skill has a goal, numbered steps including a
verify/repeat step, and an explicit done condition.

---

### Phase 3: Complete and validate the frontmatter

Every SKILL.md frontmatter must include all required fields and should include the
recommended optional fields. Check each one:

**`name`** (required)
- kebab-case only — no spaces, no capitals
- Must match the skill's folder name exactly

**`description`** (required) — the primary triggering mechanism
- Structure: [What it does] + [When to use it] + [Key trigger phrases]
- Under 1024 characters
- No XML tags (no `<` or `>` characters anywhere in the value)
- Include specific things users will actually say: "fix security issues",
  "scan my Dockerfile", "check for CVEs" — not abstract capability descriptions
- Be specific about file types, tools, or domains if relevant
- Write it "pushy": Claude tends to undertrigger skills, so the description
  should proactively tell Claude to use the skill even when the user doesn't
  name it explicitly. Example: "Use this skill even if the user just says
  'check for issues' without mentioning [tool] by name."
- Lead with the outcome, not the mechanism:
  - Good: "Finds and fixes security vulnerabilities in your project..."
  - Bad: "Runs Snyk CLI commands across four scanning domains..."

**`license`** (recommended for open-source skills)
- Common values: `MIT`, `Apache-2.0`

**`compatibility`** (recommended)
- 1–500 characters
- State environment requirements: required CLI tools, OS support, network
  access needs, account prerequisites

**`metadata`** (recommended)
- At minimum: `author` and `version`
- Add `mcp-server` if the skill depends on an MCP server

**Done when:** All required fields are present and valid; optional fields are filled
in where they add useful context for the user or the agent.

---

### Phase 4: Apply the recommended body structure

A SKILL.md body that follows a predictable structure is easier for Claude to navigate
and easier for users to read and contribute to.

Required sections, in order:

**`# [Skill Name]`** — top-level heading

**`# Instructions`** — signals to Claude where executable instructions begin

**`### Step N: [Step name]`** — numbered steps for the main workflow. Steps should
be at the use-case level (Step 1: Identify scope, Step 2: Execute, Step 3: Monitor),
with use-case variants nested underneath each step as needed.

**`## Examples`** — concrete scenarios in this exact format:
```
User says: "[realistic user phrase]"

Actions:
1. [what Claude does first]
2. [what Claude does next]
...

Result: [what the user ends up with — stated as an outcome]
```
Include 3–5 examples that cover: a broad/ambiguous request, a specific targeted
request, and at least one edge case or less-obvious trigger. The "User says" phrase
should sound like a real person talking, not a formal API call.

**`## Troubleshooting`** — common failure modes in this exact format:
```
Error: [the error message or failure symptom]
Cause: [why it happens]
Solution: [how to fix it]
```
Cover authentication failures, missing prerequisites, and any exit codes or error
states that are commonly misunderstood.

**Done when:** The skill body has all four section types in order, with at least
3 examples and the most common failure modes documented.

---

### Phase 5: Apply writing quality and positioning principles

The body is structured. Now make it good.

**Outcome-focused positioning**

The opening paragraph (and the README if there is one) must lead with the problem
being solved and the outcome the user gets — not a description of the tool's
features or architecture.

- Good: "Stop manually chasing security vulnerabilities across your codebase.
  This skill scans your project and fixes what it finds, without you directing
  every step."
- Bad: "This skill runs Snyk CLI commands across four security domains and
  generates vulnerability reports."

**Explain the why, not just the what**

For every instruction in the skill, there should be a reason. Claude is smart enough
to generalize from a well-explained principle; it doesn't need a rule for every edge
case. When you catch yourself writing "ALWAYS" or "NEVER" in all caps, that's a
signal to instead explain *why* the behavior matters — Claude will apply it more
intelligently.

**Imperative form**

Instructions should be direct commands: "Run the scan", "Prioritize Critical and
High severity first", "Re-run to confirm the finding is gone." Not: "You should
consider running the scan" or "It may be helpful to prioritize..."

**Lean prompts**

Remove anything that isn't pulling its weight. If a sentence doesn't change what
Claude does, cut it. Long skills aren't more powerful — they're harder to follow
and more likely to cause Claude to lose the thread.

**Done when:** The opening positions the skill around outcomes. Instructions use
imperative form and explain the why. The skill body has no filler sentences.

---

### Phase 6: Validate progressive disclosure architecture

Skills have three loading levels:
1. **Metadata** (name + description) — always in context, ~100 words
2. **SKILL.md body** — loaded when the skill triggers, target under 500 lines
3. **Reference files** — loaded on demand, unlimited

If the SKILL.md body is approaching 500 lines, the skill needs a second layer
of hierarchy. Move domain-specific content into a `references/` folder and replace
it in SKILL.md with a pointer and a clear statement of when to read it.

Reference file organization:
```
skill-name/
├── SKILL.md
└── references/
    ├── domain-a.md     # read when working on domain A
    ├── domain-b.md     # read when working on domain B
    └── domain-c.md     # read when working on domain C
```

Each reference file should have a table of contents if it exceeds 300 lines.
SKILL.md should tell Claude exactly when to read each file — not just list them,
but say "read `references/domain-a.md` when the user is asking about X."

**Done when:** SKILL.md is under 500 lines. Any domain-specific detail that would
push it over lives in `references/`. Every reference file is pointed to with
explicit guidance on when to load it.

---

## Examples

**Example 1: Creating a skill from scratch**

User says: "I want to make a skill for deploying to AWS using our internal scripts."

Actions:
1. Start Phase 1 — invoke the official skill creator plugin to capture intent,
   draft the skill, and run evals
2. Once a draft exists, apply Phase 2 — identify the concrete use-cases
   (e.g., "deploy to staging", "deploy to production", "rollback a release")
   and ensure each has a goal, steps, and done condition with a verify/repeat loop
3. Phase 3 — check the frontmatter: name matches folder, description mentions
   "deploy", "AWS", "release", "rollback" as trigger phrases, compatibility
   notes the AWS CLI and required environment variables
4. Phase 4 — add Examples with real deploy request phrasing and a Troubleshooting
   section covering auth failures and missing env vars
5. Phase 5 — rewrite the opening to lead with the outcome ("Deploy to AWS in
   seconds without memorizing script flags"), remove filler, add "why" context
   to key instructions
6. Phase 6 — if the skill covers staging, production, and rollback separately,
   move each into `references/` and keep SKILL.md as the workflow router

Result: A complete, well-structured skill that an agent can use to carry a deploy
from start to finish without step-by-step user guidance.

---

**Example 2: Reviewing and improving an existing skill**

User says: "Can you review my SKILL.md and make it better?"

Actions:
1. Read the existing SKILL.md
2. Skip Phase 1 (skill already exists) — go straight to Phase 2
3. Check: does the skill have concrete use-cases with done conditions, or does
   it read like documentation? If it's a reference doc, redesign around use-cases.
4. Work through Phases 3–6 in order, applying each improvement
5. Show before/after for the description and the opening paragraph so the user
   can see the positioning shift

Result: The skill has a validated frontmatter, structured body with examples and
troubleshooting, outcome-focused positioning, and stays under 500 lines with
domain detail in reference files.

---

**Example 3: Capturing a workflow the user just demonstrated**

User says: "We just walked through how I handle PR reviews — turn that into a skill."

Actions:
1. Extract the workflow from the conversation: the tools used, the sequence,
   any corrections the user made, the expected output format
2. Run Phase 1 to draft the skill from what was observed, filling gaps with
   the user before proceeding
3. Apply Phases 2–6 to shape the draft into a well-structured skill

Result: The demonstrated workflow is captured as a reusable skill that another
agent can follow without the user re-explaining the process.

---

## Troubleshooting

**Problem:** The skill triggers too rarely — Claude doesn't use it when it should.
Cause: The description is too narrow or too abstract. It describes what the skill
does mechanically but doesn't list the natural-language phrases users actually say.
Solution: Apply Phase 3. Rewrite the description to include 4–6 specific user
phrases. Add a "trigger even if the user doesn't mention [tool] by name" clause.
Then run the description optimization loop from the official skill creator.

---

**Problem:** The skill triggers but Claude stops after the first action and reports
back instead of driving to completion.
Cause: The skill's use-cases don't have an explicit verify/repeat loop or done
condition. Claude defaults to one-shot behavior unless told to loop.
Solution: Apply Phase 2. Add a verify step and a "Repeat steps N–M until [done
condition]" instruction to each use-case.

---

**Problem:** The SKILL.md is getting long and hard to maintain.
Cause: Domain-specific detail is living in the main skill file instead of reference
files.
Solution: Apply Phase 6. Identify which sections are domain-specific (e.g., one
per language, cloud provider, or tool variant), move each to `references/`, and
replace with a one-line pointer in SKILL.md.

---

**Problem:** The description passes the char limit check but still feels vague.
Cause: The description is feature-focused ("supports four scanning modes") rather
than outcome-focused and trigger-phrase rich.
Solution: Rewrite using the structure: [problem solved for user] + [how] +
[specific phrases that should trigger this]. Cut technical architecture language.
Add the scenarios a real user would describe.
