---
title: Why you should use COPY instead of ADD when building Docker images
date: '2019-05-01'
pubDate: '2019-05-01'
description: "Docker provides two commands for copying files from the host to the Docker image when building it: `COPY` and `ADD`. which one should you use?"
image: ~/assets/images/blog/photo-1507860731853-84f12e4c036b.jpeg
tags: docker, build, images, devops
---

Docker provides two commands for copying files from the host to the Docker image when building it: `COPY` and `ADD`. The instructions are similar in nature, but differ in their functionality:

* COPY — copies local files recursively, given explicit source and destination files or directories. With COPY, you must declare the locations.
* ADD — copies local files recursively, implicitly creates the destination directory when it doesn’t exist, and accepts archives as local or remote URLs as its source, which it expands or downloads respectively into the destination directory.

While subtle, the differences between ADD and COPY are important. Be aware of these differences to avoid potential security issues:

* When remote URLs are used to download data directly into a source location, they could result in man-in-the-middle attacks that modify the content of the file being downloaded. Moreover, the origin and authenticity of remote URLs need to be further validated. When using COPY the source for the files to be downloaded from remote URLs should be declared over a secure TLS connection and their origins need to be validated as well.
* Space and image layer considerations: using COPY allows separating the addition of an archive from remote locations and unpacking it as different layers, which optimizes the image cache. If remote files are needed, combining all of them into one RUN command that downloads, extracts, and cleans-up afterwards optimizes a single layer operation over several layers that would be required if ADD were used.
* When local archives are used, ADD automatically extracts them to the destination directory. While this may be acceptable, it adds the risk of zip bombs and [Zip Slip vulnerabilities](https://snyk.io/research/zip-slip-vulnerability) that could then be triggered automatically.

> This tip is part of a complete [10 Docker image security best practices](https://snyk.io/blog/10-docker-image-security-best-practices/) you should adopt. Thanks for reading and to [Omer Levi Hevroni](https://twitter.com/omerlh) who worked with me on it.

