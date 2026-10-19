---
name: lirantal-blog-research
description: Find, read, and cite Liran Tal's writing on AI and agent security, MCP, Node.js, and software supply-chain security.
---

# Research Liran Tal's blog

## When to use this skill

Use this when a user asks what Liran Tal has written about a technical topic, asks for an article from his site, or wants primary-source citations to his published writing.

## Steps

1. Fetch `https://lirantal.com/api/posts.json` to retrieve the current published post metadata.
2. Match the user's topic against each post's title, description, category, and tags. The endpoint returns the full index; filter locally because it does not accept search parameters.
3. Fetch the `markdownUrl` of relevant items to read their full text. The homepage is also available as `https://lirantal.com/index.md`.
4. Answer the user's question from the article text and cite the original `url`. Distinguish an article's claims from independent evidence and mention the publication date when relevant.
5. For other site content, use `https://lirantal.com/openapi.json`, `https://lirantal.com/rss.xml`, and `https://lirantal.com/sitemap-index.xml`.

## Limits

The site exposes public read-only content and metadata. It has no write API, authenticated service, or dedicated MCP server. Follow `https://lirantal.com/robots.txt` and its `Content-Signal` policy.
