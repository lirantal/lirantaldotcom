---
name: create-lirantal-blog-post
description: >
  Creates and publishes new posts on lirantal.com (Astro static blog): adds dated
  markdown under data/blog/, fills frontmatter (title, description, tags, slug, dates,
  full image path), generates an Open Graph-sized cover using Cursor's built-in
  GenerateImage tool, copies it into src/assets/images/blog using the slug as the
  filename stem, and runs npm run build to verify. Use when the user asks for a new
  blog post, draft post, lirantal.com article, Astro blog entry, or a cover image for
  a post--even if they do not name this skill or AGENTS.md.
license: Apache-2.0
compatibility: >
  Requires Node/npm for npm run build. Cursor agent mode with GenerateImage tool
  available (built-in, no external CLI or extensions needed). Repository must match
  lirantal.com layout (data/blog, src/assets/images/blog, AGENTS.md).
metadata:
  author: lirantal
  version: 2.0.0
---

# Create lirantal.com blog posts

# Instructions

Stop ad-hoc blog edits that break the image pipeline or leave drafts half-wired. This
skill drives the full path: correct frontmatter, a real cover file under
src/assets/images/blog, and a green build.

Read [references/conventions.md](references/conventions.md) when you need the exact
frontmatter template or checklist; read [AGENTS.md](../../../AGENTS.md) at repo root
for site-wide blog rules (routes, drafts, tags, HighlightedPosts).

### Step 1: Prepare

1. Take **today's date** from the user environment (session date). Use ISO
   YYYY-MM-DD for filename and frontmatter unless the user specifies another date.
2. From the user's topic, choose a URL-safe **slug** (kebab-case, stable). The cover
   file basename must match the slug (extension matches whatever the generator writes,
   usually `.png`).
3. Confirm the post path: `data/blog/YYYY-MM-DD.md`. If that file already exists, use
   `data/blog/YYYY-MM-DD_short-topic.md` so the post id stays unique.
4. Default cover aspect ratio for social/Open Graph: **1200x630** (roughly 2:1
   landscape). Mention this in the GenerateImage description so the output is
   OG/social-preview friendly.

### Step 2: Create markdown and frontmatter

1. Create the new markdown file under `data/blog/`.
2. Fill frontmatter per [references/conventions.md](references/conventions.md): title,
   description (folded `>-` when long), matching `date` and `pubDate`, `categories`,
   `keywords`, `draft`, lowercase `tags`, `slug`, and a **complete** `image` line pointing
   at the final asset, e.g. `~/assets/images/blog/{slug}.png` (or `.jpg` if you standardize
   on JPEG after generation).
3. Do **not** set `readingTime` (injected at build).
4. Write the post body after the frontmatter. If `draft: true`, say so in a short
   intro so expectations match AGENTS (drafts do not appear on the site).
5. **Body voice (opening and throughout):** Do **not** mention the cover/OG/hero image or
   how it was produced. Do **not** use the opening to enumerate "intended audience,"
   reader personas, or meta scope aimed at "who should read this"--start with thesis and
   substance. When using the writing-style-explainer profile, follow its **lirantal.com
   overrides**: no terminal `## References` section; use descriptive **inline** links in
   the body instead.

### Step 3: Cover Image via Cursor's Built-in GenerateImage Tool

Use Cursor's native **GenerateImage** tool to create the cover. This is a built-in
capability in Cursor agent mode--no external CLI, extensions, API keys, or cleanup
needed.

**Invocation:** Call the `GenerateImage` tool with two arguments:
- `description`: A detailed creative brief for the image (see prompt quality below).
- `filename`: `{slug}.png` -- use the post slug as the filename.

The tool writes the image to a workspace staging path. After generation, **copy** the
file into `src/assets/images/blog/{slug}.png`.

**Prompt quality (avoid generic "AI slop"):**

- Aim for **one clear visual idea**: mood, setting, light, and subject--like editorial
  or cinematic key art, not a diagram.
- Ask for **specific aesthetics** (film grain, analog photo, gouache, neon noir,
  brutalist color blocks, etc.) when it fits the post.
- Always include "Aspect ratio 1200x630 (roughly 2:1 landscape)" in the description
  so the output is Open Graph / social preview friendly.
- **Do not** ask for infographics, flowcharts, labeled diagrams, floating browser
  windows, stock "holographic UI," or busy collages of icons unless the article truly
  requires it.
- Always end the description with: "No text, no logos, no UI elements, no people."
  (unless the brief specifically requires people).

**Example description** (replace bracketed content with post-specific creative brief):

