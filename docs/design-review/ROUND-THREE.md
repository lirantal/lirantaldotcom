# Third design round

> Historical round. Superseded by [round four](ROUND-FOUR.md). Structured and Navigator are retired; Prism has been redesigned.

## Brief

The owner rejected the previous round as three cosmetic variations of one layout. Remove Atlas and Lumen. Keep Prism's colored section grouping and general hero direction, but remove the article-led hero and newspaper/widget composition. Give recognition visible, working links and research a complete section. Use literal names: Blog, Research, Open source, Speaking, Books, Recognition. A second proposal should preserve the current website while imposing consistent structure. A third should be a genuinely different design and interaction model. Light mode remains the priority; dark mode follows selection.

Read and apply `.agents/skills/frontend-design/SKILL.md`: plan, review against the brief, build, inspect screenshots, critique. This round supersedes the earlier recommendations. Production routes remain the baseline, not an adopted concept.

## Plans before implementation

### Prism: a sequential portfolio

Manrope. Canvas `#F7F5FC`, ink `#28213C`, violet `#6242B5`, research surface `#EDE6F8`, open-source surface `#E5F2EC`, speaking surface `#E7EFFA`. A compact, evergreen introduction and real photography lead to prominent linked recognition. Research, Open source, Speaking, Books, and Blog each own a full-width component. The hero is about the person and their work, never the newest article. Research is not an aside. Section color denotes content ownership; it is not a grid of competing widgets.

```text
Introduction + portrait / stage inset
Recognition: linked GitHub Star + linked OpenJS award
Research, full width
Open source, full width
Speaking, full width
Books, full width
Blog, full width, last
```

### Structured: the current site, organized

Inter and the incumbent blue/neutral identity. White `#FFFFFF`, background `#F3F6FB`, ink `#0F172A`, blue `#1D4ED8`, soft blue `#EAF1FC`, quiet mint `#EDF6F2`. Retain the current thesis, supporting copy, portrait/social grouping, project selection, numbered headings, and familiar sequence. Give every section one containing panel with a shared heading/content grid, a clear action area, and a consistent internal alignment. Use restrained surface changes to keep related material together. This option is an evolution of the current homepage, not another Prism recolor.

```text
Familiar text-led hero / round portrait / social row
Recognition + featured maintained projects
01 Speaking: shared heading rail + aligned content
02 Blog: same component grammar
03 Research: full section, same visual weight
04 Open source / 05 Books / community
```

### Navigator: a portfolio workspace

Manrope with a different spatial and interaction model. Canvas `#F1F4F9`, white `#FFFFFF`, ink `#142A43`, blue `#1D4ED8`, pale coral `#FFE7DA`, secondary `#56677C`. A persistent identity/navigation rail opens a single content workspace. Research is the default view; selecting Open source, Speaking, Books, or Blog replaces the workspace rather than adding more homepage widgets. A compact evergreen introduction and prominent linked recognition establish identity first. No dashboard metrics, ornamental rules, or news-feed opening. Without JavaScript, sections remain readable through ordinary anchor navigation.

```text
Identity rail | Evergreen introduction + Recognition
Research      | One full-width active content area
Open source   | Research is selected initially
Speaking      | Other sections replace this area on selection
Books / Blog  | Article reading remains in the same workspace
```

## Review against the brief

These options differ in navigation model and content organization before color is considered: sequential portfolio, improved incumbent, and interactive workspace. Only Structured retains the incumbent numbered sequence. Prism and Navigator prioritize research over blog recency. Neither puts Research beside Blog as a sidebar. All three use literal section labels and linked awards. Do not import the abandoned Atlas/Lumen layouts or their CSS; keep first-round history separate from the current comparison.

## Rendered review

[Desktop comparison](round-three-overview.webp) captures the implemented previews, not a separate illustration. Gallery thumbnails are generated from the same pages.

- **Prism:** the portrait and stage inset anchor the introduction. Recognition follows immediately, with whole-card links and explicit destinations. Research occupies the same full-width section footprint as Open source, Speaking, Books, and Blog; Blog is last. The tradeoff is a longer linear page, especially on mobile, in exchange for making every area available without interaction.
- **Structured:** the round portrait, blue thesis, Inter, featured projects, and 01–05 sequence retain the incumbent identity. Shared heading rails and consistent panels organize content within each section. Dated impact snapshots retain their package/repository scope, caveats, and source disclosures. This deliberately remains the most conservative option.
- **Navigator:** the rail is functional navigation rather than a sidebar of competing content. Only the selected workspace is shown with JavaScript, initially Research; awards remain above it. On mobile the menu becomes a horizontally scrollable row. This is the strongest interaction change, with the tradeoff that visitors must choose sections to discover the rest of the portfolio. Without JavaScript all five anchor sections remain readable.

Reviewed desktop and mobile screenshots, including Blog and article views. All nine current pages were checked at 320, 390, 768, and 1440 pixels under a dark OS preference: no document overflow and light presentation retained. Confirmed literal section labels, Prism's section order and equal widths, recognition destinations, Structured's numbered sequence and source disclosure, Navigator selection, keyboard arrows/Home/End/Space, deep-link reload, writing-page heading updates, and no-JavaScript fallback. First-round home routes still respond; Atlas and Lumen return 404. The repository's design detector returned no findings for changed preview sources.

The concepts share factual content components, but their top-level renderers are independent: sequential portfolio, incumbent numbered layout, and interactive workspace. Shared content is not a single grid recolored three times. Production routes and theme controls remain the baseline for comparison. Dark variations await a selected direction.

Validation: `npm run lint`, `npm test`, and `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed. Repeated the responsive and interaction checks against the production build, including the JavaScript-disabled fallback and retired-route 404s. Preview routes remain excluded from the sitemap and Pagefind body markers. Existing upstream embed fetch warnings did not prevent the full static build, Pagefind, or Markdown output.
