---
title: Primer to Babel.js
description: >-
  I’m sure you’re interested in ES6, supporting JSX, etc.So I worked out this
  intro so you can get up to speed really quick and really clear…
date: '2016-11-28T13:36:52.032Z'
categories: []
keywords: []
tags: []
slug: primer-to-babel-js-1c064fc0f236
pubDate: '2016-11-28T13:36:52.032Z'
image: ~/assets/images/blog/cfa92d0bdb044201a4373b1b9721b297.jpeg
---

I’m sure you’re interested in ES6, supporting JSX, etc.  
So I worked out this intro so you can get up to speed really quick and really clear (I hope!)

This is the bare-bones, quickest intro to everything you need to know about Babel.

![](/images/blog/0__4uHSBeXQ8XM11pNv.jpg)

### Interlude

Babel compiles JavaScript code, to JavaScript code. Not so complicated, right?  
It needs to do it because there are different versions of the JavaScript engines and developers want to use bleeding edge code syntax and functionality but also supporting old JavaScript engines running on older browsers or Node.js versions.

Babel’s high-level architecture broken in two main packages:

*   **_babel-cli_** — helps with running babel from the command line for compiling file by file.
*   **_babel-core_** — the core babel library for Node.js.

There are many other npm modules which are integrations like **_gulp-babel_**, or **_babel-loader_** for webpack, as well as the babel collections of transformations like **_babel-preset-es2015_** and so on. We’ll touch the latter in a sec.

### How Babel Works, in a nutshell

Babel is just a compiler.  
It has 3 stages where things happen:

1.  Parsing — a piece that knows how to parse JavaScript code. By default this is what Babel does in it’s core.
2.  Transforming — a piece that knows how to apply any sort of transformations based on the parsed data. For example:  
    **_const h = ‘hello’_** and converting it to **_var h = ‘hello’._**
3.  Generating — Applies the generated transformations.

### Babel’s modularity

Plugins, Presets, and Pollyfils:

*   Plugins — plugins are specific set of transformations that are applied to syntax. For example, supporting arrow functions in ES6. As you can imagine, there are many plugins that are created to cover all of ES6.
*   Presets — presets are simply a collection of plugins. They are just a bundle of the plugins, no extra sugar.
*   Pollyfils — these are plugins that pollyfil a specific set of functionality that is not yet available in the runtime engine, hence require an actual implementation. For example: **_Object.assign_** in ES6.

### Resources

Learn more about Babel:

[**Plugins · Babel**  
_The compiler for writing next generation JavaScript_babeljs.io](https://babeljs.io/docs/plugins/ "https://babeljs.io/docs/plugins/")[](https://babeljs.io/docs/plugins/)

Want to know more about compilers like Babel? check out the following project:

[**thejameskyle/the-super-tiny-compiler**  
_the-super-tiny-compiler - :snowman: Possibly the smallest compiler ever_github.com](https://github.com/thejameskyle/the-super-tiny-compiler "https://github.com/thejameskyle/the-super-tiny-compiler")[](https://github.com/thejameskyle/the-super-tiny-compiler)