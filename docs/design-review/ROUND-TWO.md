# Second design round

> Historical round. Superseded by [round three](ROUND-THREE.md); Atlas and Lumen have been retired.

## Owner feedback

Signal's compact section spacing was useful, but its overall presentation was too simplistic. After Hours was also too simplistic and its horizontal/vertical dividers looked unprofessional; its font was liked. Fieldnotes' magazine/newspaper feel was rejected. Prioritize light mode now; a dark counterpart comes after a direction is selected.

This feedback supersedes the first-round recommendation. All three new concepts use **Manrope** for headings and body text, including article prose. They use compact sections and rich, purposeful arrangements of real writing, projects, books, and photography. No decorative dividing rules. Existing first-round URLs remain available as history, but the gallery and comparison bar lead with this round.

## Plans before implementation

### Prism — a layered personal portfolio

Palette: white `#FFFFFF`, lilac canvas `#F5F3FB`, ink `#27213B`, secondary `#655E75`, violet `#6242B5`, pale lilac `#EAE4F7`. Use an asymmetric split hero: introduction beside a composed feature area combining real article artwork, portrait, and a small speaking photograph. Follow with a compact project strip, image-led writing, and a varied research/books grouping. Different surface depths communicate hierarchy; avoid a wall of identical cards.

```text
Name + navigation
Introduction              Latest work / portrait / speaking inset
Three compact maintained tools
Writing: lead story       Two smaller stories
Research selection        Books + community voice
```

### Atlas — a connected body of work

Palette: cool white `#F7FAFC`, white `#FFFFFF`, ink `#173846`, secondary `#526873`, teal `#006E68`, mint `#E2F1EC`. Use a short integrated hero panel with portrait-led identity and a broad stage image, then a main/aside composition that brings writing and useful resources into the same visual field. Compact content islands replace divider lines. Organize related information without adding dashboard gauges or invented metrics.

```text
Name + navigation
Mint introduction                 Landscape stage photo
Featured writing + recent list    Tools + research / books
Attributed community note
```

### Lumen — a photographic author portfolio

Palette: white `#FFFFFF`, cool canvas `#F6F7FA`, ink `#283341`, secondary `#606A78`, burnt orange `#A74825`, peach `#FBE8DC`. Combine a quieter masthead with a photographic identity composition and a more visual writing shelf. The opening uses a portrait panel, useful professional context, and the thesis rather than another giant plain headline. The writing index is a compact visual shelf, and article typography stays clean and sans serif. Real images supply the richness; no ornamental separators or fake browser chrome.

```text
Name + navigation
Portrait / professional context   Thesis + current article
Three image-led stories
Tools + research                   Books / speaker invitation
```

## Review against the brief

The earlier concepts relied too much on large type, a single picture, and dividing rules. The new designs must change content composition as well as color. Shared Manrope and reduced spacing are accepted constraints, not axes to differentiate. Prism spends its emphasis on a layered current-work composition, Atlas on connected main/aside content, and Lumen on portrait-led identity plus a visual writing shelf. Vary image scale and surface treatment instead of boxing every item identically. Do not reintroduce a serif reading view or dark-first palette.

The same real homepage, blog-listing, and article journey remains available for each option. Preview search filters only the displayed six articles and says so; the full archive remains a separate real destination.

## Rendered review

[Compare the three new openings](round-two-overview.webp). Prism is the most layered, Atlas places the most complementary content in the same viewport, and Lumen gives the portrait and writing imagery greater prominence. All three retain Manrope in the reading view and use light palettes.

The review removed an inset overlapping Prism’s story title, corrected style precedence that enlarged supporting headings, restored an accessible research heading, and reduced unused height in Prism’s mobile composition. Lumen’s initial spanning article mosaic created empty space within large tiles; its final blog uses a compact three-column shelf. Topic chips draw from different displayed posts rather than repeating several tags from the same post. The filter is explicitly limited to the six displayed recent articles; full archive search remains linked separately.

The mechanical changed-file detector returned no findings. This supplements screenshot review rather than deciding which option fits the owner’s taste. No theme is adopted, and no dark variation is proposed in this round.

## Validation

- Build (including Pagefind and Markdown postbuild), ESLint, existing Node tests, and whitespace checks passed.
- All nine new pages passed at 320, 390, 768, and 1440px: no document overflow or JavaScript errors, one main heading, valid section label targets, visible focus, light mode under dark OS preference, Manrope in the reading view, and page-preserving comparison links.
- Browser checks covered local search, no results, clearing filters with focus return, topic selection, and restoring all six articles. Final Lumen shelf and all topic buttons were checked again at all four widths.
- Reviewed desktop and mobile screenshots, including code blocks and loaded book covers. New gallery thumbnails load, and the previous-round disclosure opens at mobile and desktop widths.
- The final production preview serves all nine new pages and the gallery; filters work from the built JavaScript. Checked the three prior homepages, the unchanged main-site homepage, built CSS type sizing, noindex metadata, sitemap exclusion, and absence of Pagefind article markers in the mockups.

Open `/design-lab` for the new round. Direct paths follow `/design-lab/prism/{home,writing,article}`, `/design-lab/atlas/{home,writing,article}`, and `/design-lab/lumen/{home,writing,article}`. The previous round remains under its original URLs.
