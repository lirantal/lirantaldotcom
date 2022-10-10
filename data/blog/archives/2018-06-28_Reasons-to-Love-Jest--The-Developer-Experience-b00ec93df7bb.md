---
title: 'Reasons to Love Jest: The Developer Experience'
description: "Oh yes. The Developer Experience with Jest is transforming the act of writing tests from a chore to hell of a fun time, promise! \U0001F913"
date: '2018-06-28T05:50:45.207Z'
categories: []
keywords: []
tags: []
slug: reasons-to-love-jest-the-developer-experience-b00ec93df7bb
pubDate: '2018-06-28T05:50:45.207Z'
image: ~/assets/images/blog/92df734d2f1ca2383f3a3c5f2d71831f.jpeg
---

Oh yes. The Developer Experience with Jest is transforming the act of writing tests from a chore to hell of a fun time, promise! 🤓

This post is a follow-up from my previous post about Jest’s Framework:

[**Reasons to Love Jest: The Test Framework - Liran Tal - Medium**  
_I really enjoy writing tests, and Jest takes it to a whole new level. It's like I get up in the morning and ask myself…_medium.com](https://medium.com/p/ae19b49c02c3/ "https://medium.com/p/ae19b49c02c3/")[](https://medium.com/p/ae19b49c02c3/)

![](/images/blog/1__BImt6BeBv2SHXWsiblU6Fw.png)

### The Logo

Aww, the logo. Isn’t it just good?  
Like it’s trying to tell you “are you gonna write tests? this is gonna be fun!”  
And just like that it lures you in

![](/images/blog/1__YWAE08oNqUDG9lAj5x0qhw.png)

Ok but seriously though, I just needed an item on the left-side to sort of align the rest of the items. Forgive me 🤷‍.️

An anecdote on the logo if you will —   
Recently I learned the Jest logo was created in a last minute sketch up by [James Pearce](https://medium.com/u/9d26c4a319d4) where he iterated over several options ([twitter reference](https://twitter.com/jamespearce/status/1011494561682620416)) but more amusingly [Christoph Nakazawa](https://medium.com/u/9ea60eb6fc7c) mentioned that the … circles positioned next to each other reminds him of a loading animation which is correlated with slowness :-)

![](/images/blog/1__EBVLbY31axYj7tuorTM9mg.png)

### Visual Diff and Effective Verbosity

A big part of good developer experience is increasing your productivity.  
When it comes to testing, when tests fail, you want to quickly identify what went wrong with the test.

Take this code snippet for example:

![](/images/blog/1__sJ4jlKiMDVrYtUj__kPcfPA.png)

It has a typo in the test’s source code.  
This is how Jest would show the error in the console:

![](/images/blog/1__wDZ6jaMpLdVP4z__3EleJsQ.png)

It provides great context into the actual file, the line number, and arrows to point to the exact problem and colors the code with a syntax highlighter too.

Are you going to compare two objects in your assertions?  
No problem at all. Jest is so verbose that it will show this great diff even for nested keys that are different between the objects you’re comparing:

![](/images/blog/1__GjwLHmZwGBzc2dvWXShf3Q.png)

**side note**: Jest has been made very modular and many of its capabilities were moved out to individual modules that the community can make use of.

If you fancy the above diff’ing you can use it in your own project, see here: [http://jestjs.io/docs/en/jest-platform.html#jest-diff](http://jestjs.io/docs/en/jest-platform.html#jest-diff)

### Relaxed Conventions

#### Test suites conventions

If you’re coming from different test runners or frameworks, you’ll know that they differ in their test suites syntax.

![](/images/blog/1__qCglC7g6xU__r2Nmd4Zsh0A.png)

Some use **_describe.only()_**, in others you can only have **_test().  
_**In some of them you disable a test by **_test.skip()_** while in others it’s **_xit()_**_._

With Jest, it doesn’t matter.  
It does its best to optimize productivity instead of strict conventions.

You can write **_test()_**, or a nested **describe()** _and_ **test(),** or just use **_it().  
_No brainer.**

![](/images/blog/1__sRdX97yxaO6greiRoBJS0A.png)

Which file naming convention should you use for tests?  
Who cares! 😜

Jest will automatically pick up any **_\*.test.js_** or **_\*.spec.js_** file extensions, as well as any files in a **_\_\_tests\_\__** directory.

#### Friendly CLI

Jest has a friendly CLI that will help you figure out what you mean incase of spaghetti fingers:

![](/images/blog/1__I6F__p1sfSWpKoKX5KplcZw.png)

Sure, it’s not a time travel but it’s another corner stone in Jest’s productivity boosting and developer friendliness.

It’s the little things that matter the most.

#### Test Doubles

In automated testing, where we write and execute unit and integration tests, it is a common practice to make use of different kinds of test doubles to isolate different parts of the system.

There are different methods of isolation with different goals and behaviors, but they are all collectively referred to as test doubles.

Where as other libraries like Sinon require you to explicitly declare and choose a type of a test double for your test (a stub, a mock, a spy), Jest wraps everything into a single entry point called the Mock object (jest.fn).

The Mock is accessed and used in different ways through the test code, still essentially you don’t need to bother yourself with such decisions in your test code about types of test doubles. It’s another productivity gain with Jest.

That said, you should still understand testing principles.

> Suggested reading about Test Doubles in Martin Fowler’s blog: [https://martinfowler.com/bliki/TestDouble.html](https://martinfowler.com/bliki/TestDouble.html)

### Immersive Watch Mode

Some benefits of Jest’s watch mode that streamlines your development workflow:

*   The obvious being — instantly running tests as changes occur (in the IDE, or say you switch a branch).
*   Jest resolves which tests to run automatically for you.  
    It manages metadata about your source code so it can learn how to run only the relevant test files when a source code file is changed.
*   Jest’s interactive watch mode will show you if you’re filtering for any file types. For example, if you ran jest with a specific glob path, it will display it as an active filter:

![](/images/blog/1__11AevdkhAA2s0hsaHYObkQ.png)

*   No longer test.only() making it into your test code, and accidentally slipping into your PR. With Jest you can easily filter a test run by it’s filename or test name straight from the console. So just filter by the test name, and only it will get re-run whenever you make changes to the test file:

![](/images/blog/1__D__YqHsu4xnSoGMSlCTn1qg.png)

Other things you should know about the test runner:

*   Jest will run the slowest tests first to optimize for parallel CPU work and decrease overall test run times.
*   Jest will run previously failing tests first to provide a quick feedback loop
*   Jest will pick the order of tests to run so you should definitely not have an expectation that they will run alphabetically, or any other fashion.  
    For you, they run completely random and it would be a bad practice to have test files named _01\_loginFucntions.spec.js_, _02\_createUsers.spec.js_.

So what do you like about the developer experience when using Jest?