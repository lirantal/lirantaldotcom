---
title: How to avoid leaking secrets to the npm registry
date: '2019-03-05'
pubDate: '2019-03-05'
description: 10 awesome npm security tips to keep you safe!
image: ~/assets/images/blog/photo-1542320868-5ded2628008a.jpeg
tags: npm, nodejs, security, javascript
---

It is important to take npm security into account for both frontend, and backend developers. Leaking secrets is an easy mistake that can happen for you at work or when you work on your open source projects.


## Avoid leaking secrets to the npm registry

Whether you’re making use of API keys, passwords or other secrets, they can very easily end up leaking into source control or even a published package on the public npm registry.

You may have secrets in your working directory in designated files such as a `.env` which should be added to a `.gitignore` to avoid committing it to a SCM, but what happen when you publish an npm package from the project’s directory?

The npm CLI packs up a project into a tar archive (tarball) in order to push it to the registry. The following criteria determine which files and directories are added to the tarball:

* If there is either a `.gitignore` or a `.npmignore` file, the contents of the file are used as an ignore pattern when preparing the package for publication.
* If both ignore files exist, everything not located in `.npmignore` is published to the registry. This condition is a common source of confusion and is a problem that can lead to leaking secrets. Developers may end up updating the `.gitignore` file, but forget to update `.npmignore` as well, which can lead to a potentially sensitive file not being pushed to source control, but still being included in the npm package.

Another good practice to adopt is making use of the `files` property in `package.json`, which works as a whitelist and specifies the array of files to be included in the package that is to be created and installed (while the ignore file functions as a blacklist).

The `files` property and an ignore file can both be used together to determine which files should explicitly be included, as well as excluded, from the package. However note that when using both, the `files` property in `package.json` takes precedence over the ignore file.

When a package is published, the npm CLI will verbosely display the archive being created. To be extra careful, add a `--dry-run` argument to your publish command in order to first review how the tarball is created without actually publishing it to the registry.

In January 2019, npm shared on their blog that they added a [mechanism that automatically revokes a token](https://blog.npmjs.org/post/182015409750/automated-token-revocation-for-when-you) if they detect that one has been published with a package.


> I also blogged about a complete [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/) you should adopt in a post that includes a high-resolution printable PDF like the snippet you see below.

[![Node Version](/images/blog/yvey2bykpvbjcxrurqoz.png)](https://snyk.io/blog/ten-npm-security-best-practices/)
