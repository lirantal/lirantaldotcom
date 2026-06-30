---
name: create-lirantal-blog-post
description: >
  Creates and publishes new posts on lirantal.com (Astro static blog): adds dated
  markdown under data/blog/, fills frontmatter (title, description, tags, slug, dates,
  full image path), generates an Open Graph-sized cover using the available Cursor
  GenerateImage or Codex image_gen tool, copies it into src/assets/images/blog using
  the slug as the filename stem, and runs npm run build to verify. Use when the user
  asks for a new blog post, draft post, lirantal.com article, Astro blog entry, or a
  cover image for a post--even if they do not name this skill or AGENTS.md.
license: Apache-2.0
compatibility: >
  Requires Node/npm for npm run build. Use Cursor GenerateImage in Cursor agent mode
  or Codex image_gen in Codex; no external image API is required. Repository must
  match lirantal.com layout (data/blog, src/assets/images/blog, AGENTS.md).
metadata:
  author: lirantal
  version: 2.1.0
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
   landscape). Mention this in the image-generation prompt so the output is
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

### Step 3: Cover image via Cursor or Codex

Use the image generation capability available in the current agent environment. The
goal is the same in both Cursor and Codex: generate one real raster cover, save it
under `src/assets/images/blog/{slug}.png`, and point frontmatter at that exact file.

#### Cursor agent mode

Use Cursor's native **GenerateImage** tool. It is built in to Cursor agent mode and
does not require external CLI tools, extensions, API keys, or cleanup.

**Invocation:** Call `GenerateImage` with two arguments:
- `description`: A detailed creative brief for the image (see prompt quality below).
- `filename`: `{slug}.png` -- use the post slug as the filename.

The tool writes the image to a workspace staging path. After generation, **copy** the
file into `src/assets/images/blog/{slug}.png`.

#### Codex

Use the system **imagegen** skill and built-in `image_gen` tool. Read the imagegen
skill instructions before generating if they are available in the session. In Codex,
generated images are saved under `$CODEX_HOME/generated_images/...` (usually
`/home/node/.codex/generated_images/...`) and the tool may not accept a destination
filename. Generate first, then copy the selected output into the project.

**Invocation:** Call `image_gen` with a detailed prompt. Include the slug and intended
workspace destination in your own notes, but do not rely on the tool writing there.

**After Codex generation:**

1. Locate the newest generated file, for example:
   ```bash
   find "${CODEX_HOME:-$HOME/.codex}" -path '*generated_images*' -type f -printf '%T@ %p\n' | sort -nr | head
   ```
2. Copy or convert the selected file into
   `src/assets/images/blog/{slug}.png`. Leave the original generated image in place
   unless the user explicitly asks to delete it.
3. Normalize the project copy to **1200x630** when needed. Prefer Sharp because this
   repo already uses it:
   ```bash
   node --input-type=module -e "import sharp from 'sharp'; await sharp('/absolute/generated.png').resize(1200, 630, { fit: 'cover', position: 'center' }).png({ compressionLevel: 9 }).toFile('src/assets/images/blog/{slug}.png');"
   ```
4. Confirm the image dimensions with `file` or Sharp metadata before building.

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

1. Get the absolute path of the generated file from the tool output or by locating
   it in the generator's staging directory.
2. **Copy** the file into `src/assets/images/blog/{slug}.png` using a shell `cp` command.
   In Codex, use `cp` only when the generated dimensions are already suitable;
   otherwise use the Sharp resize command above.
3. Confirm frontmatter `image` is set to `~/assets/images/blog/{slug}.png` (path must
   start with `~/assets` per `findImage`).
4. No cleanup step needed--the generator's staging area can remain as-is.

**If generation fails** (tool unavailable or error): tell the user which generation
path failed. Retry once with a simpler prompt if the failure looks transient. Leave
`image` pointing at the intended final path only if you are still actively resolving
the cover; do not claim the post is ready until a file exists in `src/assets/images/blog/`.

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
3. Generate a vivid editorial cover with Cursor GenerateImage or Codex image_gen;
   copy or resize it to
   src/assets/images/blog/supply-chain-security-npm-packages.png.
4. Run npm run build and fix any errors.

Result: A publishable post at /blog/supply-chain-security-npm-packages with a working
cover and successful static build.
```

```
User says: "Draft something on AI agents but don't publish yet"

Actions:
1. Create the post with draft: true and a clear intro that it is a draft.
2. Still add slug, image path, generate a cover, and copy it into place.
3. Run npm run build to verify assets resolve.

Result: A draft file that does not appear in listings until draft is false.
```

```
User says: "New post titled 'OAuth device flow' -- image generation failed"

Actions:
1. Report the tool error; keep frontmatter image path as the intended destination.
2. Retry once with a simpler description using the current environment's image tool.
3. If the current environment has no working image tool, ask the user to provide a
   cover manually.

Result: Either a recovered cover or a clear blocker and clean repo state.
```

```
User says: "Make the cover feel like 1970s technical manual but not an infographic"

Actions:
1. Encode that in the image prompt (paper texture, limited palette, single object,
   no labels, retro technical illustration style).

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
Cause: Not running in Cursor agent mode, or Cursor's image tool is disabled.
Solution: If you are in Codex, use the imagegen skill and built-in image_gen tool
  instead. If neither Cursor GenerateImage nor Codex image_gen is available, ask the
  user to provide a cover image manually and place it at
  src/assets/images/blog/{slug}.png.
```

```
Symptom: Codex generated an image but the project cover file is missing
Cause: image_gen saves under $CODEX_HOME/generated_images by default, not under the
  repository.
Solution: Locate the newest generated file under $CODEX_HOME/generated_images, then
  copy or Sharp-resize it into src/assets/images/blog/{slug}.png. Verify with file or
  Sharp metadata before running npm run build.
```

```
Symptom: Generated image not at expected path after copy
Cause: Copy command used wrong source path, or the generated file was left only in
  a staging directory.
Solution: Read the absolute generated path from the tool output or locate it under
  $CODEX_HOME/generated_images; use that exact path in the cp or Sharp command.
  Verify with ls after copying.
```

```
Symptom: Tag page does not list the post
Cause: Tags not lowercase in frontmatter
Solution: Use lowercase tag strings in YAML array per AGENTS.md
```
