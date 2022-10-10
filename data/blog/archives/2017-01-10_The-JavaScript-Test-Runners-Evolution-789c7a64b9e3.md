---
title: The JavaScript Test Runners Evolution
description: >-
  Like with everything else in the JavaScript ecosystem, test automation tools
  are also going through a high pursuit speed race and nobody is…
date: '2017-01-10T21:55:23.172Z'
categories: []
keywords: []
tags: []
slug: the-javascript-test-runners-evolution-789c7a64b9e3
pubDate: '2017-01-10T21:55:23.172Z'
image: ~/assets/images/blog/37010c33034f3f32c728fdbe5f5ab2fa.jpeg
---

![](/images/blog/1__V6DVoWCl6nOxCT4W58Xkfg.jpeg)

Like with everything else in the JavaScript ecosystem, test automation tools are also going through a high pursuit speed race and nobody is taking prisoners.

### Mocha and Tape

Mocha has been the clear defacto choice for JavaScript developers and framework authors for quite some time now. I bet if we were to spider GitHub repositories we’ll find the majority of projects using it.

I’ll even give you a seemingly accurate statistics of a [Google Trends graph](http://www.google.com/trends/explore?q=mochajs,tapejs) for Mocha vs Tape:

![](/images/blog/0__vteGRnlohuxnzTdN.png)

Tape is taking pride in doing things better than how Mocha is doing them, whether they are better code methodologies such as no global state shared between tests, and others such as providing a TAP output result which computers, parsers, bots, and some humans, can easily understand.

Tape was the conscience evolution choice after Mocha, but then came Ava.

Oh pretty Ava…

### Ava

While I haven’t actually used Tape, just by comparing it with Ava it seems like Ava is Tape’s older brother. Or younger sister. oh well, you got the point, Ava is the new kid everyone wants to play with.

Highlights about Ava, yet there are probably more:

*   **Speed** — Speed of tests running matters. It matters for CI and for you, because the time you wait for tests to finish you could have invested in writing and debugging code. Ava approaches this by spawning different Node.js processes to run your tests, and asynchronously running the tests inside them. This benefits from the side effect shared state between tests.
*   **Opinionated** — Mocha doesn’t ship with an assertion library and is open for you to make use of anything you wish, may it be Chai, Should.js, or Node.js’s core Assert. Ava however, doesn’t leave room for confusion and provide it’s own assertion capabilities baked into Ava.
*   **Explicit** — With Ava, all the library facilities you use are explicitly defined. Where in Mocha you have globals like **_describe_** or **_it_**, in Ava everything is declared, no globals.
*   **No Shared State** — Ava makes use of Node.js’s asynchronous nature and runs tests in parallel, and also in dedicated Node.js processes. This means that making changes to files you require will not have an effect on other tests. Also, the use of **_beforeEach_** and friends in Mocha wouldn’t make sense anymore due to the parallelism of tests.
*   **JS Edge** — Ava ships with modern JavaScript capabilities out of the box where it will happily transpile all of your modern ES6/ES7 code in your tests (**not** in your libraries if you include them). This means you get the benefits of async/await and other gems when you write your test files.

Disclaimer: Ava does support running tests serially through the **_test.serial()_** method or the **_— serial_** command argument for all tests, and it also has before/after hooks such as **test.before()**. Granted they exist for convenience and specific use cases, they aren’t encouraged.

### Worthy Mentions

Some other tools worth a mention if you’re in the test mood, each definitely deserve it’s own post.

[Wallaby.js](http://wallabyjs.com/) — A test runner that integrates with an IDE for a quick feedback loop on code coverage and tests.

[Jest.js](http://facebook.github.io/jest/) — Originating from Facebook it obviously provides solutions for a more powerful React.js test framework, but is not limited to and states to support any JavaScript code testing.

There’s also a test library called [Painless](http://github.com/taylorhakes/painless). Yes, I’m not kidding, there is definitely such a test library.

### What’s next?

Would be interesting to see what yields next in 2017 (yes, that ES6 pun was intentional).