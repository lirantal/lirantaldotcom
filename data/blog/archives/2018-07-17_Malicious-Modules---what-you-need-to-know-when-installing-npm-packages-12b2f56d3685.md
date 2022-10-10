---
title: Malicious Modules — what you need to know when installing npm packages
description: What if someone was able to directly publish a new vulnerable React version?
date: '2018-07-17T09:56:53.190Z'
categories: []
keywords: []
tags: []
slug: >-
  malicious-modules-what-you-need-to-know-when-installing-npm-packages-12b2f56d3685
pubDate: '2018-07-17T09:56:53.190Z'
image: ~/assets/images/blog/c4a0a36699be4bafe82424cff04faa48.jpeg
---

What if someone was able to directly publish a new **vulnerable** React version?

What if someone gained direct publish access to popular npm modules?  
More precisely these are the numbers:

![](/images/blog/1__z2LKU9xAuGSmHxEBGsYmYg.png)

Read on to understand why, and how it can happen.

Understanding security concerns in the npm ecosystem is an absolute must for anyone who is doing JavaScript related development.

Whether you’re a consumer of a package, or an author of one, you should be familiar with the security concerns presented here.

![](/images/blog/1__7apoG__kCuzSWMYjnNJZ17Q.png)

### Malicious Modules

npm is an open ecosystem, where anyone with an e-mail address can contribute a module to the repository, and in turn, any user with an npm client installed can consume it.

**But what makes a module malicious?**

*   Upon requiring it, the module could gather information from your system or network, and send it out to a 3rd party.
*   Upon installing it, the module could have an install phase, where it will run destructive commands, for example: **_rm -rf /_**

By now you’re thinking “_but who would consciously install a malicious module?_”

Typosquatting — an attack in which malicious modules are named similar to real modules and could accidentally be installed by a user typo, or phishing websites.

![](/images/blog/1__P0gkqRCywrcAQvuEowfuOg.png)

This problem isn’t unique to npm either — it hit both ruby and [python](https://arstechnica.com/information-technology/2017/09/devs-unknowingly-use-malicious-modules-put-into-official-python-repository/) as well.

You’re welcome to read a very interesting and detailed research on the subject by Nikolai Tschacher — [Typos in package managers — A Bachelors Thesis in Computer Science](http://incolumitas.com/2016/06/08/typosquatting-package-managers/)

#### Malicious Contributors

A private case of malicious modules is where malicious contributors may send you a PR with a backdoor, or an added project dependency of their own, which is of course malicious.

You might not notice it or code-review, and there you have it — you bundled it straight with your own module.

### Compromised Contributors

Raise your hand if you ever submitted a module to npm.

What would happen if malicious attackers would be able to get their hands on user credentials for module authors or contributors of key modules?

![](/images/blog/1__XcwEULojmZSvp__blNdwrxQ.png)

Nikita, a member of the Node.js CTC [released his findings](https://github.com/ChALkeR/notes/blob/master/Gathering-weak-npm-credentials.md) since almost a year ago about weak passwords that npm module authors use.

[**ChALkeR/notes**  
_Some public notes_github.com](https://github.com/ChALkeR/notes/blob/master/Gathering-weak-npm-credentials.md "https://github.com/ChALkeR/notes/blob/master/Gathering-weak-npm-credentials.md")[](https://github.com/ChALkeR/notes/blob/master/Gathering-weak-npm-credentials.md)

He gained (?) module publish permissions to the following modules,  
I don’t know if you ever heard of them:

*   react
*   debug
*   request
*   koa
*   winston
*   mysql

![](/images/blog/1__3ztJVat3ygWSWmlOLZ6ZLw.gif)

### A Safer World

*   As a user, you should pay a greater attention of what modules you are installing. Don’t copy&paste anything blindly.
*   The **npm** folks themselves have recognized the problem and taken pro-active measures to make typo-squatting a problem.  
    Read more in their blog post about it: [**New Package Moniker rules**](http://blog.npmjs.org/post/168978377570/new-package-moniker-rules)
*   Still, as a user you may want to take extra precaution of not executing install lifecycle scripts when modules get installed/uninstalled. FYI it may break some modules that depend on those lifecycle scripts. This can be done with **_npm config set ignore-scripts true_**
*   Npm’s recent acquisition of ^Lift and it’s Node Security Platform means it is possible to better integrate between the npm client and security concerns like checking vulnerabilities when you install/ad-hoc.  
    This has been made available through the latest npm@6 release: [https://docs.npmjs.com/getting-started/running-a-security-audit](https://docs.npmjs.com/getting-started/running-a-security-audit)
*   Make use of tools like [Snyk](https://snyk.io) that will let you know if a module you are installing is known to be malicious or have vulnerabilities. It is still relevant as Snyk is considered to have the largest and most up to date vulnerabilities database, plus you are able to patch packages which don’t have a fix yet, and track everything through their platform.
*   As a module author [enable 2FA](https://docs.npmjs.com/getting-started/working_with_tokens) on npm, and use tools like Snyk in your CI.
*   As a module author, make sure you aren’t re-using passwords from other accounts (this is a good tip in general), and make sure your password is strong enough.

#### Consider using [npq](https://github.com/lirantal/npq)

A shameless plug to a tool I developed almost 8 months back —

Sharing the same concern as others that when I’m about to install a package it might be malicious, how can I further vet it before I’m even installing it on my disk?

That’s where [npq](https://github.com/lirantal/npq) comes in — it has a basic set of checks to run against any packages you’re about to install, for example:

*   Does it have a pre/post install script?
*   Is it pretty new on the registry or has a low level of downloads?

![](/images/blog/1__lf8l8k0I7__pFtvlxKO401Q.gif)

If one of the packages raises concerns, it will show you the details and if it’s a false positive or just a warning you’re able to continue with the installation process.

The cool thing about it is that you can alias **_npq-hero_** to **_npm_** or **_yarn_** and it will just work silently behind the scenes for you regardless if you’re using onr or the other.

**Remember**, your app is not your own 500 LOC.  
It’s a plethora of dependencies you rely upon and ship to production alongside your own code…

![](/images/blog/1__8uSU6awGZwuRwcZa7n7AYg.png)