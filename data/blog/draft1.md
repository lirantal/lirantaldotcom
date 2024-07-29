---
title: "TypeScript in 2024 with ESM and CJS npm publishing is still a mess"
description: >-
  
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: []
slug: ""
image: ~/assets/images/blog/
---


## Package build toolchain

### tsup

Purpose: A bundler for Node.js and browsers.

### tshy

tshy is much higher-level & opinionated than tsup—it builds CJS and ESM (using `tsc`, writes to your package.json, and reads config from package.json & tsconfig only (not intended as a CLI tool or bundler)

Zod is a TypeScript-first schema declaration and validation library. It is designed to be as simple as possible, and to be as easy to use as possible. A recent [pull request introduces tshy](https://github.com/colinhacks/zod/pull/3653/files) as a build toolchain for Zod.


Purpose: Building CJS and ESM, not a bundler.

## TypeScript executors

### ts-node

### tsx