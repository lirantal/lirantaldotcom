---
title: Docker Hub Image in Warp Speed for Open Source Projects
description: >-
  I recently announced on social media about my latest Docker utility — a
  Node.js shell UI to easily manage your docker containers. It’s an…
date: '2016-12-05T15:39:03.001Z'
categories: []
keywords: []
tags: []
slug: docker-hub-image-in-warp-speed-for-open-source-projects-cb7eb6f0a173
pubDate: '2016-12-05T15:39:03.001Z'
image: ~/assets/images/blog/ef58ba904ac6a49f34295f5443b59926.jpeg
---

I recently announced on social media about my latest Docker utility — a Node.js shell UI to easily manage your docker containers. It’s an amazingly useful tool for me personally as I don’t need to script or remember docker commands and can quickly spin off this UI tool straight from command line.

Dockly Project: [https://github.com/lirantal/dockly](http://github.com/lirantal/dockly)

![](/images/blog/0__hXE__VmWrX1XLHJla.png)

What happened next is that someone commented “It would be nice if the tool would run from a docker image” and someone else made it happen.

### The Docker Image Support

Unsurprisingly, it was [Eitan Schichmanter](http://www.linkedin.com/in/eitanschichmanter) who jumped on the opportunity. Eitan is a longtime DevOps and Software Engineer whose been leading the R&D team for [VeriGreen](http://verigreen.io/), an open source platform for gated check-in system for Git and Jenkins.

![](/images/blog/0____R9klkGa9ZnZTbH4.png)

When Eitan opens a PR, there’s no doubt you’ll be merging it in. So there it was finally, and as quick as a one day turned around for the Dockly to be Dockerized.

### Automating the Docker Image and Pushing it to Docker Hub

Now that I have a Dockerfile, I can easily make use of [CodeFresh](https://codefresh.io/) — it’s a docker lifecycle management platform which means that it can basically build your Dockerfile or Docker Compose setup, run tests, whatever scripts you want and even spins it up for you so you can remotely connect to it and QA it.

The kick with CodeFresh for me was that it can also push the image to the Docker Hub register once it builds correctly. Amazing! It’s like publishing your npm package every time there’s a successful build for your project.

![](/images/blog/0__kzwMxhyw__fQ1bN5P.png)

Once I found that little gem _Push to Docker register_ option this sealed the deal.

Now after every PR, the Dockerfile is built and automatically pushed to Docker Hub so you get a fully updated Dockly image all the time:

![](/images/blog/0__N48IE4qll86q0zBq.png)

### Summary

All of these services that provide open source integration are awesome, the community is awesome, and now that there’s an automated docker image is awesome too :)

![](/images/blog/0__HJ6gjS__J__1xRUr1Z.png)

Thanks Eitan and CodeFresh!