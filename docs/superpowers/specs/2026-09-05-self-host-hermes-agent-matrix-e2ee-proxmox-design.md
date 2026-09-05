# Self-hosting Hermes Agent with Matrix E2EE on Proxmox: article design

## Goal

Turn the supplied `article.md` into a published lirantal.com technical explainer while preserving its practical setup instructions and technical behavior. Remove environment-specific identifiers from the real deployment, use consistent realistic examples, and produce a complete blog entry with a generated Open Graph cover.

## Source of truth

The attached article is authoritative for the architecture, commands, configuration, verification steps, troubleshooting advice, and conclusions. Editorial work may improve structure, readability, citations, and formatting, but it must not silently change the setup or substitute a different technical approach.

The finished article will retain the source's central topology:

1. Element on Android reaches Synapse through tailnet-only Tailscale HTTPS.
2. Synapse runs inside an unprivileged Debian 13 LXC on Proxmox.
3. Hermes runs in a separate LXC and reaches Synapse over the private LAN.
4. Matrix E2EE protects messages between Element and the Hermes Matrix device.
5. Account, sender, recovery-key, device-ID, and room controls restrict the personal-assistant gateway.

## Publication metadata

- Filename: `data/blog/2026-09-05.md`
- Title: `Self-Hosting Hermes Agent with Matrix E2EE on Proxmox`
- Slug: `self-host-hermes-agent-matrix-e2ee-proxmox`
- Status: published with `draft: false`
- Proposed tags: `hermes`, `matrix`, `homelab`, `tailscale`, `proxmox`
- Cover: `src/assets/images/blog/self-host-hermes-agent-matrix-e2ee-proxmox.png`
- Frontmatter image: `~/assets/images/blog/self-host-hermes-agent-matrix-e2ee-proxmox.png`

The frontmatter will include matching `date` and `pubDate`, an accurate search description, empty `categories`, and relevant `keywords`. It will not include `readingTime`, which the Astro pipeline injects.

## Redaction map

Apply each replacement throughout prose, tables, diagrams, configuration snippets, commands, expected output, Matrix IDs, and URLs:

| Source value | Published example | Reason |
| --- | --- | --- |
| `tail77e7b.ts.net` | `tail-example.ts.net` | Hide the real tailnet DNS suffix. |
| `192.168.68.20` | `192.168.50.20` | Hide the real private LAN addressing. |
| `liran` / `@liran:...` | `owner` / `@owner:...` | Avoid publishing the real Matrix account address. |
| `TCNEKHSKLV` | `HERMESBOT1` | Avoid publishing an actual-looking Matrix device identifier. |
| `!abc123def456:...` | `!exampleRoom123:...` | Make the room ID explicitly illustrative and consistent. |

Keep generic values such as the `matrix` and `hermes` hostnames, loopback addresses, port `8008`, `/home/hermes` paths, `<CTID>`, and `100.x.y.z`. They describe the procedure without identifying the real environment.

The source audit found no literal passwords, access tokens, registration secrets, recovery keys, or public IP addresses. The article will warn readers that `cat ~/matrix.creds` displays administrator credentials, that recovery material must not enter logs or support chats, and that commands using a remote script pipe execute downloaded code.

## Editorial structure

Use the supplied article's substance and sequence while adapting it to the lirantal.com explainer profile:

- Begin with the architecture's thesis and the distinction between private reachability, HTTPS transport, and Matrix E2EE.
- Do not duplicate the title as an H1 in the Markdown body; Astro renders the frontmatter title.
- Normalize the numbered source headings to a consistent Markdown hierarchy.
- Retain the reference-environment table and topology diagrams.
- Preserve all executable commands and their operational context.
- Keep validation close to each configuration step so readers can distinguish Synapse, DNS, TLS, Tailscale, and Hermes failures.
- Retain the alternatives and trade-offs already present, especially LXC versus VM, LAN transport versus Tailscale on Hermes, password login versus access tokens, and sender versus room allowlists.
- Retain and polish the troubleshooting guide and the final second-brain application.
- Include an FAQ with at least three concrete questions derived from likely setup failures.
- End with practical next actions and the standard X/Twitter and GitHub calls to action.

The final body should sound like a first-hand technical account. The humanizer pass will remove formulaic transitions, excessive bolding, title-case headings, repetitive conclusions, and other synthetic writing patterns without altering commands or claims.

## Citations

Remove the terminal References section. Place descriptive inline links where the corresponding tool or behavior first matters, including canonical documentation for:

- Hermes Matrix setup and E2EE;
- Hermes environment variables;
- the Proxmox Element Synapse helper;
- Tailscale LXC support, MagicDNS, HTTPS certificates, and Serve;
- Synapse registration configuration;
- the Proxmox Debian 13 nesting behavior.

Use at least three inline canonical links. Preserve all useful sources from the attachment where they support a concrete instruction.

## Cover design

Generate one 1200x630 PNG editorial illustration. The visual idea is a small, private homelab communications relay: a compact server stack connected to a phone through a protected luminous path. Use restrained deep blue, teal, and warm amber lighting, subtle film grain, and enough contrast for a social preview. Avoid diagrams, labels, brand marks, dashboards, browser windows, people, and text.

The built-in image-generation tool will create the source image. The selected result will be copied or Sharp-resized into the exact cover path, then checked for 1200x630 dimensions before the build.

## Validation

Before completion:

1. Compare every code block and configuration value against the source article, allowing only the approved identifier replacements and presentational whitespace changes.
2. Search the new post for every original sensitive identifier and confirm none remain.
3. Confirm replacement identifiers remain consistent across prose, diagrams, commands, and expected output.
4. Confirm frontmatter follows current site conventions and points to an existing cover file.
5. Confirm the body has no terminal References section and has at least three descriptive inline links.
6. Confirm the cover metadata reports 1200x630.
7. Run `npm run build` from the repository root and require a zero exit status.

The homepage highlighted-post list is out of scope because it was not requested.
