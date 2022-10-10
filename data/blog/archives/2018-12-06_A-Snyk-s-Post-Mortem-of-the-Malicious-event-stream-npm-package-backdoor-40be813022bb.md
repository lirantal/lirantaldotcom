---
title: A Snyk’s Post-Mortem of the Malicious event-stream npm package backdoor
description: >-
  Last week the imaginable happened. A malicious package, flatmap-stream, was
  published to npm and was later added as a dependency to the…
date: '2018-12-06T17:39:09.000Z'
categories: []
keywords: []
tags: []
slug: >-
  a-snyks-post-mortem-of-the-malicious-event-stream-npm-package-backdoor-40be813022bb
pubDate: '2018-12-06T17:39:09.000Z'
image: ~/assets/images/blog/f4c8af6beb8aa370076153cf5c409e86.jpeg
---

Last week the _imaginable_ happened. A malicious package, flatmap-stream, was published to npm and was later added as a dependency to the widely used event-stream package by user `right9ctrl`. Some time, and 8 million downloads later, applications all over the web were unwittingly running malicious code in production. We wrote some [early thoughts on our blog last week](https://snyk.io/blog/malicious-code-found-in-npm-package-event-stream), moments after the incident came to light, but are now able to perform a deeper post-mortem including a timeline of the events as they took place. Thanks go to many others who also investigated this issue, and in particular GitHub user `maths22`, who reverse engineered the malicious code.

### What is the event-stream package?

The event-stream package is a toolkit that provides utilities to creating and managing streams. Authored by Dominic Tarr (`~dominictarr` on npmjs), it is one of [422 packages](https://www.npmjs.com/~dominictarr) he owns on npmjs. The event-stream package has a total of 84 releases, dating back to v0.5.2, in 2011, and having regular releases up until version 3.3.4, two years ago.

Throughout event-steam’s total development, it received contributions from [33 different contributors](https://github.com/dominictarr/event-stream/graphs/contributors), but most of its contributions were delivered in its early days and has only reviewed minor changes since then:

![](/images/blog/0__yO__HNQPj1qz2cgOY.png)

The project had received over 2000 stars, been forked 139 times and 62 GitHub users have signed-up for notifications on any changes happening in the project. The project was used by 3931 other packages (excluding scoped packages).

### The Timeline of Events

Here is a timeline showing some of the major milestones in the project history, and the key moments during the malicious incident. We’ll look into each point on the timeline, and more, in detail below.

![](/images/blog/0__invkHLtulBJ8BEYx.jpg)

### Chain of Events

We’ll take a look at the chain of events which led up to the use of the malicious flatmap-stream package. These events were researched from public GitHub information, Google cache, and npm.

**31st July, 2015:** GitHub user, `devinus`, [comments on an issue](https://github.com/dominictarr/event-stream/issues/73) on the event-stream project questioning whether a flatmap functionality would be welcomed, to which the package maintainer, `dominictarr`, replies positively stating that a user contribution would be accepted:

![](/images/blog/0__hrLmJn1ag3__kk4MT.png)

We could speculate that the later to be discovered malicious user `right9ctrl` could well have used this information to plan and execute an elaborate social engineering attack on the project.

**August 5, 2018:** a user who identified as _“Antonio Macias”_ in npm created and published a non-malicious package called flatmap-stream.

Next, Antonio Macias proposed that the event-stream project used in the flatmap package. GitHub user `right9ctrl` approached Dominic Tarr asking to assist with the project and to make the necessary changes to introduce the flatmap functionality, by pulling in the flatmap-stream dependency. Dominic accepted `right9ctrl`'s offer and makes them a contributor to the event-stream GitHub project, as well as gave `right9ctrl` full npm publishing rights for the module on the npm ecosystem. Dominic later confirmed during the incident report that he no longer had any publishing rights for the module on npm to remedy the incident (i.e. by removing the infected 3.3.6 version from npm)

Soon after, a series of innocuous commits were pushed by `right9ctrl` to the event-stream GitHub repository:

**September 16, 2018:** flatmap-stream was removed from the event-stream code in [908](https://github.com/dominictarr/event-stream/commit/908fee5c65d4eb02809a84a1ebc3e5df1f935cd1) and from the dependency tree in [2bd](https://github.com/dominictarr/event-stream/commit/2bd63d58fe24367372690c29c7249ed1c7145601) and released as a major version, 4.0.0

**September 20, 2018:** `right9ctrl` adds further cosmetic code changes that enhance the project's keywords in [60d](https://github.com/dominictarr/event-stream/commit/60d0aa3def10c09ead68ee43804f244ffbd3b9c9) to presumably further improve the search results on the official npmjs.com registry website

**October 5, 2018:** a new minor version flatmap-stream@0.1.1 was released with the injection attack in its minified source code. Installations of event-stream will now also fetch the new infected 0.1.1 version of flatmap as a transient dependency.

There is no more evidence of any further work to the event-stream project by the `right9ctrl` user, whose profile has now been removed from GitHub and npm, although can still be [accessed via Google cache](https://webcache.googleusercontent.com/search?q=cache:Lyox1SZ96zAJ:https://github.com/right9ctrl+&cd=1&hl=en&ct=clnk&gl=il) for introspection:

![](/images/blog/0__HvJWdPWRuzsb7t7h.png)

**October 29, 2018:** `jaydenseric` opened an [issue against nodemon](https://github.com/remy/nodemon/issues/1442) reporting an unexpected deprecation warning. This message is in line with OpenSSL's recommendation to use a more modern algorithm instead of `EVP_BytesToKey` it is recommended that developers derive a key and IV on their own using `[crypto.scrypt()](https://docs.google.com/document/d/19g1krCBUjjPyz7mkKT-xNoJXIG_PQYcZCm0HfcH8DnM/edit)` [and to use](https://docs.google.com/document/d/19g1krCBUjjPyz7mkKT-xNoJXIG_PQYcZCm0HfcH8DnM/edit) `[crypto.createDecipheriv()](https://docs.google.com/document/d/19g1krCBUjjPyz7mkKT-xNoJXIG_PQYcZCm0HfcH8DnM/edit)` to create the Decipher object.

![](/images/blog/0__EqTRck__pZLeebpKv.png)

November 19, 2018: `NewEraCracker` opened an issue [against event-stream](https://github.com/remy/nodemon/issues/1451).

![](/images/blog/0__zfRMohqvUW__SCVXJ.png)

**November 19, 2018:** `NewEraCracker` opened an issue [against nodemon.](https://github.com/remy/nodemon/issues/1451)

![](/images/blog/0__e1aKbPTeC3j6FXf0.png)

**November 20, 2018:** `FallingSnow` [suspects it's an injection attack.](https://github.com/remy/nodemon/issues/1442#issuecomment-440435714)

**November 20, 2018:** `FallingSnow` opens the [issue against event-stream.](https://github.com/dominictarr/event-stream/issues/116)

**November 26, 2018:** flatmap-stream package got removed from npm.

**November 27, 2018:** Snyk published a [blog post](https://snyk.io/blog/malicious-code-found-in-npm-package-event-stream) on the issue.

### The Target: Copay

Upon a more detailed inspection of the flatmap-stream code, we can see that this was a surgically targeted attack on [Copay](https://copay.io/), a secure bitcoin wallet platform.

The malicious flatmap-stream code was downloaded millions of times, and executed many million more. The attackers could have done countless evil things here. But instead, their strategy was to wait for the opportunity to be executed when the Copay app was being built. They succeeded, and were built into Copay versions 5.0.2 to 5.1.0.

The decryption code looked for the key in an environment variable named npm\_package\_description. This environment variable is set by npm in the root package’s description. It would be only be decrypted if the client application was the bitcoin wallet, Copay, which used the key to decrypt the payload as “A Secure Bitcoin Wallet”. The latter was found by `maths22` as he brute forced various npm package descriptions.

To work this out, the user, `maths22`, [enumerated over different npm package descriptions](https://github.com/dominictarr/event-stream/issues/116#issuecomment-441745006), using them as keys, to decrypt the payload. However this wasn't all, the second payload would execute upon running a [specific build commands](https://github.com/bitpay/copay/blob/master/package.json#L70-L72), essentially only when the ios, android, or desktop applications are being built.

The [third and final payload](https://gist.github.com/jsoverson/3df528d4f0be857fe03c32dafc56a486#file-payload-c-js) is JavaScript code that will be injected into another dependency, namely `./node_modules/@zxing/library/esm5/core/common/reedsolomon/ReedSolomonDecoder.js`. This was then executed within the app itself, unlike the first two payloads which were executed during build time.

The malicious code harvested Bitcoins along with the wallet private keys, if the wallet balance was above 100 Bitcoins or 1000 BHC (Bitcoin Cash). Copay issued the following advice to their users:

> _Users should not attempt to move funds to new wallets by importing affected wallets’ twelve word backup phrases (which correspond to potentially compromised private keys). Users should first update their affected wallets (5.0.2–5.1.0) and then send all funds from affected wallets to a brand new wallet on version 5.2.0, using the Send Max feature to initiate transactions of all funds._

The further suggested that users “should assume” their private keys may have been compromised, and react by “immediately” moving any holdings to new, secure v5.2.0 wallets.

From the post-mortem of the events and the attack, we can see that this was a well planned and well executed attack, which was performed by professionals and likely took months of preparation.

### Conclusion

The series of events that have been described in this blog are another reminder of how fragile the open-source model can be if not respected. If widely used packages, such as event-stream, were supported by just a small proportion of those who consume it, and take value from it, the malicious takeover could easily have been avoided. The event-stream package was included as a dependency all over the npm ecosystem, being included in at least [3931](https://github.com/dominictarr/event-stream/files/2616706/flatmap-deps-list.txt) packages as a dependency. Most notably, affecting top level packages such as: @vue/cli-ui, vscode, nodemon, and ps-tree.

The malicious package could have even remained unnoticed if not for the deprecation message that caused Jayden Seric to open an issue on the nodemon package. Otherwise, it’s likely it would have not been found for a long time.

Snyk are are big advocates for responsible disclosure and practice security research as part of their security culture and have a history of collaboration with open source project maintainers.

If you discover a vulnerability that you would like to responsibly disclose Snyk would love to help if you send a [responsible disclosure form](https://snyk.io/vulnerability-disclosure).

_Originally published at_ [_https://snyk.io_](https://snyk.io/blog/a-post-mortem-of-the-malicious-event-stream-backdoor/) _on December 6, 2018._