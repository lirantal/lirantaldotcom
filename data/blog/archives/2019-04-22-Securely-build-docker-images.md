---
title: How to securely build Docker images for Node.js
published: true
date: '2019-04-22'
pubDate: '2019-04-22'
description: When a Dockerfile doesn't specify a USER directive, what's the worst that can happen?
image: ~/assets/images/blog/photo-1578163677454-b3933804a354.jpeg
tags: docker, image, container, security
---

## Use a least privileged user

When a `Dockerfile` doesn’t specify a `USER`, it defaults to executing the container using the root user. In practice, there are very few reasons why the container should have root privileges.

Docker defaults to running containers using the root user. When that namespace is then mapped to the root user in the running container, it means that the container potentially has root access on the Docker host.

Having an application on the container run with the root user further broadens the attack surface and enables an easy path to privilege escalation if the application itself is vulnerable to exploitation.

To minimize exposure, opt-in to create a dedicated user and a dedicated group in the Docker image for the application; use the `USER` directive in the `Dockerfile` to ensure the container runs the application with the least privileged access possible.

A specific user might not exist in the image; create that user using the instructions in the `Dockerfile`.

The following demonstrates a complete example of how to do this for a generic Ubuntu image:

```
FROM ubuntu
RUN mkdir /app
RUN groupadd -r lirantal && useradd -r -s /bin/false -g lirantal lirantal
RUN chown -R lirantal:lirantal /app
WORKDIR /app
COPY . /app
USER lirantal
CMD node index.js
```

The example above:

* creates a system user (-r), with no password, no home directory set, and no shell
* adds the user we created to an existing group that we created beforehand (using groupadd)
* adds a final argument set to the user name we want to create, in association with the group we created

If you’re a fan of Node.js and alpine images, they already bundle a generic user for you called `node`. Here’s a Node.js example, making use of the generic node user:

```
FROM node:10-alpine 
RUN mkdir /app
COPY . /app
RUN chown -R node:node /app
USER node
CMD [“node”, “index.js”]
```

If you’re developing Node.js applications, you may want to consult with the official [Docker and Node.js Best Practices](https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md).

> This post is part of [10 Docker image security best practices](https://snyk.io/blog/10-docker-image-security-best-practices/) you should adopt. Thanks for reading and to [Omer Levi Hevroni](https://twitter.com/omerlh) who worked with me on it.

[![Docker Images Security Best Practices](/images/blog/1lgubzkhy0jvjahg4zfp.png)](https://snyk.io/blog/10-docker-image-security-best-practices/)

