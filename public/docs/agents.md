# Agent documentation for lirantal.com

This is Liran Tal's personal website and technical blog. Use the site to find published articles, open-source projects, research, books, and speaking material on AI security, MCP, Node.js, and software supply-chain security.

## When to use this site

- Find Liran Tal's published writing and reference the original article URL.
- Search post titles, summaries, categories, and tags through the public read-only JSON endpoint.
- Read complete post text from the Markdown URL included in each API item.
- Browse related profile and project details through the homepage, writing directory, speaking pages, and RSS feed.

## Programmatic access

- OpenAPI: [openapi.json](https://lirantal.com/openapi.json)
- Published posts: [api/posts.json](https://lirantal.com/api/posts.json)
- RSS: [rss.xml](https://lirantal.com/rss.xml)
- Sitemap: [sitemap-index.xml](https://lirantal.com/sitemap-index.xml)
- Health: [health.json](https://lirantal.com/health.json)
- Agent-mode view: [agent-view.json](https://lirantal.com/agent-view.json), also available at `/?mode=agent`
- Discovery metadata: [site-for-agents.json](https://lirantal.com/.well-known/site-for-agents.json)
- Agent skill index: [agent-skills/index.json](https://lirantal.com/.well-known/agent-skills/index.json)
- ARD manifest: [ard.json](https://lirantal.com/.well-known/ard.json)

These are public, read-only resources and need no authentication. There is no dedicated MCP server or write API. Use `/robots.txt` as the source of truth for crawler and AI-use preferences.

## Markdown

HTML pages advertise a Markdown alternate. The homepage has a Markdown twin at `/index.md`; for a page such as `/blog/example`, append `.md` to get `/blog/example.md`. Production also supports `Accept: text/markdown` content negotiation.

For build commands, site architecture, content conventions, and repository changes, read the [repository agent guide](https://github.com/lirantal/lirantaldotcom/blob/main/AGENTS.md).
