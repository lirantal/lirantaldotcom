---
title: 3 Things You Didn’t Know About Yarn
description: >-
  Everyone talk about Yarn’s speed and reliability but no one mentions any of
  the below nice-to-know facts about Yarn.
date: '2017-02-28T14:56:22.065Z'
categories: []
keywords: []
tags: []
slug: 3-things-you-didnt-know-about-yarn-877416ac40c3
pubDate: '2017-02-28T14:56:22.065Z'
image: ~/assets/images/blog/29c31c70891a9d8acc9d21ea91c18c05.jpeg
---

![](/images/blog/1__1PdacXrzbm0A1vxX0Jglrw.jpeg)

Everyone talk about Yarn’s speed and reliability but no one mentions any of the below nice-to-know facts about Yarn.

### 1\. Yarn Depends on npm

Well guess what? Yarn’s source code actually depends on npm to be present because it uses it to run it’s own npm run-scripts which help build the Yarn package itself:

![](/images/blog/0__b2wlcwGIgoyDRm28.png)

### 2\. Yarn Style

Yarn coding convention is all about 2 space indentations, semicolons, and actually extending what seems to be Facebook’s own JavaScript coding conventions:

eslint-config-fb-strict

Surprise surprise, Yarn developers also use Flow extensively.

### 3\. Built-In Spellcheck

Yarn is so much user-friendly that it’s developers added a functionality to automatically detect possible typos which are classic for the ‘dependencies’ clause.

Say we init a new npm module:

![](/images/blog/0__MpiHFtDzqw9oiYy9.png)

And then we deliberately add a typo for the dependencies clause as such:

{  
  "name": "test",  
  "version": "1.0.0",  
  "main": "index.js",  
  "license": "MIT",  
  "dependancies": {  
    "express": "\*"  
  }  
}

Running Yarn will produce the following:

![](/images/blog/0__XNePQv9__2x2sE43u.png)

Nice huh? This is thanks to the following source code for Yarn that does it’s best to help you out when in need:

![](/images/blog/0__dgYwdfyJpSuTWYSE.png)