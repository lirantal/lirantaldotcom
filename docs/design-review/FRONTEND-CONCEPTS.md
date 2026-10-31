# Frontend design exploration

## Brief and scope

The owner requested several visibly different mockups after PR #27's restrained refinements were merged and reverted. This is an explicit theme exploration using Anthropic's frontend-design skill, not another polish pass against the incumbent style. The approved production design remains the baseline; the exception applies to `/design-lab` only. No concept is selected for adoption yet.

Audience: developers looking for practical security writing, researchers checking primary work, and organizers considering Liran as a speaker. Use real posts, projects, research, portraits, and verified profile links. Keep useful navigation, readable articles, and clear authorship. Evaluate a complete reading journey rather than just a hero image.

Read `.agents/skills/frontend-design/SKILL.md` and follow its plan → review → build → critique process. A skill is agent guidance, not a runtime theme plugin. APM installs/restores it; an agent applies it to an explicit brief. Reusable invocation:

> Apply frontend-design to explore three distinct visual directions for lirantal.com. You may change typography, palette, composition, navigation treatment, and article styling within isolated mockup routes. Use real content. Build a responsive homepage, writing index, and article for each direction and a comparison gallery. Critique screenshots before proposing a favorite. Do not adopt a theme on production routes until one is selected.

## Design plans, reviewed before implementation

### Fieldnotes

A personal research journal. Newsreader carries headlines and long-form prose; Inter carries navigation and metadata. Paper `#FAFBF8`, ink `#20352D`, secondary `#52675C`, forest link `#23664C`, rule `#D5DED6`, pale surface `#EEF2EB`. Left aligned, generous reading margins, a narrow persistent identity column on desktop, and a typographic lead story. The researcher's personal voice supplies the identity, not decorative terminal graphics.

```text
Identity rail | Introduction + portrait
              | Lead story / latest writing
              | Tools / selected research
Article: rail | title, then a narrow reading column
```

### Signal

A security practitioner's public workbench. Space Grotesk for display and Inter for prose. Cobalt `#2549DF`, white `#FFFFFF`, ink `#172447`, muted `#53617A`, pale blue `#EDF2FF`, rule `#CCD6F3`. Large left-aligned type and a strong cobalt opening; white space and the site's own tools supply the supporting structure. The writing index is a visual two-column grid with real cover art.

```text
Wordmark                    Navigation
Cobalt: oversized thesis    Portrait
Featured tools              Latest stories
Article: title across the grid / readable body
```

### After Hours

A personal studio for the author, speaker, and maintainer. Manrope for display/navigation, Newsreader for article prose. Plum-black `#211C27`, elevated plum `#302936`, ivory `#F5EFE8`, secondary `#C5B8C8`, peach `#FFBD9B`, rule `#514655`. A large nameplate, an asymmetric introduction beside a real stage photo, then a broad image-led lead story and compact subsequent entries. Calm surfaces keep the dark palette readable rather than imitating a neon hacker terminal.

```text
Large Liran Tal nameplate / navigation
Introduction               Stage photography
Lead story image           Headline
Recent entries / tools / research
Article: compact title / wide cover / serif reading column
```

### Review against the brief

All three must differ in composition and type, not merely hue. Fieldnotes could drift into a generic newspaper; retain a personal identity rail and avoid numbered sections, faux issue numbers, and dense columns. Signal could become a SaaS landing page; remove invented metrics, decorative gradients, and repeated CTA cards. After Hours could become a stock hacker site; use plum and a soft peach accent, authentic stage photography, and no terminal/neon embellishments. Keep role and article metadata in sentence case. Skip automatic motion; visible links, focus, and natural document navigation matter more here.

The gallery offers the same three page types for each option. Concept switching preserves the page type. These are working visual prototypes, with a real published article and ordinary links back to existing destinations. Existing search remains available through the full archive. The mockups do not claim to implement a complete site migration, a new search UI, or all production interactions.

## Installation

APM dependency: `anthropics/skills/skills/frontend-design#dbd4588f9e1033efb41dad4bef2f7947c8993d44`. Restore with `apm install --frozen --target agent-skills`. The upstream skill and license are committed under `.agents/skills/frontend-design/`. The skill dependency and APM deployment records are reinstated on a fresh branch from the current post-revert main; the previous PR's production CSS changes are not carried over.

## Rendered critique and recommendation

[Compare the three openings](concepts-overview.webp). Each proposal carries its visual choices through a complete published article, including code blocks, quotations, lists, and tables. The comparison controls preserve the current page type; other story links and the full archive retain their real destinations.

- **Fieldnotes** is the strongest starting point if the blog and long-form reading are the priority. Its serif hierarchy and quieter palette make a clear change from the incumbent without competing with the subject. The desktop identity rail consumes horizontal space, so it becomes ordinary top navigation on mobile. Removed the second portrait from the home-page rail after reviewing the first screenshots.
- **Signal** is strongest if tools and developer-facing work should lead. Its large cobalt opening and geometric type are more assertive. The white button and all links in the cobalt region retain visible hover/focus contrast. Removed the initial colored side borders from tool entries after critique; the opening already provides sufficient emphasis.
- **After Hours** is strongest for personality and speaking. The original stage photo and large nameplate are the memorable elements. It is dark-first by design; a complementary light palette and a preference toggle would be part of adopting it, not evidence already supplied by this prototype.

The article screenshots exposed visually broken wrapping inside long shell commands. Code now keeps preformatted whitespace and scrolls within its container on narrow screens; prose still wraps within the reading measure. Replaced arrow glyphs with small SVGs after the font-limited environment rendered missing-glyph boxes.

The mechanical detector flags Inter/Space Grotesk and a colored blockquote border. Those are reviewed choices here: Inter maintains familiar body text, Space Grotesk gives Signal its geometric display role, and the quote border denotes quoted source content rather than decorating a card. The detector is an input to review, not proof that one theme is better.

No concept is adopted. My initial recommendation is **Fieldnotes for a writing-first site**, with After Hours as the more personal alternative. The owner's preference should choose the next iteration, and can combine specific treatments across proposals.

## Validation

- APM frozen restore, ESLint, existing Node tests, and the complete production build including Pagefind and Markdown generation passed.
- Chromium checked all nine pages at 320, 390, 768, and 1440px (36 combinations): successful responses, no document overflow or JavaScript errors, one main heading, noindex metadata, visible keyboard focus, and concept links preserving the page type.
- Reviewed desktop openings/listings/article headers plus mobile reading screenshots. Final checks cover the corrected mobile code formatting and Signal button hover/focus colors.
- The final production preview serves the gallery and all nine pages. Gallery thumbnails load; preview pages stay out of the sitemap and Pagefind's article index. The existing homepage still renders its light baseline, and its source/components/styles have no diff from the current main branch.
- The three concepts have fixed palettes for comparison. A full light/dark pair, search redesign, remaining site sections, and real-device validation belong to a subsequent adoption pass after a direction is selected.

Start the site with `npm run dev` and open `/design-lab`, or append `/design-lab` to the draft PR's Vercel preview URL. The regular preview root intentionally displays the existing site. Article views use the newest published post at build time, so their content follows the same feed as the homepage.
