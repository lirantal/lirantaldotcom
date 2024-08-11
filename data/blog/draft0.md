---
title: "Using Promise.withResolvers in Node.js Tests"
description: >-
  This article explores the use of `Promise.withResolvers` in Node.js tests, providing examples and refactoring techniques to handle nested tests and signal their completion effectively. It also discusses the limitations of the `Promise.withResolvers` API in different Node.js versions.
date: '2024-12-12'
pubDate: '2024-12-12'
categories: []
keywords: []
draft: true
tags: ["javascript", "promises", "event emitter"]
slug: "promise-with-resolvers-in-nodejs-tests"
image: ~/assets/images/blog/nodejs-promise-with-resolvers.jpg
---

If you often encounter scenarios where managing asynchronous operations efficiently is crucial but you're left wondering how exactly to do so (someone said event emitter? callback patterns??) then there's good news and it's called `Promise.withResolvers`.

One such scenario is running nested tests that have asynchronous code in Node.js and I want to visit that in this article. I'll show you different ways to use the `Promise.withResolvers` API, a cool new JavaScript way introduced in Node.js v22.0.0, which simplifies the handling of nested tests by providing a more elegant way to signal their completion.

## Use case: Promise.withResolvers in Tests

Another use-case for `Promise.withResolvers` is in tests. Here's an example from the Node.js core tests when tests are nested and you want to signal the end of all tests:

```javascript
import { test } from 'node:test';

test('foo', t => {
  t.test('bar', t => {
    t.plan(1)
    t.assert.equal(1, 1)
  })

  t.end()
})
```

In the above example, `t.end()` is used to signal the end of the test. HOWEVER, if you ran that code it wouldn't work. Why? there's no `t.end()` in the native Node.js test runner, so that code snippet above is really just a pseudo-code example.

How would you do it instead? probably something like this:

```javascript
import { test } from 'node:test';

test('foo', async (t) => {
  await Promise.all([
    t.test('bar 1', async (t) => {
      assert.equal(1, 1);
    }),
    t.test('bar 2', async (t) => {
      assert.equal(1, 1);
    })
  ]);
});
```

> Today is the first time I have ever had a need for `Promise.withResolvers`. It’s a rather effective hack around not having `t.end`.

- James Sumners [shared on X](https://x.com/jsumners79/status/1817966991761674509)

But, Promise `withResolvers` to the rescue! 🦸‍♀️

If you want to use `Promise` instead of the pseudo-code `t.end()` or our `Promise.all()` wrapper, you can use `Promise.withResolvers` like so:

```javascript
test('foo', async t => {
  const { promise, resolve } = Promise.withResolvers();

  let completedTests = 0;
  const totalTests = 2;

  const checkCompletion = () => {
    completedTests += 1;
    if (completedTests === totalTests) {
      resolve();
    }
  };

  t.test('bar 1', t => {
    t.assert.equal(1, 1);
    checkCompletion();
  });

  t.test('bar 2', t => {
    t.assert.equal(1, 1);
    checkCompletion();
  });

  await promise;
});
```

In the above example, we're using `Promise.withResolvers` to signal the end of the test. We're keeping track of the number of completed tests using a counter and when all tests are completed, we call `resolve()` to signal the end of the test.

Another refactor of the above code could be to use `Promise.all()`:

```javascript
import { test } from 'node:test';
import { setTimeout } from 'node:timers/promises'

test('foo', async t => {
  const { promise, resolve } = Promise.withResolvers();

  const subtests = [
    t.test('bar 1', async t => {
      await setTimeout(2500);
      t.assert.equal(1, 1);
    }),
    t.test('bar 2', async t => {
      await setTimeout(5500);
      t.assert.equal(1, 1);
    })
  ];

  Promise.all(subtests).then(resolve);

  await promise;
});
```

## Node.js Promise.withResolvers API version limitations

The `Promise.withResolvers` API is available in Node.js v22.0.0 and later. If you're using an older version of Node.js, you can't use this API directly.

![browser compatibility for Promise.withResolvers API](/images/blog/promise-with-resolvers-browser-compatibility.png)

