---
title: Node.js — Integration Testing with Pact.js
description: >-
  In a previous article we reviewed how Consumer-Driven Contracts (CDC) help
  with integration testing in an environment that is rich with…
date: '2018-03-05T18:41:08.546Z'
categories: []
keywords: []
tags: []
slug: node-js-integration-testing-with-pact-js-1a2ea8aa3116
pubDate: '2018-03-05T18:41:08.546Z'
image: ~/assets/images/blog/8c3b6a5fb6a0020f4c4e53cc4f46b3ac.jpeg
---

![](/images/blog/1__SRXBXHAovcH__xkQ5ZSttyg.jpeg)

[In a previous article](https://medium.com/nmc-techblog/scalable-integration-testing-for-microservices-deployments-e03e29dd1280) we reviewed how Consumer-Driven Contracts (CDC) help with integration testing in an environment that is rich with microservices.

[**Scalable Integration Testing for Microservices Deployments**  
_Many jumped the gun on microservices, and they are ubiquitous today more than ever for implementing service oriented…_medium.com](https://medium.com/nmc-techblog/scalable-integration-testing-for-microservices-deployments-e03e29dd1280 "https://medium.com/nmc-techblog/scalable-integration-testing-for-microservices-deployments-e03e29dd1280")[](https://medium.com/nmc-techblog/scalable-integration-testing-for-microservices-deployments-e03e29dd1280)

### Solving it with Pact

Pact is an open source initiative that implements consumer-driven contract testing and is facilitated using the Pact Foundation organization to create and collaborate on pact frameworks for different languages and platforms.

Some Pact implementations include:

*   Ruby
*   Java
*   Node.js

### Introducing Pact.js

While there are two sides to the coin, we will focus only on the consumer testing for a Node.js project and review the integration tests with an Ava.js test runner and framework.

### 0\. Installation

Install the pact npm package as dev dependency:

npm install _\--save-dev pact_

### 1\. Create the test file

Depending on your Node.js framework and directory structure, create a test (spec) file where we will write our integration test with pact.

_// consumer-example-test.integration.test.js_  
const path = require('path')  
const test = require('ava')  
const pact = require('pact')  
const request = require('request')

### 2\. Define the Pact server

  const MOCK\_SERVER\_PORT = 2202  
﻿  
  const provider = pact({  
    consumer: 'TodoApp',  
    provider: 'TodoService',  
    port: MOCK\_SERVER\_PORT,  
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),  
    dir: path.resolve(\_\_dirname, 'pacts'),  
    logLevel: 'INFO',  
    spec: 2  
  })

While we said we’re writing a consumer test, don’t be mis-lead by the _provider_ variable definition. This is where we define the pact server which mocks our provider and will respond to API requests we make to it.

1.  **_consumer_** and **_provider_** are simply names to make it easier when debugging, reviewing test logs, and for use in the generated Pact contract in the end.
2.  Pact will start a service listening on port 2202, writing logs to a _logs/_ directory where the test are executed from, and will create the actual pact contract file in a directory _pacts/_ that resides next to where you created the test file itself.
3.  Pact will use the latest specification version that it supports (v2)

### 3\. Test Setup

test.before('setting up pact', async t => {  
  _// this is the response you expect from your Provider_  
  const EXPECTED\_BODY = \[{  
    id: 1,  
    name: 'Project 1',   
    type: '1',  
    due: '2016-02-11T09:46:56.023Z',  
    tasks: \[  
      {id: 1, name: 'Do the laundry', 'done': true},  
      {id: 2, name: 'Do the dishes', 'done': false},  
      {id: 3, name: 'Do the backyard', 'done': false},  
      {id: 4, name: 'Do nothing', 'done': false}  
    \]  
  }\]

  await provider.setup()  
    .then(() => {  
      provider.addInteraction({  
        _// The 'state' field specifies a "Provider State"_  
        state: 'i have a list of projects',  
        uponReceiving: 'a request for projects',  
        withRequest: {  
          method: 'GET',  
          path: '/projects',  
          headers: {'Accept': 'application/json'},  
          query: {  
            projectTypes: pact.Matchers.term({  
              matcher: '\\\\d+',  
              generate: '1'

            })  
          }  
        },  
        willRespondWith: {  
          status: 200,  
          headers: {'Content-Type': 'application/json'},  
          body: EXPECTED\_BODY  
        }  
      })  
    })  
})

Before our tests can actually run we need to start the Pact service and provide it with our expected interactions.

> This is where we define our expectations. Any mis-match between expected interactions will result in the test throwing an error when being asserted.

1.  _withRequest_ and _willRespondWith_ define the expected interaction between the API consumer and provider.
2.  You will notice the expectation for the request part is also defining a query parameter called _projectTypes_ which the consumer API is expected to send and we use a capability from the pact library known as matchers to allow some flexibility on the provider implementation of the contract by using a number regex.

### 4\. Consumer Testing

test.cb('should generate a list of TODOs for the main screen', t => {  
  t.plan(1)

  _// const todoApp = new TodoApp()_  
  _// todoApp.getProjects() // <- this method would make the remote http call_  
  _//   .then((projects) => {_  
  _//     expect(projects).to.be.a('array')_  
  _//     expect(projects).to.have.deep.property('projects\[0\].id', 1)_  
  _//_  
  _//     // (5) validate the interactions occurred, this will throw an error if it fails telling you what went wrong_  
  _//     return provider.verify()_  
  _//   })_

  const reqOptions = {  
    url: \`http://localhost:${MOCK\_SERVER\_PORT}/projects?projectTypes=1\`,  
    method: 'GET',  
    json: true  
  }

  request(reqOptions, async (error, response, body) => {  
    if (error) {  
      t.fail()  
    }  
  

    // This is the important part, where we assert expected interactions with our Pact service  
    await t.notThrows(provider.verify())  
    t.end()  
  })

})

This is our actual consumer test where we use the _request_ module to make HTTP requests to the mocked API service that the pact library created for us.

About the actual consumer test — the top part which is commented shows an actual expected usage in real world where you call an internal logic that behind the scenes expects to fire an API call to the provider. Another case can be where you simulate requests with _supertest_ to an internal API end-point inside your own consumer, which in-turn fires that API call to the provider.

The bottom part of the test where we fire that API call to the provider is just for the sake of a working example.

**Most importantly**, we assert with _provider.verify()_ that indeed all expected interactions have been fulfilled by making sure it doesn’t throw an error, and then conclude the test.

### 5\. Test tear-down

test.always.after(async () => {  
  _// (6) write the pact file for this consumer-provider pair,_  
  _// and shutdown the associated mock server._  
  _// You should do this only \_once\_ per Provider you are testing._  
  await provider.finalize()  
})

After running the test, you can consult the verbose pact.log file to gain more clarity on how the interactions work, and better yet, you now have a pact file in the _pacts/_ directory that you can collaborate on with your provider!

### Summary

*   Pact.js makes it really easy for us to write consumer tests, and you’re invited to help collaborate with us in an open source spirit at: [https://github.com/pact-foundation/pact-js](https://github.com/pact-foundation/pact-js)
*   Mind your test setup — usually you will be dependent on data available for the consumer in order to test the provider as well so plan for that when you’re writing your consumer tests.

For brevity, the test code itself is written in a simple manner but there are better patterns to employ on how to write your tests, such as defining interactions and their expectations within the test case itself and not on the global test suite.

In the next follow-up post we will review more in-depth on the Pact.js framework lifecycle, and test patterns for better tests.