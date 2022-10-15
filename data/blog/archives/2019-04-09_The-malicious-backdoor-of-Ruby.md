---
title: Did you hear about the malicious backdoor discovered in the popular bootstrap-sass Ruby gem?
date: '2019-04-09'
pubDate: '2019-04-09'
description: a malicious version of a Ruby gem used in a Rails application leads to remote code execution on vulnerable servers
image: ~/assets/images/blog/photo-1510920081567-0c22e967d744.jpeg
tags: ruby, security, rails, rubygems
---

I recently shared the [outline of events and technical details](https://snyk.io/blog/malicious-remote-code-execution-backdoor-discovered-in-the-popular-bootstrap-sass-ruby-gem/) behind the backdoor that was wisely hidden in the 3.2.0.3 version of bootstrap-sass, a popular ruby gem that was downloaded 28 million times since added to the repository 8 years ago.

The malicious version allowed remote attackers to dynamically execute code on servers hosting the vulnerable versions, by sending a specially crafted HTTP request that hides the payload in an innocent-looking cookie 🍪.

As there are no logs and evidence to trace back how this happened, the maintainers suspect that the gem was published using a compromised account of one of the two of them who had publish access.

We've heard stories of this happening before in the JavaScript community as well. On good example for this is the eslint-scope package.

## What can we do about it?

I can't stress enough how important it is for maintainers, and developers in general to bump up their security game. I have compiled a list of [10 npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/) for JavaScript developers, and at the very least enabling 2FA on the RubyGems repository is a must.

If you're using [Snyk](https://app.snyk.io/signup), we already updated our vulnerability database to alert in-case you are using the malicious version.