```
Editorial illustration for a technical blog post about [topic].
[2-4 sentences: one clear visual metaphor, mood, lighting direction,
color palette, what to emphasize]. Cinematic depth of field, subtle
film grain, muted color palette of [colors]. Aspect ratio 1200x630
(roughly 2:1 landscape). No text, no logos, no UI elements, no people.
```

**After generation:**

1. The tool output includes the absolute path of the generated file.
2. **Copy** the file into `src/assets/images/blog/{slug}.png` using a shell `cp` command.
3. Confirm frontmatter `image` is set to `~/assets/images/blog/{slug}.png` (path must
   start with `~/assets` per `findImage`).
4. No cleanup step needed--the tool manages its own staging area.

**If generation fails** (tool unavailable or error): tell the user, leave `image`
pointing at the intended final path, and do not claim the cover exists until a file
is in `src/assets/images/blog/`.

### Step 4: Optional homepage feature

If the user wants the post on the homepage "From the blog" list, add its **slug** to
`src/components/blog/HighlightedPosts.astro`. Skip unless they ask.

### Step 5: Verify

1. Run `npm run build` from the repo root.
2. If the build fails on images or frontmatter, fix paths: `image` must start with
   `~/assets` and the file must exist under `src/assets/images/blog/`.
3. Repeat fix and build until the build succeeds.

**Done when:** The markdown file exists with complete frontmatter, the cover file
exists at `src/assets/images/blog/{slug}.{ext}`, `npm run build` passes, and
HighlightedPosts is updated only if requested.

## Examples

```
User says: "Write a blog post about supply chain security for npm"

Actions:
1. Set date to today; slug e.g. supply-chain-security-npm-packages; pick tags like
   "security", "npm", "supply chain".
2. Add data/blog/YYYY-MM-DD.md with full frontmatter; set image to the planned path.
3. Call GenerateImage with a vivid editorial brief and filename
   "supply-chain-security-npm-packages.png"; copy the generated file to
   src/assets/images/blog/supply-chain-security-npm-packages.png.
4. Run npm run build and fix any errors.

Result: A publishable post at /blog/supply-chain-security-npm-packages with a working
cover and successful static build.
```

```
User says: "Draft something on AI agents but don't publish yet"

Actions:
1. Create the post with draft: true and a clear intro that it is a draft.
2. Still add slug, image path, generate cover with GenerateImage, and copy into place.
3. Run npm run build to verify assets resolve.

Result: A draft file that does not appear in listings until draft is false.
```

```
User says: "New post titled 'OAuth device flow' -- image generation failed"

Actions:
1. Report the tool error; keep frontmatter image path as the intended destination.
2. Retry with a simpler description or ask the user to provide a cover manually.

Result: Either a recovered cover or a clear blocker and clean repo state.
```

```
User says: "Make the cover feel like 1970s technical manual but not an infographic"

Actions:
1. Encode that in the GenerateImage description (paper texture, limited palette, single
   object, no labels, retro technical illustration style).

Result: A stylized OG image that matches the brief without chart junk.
```

```
User says: "I already have 2026-03-30.md -- add another post today"

Actions:
1. Use data/blog/2026-03-30_second-topic.md (or similar) for a unique id.
2. Set slug independently of filename; slug drives URL and image basename.

Result: Two posts can share a calendar day without clobbering ids.
```

## Troubleshooting

```
Symptom: Cover does not show or build errors about image
Cause: findImage only accepts paths starting with ~/assets; file missing or wrong name
Solution: Put the file under src/assets/images/blog/; set image to the matching
  ~/assets/images/blog/{slug}.{ext}; re-run npm run build
```

```
Symptom: Post never appears on the site or in RSS
Cause: draft: true or file outside data/blog/**/*.md
Solution: Set draft: false for publish; keep file under data/blog/
```

```
Symptom: GenerateImage tool not available
Cause: Not running in Cursor agent mode, or tool disabled
Solution: Ensure you are in Cursor agent mode. The GenerateImage tool is built-in and
  requires no installation. If still unavailable, ask the user to provide a cover
  image manually and place it at src/assets/images/blog/{slug}.png.
```

```
Symptom: Generated image not at expected path after copy
Cause: Copy command used wrong source path
Solution: Read the absolute path from the GenerateImage tool output; use that exact
  path in the cp command. Verify with ls after copying.
```

```
Symptom: Tag page does not list the post
Cause: Tags not lowercase in frontmatter
Solution: Use lowercase tag strings in YAML array per AGENTS.md
```
