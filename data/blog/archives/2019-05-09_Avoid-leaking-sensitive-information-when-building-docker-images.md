---
title: Are you building Docker images? here's how to avoid leaking sensitive information into Docker images
date: '2019-05-09'
pubDate: '2019-05-09'
description:
image: ~/assets/images/blog/photo-1486467589601-77e4ca1314b6.jpeg
tags: docker, secrets, leak, image
---

Sometimes, when building an application inside a Docker image, you need secrets such as an SSH private key to pull code from a private repository, or you need tokens to install private packages.

If you copy them into the Docker intermediate container they are cached on the layer to which they were added, even if you delete them later on. These tokens and keys must be kept outside of the `Dockerfile`.

## Using multi-stage builds

By leveraging Docker support for multi-stage builds, fetch and manage secrets in an intermediate image layer that is later disposed of so that no sensitive data reaches the image build.

Use code to add secrets to said intermediate layer, such as in the following example:

```
FROM: ubuntu as intermediate

WORKDIR /app
COPY secret/key /tmp/
RUN scp -i /tmp/key build@acme/files .

FROM ubuntu
WORKDIR /app
COPY --from=intermediate /app .
```

## Using Docker secret commands

Use an alpha feature in Docker for managing secrets to mount sensitive files without caching them, similar to the following:

```
# syntax = docker/dockerfile:1.0-experimental
FROM alpine

# shows secret from default secret location
RUN --mount=type=secret,id=mysecret cat /run/secrets/mysecre

# shows secret from custom secret location
RUN --mount=type=secret,id=mysecret,dst=/foobar cat /foobar
```

## Beware of recursive copy

You should also be mindful when copying files into the image that is being built. 

For example, the following command copies the entire build context folder, recursively, to the Docker image, which could end up copying sensitive files as well:

```
COPY . .
```

If you have sensitive files in your folder, either remove them or use `.dockerignore` to ignore them:


```
private.key
appsettings.json
```

> This tip is part of a complete [10 Docker image security best practices](https://snyk.io/blog/10-docker-image-security-best-practices/) you should adopt. Thanks for reading and to [Omer Levi Hevroni](https://twitter.com/omerlh) who worked with me on it.
