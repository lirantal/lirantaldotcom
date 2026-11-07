# Open-source area

Extend the existing Forma Refined system: Inter, white paper `#FFFFFF`, ink/accent `#171717`, muted `#626262`, surface `#F7F7F7`, rule `#DFDFDF`; shared tokens supply dark mode. No independent palette or new fonts.

The homepage keeps its stable `#open-source` anchor and the full npm/GitHub dashboard. Three compact editorial highlights replace the repeated six-project inventory: Node.js core hardening, OWASP guidance, and GitRanks language rankings. The primary action opens `/open-source`.

The hub opens with the purpose of the work and a dated, scoped contribution summary. A featured Node.js fix supplies the concrete example, followed by three routes into the collection:

```text
shared header / wrapping open-source navigation
introduction                  dated contribution facts
Node.js hardening feature      PR evidence and context
Projects | Contributions | Impact & rankings
selected work / community recognition / contribution invitation
shared footer
```

Everything is left aligned on the shared 1120px grid. Long prose stays below 72ch. The maintained-project collection groups security defenses, developer tools, and shared practices; editorial rows explain purpose and exact involvement. The contributions page curates upstream changes rather than reproducing a GitHub activity feed. Impact pairs the existing dashboard with scope/methodology and GitRanks links. Native navigation and source links work without JavaScript.

Review against the brief: a generic portfolio would repeat repository cards and headline star totals. This area instead makes one concrete contribution memorable (Node.js process hardening), connects research to defenses, and distinguishes creation, maintenance, education, and upstream work. Existing project titles and source links remain available. GitRanks figures require a verified profile snapshot; unavailable ranks must never become invented numbers or zeroes.

Evidence gathered November 6, 2026 (client date): GitHub user profile, all five public repository pages, all nine pages of the merged-PR search outside `lirantal`, project READMEs, npm maintainer metadata, and the Node.js fix. Search returned 850 unique merged PRs across 193 repositories, with `incomplete_results: false`. Includes Snyk organization work; this is a namespace boundary, not an independent-volunteer-work claim. Retain only aggregate scope, selected repository counts, and curated examples in the site.

GitRanks methodology was readable; its profile and ranks routes were unavailable through the browsing service. Liran supplied the complete profile/ranking text during this task, including the profile update date of November 4, 2026. `src/data/gitranks.json` preserves the supplied three global/country ranks and three selected language rankings, with explicit provenance and capture date. Feature top 0.1% globally across the three rankings, #845 by contributor reach, and #1 in Israel for JavaScript and PHP. The 1,104,888 contributor stars belong to 89 repositories with merged PRs, not to Liran’s code. GitRanks’ coverage differs from the direct GitHub search’s 193 repositories; never equate the populations. Do not mirror tier-progress targets, monthly fluctuations, every language, remote badges, or the full profile.

Validation: production build (including Markdown twins and Pagefind), lint, internal/deploy links, social cards, and rendered responsive light/dark inspection. The mechanical Impeccable detector supplements visual review; its sanctioned Inter/neutral system findings are not grounds to redesign.
