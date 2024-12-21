---
title: "5 Steps of Refactoring a Fastify App"
description: >-
  
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: ["fastify", "nodejs", "web framework"]
slug: 
image: ~/assets/images/blog/
---

1. just fastify, a route, and a db (prisma)
2. refactor db prisma from included in the route to auto-loaded as a plugin
3. refactor `fastify.register(routes)` to use fastify-autoload
4. routes refactored to include schema validation
5. fastify app refactored to return a promise before server starts so it can be called after healthchecks performed and also easily used in tests
    1. it also helps avoid globals with the Fastify app in server.js
6. refactor routes from all in single files to be in vertical modules
7. refactor the vertical moduels to also use api endpoint prefixes, such as:

```bash
server.register(userRoutes, { prefix: "api/users" });
server.register(productRoutes, { prefix: "api/products" });

```

1. fail fast with Fastify’s routing capabilities
    1. declare the same route in two different plugins - fastify fails
    2. this happens because the route handling is global across an entire fastify app
    3. Express behaves differently - it lets the last route override. Fastify approach is great because it follows a ‘fail fast’ methodology rather than finding out about routes not working later in the process such as during tests or production
2. add tests with tap
3. add database with prisma
4. add authentication with <TBD>
5. add observability with <TBD>
6. add logging with pino and <TBD>