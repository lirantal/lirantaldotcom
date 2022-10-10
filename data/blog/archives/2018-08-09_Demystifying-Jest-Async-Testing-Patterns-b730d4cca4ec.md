---
title: Demystifying Jest Async Testing Patterns
description: >-
  There are several traps that are easy to fall to when it comes to async
  testing. Moreover, there are several methods of achieving the same…
date: '2018-08-09T11:47:06.563Z'
categories: []
keywords: []
tags: []
slug: demystifying-jest-async-testing-patterns-b730d4cca4ec
pubDate: '2018-08-09T11:47:06.563Z'
image: ~/assets/images/blog/31e1d4ae0b2a4bfcaa29bd0fd94fbd2b.jpeg
---

There are several traps that are easy to fall to when it comes to async testing. Moreover, there are several methods of achieving the same thing depending on your flavor.

An important insight a developer can possess is what bad practices NOT to follow and identifying bad code patterns.

In this post I’d like to demystify some of these async patterns and highlight the traps that are hidden inside.

### Expecting Promises

Imagine a world without Async/Await.

In the following use-cases we have an async function **_somethingAsync_** that does some business logic which we want to test and returns a promise, maybe we also stub some of it, but that’s not really the point.

One pattern of assertions can be to call this stub or actual subject under test and once the promise resolves we chain it to a thenable that allows to assert on the result using Jest’s custom matchers.

Here is an example:

![](/images/blog/1__acaTkgFtvskzGw6cO2kPuQ.png)

The thing is , the above test is not written well — **It will always pass**.

Because we aren’t returning the promise from the test then Jest has no idea that this test is asynchronous so it just calls the promise and continues on. Since no expectations triggered any errors the test pass.

The semantics are important to understand:

*   As it is, with **_somethingAsync_** rejecting the promise the test itself will pass and there will be a warning for an unhandled promise rejection since there’s nothing to catch it.
*   If you change the return value of **_somethingAsync_** to resolve instead of rejecting, then something even worse happens — the expect is never reached and you get a false positive with no indication that the test is not really testing anything.

There’s another variation of the above and that is to wrap any promise with expect and use its built-in matchers to assert on the return value.

It looks like this:

![](/images/blog/1__rJyoft2s6U__3qf9YcHi0KA.png)

It’s easy to fall into the trap of this methodology as well because we’re used to asserting data structures or possibly synchronous function calls.

So the above snippet is also broken — While the expectation is called, there is no way to assert on its return value since the test code has already ended.

The outcome of the above snippet will be either a blindly passing test, or a test that passes with additional log output due to the unhandled promise rejection and the missed expectation.

It looks something like this:

![](/images/blog/1__SyxVYAMZ4xhz26Q9kXcaSw.png)

The solution for both of the methods laid out above are to return the promise as can be seen in the following example:

![](/images/blog/1____aknsWasApQi17F7FPh9ow.png)

### When Errors Go Lost

We’re back to our Async/Await world. Yay!

In the following use-case we are hoping to drive the application towards throwing an error and rejecting the promise and we want to catch it and match the error message.

A tempting approach is to catch the error thrown, since you know that **_getUserName_** is going to throw, and assert the exact error object and message:

![](/images/blog/1__nPvhOWnog5UUiI4F5ylGRQ.png)

There’s a very common error here though, and that’s the fact that if the **_getUserName()_** async function would have been refactored in a way that would actually resolve the promise then the test would blindly pass, therefore rendering this test useless and providing a false positive where it should’ve failed.

If you’re keen on the try/catch block, one way to deal with the above problem is to declare an expected assertion count as follows:

![](/images/blog/1__dPf4DdgSww8VU64RiwVpPQ.png)

2 changes in the above code snippet are:

1.  We updated the **_getUserName()_** _to resolve in order to simulate a code refactoring that changed the logic._
2.  We added an expected assertion count to the test itself

The above test is going to end with no assertions made due to the catch block not being reached. Jest will then fail the test as it missed the expected assertions count.

#### Explicit Expectations

I find assertions count somewhat non-elegant.  
Fortunately, there’s another way.

Jest has matchers for promises that can assert a resolved or rejected promise.  
I find this way to be more explicit and self-explaining on what the test is doing or expecting.

Let’s change the above test:

![](/images/blog/1__XTojhZXRJToF__OHm__3h6Gg.png)

You should still remember the golden rules of testing asynchronous code — always return a promise (return the expect) or make sure to await the expectation to unwrap the promise’s return value.

### Expecting Assertions

A final note on when to use and when to avoid assertions planing (based off of [Ava’s reference](https://github.com/avajs/ava/blob/master/docs/recipes/when-to-use-plan.md)):

Avoid **_expect.assertions(N)_** when:

1.  Your tests are synchronous
2.  You are using promises (in which case, just return the expectation)
3.  You are using async/await with try/catch (again, just await the expectation)

Use **_expect.assertions(N)_** when:

1.  Your test has conditionals — and therefore, you may have in one branch of code one expectation, and in the other several. This makes it impossible to plan your exact assertions count, but luckily you can use the **_expect.hasAssertions()_** to verify that at least one assertion has been made.
2.  Your asynchronous test code uses callbacks — if you are asserting inside those callbacks then you want to make sure you define your expected assertions so that you can be sure the callback was indeed called and asserted.

Happy Jesting! 😋