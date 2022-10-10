---
title: 'Wiring up Ava.js Integration Tests with Express, Gulp, but not Supertest.'
description: >-
  Gulp, the streaming build system for JavaScript source code probably doesn’t
  require an introduction, and most probably you’ve configured…
date: '2017-03-16T19:12:50.943Z'
categories: []
keywords: []
tags: []
slug: >-
  wiring-up-ava-js-integration-tests-with-express-gulp-but-not-supertest-a2edc75a042
pubDate: '2017-03-16T19:12:50.943Z'
image: ~/assets/images/blog/7d9a5be63fdfedb306a531fb0ce08cdb.jpeg
---

[Gulp](http://github.com/gulpjs/gulp), the streaming build system for JavaScript source code probably doesn’t require an introduction, and most probably you’ve configured it, used it to run a project, or at least heard about it among the plethora of build tools like **_grunt_**, **_webpack_** and **_broccoli_** (yes, that’s a real JavaScript project. I know).

Working on my new [side project](http://github.com/lirantal/Riess.js) I needed to configure a test integrations setup that would connect Ava to run integrations test. For that, I needed to also bring up the actual server with the databases so it can process the APIs.

> If you’re still using Mocha I highly recommend trying out Ava, or at least moving on to Tape. They are in similar context but a totally different paradigm.

Some naive approaches to set it up were all considered yet they didn’t cut it for me for different reasons. Here is a review of the process I reviewed:

### Supertest

Using supertest I could wrap ExpressJS on an ephemeral port, share this instance among all the tests. That could work but I didn’t like it because:

*   Sharing the supertest instance or somehow making it available to all of my tests means that I need to share context and this is completely against Ava paradigms that promotes a no-shared-state approach for minimizing side effects and parallelism. Ava actually doesn’t even allow that in it’s **_test.before()_**.
*   With Ava running the tests concurrently, I would need to worry about tearup and teardown for ExpressJS and the rest of the connectors (Mongoose and Sequelize) which seems to me like setting up a bed of nails.
*   Supertest, from the family of Superagent, doesn’t seem like choice I want to make for the long run. It has worked forever only with callbacks, except for a recent patch that made it support Promises, but even that came too long that the community created [supertest-as-promised](http://github.com/WhoopInc/supertest-as-promised).

So rejecting Supertest, and Superagent, I’m off to find another alternative, hopefully with a more promising library like [Axios](http://github.com/mzabriskie/axios) (yes yes, pun definitely intended!)

### Reflection on Architecture

It was quickly made clear I want to de-couple the integration tests flow meaning that the tests or test runner won’t need to know or care about bringing up the server. It’s cleaner and makes it more scalable if for some cases I want to have a dedicated test server which test will run on, and another server which the integration tests will execute.

### Gulp

So actually before moving to the obvious solution with Gulp, let’s quickly consider other viable approaches:

*   Concurrently — if you didn’t hear about it before, [concurrently](http://www.npmjs.com/package/concurrently) is a Node.js tool that allows executing commands in parallel. In simple terms for Linux users, it’s basically like doing **_command1 && command2_** except it isn’t (the details aren’t correct because command2 will not run if command1 fails but let’s not dwell on the details).

The downside with concurrently is that it might take some seconds to bring up the server while the tests will already spinning up, hence failing.

The other option:

*   npm scripts — a more straight-forward approach is setting up something like **_“test:integrations”: “node — harmony server.js & sleep 5; npm run gulp test:integrations”_**

Technically that works but there’s code smell all over it. Who knows if 5 seconds are enough, and if some times it takes only 2 seconds to bring up the server then I’m wasting 3 seconds for no reason.

> The time you wait for tests to run is the time you aren’t writing code, unless you’re using Wallaby.js. Hah!

So Gulp is a natural solution to spin up the server and run the integration tests on the same host, which thanks to **_gulp-ava_** plugin makes it a breeze as well.

A rough implementation is as follows:

gulp.task('test:integration', function(done) {  
  runSequence('env:test', 'server:bootstrap', 'ava', done);  
});

### Final Words

Give Ava a try, she’s a beauty, and don’t forget to test test test.