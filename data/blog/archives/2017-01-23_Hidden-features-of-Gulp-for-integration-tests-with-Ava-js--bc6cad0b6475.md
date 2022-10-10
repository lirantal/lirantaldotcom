---
title: Hidden features of Gulp for integration tests with Ava.js.
description: >-
  This is a bit of a follow-up to my previous post on Wiring up Ava.js
  Integration Tests with Express, Gulp, but not Supertest.
date: '2017-01-23T15:49:51.425Z'
categories: []
keywords: []
tags: []
slug: hidden-features-of-gulp-for-integration-tests-with-ava-js-bc6cad0b6475
pubDate: '2017-01-23T15:49:51.425Z'
image: ~/assets/images/blog/6ac2f1f7987898c31f27792af23f1fa3.jpeg
---

![](/images/blog/1__YsUi26LJRYfye__AaQDQjyw.jpeg)

This is a bit of a follow-up to my previous post on [Wiring up Ava.js Integration Tests with Express, Gulp, but not Supertest](https://www.linkedin.com/pulse/wiring-up-avajs-integration-tests-express-gulp-supertest-liran-tal/).

To make a long story short, I ended up using Gulp to bring up a full ExpressJS server so I can test the APIs using Ava. No mocking, or stubbing. The point is to really test the integration of the APIs with the Mongoose and Sequelize.js databases. Obviously it spins up a test schema/data to work on.

An example implementation of that would be:

gulp.task('test:integration', function(done) {  
  runSequence('env:test', 'server:bootstrap', 'ava', done);  
});

While seemingly a straight-forward solution this entails some issues. The bootstrapped server hangs the event loop open because the event handler is blocking for connections. The result is that even though Ava tests finished executing the server is still up and running and Node.js doesn’t quit.

### Streamorama

Thanks to the fact that Gulp’s foundation are Streams we can take advantage of that. Gulp plugins allow emitting errors and there are generally other events you can subscribe to.

This is completely undocumented in Gulp documentation or README and the only evidence for that lies in Gulp’s test source code.

So here’s a little trick we can do:

gulp.task('ava', function() {  
  gulp.src(defaultAssets.server.tests)  
    .pipe(plugins.ava({verbose: true}))  
    .on('error', function(err) {  
      console.log(err.message);  
      process.exit(1);  
    })  
    .on('end', function() {  
      console.log('completed');  
    });  
});

We can subscribe to the **_error_** and **_end_** events, and then kill the Node.js process that runs gulp.

This is pretty much it, mostly undocumented as far as I could find.

### On Node.js Security

I invite you to read **my** **newly published book** [Essential Node.js Security](http://bit.ly/securenodejs) to get insights on security measures, the right npm packages to use, and secure code guidelines.

![](/images/blog/0__nRZFQpDlUVdnZ__9R.png)