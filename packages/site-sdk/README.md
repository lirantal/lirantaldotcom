# @lirantal/site-sdk

A small, dependency-free JavaScript client for the public, read-only post API at [lirantal.com](https://lirantal.com).

```js
import { LirantalSiteClient } from '@lirantal/site-sdk';

const client = new LirantalSiteClient();
const matches = await client.searchPosts('MCP security');
console.log(matches.map(({ title, markdownUrl }) => ({ title, markdownUrl })));
```

The client filters the returned metadata locally. It does not call a server-side search endpoint. Each result includes a canonical page URL and a Markdown URL for fetching the full article. No authentication is required.

## API

- `listPosts({ signal })` returns the full published post collection.
- `searchPosts(query, { limit, signal })` matches all query terms against title, summary, category, and tags.
- Set `baseUrl` to use a compatible mirror or `fetchImpl` to provide a custom Fetch implementation.

The OpenAPI document is at <https://lirantal.com/openapi.json>.
