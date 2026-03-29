---
name: create-lirantal-blog-post
description: >
  Creates and publishes new posts on lirantal.com (Astro static blog): adds dated
  markdown under data/blog/, fills frontmatter (title, description, tags, slug, dates,
  full image path), generates an Open Graph-sized cover with the local Gemini CLI and
  Nano Banana extension, copies it into src/assets/images/blog using the slug as the
  filename stem, cleans up nanobanana-output, and runs npm run build to verify. Use when
  the user asks for a new blog post, draft post, lirantal.com article, Astro blog entry,
  or a cover image for a post—even if they do not name this skill, Gemini, or AGENTS.md.
license: Apache-2.0
compatibility: >
  Requires Node/npm for npm run build. Local gemini CLI on PATH; Nano Banana extension
  installed (e.g. gemini extensions install https://github.com/gemini-cli-extensions/nanobanana).
  Network access for image generation. Run image commands from the repository root so
  ./nanobanana-output/ resolves correctly. Repository must match lirantal.com layout
  (data/blog, src/assets/images/blog, AGENTS.md).
metadata:
  author: lirantal
  version: 1.1.0
---

# Create lirantal.com blog posts

# Instructions

Stop ad-hoc blog edits that break the image pipeline or leave drafts half-wired. This
skill drives the full path: correct frontmatter, a real cover file under
src/assets/images/blog, cleanup of generator output, and a green build.

Read [references/conventions.md](references/conventions.md) when you need the exact
frontmatter template or checklist; read [AGENTS.md](../../../AGENTS.md) at repo root
for site-wide blog rules (routes, drafts, tags, HighlightedPosts).

### Step 1: Prepare

1. Take **today’s date** from the user environment (session date). Use ISO
   YYYY-MM-DD for filename and frontmatter unless the user specifies another date.
2. From the user’s topic, choose a URL-safe **slug** (kebab-case, stable). The cover
   file basename must match the slug (extension matches whatever the generator writes,
   usually `.png`).
3. Confirm the post path: `data/blog/YYYY-MM-DD.md`. If that file already exists, use
   `data/blog/YYYY-MM-DD_short-topic.md` so the post id stays unique.
4. Default cover size for social/Open Graph: **1200x630** via the Gemini CLI
   `--size="1200x630"` unless the user asks for something else.

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
5. **Optional:** One short line in the body that the cover is AI-generated is fine;
   no stock-photo attribution is required.

### Step 3: Cover image via Gemini CLI (Nano Banana)

Assume **gemini** is installed locally and the **nanobanana** extension is already
installed (for example:
`gemini extensions install https://github.com/gemini-cli-extensions/nanobanana`).

Run generation from the **repository root** so outputs land in `./nanobanana-output/`.

**Programmatic invocation:** use `-p` for the prompt and `--yolo` so tool calls auto-approve
without an interactive chat. Always pass **`--size="1200x630"`** on image generation so
the asset is Open Graph / social preview friendly.

**Slash commands inside the prompt** (examples—these are patterns, not literal-only):

- `/generate "brief subject" --styles="watercolor,oil-painting"`
- `/pattern "wood grain texture" --type="texture" --colors="mono"`
- Open-ended: `/nanobanana create a logo for my tech startup`

For blog covers, prefer **`/generate`** (or equivalent nanobanana image flow) with a
**strong creative brief**, not a dump of the article abstract.

**Prompt quality (avoid generic “AI slop”):**

- Aim for **one clear visual idea**: mood, setting, light, and subject—like editorial
  or cinematic key art, not a diagram.
- Ask for **specific aesthetics** (film grain, analog photo, gouache, neon noir,
  brutalist color blocks, etc.) when it fits the post.
- **Do not** ask for infographics, flowcharts, labeled diagrams, floating browser
  windows, stock “holographic UI,” or busy collages of icons unless the article truly
  requires it.

**Example command shape** (replace the inner prompt with something better than a raw
article paste—distill metaphor, tone, and palette). Put **`--size="1200x630"` on `gemini`**
(not inside a chat session):

```bash
gemini -p "/generate Editorial illustration for a technical blog: [2–4 sentences: metaphor, mood, lighting, color palette, what to emphasize—no text in the image, no logos, no UI mockups]" --size="1200x630" --yolo
```

If a nanobanana slash command documents its own size flag inside `-p`, keep it aligned
with **1200x630** for Open Graph; otherwise rely on the outer `--size="1200x630"`.

**After generation:**

1. Read the CLI output for the saved path, or list `./nanobanana-output/` for the new
   file (often `.png`).
2. **Copy** the file into `src/assets/images/blog/` using the post slug:
   `src/assets/images/blog/{slug}.png` (or the correct extension).
3. Set frontmatter `image` to `~/assets/images/blog/{slug}.png` (path must start with
   `~/assets` per `findImage`).
4. **Clean up:** remove the repo’s **`nanobanana-output`** directory after a successful
   copy (`rm -rf nanobanana-output` from repo root, or delete only the copied file if you
   must keep other outputs—prefer clearing the folder so the tree stays clean). Do **not**
   uninstall the Gemini extension; only remove local throwaway output.
5. Ignore non-fatal messages such as IDE companion extension warnings if the image file
   still appears under `nanobanana-output/`.

**If generation fails** (CLI missing, extension not loaded, no file written): tell the
user, leave `image` pointing at the intended final path, and do not claim the cover
exists until a file is in `src/assets/images/blog/`.

### Step 4: Optional homepage feature

If the user wants the post on the homepage “From the blog” list, add its **slug** to
`src/components/blog/HighlightedPosts.astro`. Skip unless they ask.

### Step 5: Verify

1. Run `npm run build` from the repo root.
2. If the build fails on images or frontmatter, fix paths: `image` must start with
   `~/assets` and the file must exist under `src/assets/images/blog/`.
3. Repeat fix and build until the build succeeds.

**Done when:** The markdown file exists with complete frontmatter, the cover file
exists at `src/assets/images/blog/{slug}.{ext}`, `nanobanana-output` is cleaned up after
copy, `npm run build` passes, and HighlightedPosts is updated only if requested.

## Examples

```
User says: "Write a blog post about supply chain security for npm"

Actions:
1. Set date to today; slug e.g. supply-chain-security-npm-packages; pick tags like
   "security", "npm", "supply chain".
2. Add data/blog/YYYY-MM-DD.md with full frontmatter; set image to the planned path.
3. Run gemini with -p and --yolo; use a vivid editorial brief plus --size="1200x630";
   copy nanobanana-output file to src/assets/images/blog/supply-chain-security-npm-packages.png;
   remove nanobanana-output.
4. Run npm run build and fix any errors.

Result: A publishable post at /blog/supply-chain-security-npm-packages with a working
cover and successful static build.
```

```
User says: "Draft something on AI agents but don't publish yet"

Actions:
1. Create the post with draft: true and a clear intro that it is a draft.
2. Still add slug, image path, generate cover with Gemini, copy and clean up output.
3. Run npm run build to verify assets resolve.

Result: A draft file that does not appear in listings until draft is false.
```

```
User says: "New post titled 'OAuth device flow' — image generation failed"

Actions:
1. Report the CLI or extension error; keep frontmatter image path as the intended
   destination.
2. Retry with a shorter /generate prompt or ask the user to run gemini interactively once.
3. Do not remove nanobanana-output until you have successfully copied a file—or remove
   stale failed runs to avoid confusion.

Result: Either a recovered cover or a clear blocker and clean repo state.
```

```
User says: "Make the cover feel like 1970s technical manual but not an infographic"

Actions:
1. Encode that in the /generate brief (paper texture, limited palette, single object,
   no labels).
2. Same CLI flags: --size="1200x630", --yolo.

Result: A stylized OG image that matches the brief without chart junk.
```

```
User says: "I already have 2026-03-30.md — add another post today"

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
Symptom: gemini: command not found
Cause: Gemini CLI not installed or not on PATH
Solution: Install/configure gemini; re-run from repo root with -p and --yolo
```

```
Symptom: No image in nanobanana-output or extension errors in the log
Cause: nanobanana not installed, wrong working directory, or generation failed
Solution: Confirm extension install; run from repository root; read full CLI output;
  retry with a simpler /generate prompt and --size="1200x630"
```

```
Symptom: IDE companion / extension warnings in stderr
Cause: Optional IDE integration not running
Solution: If the image file still materializes under nanobanana-output/, proceed with
  copy and cleanup; otherwise fix CLI/extension setup
```

```
Symptom: Tag page does not list the post
Cause: Tags not lowercase in frontmatter
Solution: Use lowercase tag strings in YAML array per AGENTS.md
```
