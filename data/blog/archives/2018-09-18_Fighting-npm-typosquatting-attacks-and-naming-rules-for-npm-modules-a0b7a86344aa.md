---
title: Fighting npm typosquatting attacks and naming rules for npm modules
description: >-
  I guess naming is a hard task in general, and for the npm registry, the naming
  rules have evolved from what they were to begin with, much…
date: '2018-09-18T01:01:01.624Z'
categories: []
keywords: []
tags: []
slug: >-
  fighting-npm-typosquatting-attacks-and-naming-rules-for-npm-modules-a0b7a86344aa
pubDate: '2018-09-18T01:01:01.624Z'
image: ~/assets/images/blog/25dbf50769d3674e1c087232e7e60148.jpeg
---

![](/images/blog/1__C3sCyNGZ3aQhaXzhLCr9Jw.jpeg)

I guess naming is a hard task in general, and for the npm registry, the naming rules have evolved from what they were to begin with, much of which was about mitigating typosquatting attacks.

### Uppercase vs Lowercase

In the beginning, the npm repository was case-sensitive and allowed to publish the same package names with different cases.

This lead to the fact that we now have the following two different modules in the repository:

*   [JSONStream](https://www.npmjs.com/package/JSONStream)
*   [jsonstream](https://www.npmjs.com/package/jsonstream)

While the latter has been deprecated in favor of the first, they are still different packages.

The registry maintains any existing package names with upper case to not break dependency chains in the ecosystem, but it doesn’t allow anymore (for quite some time) to submit any packages with an uppercase.

### Fighting Typosquatting

Another stance that triggered naming rules updates on the npm registry has been the typosqautting attacks we’ve been seeing for a while.

With typosquatting, bad actors could publish malicious modules to the npm registry with names that look much like existing popular modules. The intent being to fool users into installing them, either by driving them to do so through targeted actions or just by mistake — a typo.

You might have heard about the [cross-env](https://blog.npmjs.org/post/163723642530/crossenv-malware-on-the-npm-registry) horror story where a package called _crossenv_ (notice the typo), mimicked the original one but was also kind enough to send all of your environment variables and the passwords and API keys you have in them, to a remote server.

This prompted the npm registry folks to fight typosquatting attacks at the naming level and establish the following:

**No new modules are allowed to be published that their names are an exact match with an existing module given that you strip off any punctuation chars.**

The npm blog explains this easily with a react-native example — all of the following module names will be disallowed:

*   react\_native
*   react.native
*   re.a\_ct-native

Further reading:

[**New Package Moniker rules**  
_We've recently made some changes to how package naming works to better fight typosquatting, and help package authors…_blog.npmjs.org](https://blog.npmjs.org/post/168978377570/new-package-moniker-rules "https://blog.npmjs.org/post/168978377570/new-package-moniker-rules")[](https://blog.npmjs.org/post/168978377570/new-package-moniker-rules)

#### Naming rules you should follow:

1.  Can’t start with a .
2.  Can’t start with a \_
3.  Can’t have leading or trailing spaces
4.  It can’t be **_node\_modules_** and it can’t be **_favicon.ico_**
5.  It is limited to 214 characters
6.  No capital letters allowed, only lowercase.
7.  These special characters are not allowed: “~\\’!()\*”)’
8.  Module names must adhere to the typosquatting rules mentioned above

The above rules are largely based off of **_validate-npm-package-name_** which is used internally by npm itself:

[**npm/validate-npm-package-name**  
_validate-npm-package-name - Is the given string an acceptable npm package name?_github.com](https://github.com/npm/validate-npm-package-name "https://github.com/npm/validate-npm-package-name")[](https://github.com/npm/validate-npm-package-name)