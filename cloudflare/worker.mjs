import manifest from './.cloudflare/routes.json' with { type: 'json' };
import media from './.cloudflare/media.json' with { type: 'json' };
import policy from './http-policy.json' with { type: 'json' };
import { createHandler } from './handler.mjs';

export default { fetch: createHandler({ ...manifest, media, policy }) };
