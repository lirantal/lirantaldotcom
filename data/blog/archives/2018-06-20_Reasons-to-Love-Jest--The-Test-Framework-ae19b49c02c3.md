---
title: 'Reasons to Love Jest: The Test Framework'
description: 'We had Tape, Mocha, Ava, and now Jest. Let’s see what this is all about!'
date: '2018-06-20T11:56:15.942Z'
categories: []
keywords: []
tags: []
slug: reasons-to-love-jest-the-test-framework-ae19b49c02c3
pubDate: '2018-06-20T11:56:15.942Z'
image: ~/assets/images/blog/baab37c6065e3102060f5dcb9c20cc75.jpeg
---

We had Tape, Mocha, Ava, and now Jest. Let’s see what this is all about!

I enjoy writing tests, but Jest takes it to a whole new level.  
It’s like I get up in the morning and ask myself:

> what new app am I going to build today?

> I need something to write some jests tests for

![](/images/blog/1__QKkubXXqtWXqhE8PwUAPjA.png)

I love Jest for many reasons and this is the first of several posts where I’ll share why I really like it, so let’s get started.

### Zero Configuration

Jest follows the #0CJS practices for Zero Configuration, where even though it is extendible with many configuration variables, it just works out of the box and you don’t need to configure anything special.

Think **Webpack4**, **Parcel**, **Create React App** — this is a practice that many projects have been following recently so it shouldn’t be news and Jest embraces it whole heartedly.

What 0CJS boils down to:

*   **One** **dependency** — just install Jest
*   **Mocking** is built in, no need to install testdoubles libraries like proxyquire, sinon, testdouble, or others.
*   **Assertions** are built in, no need to install Chai, Should.js, or others. Jest ships with a good basis of what it refers to as Matchers to assert expectations.
*   **Code coverage** ? Built-in.

### Fast Like Ava, Sane Like The Rest

Oh Ava my love!

I jumped from Mocha to [Ava.js](https://github.com/avajs/ava) a few years back and it has been an interesting ride. With Ava, it’s not about the tooling but rather the philosophy and test practices it promotes — no shared state between any tests.

This is however, not an easy task to follow.  
Let’s see a crude example — Say your app behaves differently depending on an environment variable like **_NODE\_ENV_** (not a far fetched example) and you want to test it in different conditions:

![](/images/blog/1__OqcDUJyAVchnir__tTjuh6g.png)

See the pitfall?

With Ava, the two test cases are executed concurrently, which will lead to a situation where by the time the first test case enters the service promise, the second test case already ran and changed the global variable’s value to _production._

Some of these pitfalls are not uncommon across test code—global variables, singletons which are the basis for Node.js module system, or integration tests where managing state between test cases is part of a flow.

All of which are bad test patterns and should be avoided as Ava encourages, but we often find ourselves in these situations.

### Extensible Framework

There’s a great talk about Jest As a Platform by Rogelio Guzman which I highly recommend you to watch:

But even without diving into the internals of the Jest project and how the platform is built -

Jest’s matchers (assertions, such as _expect().toBe(1)_) are easily extendible and help make your code more readable and concise without requiring you to use any of the language constructs.

For example, while Jest matchers give you out of the box things like:

*   .toBeTruthy()
*   .toHaveBeenCalled()
*   .toBeGreaterThan(number)

With the [jest-extended](https://github.com/jest-community/jest-extended) package installed you also win the following matchers:

**Arrays**:

*   .toBeArrayOfSize()
*   .toBeArray()
*   .toIncludeAllMembers(\[members\])

**Numbers**:

*   .toBeEven()

**Objects**:

*   .toContainKey(key)

[**jest-community/jest-extended**  
_jest-extended - Additional Jest matchers 🃏💪_github.com](https://github.com/jest-community/jest-extended "https://github.com/jest-community/jest-extended")[](https://github.com/jest-community/jest-extended)

### Codemods

Imagine you have an existing code-base written in one test framework and you’d want to move to another framework. How would you do it?

Codemods are programs that help you automate work for transforming your code-base, and can largely be categorized in the following levels of maturity:

*   Search and replace
*   Apply regular expressions for smarter search and replace
*   Apply Abstract Syntax Tree (AST) transformations from one language syntax to another.

> Codemods aren’t really specific to Jest but they make the job easy when you need to migrate existing projects.

I wrote an article that documented this process on a small project if you’re into the process:

[**Migrating a Mocha project to Jest Test Framework**  
_I like mocha just like the next guy, but sometimes it’s time to move on. We’re talking about iced coffee, right?_medium.com](https://medium.com/@liran.tal/migrating-a-mocha-project-to-jest-test-framework-76d13d76685 "https://medium.com/@liran.tal/migrating-a-mocha-project-to-jest-test-framework-76d13d76685")[](https://medium.com/@liran.tal/migrating-a-mocha-project-to-jest-test-framework-76d13d76685)

And of course, the jest-codemods repository that will get you going:

[**skovhus/jest-codemods**  
_jest-codemods - Codemods for migrating to Jest https://github.com/facebook/jest 👾_github.com](https://github.com/skovhus/jest-codemods "https://github.com/skovhus/jest-codemods")[](https://github.com/skovhus/jest-codemods)

I’d be happy to hear what are your reasons to love Jest.

There’s a second part that I’ll share soon —   
“Reasons to love Jest: Developer Experience”

Stay tuned!