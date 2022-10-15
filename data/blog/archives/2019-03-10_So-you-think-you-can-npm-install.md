---
title: So you think you're just gonna `npm install`? Think again
date: '2019-03-11'
pubDate: '2019-03-11'
description: installing dependencies is not the same for development as it is for continuous integration systems, in this post I share why.
image: ~/assets/images/blog/photo-1465788786008-f75a725b34e9.jpeg
tags: npm, nodejs, javascript, tips
---

We embraced the birth of package lockfiles with open arms, which introduced: deterministic installations across different environments, and enforced dependency expectations across team collaboration.

Life is good! Or so I thought…
what would have happened had I slipped a change into the project’s `package.json` file but had forgotten to commit the lockfile along side of it?

Both Yarn, and npm act the same during dependency installation . When they detect an inconsistency between the project’s `package.json` and the lockfile, they compensate for such change based on the `package.json` manifest by installing different versions than those that were recorded in the lockfile.

This kind of situation can be hazardous for build and production environments as they could pull in unintended package versions and render the entire benefit of a lockfile futile.

Luckily, there is a way to tell both Yarn and npm to adhere to a specified set of dependencies and their versions by referencing them from the lockfile. Any inconsistency will abort the installation. The command line should read as follows:

* If you’re using Yarn, run `yarn install --frozen-lockfile`
* If you’re using npm run `npm ci`

> Thanks for reading and to [Juan Picado](https://twitter.com/jotadeveloper) from the Verdaccio team who worked with me on it. [Check it out](https://snyk.io/blog/ten-npm-security-best-practices/)

[![Node Version](/images/blog/yvey2bykpvbjcxrurqoz.png)](https://snyk.io/blog/ten-npm-security-best-practices/)

