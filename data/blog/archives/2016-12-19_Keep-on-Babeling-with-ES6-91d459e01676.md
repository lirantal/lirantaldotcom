---
title: Keep on Babeling with ES6
description: >-
  In my previous post we did a crash course to Babel.js, let’s now dive deeper
  down the rabbit hole.
date: '2016-12-19T10:40:36.840Z'
categories: []
keywords: []
tags: []
slug: keep-on-babeling-with-es6-91d459e01676
pubDate: '2016-12-19T10:40:36.840Z'
image: ~/assets/images/blog/698b74d1a6af8ab8b6584fd39a2a2e89.jpeg
---

In [my previous post](https://medium.com/@liran.tal/primer-to-babel-js-1c064fc0f236#.kkqe9btf8) we did a crash course to Babel.js, let’s now dive deeper down the rabbit hole.

### Experimenting with Stage-X

Presets are a collection of plugins that perform transformations. In that context, Stage-X presets are the same collections, but they refer to features in the very bleeding edge of the JavaScript engine spec.

The spec itself is referred to as [TC39](https://github.com/tc39) and is split into the following stages:

*   stage-0 — just an idea
*   stage-1 — proposal
*   stage-2 — draft spec
*   stage-3 — initial browser implementation as candidate
*   stage-4 — finished and will be added in the next release

### Babel Config

Babel can either get it’s config when being invoked from gulp, webpack or others, or it can read it’s configuration from a dedicated .**_babelrc_** file.

The configuration file is yet another JSON file which can specify the plugins, presets or specific environment configuration.

All plugins, and presets should be specified with their full name (i.e: **_babel-preset-es2015_**) or with their shorthand prefix (i.e: **_es2015_**) because Babel knows to shortcut the babel-plugin or babel-preset prefix.

Ordering is important, plugins run first in their order of apperance in the array, and then presets are followed after.

Options can be set for specific environments using the **_env_** option.

A summarizing example:

{  
  "plugins": \[  
     "babel-preset-es2015"          // runs first  
  \],  
  "presets": \[  
     "es2015",                      // runs third  
     "stage-0"                      // runs first  
 \],  
  "ignore": \[  
    "foo.js",  
    "bar/\*\*/\*.js"  
  \],  
  "env": {  
    "production": {  
      "plugins": \["transform-react-jsx"\]  
    }  
  }  
}

### Source Maps

Source maps play an important role when debugging your code comes into play.

Errors happen, exception are thrown, that’s obvious.  
But when they occure they happen in the context of the compiled version of your code, because this is what gets executed and run.

Because of that, when an error is thrown and Node.js says it happens on line 42 then it’s referring to the compiled version that we built with Babel.  
That’s not helpful because you are interested in the specific change on your original ES6 code, right?

Indicate the build process to also create source maps:

babel lib/ -d build --source-maps

Errors that will be thrown now will correctly hint the proper file and line number.