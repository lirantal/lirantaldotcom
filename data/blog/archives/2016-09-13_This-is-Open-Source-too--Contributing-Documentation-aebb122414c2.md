---
title: 'This is Open Source too: Contributing Documentation'
description: >-
  So what does Open Source software mean in real life? I promise no fancy
  philosophies and day-long lectures by Richard Stallman about open…
date: '2016-09-13T14:41:49.947Z'
categories: []
keywords: []
tags: []
slug: this-is-open-source-too-contributing-documentation-aebb122414c2
pubDate: '2016-09-13T14:41:49.947Z'
image: ~/assets/images/blog/e4edef371b544aa64fd4995e4f02997c.jpeg
---

**So what does Open Source software mean in real life?** I promise no fancy philosophies and day-long lectures by Richard Stallman about open source and free software.

Contributing documentation — yes that’s an open source thing too.Not everything is about code, and you don’t need to provide a patch to fix the Linux kernel for your contribution to matter. Any contribution is welcome!

![](/images/blog/0__eM5Yke1nrV46ASv7.png)

Two weeks ago I started working on a [NodeJS API client](https://github.com/lirantal/operations-orchestration-api) for [HPE’s Operations Orchestration](https://hpln.hpe.com/group/operations-orchestration) product, and this software I’m building provides a console CLI for users to interact with the OO product.

Obviously to interact with the console there is going to be some library that someone else wrote for me to use, which can parse all the arguments and display a nice command usage output. Something like this:

![](/images/blog/0__IjnzTQCzkKyba0k8.png)

The search for this library takes place in [NPM](https://www.npmjs.com/), the largest repository of open source NodeJS packages, which quickly shows some popular libraries I can use, one of which is [command-line-args](https://github.com/75lb/command-line-args)

That library is gold!It does everything I need, it has tests and code coverage, maintained well, released often. Awesome. But then… I wanted to add some description to my command arguments yet couldn’t find anything in the documentation about it. Only after inspecting the source code a little bit further I’ve found references to a _description_ property that can be configured.

So hey, I found the solution to my problem, that’s great, I’m all done with this library.But what if someone else will have the same problem in the future? They might be a little lazier and rule out this library just because it doesn’t seem to support a description configuration, which isn’t true, it’s just missing out from the documentation.

This is where open source shines! Here is how you contribute to open source in 3 easy steps:

1.  Fork the original Github repository, in our case it is [https://github.com/75lb/command-line-args](https://github.com/75lb/command-line-args)
2.  Now that you have your own copy of the repository, make changes to the _md_ documentation on your own repo, commit and push them.
3.  Create a Pull-Request, which is just Github terminology for merging and incorporating your changes with the original repository.

Your contribution will be appreciated, and addressed by the project maintainer:

![](/images/blog/0__3Z__hzL5bjCfexeBz.png)

And you also got yourself a new brother in the open source family :)