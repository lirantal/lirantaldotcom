---
name: writing-style-explainer
description: >
  Gives you writing style instructions for Explainer type articles including tone of voice,
  writing style, structure, content formatting and more.
metadata:
  author: lirantal
  version: 1.1.0
---

# A writing style definition for Explainer-type articles

See the [writing style JSON definition](assets/writing-style.json) for tone, structure, density, and formatting defaults.

## lirantal.com overrides (always apply on this site)

When the article is for **lirantal.com** (used together with the create-lirantal-blog-post skill or `data/blog/` posts), these rules **override** any conflicting checklist lines inside `writing-style.json`:

1. **No terminal References section** — Do not end the post with `## References`, “Further reading” link dumps, or a bibliography block. Satisfy sourcing by placing **≥3 descriptive inline links** to canonical docs, specs, or repos in the body where each topic is introduced or justified.
2. **Opening paragraphs** — Lead with thesis, problem, and why the topic matters. **Do not** open with: who the “intended audience” is, assumed reader personas, disclaimers about scope aimed at reader segments, or **any** mention of the cover/OG/hero image (including AI-generated, Sharp/script-generated, or how the asset was produced). Hero imagery is frontmatter and layout concern only.

All other explainer guidance (trade-off tables, validation commands, FAQ depth, and so on) still applies unless AGENTS.md or the user says otherwise.