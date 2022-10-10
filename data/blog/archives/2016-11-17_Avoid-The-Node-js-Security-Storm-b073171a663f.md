---
title: Avoid The Node.js Security Storm
description: >-
  Keeping your 3rd party project dependencies secured is such an important task
  that you can’t under-estimate.
date: '2016-11-17T14:09:10.871Z'
categories: []
keywords: []
tags: []
slug: avoid-the-node-js-security-storm-b073171a663f
pubDate: '2016-11-17T14:09:10.871Z'
image: ~/assets/images/blog/49f199923afd6196feb48585eff16a00.jpeg
---

![](/images/blog/1__7YJdHaMPzJTjC2yNboShKg.jpeg)

Keeping your 3rd party project dependencies secured is such an important task that you can’t under-estimate.

Snyk is a great tool for monitoring and tracking security vulnerabilities within your Node.js dependencies (and their dependencies).

It’s a stand-alone tool, a platform, and also an active community of security researchers who provide you with patches to insecure code until an upstream package will get an update. This is extremely valuable as you don’t have to wait until an update is made to a package, or just if you don’t want to upgrade to new, possibly breaking features, and get patched the security hole.

### Test for Vulnerabilities

Install snyk as a global dependency so you can set it to monitor your project through snyk’s own dashboard.

Installing snyk

npm install -i snyk

Next up, running **_snyk test_** in your project will check **all** dependencies in your project:

![](/images/blog/1__sdkfOee18Y__03qIDE__R5tQ.png)

Luckily I don’t have any vulnerabilities :-)

### Monitoring your GitHub projects

Login to your [snyk.io](https://snyk.io/) account and browse to the Projects area.  
There you should locate a _Test my GitHub repositories_ button on the right side, just click it:

![](/images/blog/1__kAsN__gffTOqIKRibtKhQnA.png)

Your GitHub repositores will then show up and you can click on the _Watch_ button to start tracking them, getting notifications on insecure vulnerabilities found there:

![](/images/blog/1__zO1RXYVep30UTFZoN__EX9Q.png)

### Monitoring your project from the CLI

This is useful as you track the project with every change that happens, get notifications, etc.

> All monitoring added from the CLI will automatically show up as private projects in your account’s dashboard.

Authenticate to snyk.io so you can track your package

snyk auth

![](/images/blog/1__NOldN2sYoHYV__SQ9iBjBEg.png)

Now to monitor and track the project dependencies run

snyk monitor

Then you can view it in the dashboard as one of your projects at: [https://snyk.io](https://snyk.io)

![](/images/blog/1__fYlIQwmQwJTiTQz39aaGqQ.png)

### CI/CD Integration

Installing snyk for the build

before\_install:  
  - npm install snyk -g

It’s great to also add a badge to your README file so that quality is visible to anyone who explores the project in GitHub or npmjs.com.

Modify the following markdown to match your project’s GitHub’s **_USER_** and repo **_REPONAME:_**

\[!\[Known Vulnerabilities\](https://snyk.io/test/github/USER/REPONAME/badge.svg)\](https://snyk.io/test/github/USER/REPONAME)

Here’s how it looks like in my own project —   
it’s the last badge specifying 0 vulnerabilities.

![](/images/blog/1__rhGdfw1RS1K6zz7IU42JQg.png)

Also, I invite you to read my newly published book [Essential Node.js Security](http://bit.ly/securenodejs)

![](/images/blog/1__1WPY7__gXrww5uoF0ZEF3BA.png)