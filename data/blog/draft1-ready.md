---
title: "TypeScript in 2025 with ESM and CJS npm publishing is still a mess"
description: >-
    How do you handle TypeScript, dual ESM and CJS publishing, and the JavaScript toolchain in 2025? Here's a brief overview of the current state of the ecosystem and the tooling I personally use.
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: []
slug: "typescript-in-2025-with-esm-and-cjs-npm-publishing"
image: ~/assets/images/blog/
---

How does the JavaScript ecosystem tooling looks like in 2025 for TypeScript developers and publishing to the registry?

Well, first off, there are now several JavaScript ecosystem points in the toolchain that are on the verge of hopefully unlocking a better developer experience for TypeScript developers and for a modern JavaScript ecosystem as a whole. This extends and includes gaps related to dual publishing of ESM and CJS modules to a registry and so on.

So what's in store right now with regards to modules and publishing toolchain in 2025?

- JSR.io - A new JavaScript registry that aims to replace npmjs.com. This isn't just a new storage place to push your packages to. JSR aims to be the natural choice to publish modern JavaScript packages and that means that code is written with TypeScript and packages are distributed via the modern ECMAScript modules as is the web standard for.
- Node.js v22 and v23 introduced native support for CommonJS modules to require ESM modules. This was previously available via the experimental command-line flag `--experimental-require-module` but with v23 and a backport to v22 of Node.js, this is now supported out of the box. To recall why this is a big deal in terms of relieving the pain of dual publishing, it's because prior to this, Node.js would refuse to load ESM modules from a CJS module and would require you to manage `package.json` exports, declare the `type` field, and so on. That's what lead to the dual publishing of ESM and CJS packages in the first place.

## TypeScript and ESM Package Toolchain in 2025

With all of the above context and new features in Node.js, and possibly the rise of the new JSR.io registry, not everyone are on the latest edge of the Node.js runtime and there's some catching up to do.

For this reason, I'm still likely going to manage dual publishing of ESM and CJS packages for a while. This is where the package build toolchain comes in and I want to share what I've come up with as a good balance for supporting TypeScript and ECMAScript modules that get transpiled and bundled to CommonJS modules (and to ESM) with a dual module system publishing strategy.

### tsup

So `tsup`'s purpose is to be a bundler for Node.js and browsers that is simple to use. It might claim to be zero-config but I ended up having to manage a `tsup.config.ts` regardless to customize and explicitly declare the behavior I'm expecting from the toolchain.

The role for `tsup` is that I run it as part of the `npm run build` process in which it transpiles TypeScript to JavaScript (and can bundle it into a single file if you choose to) and allows me to output both CJS and ESM modules, taking care of the `dist/` directory and all of that. I still however had to manage the `package.json` exports field and the `type` field to declare the module system.

Here's the related `package.json` snippet that I use `tsup` with:

```json
{
  "types": "dist/main.d.ts",
  "type": "module",
  "bin": "./dist/bin/cli.cjs",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/main.d.ts",
        "default": "./dist/main.mjs"
      },
      "require": {
        "types": "./dist/main.d.cts",
        "default": "./dist/main.cjs"
      },
      "default": "./dist/main.mjs"
    },
    "./dist/*": {
      "types": "./dist/*.d.ts",
      "import": "./dist/*.mjs",
      "require": "./dist/*.cjs"
    }
  },
  "scripts": {
    "build": "tsc && tsup"
  }
}
```

And then my `tsup.config.ts` has some specific declarations in it:

- My entry points. You'll notice there are two, due to the CLI executable that gets shipped with the package.
- The extension for the output files being `.mjs` and `.cjs` for ESM and CJS respectively so that older Node.js versions can still require the CJS module based on the filename convention.

```ts
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entryPoints: ['src/main.ts', 'src/bin/cli.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    minify: false,
    outDir: 'dist/',
    clean: true,
    sourcemap: false,
    bundle: true,
    splitting: false,
    outExtension (ctx) {
      return {
        dts: '.d.ts',
        js: ctx.format === 'cjs' ? '.cjs' : '.mjs',
      }
    },
    treeshake: false,
    target: 'es2022',
    platform: 'node',
    tsconfig: './tsconfig.json',
    cjsInterop: true,
    keepNames: true,
    skipNodeModulesBundle: false,
  },
])
```

### tshy

An alternative to `tsup` is `tshy`. tshy is much higher-level and opinionated than tsup — it builds CJS and ESM (using `tsc`, writes to your package.json, and reads config from package.json & tsconfig only and is not not intended as a CLI tool or bundler.

I've had friends such as Eric Allam from Trigger.dev who recommended `tshy` but I've settled on `tsup` for now as the balance of control and simplicity is what I'm looking for.

## TypeScript executors

You're likely going to need what's referred to as `TypeScript executors` which are tools that allow you to run TypeScript files ad-hoc, without having to transpile them to JavaScript first as a build step and only then run them. You can think of them as a replacement for `node`, since `node` doesn't support TypeScript files out of the box (yet! there's work in progress there too :-))

`ts-node` - I've been using `ts-node` for running the tests. I have it set up so that I execute `node` and provide it with the `--loader tsnode/esm` flag to be able to load TypeScript files.

Here is an example of `ts-node` in my scripts section of `package.json`:

```json
{
  "scripts": {
        "test": "c8 node --loader ts-node/esm --test __tests__/**",
        "test:watch": "c8 node --loader ts-node/esm --test --watch __tests__/**"
  }
}
```

Another option you can consider is `tsx`.

## Template for TypeScript and Dual Publishing in 2025

So instead of having to re-configure a project from scratch every time I want to build a new project I've managed to get a template going that I can re-use easily.

It's a scaffold project that I'm publishing to the npm registry and it's called [create-node-lib](https://github.com/lirantal/create-node-lib). You can easily scaffold a new project with:

```bash
$ npx create-node-lib my-new-lib
```

This will scaffold a new project with `tsup`, TypeScript, `ts-node`, coverage, a bunch of useful GitHub Actions and and all the necessary configurations for dual publishing ESM and CJS modules. You can find an example of an already scaffolded project that I use as a testing ground called [baboop](https://github.com/lirantal/baboop) which is actually a fun little CLI to pop-up desktop notifications.