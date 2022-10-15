---
title: 6 stages of refactoring a jest test case
date: '2019-06-14'
pubDate: '2019-06-14'
description: what makes a test case good? how can we improve the developer friendliness when writing test code?
image: ~/assets/images/blog/photo-1576444356170-66073046b1bc.jpeg
tags: tests, testing, jest, javascript
---

An underrated feature of Jest is customizing the assertion errors that the console displays when tests fail. Imagine the following test code, which needs to programmatically loop an object to ensure keys exist as expected:

![](/images/blog/3kg7kab34fwkx3t4njsp.png)

The test is written fine but imagine a developer on the team made some changes to the code, added a new file in one place, but forgot to add it to another place such as to export it properly.

When the test fails the reason for failing will not be intuitive and if you’re new to the code you’d likely not even know what broke:

![](/images/blog/5ctqlb4g9jbfdmnnbezn.png)

So jest has more semantic expectations such as toHaveProperty(), which looks like this:

![](/images/blog/mddxn4w5h8l40tixxidp.png)

Now when a test fails it at least makes it clearer as to which property is missing, but it’s still a bit cryptic as you can see in the screenshot. What can we do? 🤔

![](/images/blog/3ti80y830wqjeh6k66xn.png)

At this point, it might be good enough. The test name is self-explanatory as you can see but the issue is that we have just one test case that fails and when looking at a test trace it isn’t very obvious which validators were used exactly.

Let's refactor:

![](/images/blog/l1uagsnyipzk5rzm8kzg.png)

Now, when my test pass or fail, it is much more obvious and intuitive as to what exactly was tested, what exactly failed, and why:

![](/images/blog/d4q9gk8rw10k44koym4n.png)

Much better! 🌈🦄🎉

---

If you love Jest as much as I do (😍) you might also be interested in reading some of my other pieces on jest here on dev.to!:
- [Demystifying Jest Async Testing Patterns
](https://dev.to/lirantal/demystifying-jest-async-testing-patterns-4n5n)
- [Reasons to Love Jest: The Developer Experience
](https://dev.to/lirantal/reasons-to-love-jest-the-developer-experience-4o6f)
- [Reasons to Love Jest: The Test Framework
](https://dev.to/lirantal/reasons-to-love-jest-the-test-framework-2hoe)