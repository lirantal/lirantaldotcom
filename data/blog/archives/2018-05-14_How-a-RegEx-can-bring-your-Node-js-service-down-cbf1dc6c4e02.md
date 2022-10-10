---
title: How a RegEx can bring your Node.js service down
description: >-
  The use of Regular Expressions (RegEx) is quite common among software
  engineers and DevOps or IT roles where they specify a string pattern…
date: '2018-05-14T13:26:05.762Z'
categories: []
keywords: []
tags: []
slug: node-js-pitfalls-how-a-regex-can-bring-your-system-down-cbf1dc6c4e02
pubDate: '2018-05-14T13:26:05.762Z'
image: ~/assets/images/blog/36c3fb5fd13b4fe7a423bdb4f2323597.jpeg
---

The use of Regular Expressions (RegEx) is quite common among software engineers and DevOps or IT roles where they specify a string pattern to match a specific string in a text.

Often, programmers will use RegEx to validate that an input received from a user conforms to an expected condition. For example:

Testing that a user’s provided e-mail address is valid:

### What does it have to do with Node.js?

The risk that is inherent with the use of Regular Expressions is the computational resources that require to parse text and match a given pattern.

A flawed Regular Expression pattern can be attacked in a manner where a provided user input for text to match will require an outstanding amount of CPU cycles to process the RegEx execution.

Such an attack will render a Node.js or JavaScript application unresponsive, and thus is referred to as a ReDoS — Regular Expression Denial of Service.

### Let me show you why RegEx is a naughty word in our office

Say you’re building a music app and you want to validate song titles.

We need to match words, numbers, and spaces.  
So you give the regex a few tries and come up with the following:

![](/images/blog/1__vWVy62j__IBc4uIk6Ai__xkw.png)

Maybe it’s not the perfect regex (**_hint_**: it isn’t).  
But hey, it works.

I tested a few song titles and yeah, **ready to push to production, woohoo!** 🎉

Until a Britney Spears fan plays a joke on your app and enters the following song title as input:

![](/images/blog/1__HNdzrGsLzrebjEEN5a5F0w.png)

**Catastrophic backtracking.**  
Even if you have no clue what that is, sure sounds scary. And it’s in red too!

Curious to see what it means when you have this little RegEx gem in your Node.js code?

![](/images/blog/1__dgthVybmyyiYDKgNjXGTzA.gif)

A relatively small input string was able to block the Node.js event-loop for about 6 seconds, during which time it consumed 99% cpu power.

Not exactly what you want to do on a single-threaded web application server.

![](/images/blog/1____McPazIiq62BxOpnJNYsgA.gif)

> tip: try that RegEx pattern on regex101.com and use their regex debugger to see what’s going on.

### What now?

My number one rule is avoid writing RegEx on your own, but following are the alternatives I am suggesting.

#### Use a third party

Most of the time, if you need the common things it is better to rely on third party libraries which have a million of eyes looking at and improving both performance and security to get the job done than 3 colleagues code reviewing your version.

A recommended package for JavaScript is [**validator.js**](https://github.com/chriso/validator.js)

[**chriso/validator.js**  
_validator.js - String validation_github.com](https://github.com/chriso/validator.js "https://github.com/chriso/validator.js")[](https://github.com/chriso/validator.js)

You’ll find all the common patterns — IP Addresses, e-mails, phone numbers, etc.

> even validator.js had its own ReDoS vulnerabilities [reported](https://nodesecurity.io/advisories/42) but better it, with a good community of maintainers and security researchers than rolling your own.

#### Lint your RegEx before using them

Of course you might need to end up writing your own RegEx pattern for something very unique in your use-case.

If that’s the case, consider using [safe-regex](https://github.com/substack/safe-regex) which is package to help you identify potential bad regular expressions.

[**davisjam/safe-regex**  
_Detect possibly catastrophic, exponential-time regular expressions - davisjam/safe-regex_github.com](https://github.com/davisjam/safe-regex "https://github.com/davisjam/safe-regex")[](https://github.com/davisjam/safe-regex)

**_safe-regex_** is a quick go-to but it isn’t perfect actually so if you’re able to integrate Jamie’s tool you’re better off with it:

[**davisjam/vuln-regex-detector**  
_vuln-regex-detector - Detect vulnerable regexes in your project. REDOS, catastrophic backtracking._github.com](https://github.com/davisjam/vuln-regex-detector "https://github.com/davisjam/vuln-regex-detector")[](https://github.com/davisjam/vuln-regex-detector)

**You followed so far? Britney Approves!**

![](/images/blog/1__35511BqSY__V__b2JxkUWGJA.gif)

### Further Reading

If you’re interested in strengthening your skill around Node.js Security practices and avoiding Node.js pitfalls in production I invite you to [grab a copy of the book I wrote](http://leanpub.com/nodejssecurity):

[**Essential Node.js Security**  
_Hands-on and abundant with source code for a practical guide to Securing Node.js web applications.Node.js Secure Code…_leanpub.com](https://leanpub.com/nodejssecurity "https://leanpub.com/nodejssecurity")[](https://leanpub.com/nodejssecurity)

Some of the topics from the book were presented live at 2017’s [JSHeroes](https://jsheroes.io/) conference:

And finally, you can find a gist of security practices I helped contribute to in the popular [Node.js Best Practices GitHub repo](https://github.com/i0natan/nodebestpractices/):

[**i0natan/nodebestpractices**  
_nodebestpractices - The largest Node.JS best practices list. Curated from the top ranked articles and always updated_github.com](https://github.com/i0natan/nodebestpractices "https://github.com/i0natan/nodebestpractices")[](https://github.com/i0natan/nodebestpractices)

Thanks for reading, and stay secure!