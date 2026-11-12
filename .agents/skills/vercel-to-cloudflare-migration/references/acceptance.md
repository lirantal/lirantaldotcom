# Validate behavior on the actual deployment

Use the existing test suite and an app-specific behavior inventory. Run full preview
acceptance when needed; for an unchanged accepted main deployment, honor a requested
light smoke pass. Expand tests when a failure or material code/runtime change warrants
it. Match results to the exact source SHA and deployment URL.

| Area | Representative checks |
| --- | --- |
| Pages | Homepage, key pages, canonical URLs, www redirects preserving path/query |
| Methods | GET/HEAD, required OPTIONS; HEAD has correct status/headers and no body |
| Negotiation | Normal HTML, explicit Markdown, recognized crawlers, query-based modes |
| Discovery | Link relations, catalogs, MIME/profile parameters, robots, RSS, sitemaps |
| APIs | Shape, pagination, CORS where intended, private-route auth, JSON errors |
| Errors | True 404 status, HTML/Markdown/JSON variants, unpublished aliases stay 404 |
| Headers | Required security policies, MIME, content disposition, cache directives |
| Assets | JS/CSS, search index/WASM, images, generated social cards, downloads |
| Browser | Mobile/desktop navigation, light/dark and saved choice, actual search/filter use |
| Auth/SSR | Session persistence, callbacks, secure cookies, CSRF, logout, dynamic handlers |
| Integrations | Embedded app interaction, payment destination, email/webhook behavior |
| Media | Metadata, actual decoded playback, seeking, byte ranges and validators |
| Privacy | Actual hosting disclosure and deliberate analytics behavior |

## Representation and cache safety

Where negotiation exists, alternate real requests to the same path: HTML, Markdown,
HTML, crawler, agent/API query and HTML again. Verify status, body format, content type
and relevant token/Link/Vary headers. Test agent mode followed by normal mode, errors,
HEAD and direct Markdown URLs. Do not assume direct Markdown twins and negotiated
responses have identical metadata; compare the intended contract.

`Vary` alone does not prove isolation at a shared cache. Where appropriate, disable
shared CDN caching of routed/negotiated responses explicitly (including platform-
specific CDN directives), while allowing immutable caching for fingerprinted assets.
Asset-storage cache hits can coexist with a non-cacheable Worker response: assess the
end-to-end body/headers, not the HIT label alone. Recheck on real production domains,
where zone cache/Page Rules and transformations may differ from workers.dev.

Inspect effective Page Rules, Cache/Redirect/Transform Rules, relevant account rules,
bot controls and browser TTL. Preserve shared protections unless the user explicitly
approves a scoped change. Do not turn off account-wide controls to make one preview pass.

## Video and object-store delivery

A plain static upload may fail both size limits and video seeking. Where required,
stream the object body through the runtime instead of buffering the whole file.
Verify first/middle/suffix ranges, unsatisfiable ranges (416), Content-Range and length,
HEAD, MIME, Accept-Ranges, ETag/Last-Modified and conditional responses. Respect If-Range
semantics if implemented. Reject or deliberately handle multipart ranges.

A 16-byte range alone is not proof of playback. In a real browser, load metadata,
play a decoded frame and seek to a later point. Keep bandwidth proportionate: use
ranges/metadata rather than repeatedly downloading every large file. After full media
acceptance, a representative range and one user playback check can serve as smoke tests
when the same read-only bucket and runtime behavior remain unchanged.

## External services and honest evidence

A populated iframe `src` only proves markup. Load the parent page and check visible
rendering plus a harmless interaction. Do not submit forms, generate paid content,
purchase items or interact with accounts unless that is authorized. Separate missing
player/thumbnail/vendor assets caused by the proxy from CSP/COEP/frame errors and real
provider failures. A provider 404 can be observed even while its assets are blocked;
that does not establish full application behavior or ownership.

When a check is blocked, record exact URL, time, environment ID/observed policy,
HTTP/TLS or CONNECT result, browser symptom and unverified portion. Use the external
attestation template. Do not claim a browser pass based on a local build or another
origin. Do not bypass network policy by changing clients or connection routes.

## Hosting transformations and production indexing

Test the real edge. For Cloudflare email obfuscation, preserve intended `email_off`
markers and inspect rendered HTML for broken `/cdn-cgi/l/email-protection` links;
local output cannot prove the edge did not rewrite them. Verify canonical/social
metadata, asset existence and preview indexing controls. Keep the agreed canonical
strategy and confirm production has no accidental preview-only noindex flag.

For protected apps, verify unauthenticated access, authorization boundaries and preview
secrets without disclosing credentials or exposing private responses as public twins.

## Light production smoke

A useful small pass includes apex HTML, www path/query redirect, health/API, one
negotiated/agent sequence if applicable, search assets plus one real search, one image,
one legacy redirect, true errors, a representative R2 range, HTTPS and production
indexing/header checks. Adapt to the app. Repeating all hundreds of accepted routes
and all browser regressions is not necessary for metadata-only cutover changes unless
new evidence justifies it. Do not describe this as full acceptance coverage.
