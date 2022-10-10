---
title: Innovating Open Source by building on the giants of others
description: >-
  We often find ourselves creating a new libraries, tools, and some times
  frameworks and bigger projects. When you end up releasing those…
date: '2016-09-26T14:57:18.497Z'
categories: []
keywords: []
tags: []
slug: innovating-open-source-by-building-on-the-giants-of-others-cf0a6e16ef54
pubDate: '2016-09-26T14:57:18.497Z'
image: ~/assets/images/blog/e8c6285d173181faa1a5edf9ebadc73b.jpeg
---

We often find ourselves creating a new libraries, tools, and some times frameworks and bigger projects. When you end up releasing those works as Open Source you get my appreciation and love, if you don’t, I’ll end up hunting you and make you memorize [The Cathedral and the Bazaar](https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar).

I had recently started working on a Security-based static code analysis tool that you can easily plug-in to your Gulp build process.

Static Code Analysis (SCA) is just like using your JavaScript linting tools but to check secure code guidelines and insecure code.

![](/images/blog/1__EicJ7__8aKVSBL4jFD4No2Q.png)

To build this tool I could just write this Gulp plugin from scratch that scans a provided glob pattern and does a simple string or regular expression matching. Simple, right?

That may seem tempting, but if you’re familiar with Gulp then you probably know that it is often associated with Linux’s philosophy for command line tools — many tiny tools, each does a very focused task, and together they are put to a solve a bigger task.

![](/images/blog/1__POH9uqCDz07lehikTx8G6w.png)

The same is with Gulp, it pipes input into one function, and that function pipes it’s output to another, this way many gulp plugins can be used together to build a more complex flow.

Keeping up with this philosophy I wrote Mr Audit, a security-oriented SCA tool which extends and builds on a more popular and well tested plugin: [gulp-contains](https://github.com/callumacrae/gulp-contains), which as you can tell the entire job for that plugin is to match text contents with files.

![](/images/blog/1__4l46OgO78qtXEQZpSCCN__w.png)

Things are actually pretty simple, and it very much boils down to the following code if you want to extend a gulp plugin with your own implementation:

![](/images/blog/1__KAEUTRE2swBEaaVsdR3Rcg.png)

The above snippet has been simplified but it conveys the paradigm of extending other great tools.

Go ahead and share with me some of the great plugins you’ve used with Gulp, or ideas you have to improve the build process.

You’re also welcome to join and help out with this Gulp plugin at: [https://github.com/lirantal/gulp-mraudit](http://github.com/lirantal/gulp-mraudit)