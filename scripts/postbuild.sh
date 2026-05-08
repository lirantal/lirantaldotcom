#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
PAGEFIND="$ROOT/node_modules/.bin/pagefind"
if [ ! -e "$PAGEFIND" ]; then
	echo "postbuild: pagefind not found at $PAGEFIND (run npm install)" >&2
	exit 1
fi

if [ -d "$ROOT/dist/client" ]; then
	SITE="$ROOT/dist/client"
else
	SITE="$ROOT/dist"
fi

"$PAGEFIND" --site "${SITE}/"

# Ahrefs (and browsers) request both; one deploy artifact must include the full Pagefind bundle.
for f in pagefind-ui.css pagefind-ui.js; do
	if [ ! -f "$SITE/pagefind/$f" ]; then
		echo "postbuild: missing $SITE/pagefind/$f after pagefind" >&2
		exit 1
	fi
done

# @astrojs/vercel copies dist → .vercel/output/static during astro:build:done, before this script runs.
# Sync generated Pagefind assets into the deploy bundle so /pagefind/* is not 404 on Vercel.
VERCEL_STATIC="$ROOT/.vercel/output/static"
if [ -d "$VERCEL_STATIC" ]; then
	if [ ! -d "$SITE/pagefind" ]; then
		echo "postbuild: pagefind output missing under $SITE/pagefind" >&2
		exit 1
	fi
	rm -rf "$VERCEL_STATIC/pagefind"
	cp -R "$SITE/pagefind" "$VERCEL_STATIC/pagefind"
fi
