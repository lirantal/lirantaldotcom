---
title: Assess your npm project health and call the doctor!
date: '2019-03-18'
pubDate: '2019-03-18'
description: npm project health assessment
image: ~/assets/images/blog/photo-1614154761029-f8e6c693bae8.jpeg
tags: npm, nodejs, javascript, tips
---

Tip 4: Assess npm project health (out of [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/))

## Outdated dependencies

Rushing to constantly upgrade dependencies to their latest releases is not necessarily a good practice if it is done without reviewing release notes, the code changes, and generally testing new upgrades in a comprehensive manner.

With that said, staying out of date and not upgrading at all, or after a long time, is a source for trouble as well.

The npm CLI can provide information about the freshness of dependencies you use with regards to their semantic versioning offset. By running `npm outdated`, you can see which packages are out of date:

```
$ npm outdated
```

![](https://res.cloudinary.com/snyk/image/upload/v1550482184/blog/npm-10-security-best-practices-CLI.png)

Dependencies in yellow correspond to the semantic versioning as specified in the package.json manifest, and dependencies colored in red mean that there’s an update available. Furthermore, the output also shows the latest version for each dependency.

## Call the doctor

Between the variety of Node.js package managers, and different versions of Node.js you may have installed in your path, how do you verify a healthy npm installation and working environment?

Whether you’re working with the npm CLI in a development environment or within a CI, it is important to assess that everything is working as expected.

Call the doctor! The npm CLI incorporates a health assessment tool to diagnose your environment for a well-working npm interaction. Run `npm doctor` to review your npm setup:

```
$ npm doctor
```

* Check the official npm registry is reachable, and display the currently configured registry.
* Check that Git is available.
* Review installed npm and Node.js versions.
* Run permission checks on the various folders such as the local and global `node_modules`, and on the folder used for package cache.
* Check the local npm module cache for checksum correctness.

> I also blogged about a complete [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/) you should adopt in a post that includes a high-resolution printable PDF like the snippet you see below.

[![Node Version](/images/blog/yvey2bykpvbjcxrurqoz.png)](https://snyk.io/blog/ten-npm-security-best-practices/)
