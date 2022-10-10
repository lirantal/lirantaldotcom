---
title: Node.js Yarn’ing for Local Packages
description: >-
  This is not another praise for npm package management with Yarn but rather a
  concise recipe for working with locally developed packages.
date: '2017-02-08T16:40:30.315Z'
categories: []
keywords: []
tags: []
slug: node-js-yarning-for-local-packages-9a7970edea7
pubDate: '2017-02-08T16:40:30.315Z'
image: ~/assets/images/blog/1__l2uYvct0tWWIaUw__SSJFIQ.jpeg
---

This is not another praise for npm package [management](https://hackernoon.com/tagged/management) with Yarn but rather a concise recipe for working with locally developed packages.

npm modules begin their lives when you init them on your local dev machine, but there comes a point when you want to test them out or plain use them with other [Node.js](https://hackernoon.com/tagged/node-js) projects you have.

With the npm client we’d be creating a link in the filesystem, but with Yarn you can really manage their versioning and use them just like any other dependency with all rules applied for dependencies.

### Modules on the Filesystem: yarn add file://

Use the following command to add a package from the filesystem:

yarn add file:/Users/lirantal/code/my-npm-module

Good to keep in mind when doing that:

*   Because Yarn treats this as a real dependency it means it will really install it to your local _node\_modules/_ directory, so if you make changes on the npm module, they won’t be reflected on the installed version you have in the Node.js project.
*   Yarn loves cache and it also caches those local npm modules, you can force a re-install by doing:

// Remove the package and clean local cache  
yarn remove my-npm-mdule  
yarn cache clean

// Re-install it  
yarn add file:/...

### Modules on Github / Git

Another thing that comes in handy with Yarn is that you can push your npm modules to a Git repository and tell Yarn to use that. This is useful if you don’t want to submit the npm package to an npm repository.

this is not specific to Yarn and the npm client can do the same

If you have a package on GitHub you can tell Yarn to install it using:

yarn add git+ssh://git@github.com/lirantal/my-npm-module.git

The same caching and versioning applies here as it did for the filesystem install.

[![](https://cdn-images-1.medium.com/max/400/1*0hqOaABQ7XGPT-OYNgiUBg.png)](http://bit.ly/HackernoonFB)
[![](https://cdn-images-1.medium.com/max/400/1*Vgw1jkA6hgnvwzTsfMlnpg.png)](https://goo.gl/k7XYbx)
[![](https://cdn-images-1.medium.com/max/400/1*gKBpq1ruUi0FVK2UM_I4tQ.png)](https://goo.gl/4ofytp)

> [Hacker Noon](http://bit.ly/Hackernoon) is how hackers start their afternoons. We’re a part of the [@AMI](http://bit.ly/atAMIatAMI) family. We are now [accepting submissions](http://bit.ly/hackernoonsubmission) and happy to [discuss advertising & sponsorship](mailto:partners@amipublications.com) opportunities.

> If you enjoyed this story, we recommend reading our [latest tech stories](http://bit.ly/hackernoonlatestt) and [trending tech stories](https://hackernoon.com/trending). Until next time, don’t take the realities of the world for granted!

![](/images/blog/1__35tCjoPcvq6LbB3I6Wegqw.jpeg)