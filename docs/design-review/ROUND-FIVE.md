# Fifth design round: Forma + Forma Refined

## Brief

Create one proposal alongside the unchanged Forma baseline. Retire Prism and Studio from the comparison. The owner chose Forma's Inter typography, monochrome palette, weight/size hierarchy, menu, filled/outlined buttons, side-by-side Research area, Blog listing and article view. Keep these. Use Prism's asymmetric hero composition for the proposal, but remove its social text links and opaque black portrait background. Match the current website's monochrome X, GitHub and LinkedIn icon row under the portrait. Recognition must be compact single-line links, including “GitHub Star (alumni)”, with icons but no arrows or redundant text. Projects should lose generic decorative icons; their categories should be small pills alongside titles, and GitHub/npm source links should become closely grouped accessible icons.

Read and apply the APM-installed Anthropic frontend-design skill. This is a consolidation of annotated choices, not another theme exploration. Production routes are unchanged.

## Plan before implementation

### Forma Refined

Reuse Forma's exact token system: Inter Variable, white `#FFFFFF`, ink/accent `#171717`, muted `#626262`, neutral surface `#F7F7F7`, rule `#DFDFDF`, footer `#181818`. Preserve its menu, button styles, body type scale, Research document frame and source links, Blog cards, and article reading canvas. Copy the approved baseline's section sequence, so differences are easy to assess. Use a left-aligned evergreen thesis with the same content and primary/secondary actions, plus the portrait on the right. The new portrait is an image-tool background-removal derivative of the original JPEG (which contains an opaque black backdrop), stored separately; the original baseline asset remains untouched.

Recognition is a compact wrapping row of icon/name links below the introduction, with the all-recognition action kept nearby. Each source project gets a title/category header, description, and a compact icon source row; there is no generic symbol or standalone category line. Social icon targets are 44px and inherit the neutral text color, with accessible labels, hover titles and visible keyboard focus. All icon-only project links also have project-specific accessible names.

```text
Forma menu, unchanged
Prism-style left introduction           Transparent portrait
Filled research / outlined Blog CTA     X / GitHub / LinkedIn icons
Recognition: icon + single-line award links; no trailing arrows
Forma Research: equal side-by-side papers, full sources, top-right CTA
Forma Open source: compact title + category pill, description, source icons
Forma Blog / Speaking / Books / contrasting RSS footer
```

## Review against the brief

The new composition combines the owner's explicitly preferred pieces without introducing another palette, font or interaction model. Forma remains the comparison baseline, including its existing recognition and project components. Conditional proposal markup and scoped styles keep the changes out of that baseline. Both versions use the same Blog/article renderer and Research partial. No new marketing claims, decorative metrics, newsletter backend or dark variation is introduced. The transparent asset can composite on any future theme background.

## Rendered review

[Homepage comparison](round-five-overview.webp) shows the unchanged baseline beside the sole proposal at the same desktop viewport. [Project comparison](round-five-projects.webp) shows both project sections at the same scale.

- The new hero follows Prism's approved asymmetric composition while using Forma's Inter, neutral text, filled research CTA and outlined Blog CTA. The transparent cutout has an alpha channel and remains transparent in Astro's optimized WebP output. Social icons form one neutral row under it, with 44px targets, accessible names and hover titles.
- Recognition now reads “GitHub Star (alumni)” and “OpenJS Security Pathfinder” beside small icons. The links size to their content and have no outgoing arrows or second descriptive lines. They wrap into compact rows on narrow screens.
- Project headings now include small neutral category pills in the text flow. Generic symbols and standalone category rows are removed. GitHub/npm icons sit together just below the description; their accessible names identify both the project and destination. The top-right GitHub CTA provides the full collection action.
- Research retains Forma's equal-width document frame, paper metadata, coauthors, source links and top-right CTA. Blog and article views use the same unchanged reading renderer. The section order, speaking data, authentic book covers and contrasting RSS footer follow Forma.

The main remaining composition tradeoff is the asymmetric introduction: it gives the portrait more presence than the centered baseline, and requires stacking the portrait and introduction on mobile. This is the requested consolidation rather than a third aesthetic direction.

## Verification

`npm run lint` and `ASTRO_TELEMETRY_DISABLED=1 npm run build` passed, including Pagefind and Markdown output. Browser checks against the production build covered both themes' homepage, Blog and article views at 320, 390, 768, 1073, 1192 (the annotation viewport), and 1440 pixels. Checked no document overflow, Inter rendering, light presentation under dark OS preference, two-option comparison navigation, approved section order, side-by-side Research above 760px and stacked papers below it, social target sizes/names/focus, optimized portrait alpha, compact recognition content, category pills/source icons, Blog hover and keyboard focus, whole-article navigation, and readable sections without JavaScript. The gallery contains exactly two cards with decoded thumbnails. Production homepage still responds. Retired preview routes return 404; the sitemap and Pagefind body markers exclude design-lab. The design detector returned no findings.

Captured Forma before editing and compared it afterwards at 390, 1192 and 1440px for all three page types. Homepage and Blog renders matched pixel-for-pixel at every width; both desktop article captures also matched. The 390px article retained identical dimensions, with only 600 differing pixels at code-block corner edges across a 13.2-million-pixel capture. Forma's homepage, original recognition/content partials and Blog/article components are unmodified. Proposal-only markup and `.d5` styles provide the new details. Existing upstream embed-fetch/Astro warnings did not prevent the full build.

Only Forma and Forma Refined remain in the public preview manifest and gallery. Prism, Studio, and earlier explorations are removed from those routes; their historical briefs and comparison artifacts remain in Git history/documentation. No production route or theme selection was changed.
