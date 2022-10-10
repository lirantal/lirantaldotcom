---
title: Scalable Integration Testing for Microservices Deployments
description: >-
  Many jumped the gun on microservices, and they are ubiquitous today more than
  ever for implementing service oriented architectures…
date: '2017-09-19T21:00:17.483Z'
categories: []
keywords: []
tags: []
slug: scalable-integration-testing-for-microservices-deployments-e03e29dd1280
pubDate: '2017-09-19T21:00:17.483Z'
image: ~/assets/images/blog/bb9d74499d022e752a5a4c215683c7f3.jpeg
---

![](/images/blog/1__oYysSq6bbdGNN__fYYXVPWw.jpeg)

Many jumped the gun on microservices, and they are ubiquitous today more than ever for implementing service oriented architectures. Moreover, tools and ecosystems like Docker and Kubernetes for container orchestration are driving high adoption for microservices due to good support for orchestration, fast and consistent deployments among other reasons.

If your deployment environment is quite small, lean and CI runs fast in an integrated test environment then chances are that you don’t feel the pain… yet.

### Microservices — The More The Merrier?

When your deployment is dependent on many microservices, some of which might turnout to be complicated to deploy, then you feel the pain. Setting up the integrated environment so you can run tests and verify your service works well with others is a challenging task and potentially hinder CI with slowness.

_docker-compose_ and similar tools help in making the job easier, but it doesn’t necessarily scale well for CI when you have tens or hundreds of services, or when services depend on large databases with large migrations backlog, all of which need to be spun up and down during your CI. Your microservice dependencies may have their own service or third-party dependencies, and they evolve and translate into more setup, and changes in deployment which again contributes to the overall problem of maintaining a fully deployed environment for CI.

![](/images/blog/0__wtqIkFaWjQttSLDs.jpg)

### Consumer Testing To The Rescue

Instead of deploying with all of your service dependencies you would instead rely on verifying an API contract from both the consumer end (you), and the provider end (the service you depend upon)

With the **Consumer-Driven Contracts** pattern employed, both parties of an API, referred to as consumer and provider, are setting an agreed-upon API contract which they both need to adhere in their testing.

Probably mocking services isn’t news for you, so practically for the consumer this means to set the API contract which will essentially be used as a mocked API service during CI for consumer tests, there-fore eliminating the need for bringing up many service dependencies.

The provider is using the API contract output that the consumer has already created, and executes tests in its own CI, assuring that it didn’t break any API contract for consumers.

> this pattern only works well if your teams are collaborating together and aren’t silo’ed. yes, people need to talk, it’s human nature.

### Some of the benefits with Consumer-Driven Contracts:

*   Setting the API as contract, in advance, even if your provider might not exist or may not have an API developed yet.
*   Expectations are defined and set up-front.
*   Easy to test, fast to run, lean infrastructure setup.
*   Improve collaboration with teams
*   When the provider breaks your contract they know about it instantly because they verify their API contract in their CI.

![](/images/blog/0__HbATwl__Vge__1x__lH.png)

The picture depicts the relationship between the consumer and provider, as illustrated by Andy Kelk in his [blog post](https://www.andykelk.net/tech/consumer-driven-contracts-with-pact-and-php).

In the picture, a reference to an open source implementation referred to as Pact which we will discuss in a follow-up post on how to do integration testing with the Pact.js project for Node.js microservices.

The Follow-up Post:

[**Node.js — Integration Testing with Pact.js**  
_In a previous article we reviewed how Consumer-Driven Contracts (CDC) help with integration testing in an environment…_itnext.io](https://itnext.io/node-js-integration-testing-with-pact-js-1a2ea8aa3116 "https://itnext.io/node-js-integration-testing-with-pact-js-1a2ea8aa3116")[](https://itnext.io/node-js-integration-testing-with-pact-js-1a2ea8aa3116)