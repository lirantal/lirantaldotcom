---
title: >-
  I contributed to Docker’s official repository but why did I send them a
  picture of an Elephant?!
description: >-
  Without having any formal experience with Docker in the past I was able to
  help the Docker project and contribute to the official…
date: '2016-07-21T15:42:03.765Z'
categories: []
keywords: []
tags: []
slug: >-
  i-contributed-to-dockers-official-repository-but-why-did-i-send-them-a-picture-of-an-elephant-b8ea401b5445
pubDate: '2016-07-21T15:42:03.765Z'
image: ~/assets/images/blog/2545ff9c99774b989eecdcc57245fac8.jpeg
---

Without having any formal experience with [Docker](https://www.docker.com/) in the past I was able to help the Docker project and contribute to the official repository and help other users. How? Here is the story.

It all began when I decided I’m ditching my Linux VM to go for the now de-facto standard of virtualization which is Docker containers.

My work laptop has to run Windows for corporate stuff so it’s a given that open source software install isn’t going to be straight-forward since those naturally run on Linux or UNIX variants OS.

I was bound to find myself scanning through the [Docker docs](https://docs.docker.com/engine/installation/windows/) and so I did.

### The Problem

While going through the instructions at [https://docs.docker.com/engine/userguide/containers/dockerrepos/](https://docs.docker.com/engine/userguide/containers/dockerrepos/)\- I noticed that the highlighted Note section about the **_config.json_** file is only referring to Linux users. Where should I find it if I’m on Windows? I’ve no idea how/where Docker Toolbox installs things.

The relevant section looked like this:

![](/images/blog/0__fMoJ8X3A4__Jpcugr.png)

After locating the file for Windows being in my user’s home directory at **_C:\\users\\lirantal\\.docker\\config.json_** I realized that other readers would probably have the same question as well.

### Suggesting a Solution

Being an active open source user I figured the docs might be hosted on GitHub as most projects do, and if they are not I could just email the docker support team and suggest to fix this.

Luckily, the [docker docs are indeed available online](https://github.com/docker/docker) so it’s now a matter of getting acquainted with the Contribution Guideline and submitting a fix.

### Contributing a Fix the Open Source fashion

A screenshot of my Pull-Request shows the requirements to answer a few questions:

![](/images/blog/0__KwRFswyvSvEnxj2m.png)

And you can also notice that this PR had quite a few messages (at least 16) exchanged until we resolved it.

The Contribution Guideline also requested me to add a picture of a cute animal and I know that **my son adores Elephants** so yay!  
I can definitely google a friendly elephant and add it:

![](/images/blog/0__kImnNhPv3K8J8TnJ.png)

From that point, we exchanged quite a few ideas on how to better style the docs and a few options were provided. Once everyone was satisfied with the texts suggested I got the desired **LGTM** (Looks Good To Me) and my contribution was approved to later be included in the updated Docker documentation.

![](/images/blog/0__Zj9icFDvQEAGGQ0D.png)