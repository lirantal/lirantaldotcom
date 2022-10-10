---
title: Migrating a Mocha project to Jest Test Framework
description: >-
  I like mocha just like the next guy, but sometimes it’s time to move on. We’re
  talking about iced coffee, right?
date: '2017-11-26T11:06:20.114Z'
categories: []
keywords: []
tags: []
slug: migrating-a-mocha-project-to-jest-test-framework-76d13d76685
pubDate: '2017-11-26T11:06:20.114Z'
image: ~/assets/images/blog/f5843d654b6a262e729aa81fd2468f5c.jpeg
---

I like mocha just like the next guy, but sometimes it’s time to move on. We’re talking about iced coffee, right?

![](/images/blog/1__ojE2ZDk9__s3QqPDOp9WcWQ.jpeg)

### The Why

So I actually had a chance to take the [Jest testing framework](https://facebook.github.io/jest/) for a drive in a side-project that abstracts some Amazon AWS S3 functions: [https://github.com/lirantal/aws-s3-utils](https://github.com/lirantal/aws-s3-utils), but this story is about migrating an existing project to Jest.

The story is about an old library I built that converts a Linux CRON scheduling notation to Quartz format. I named it in the most creative way I could: **_cron-to-quartz_**: [https://github.com/lirantal/cron-to-quartz](https://github.com/lirantal/cron-to-quartz)

> fun fact #1 — cron-to-quartz is the first, and only library on npm that does this conversion!

I used **_mocha_** and **_should.js_** for tests, and I also cared to integrate security through tools like Snyk to watch over dependencies which might introduce vulnerable code so I know to upgrade or patch them.

If you add a project badge on your README it’s easy to notice:

![](/images/blog/0__D__mXtUYNkcOKLzU4.png)
![](/images/blog/1__cNa4S35vq10aUAascdxH0g.png)

The vulnerability is coming from **_mocha_**, and one could argue that it’s just a testing framework and doesn’t ship out to users.

That’s true, but it bothers me none-the-less and I’m crazy like that.

You can read more about this vulnerability: [https://snyk.io/vuln/npm:growl:20160721](https://snyk.io/vuln/npm:growl:20160721)

### The Big Migration

Jest makes it easy to migrate away from test runners like mocha, or from using assertion libraries like should.js. It does this by employing codemods which are amazing but deserve their own post. So in short they work like babel — reading your test code and converting it to Jest code.

### Codemods

Install the **_jest-codemods_** library as a global tool that you can run on any project or codebase:

yarn global add jest-codemods

When you execute the **_jest-codemods_** utility it will interactively prompt you to select which frameworks you are using so it can run the correct combination of codemods under the hood to migrate your project:

![](/images/blog/0__DW7azXDE8JV5dB8l.png)

It’s possible to do a dry run of the migration where you aren’t actually changing your codebase and you can survey how the process works out and what manual intervention you possibly need beyond the codemods automatic migration.

![](/images/blog/0__8AIbjaCNApvPs30H.png)

Looks good…

### Not all roses and rainbows

The conversion worked almost perfectly except the AST plugin didn’t handle chained should.js assertions properly so it ended up with expect assertions that aren’t valid and all the test actually failed.

It’s not that bad either.  
I quickly updated the existing should.js test code to refactor out the chained assertions:

![](/images/blog/1__mzjzyugpLQyZCumJluUeig.png)

Then running the codemod conversion and it’s done!

From Mocha to Jest in seconds.

At this point on as simple as removing mocha and should.js dependencies and replacing them with jest and updating the project accordingly.

### A Little Jem For Closing

If you reached this far I thought I’d treat you with a little gem for closing:

> Fun fact #2 — did you know there’s an actual movie titled [Mocha & Chai](http://www.imdb.com/title/tt3231264/?ref_=fn_tt_tt_5)?

![](/images/blog/0__YIwVq4dlLk7rgHp9.png)

Can’t wait for your comments with feedback on the movie!