# Fourth design round

## Brief and reference

Prism is the closest direction, but rounded colored containers feel toy-like. The owner wants elegant, professional, clean design; clear button CTAs; visibly distinct sections; a contrasting footer; and article hover states. The reference is https://filiphric.com, specifically its button affordances, section separation, footer contrast, and article interaction—not its content, brand, or layout. Its structure was reviewed through the web reader. Keep literal section names, prominent linked recognition, research as a complete section, an evergreen hero, and a light presentation.

Apply Anthropic's frontend-design skill: plan, review, build, inspect and critique. This is an isolated exploration; production pages remain the comparison baseline.

## Plans before implementation

### Prism: restrained chapters

Manrope throughout. White `#FFFFFF`, ink `#24212D`, secondary `#605C6B`, violet `#51378B`, research wash `#F2F0F7`, footer `#25212F`. Keep the evergreen thesis and real portrait, remove the inset-photo decoration. Recognition becomes a prominent unboxed band with linked awards. Sections span the page and alternate white and a quiet neutral wash rather than living inside colored rounded boxes. Research uses full-width paper rows. Blog uses full-row linked articles with a visible hover/focus surface. Buttons have a 6px radius; section bands have no radius. Left-aligned content and a shared maximum width provide order.

```text
Brand / navigation / Blog button
Thesis + two buttons                Portrait
Recognition + two linked awards, unboxed
Research, full-width quiet band
Open source, white
Speaking, photo + copy in a neutral band
Books / Blog, full-width sections
Contrasting full-width RSS + footer
```

### Forma: precise technical portfolio

Inter throughout; deliberately informed by the owner's shadcn/Vercel reference. White `#FFFFFF`, ink `#171717`, secondary `#626262`, neutral `#F7F7F7`, keyline `#DFDFDF`, footer `#181818`. A compact, centered hero with a small portrait and actual role description replaces Prism's asymmetric hero. Black primary and outlined secondary buttons. Recognition is centered and unboxed. Research is a single contained document area with two equal paper entries, followed by an independent broad open-source band, then image-led Blog cards. Framing appears only around actionable content, not as decorative page dividers. Speaking and Books each receive complete sections. Flat surfaces and 6px component corners keep the technical precision without ornamental grids or glows.

```text
Compact brand and navigation
             Small portrait + name
             Centered thesis / buttons
             Linked recognition
Research: a contained two-paper document area
Open source: broad neutral band
Blog: three image-led linked cards
Speaking / Books
Black RSS + footer
```

### Studio: photographic personal portfolio

Manrope throughout. White `#FFFFFF`, ink `#193343`, secondary `#526571`, blue `#174B68`, pale slate `#EEF3F5`, footer `#183545`. An identity masthead establishes Liran's name, portrait, role and real affiliations before a wide stage photograph paired with an evergreen introduction. This is a personal portfolio rather than a centered technical landing page. Recognition follows at full strength. Research uses an asymmetric section heading/content layout inside one complete section; it is never a sidebar beside Blog. Sections then alternate photographic, text, and cover-led composition. Blog uses large image tiles; a blue footer closes the page with a real RSS action. Left-aligned reading and restrained photographic crops, with no candy-colored containers.

```text
Brand + navigation
Portrait / name / actual role / social links
Wide stage photo       Evergreen thesis + buttons
Recognition, unboxed links
Research label         Complete paper list
Open source, broad slate surface
Speaking invitation / Books cover gallery
Blog: image tiles
Blue RSS + footer
```

## Review against the brief

These differ before color is considered: Prism is an asymmetric introduction plus full-width chapters; Forma is a centered technical landing page with deliberately framed content; Studio is an identity-led photographic portfolio with asymmetric section alignment. No interchangeable colored section cards, no widget dashboard, no newspaper rules. Shared data and content partials preserve verified papers, coauthors, dates, destinations, book covers and posts. Each concept gets an independent homepage renderer, plus functional Blog and article views. Footer subscription uses the existing RSS feed; no fictitious newsletter form or unconnected submission action.

## Rendered review

[Opening layouts and footer comparison](round-four-overview.webp) and [Prism article states](round-four-article-states.webp) capture the implemented pages. The gallery thumbnails also come from the real pages.

- **Prism:** the hierarchy and asymmetric hero remain familiar. Removal of the inset photo, multicolor section containers, and large radii makes the page substantially quieter. Research remains a complete full-width section; the metadata/title alignment gives its papers structure without enclosing every paper. Recognition is visible directly below the hero, with linked award names. Its linear page still requires more scrolling than a section-switching interface.
- **Forma:** the centered type, small portrait, monochrome actions, restrained document framing, and consistent article tiles give it a deliberate technical identity. This is the explicitly requested shadcn/Vercel-inspired option. The tradeoff is a less photographic personality than Prism or Studio; the real book and article artwork provide color lower on the page.
- **Studio:** the masthead and broad stage image make it an identity-led portfolio. Research has an asymmetric heading/content composition inside one complete section, not a sidebar to Blog. The speaking section uses real build-time talk/country statistics without repeating the hero photo. The photographic opening occupies more vertical space on mobile; Research still follows recognition before Blog.

All three use section-scale surface changes, clear filled and outlined CTA buttons, and a full-width contrasting footer. Blog tiles/rows are whole links: hover changes the surface and underlines the heading; keyboard focus adds a visible outline. Reduced motion disables image scaling and transitions. The feed CTA uses the real RSS feed rather than an unconnected newsletter form.

The mobile screenshot review found a wrapped Blog button on a line by itself in the main navigation. Adjusted spacing and action width so all five links fit in one row at 320 and 390 pixels. Kept the Recognition heading at its intentional secondary size instead of inheriting the mobile section-title scale.

## Verification

`npm run lint` and `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed, including Pagefind and Markdown generation. Browser checks against both dev and the production build covered all nine views at 320, 390, 768, 1073, and 1440 pixels under a dark OS preference: light presentation, no document overflow, literal headings, real recognition destinations, button affordances, whole-article navigation, hover/focus surfaces, keyboard outlines, and footer feed actions. Sampled 33–34 rendered text/background pairs per homepage, including secondary text, metadata, CTAs, recognition, and footer links: minimum contrast ratios were 5.73:1 (Prism), 6.10:1 (Forma), and 5.43:1 (Studio). These are targeted checks, not a comprehensive accessibility certification.

Confirmed readable sections without JavaScript; real RSS response; all three current gallery screenshots decoded; production homepage still responds; first-round home routes remain accessible; Atlas, Lumen, Structured, and Navigator return 404. Preview routes remain noindex, excluded from the sitemap and Pagefind body markers. The design detector returned no findings on the finished preview sources. Existing upstream embed fetch and Astro deprecation warnings did not block the build. No production theme was selected or replaced.
