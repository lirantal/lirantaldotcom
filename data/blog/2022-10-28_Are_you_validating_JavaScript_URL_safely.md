---
title: Are you also validating a JavaScript URL using RegEx?
description: >-
  What do you think of the following JavaScript URL validation function code?
  Are you accidentally adding security issues while doing so?
date: '2022-10-28'
pubDate: '2022-10-28'
categories: []
keywords: []
tags: []
image: ~/assets/images/blog/photo-1564507110792-4ffa98ae18d1.png
---

What do you think of the following JavaScript URL validation function code?
Are you accidentally adding security issues while trying to build a feature?

The Snyk blog features a [Secure JavaScript URL validation](https://snyk.io/blog/secure-javascript-url-validation)
article about the importance of security traits and secure best practices
with regards to handling a JavaScript URL.

I shared the following code snippet [on Twitter](https://twitter.com/liran_tal/status/1582004942994550786?s=20&t=MsK4_x0yoj5wQgTjbU7fbA)
to see folks make of it and whether someone would be calling out security issues:

```js
function checkUrlIsValid (string) {
    let givenURL ;
    try {
        givenURL = new URL (string);
    } catch (error) {
        console.log ("error is", error);
       return false; 
    }
    return true;
  }
```

The replies varied pretty much and included some interesting perspectives
and potential security vectors that folks might not be aware of, which
we will cover in this article. But standing out were replies that
suggested to use regular expressions (RegEx) to validate a URL.

Using a RegEx to perform validation isn't new, and in fact, an often
used approach by developers when they need to perform string matching
or string manipulation. In fact, even the popular [validator](https://snyk.io/advisor/npm-package/validator)
npm package uses RegEx to validate data formats in strings. But is it
the right approach? What sort of security concerns does RegEx exposes
us to? Let's find out.

## Regular Expression Denial of Service

Due to how some RegEx engines work, they can be vulnerable to a type
of attack called Regular Expression Denial of Service (ReDoS). This
happens because of an implementation detail in the RegEx engine that
is known as [catastrophic backtracking](https://snyk.io/blog/redos-and-catastrophic-backtracking/).

The fact that escapes most when dealing with Regular Expressions
is that RegEx expressions are CPU-bound.

For JavaScript and Node.js, both being single-threaded environments
for the main event loop that handles runtime JavaScript code, this
would be disastrous. A ReDoS attack can cause a Node.js process to
completely halt and stop responding to any HTTP requests.

Consider the following function that uses a RegEx to validate a URL:

```js
function checkUrlIsValidFast (string) {

    var ip = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
    var protocol = '(?:http(s?)\:\/\/)?';
    var auth = '(?:\\S+(?::\\S*)?@)?';
    var host = '(?:(?:[a-z\\u00a1-\\uffff0-9_]-*)*[a-z\\u00a1-\\uffff0-9]+)';
    var domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
    var tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?';
    var port = '(?::\\d{2,5})?';
    var path = '(?:[/?#][^\\s"]*)?';
    var regex = '(?:' + protocol + '|www\\.)' + auth + '(?:localhost|' + ip + '|' + host + domain + tld + ')' + port + path;
  
    return new RegExp(regex, 'ig').test(string);
  }

  console.log(checkUrlIsValidFast('https://example.com'))
  // returns true
```

The regular expression validation above looks great, right?

Well, it's not. It's vulnerable to a ReDoS attack. Let's see how.
What if the attacker sends the following string as input for a URL:

```js
  console.log(checkUrlIsValidFast('018137.113.215.4074.138.129.172220.179.206.94180.213.144.175250.45.147.1364868726sgdm6nohQ'))
  // returns true
  // but after like a million years.
  // goodluck ;-)
  ```

## Your npm package validator is vulnerable to ReDoS 

My personal advice when I'm asked about how to handle RegEx in 
situation where you need to validate a string is to avoid it 
completely if you can and use lower-order string manipulation
functions instead.

The reason is that RegEx is a very powerful tool, but it's also
very complicated and can be very hard to get right. If you want
some supporting evidence, I can offer at least two:
* Cloudflare, an incredibly big Internet infrastructure provider, [had suffered one if its biggest outages in history](https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/) in 2016 due to a ReDoS vulnerability in one of their RegEx.
* The [validator](https://snyk.io/advisor/npm-package/validator) npm package, which is used by millions of developers, has been found [vulnerable to ReDoS](https://snyk.io/vuln/SNYK-JS-VALIDATOR-1298040) time and time again.

If smart maintainers, many collaborators, and talented developers employed by Fortune500 public companies can't get RegEx right, how can we expect the average developer to do so?

## What else to worry about when validating URLs?

Other security aspects to consider when validating URLs:
* [Mike Samuel](https://twitter.com/mvsamuel) had [offered advice](https://twitter.com/mvsamuel/status/1582089787850166272?s=20&t=MsK4_x0yoj5wQgTjbU7fbA) about normalizing URLs in order to avoid different sort of injection payloads.
* [Gal Weizman](https://twitter.com/weizmangal) had [shown the classic javascript:alert(1) payload](https://twitter.com/weizmangal/status/1582090000000000000?s=20&t=MsK4_x0yoj5wQgTjbU7fbA) as that which gets passed through a `new URL()` parsing just fine, but is vulnerable still.
* [Ori Livni](https://twitter.com/oriSomething) demonstrated how [different URL schemes are possible](https://twitter.com/oriSomething/status/1582007859780677634?s=20&t=MsK4_x0yoj5wQgTjbU7fbA) to provide a valid URL (per `new URL`) but are often not what the developer would have expected.
* [Emily](https://twitter.com/ThisIsMissEm) had [hinted](https://twitter.com/ThisIsMissEm/status/1582032133392314368?s=20&t=MsK4_x0yoj5wQgTjbU7fbA) that a fast performing `URL.isValid()` would be a nice idea.


## Getting better at RegEx

As I have mentioned in a [follow-up tweet](https://twitter.com/liran_tal/status/1582082037170638848?s=20&t=MsK4_x0yoj5wQgTjbU7fbA)
to the discussion about JavaScript URL validation:

> for most of us, unless you are @TheDavisJam who practically wrote the book on regular expression denial of service and who is familiar with internal regex state machine engines.

I've put together a few resources that will be helpful to
better understand ReDoS, its impact and how to avoid it:

* Snyk's [ReDoS learning path](https://learn.snyk.io/lessons/redos/javascript)
* Cloudflare made available [a dedicated
  page](https://www.cloudflare.com/learning/ddos/glossary/regular-expression-dos-and-regex-dos/)
  about ReDoS and how to avoid it.
* Tim Kadlec's [Regular Expression Denial of Service (ReDoS) in Node.js](https://snyk.io/blog/redos-and-catastrophic-backtracking/)
  guide about regular expression Catastrophic Backtracking.