---
title: "\U0001F49A 3 Valentine’s Poems for a Beloved & Secure Node.js App"
description: >-
  Dedicated to everyone whom are helpless romantics as I am, and hopelessly
  in-love with their Node.js apps.
date: '2018-02-16T14:14:28.305Z'
categories: []
keywords: []
tags: []
slug: 3-valentines-poems-for-a-beloved-secure-node-js-app-bc9dc27dca00
pubDate: '2018-02-16T14:14:28.305Z'
image: ~/assets/images/blog/c56b1e2bd1b3b1bf3929b78af3b8143e.jpeg
---

Dedicated to everyone whom are helpless romantics as I am, and hopelessly in-love with their Node.js apps.

![](/images/blog/1__B6McTs1aMuPrGnQJUikH3A.jpeg)

### In a Relationship You Respect a Spouse’s Privileges!

> Roses are red,

> Violets are blue,

> Never run node with su\_\_

If you’re brain didn’t auto-complete that — You never want to run the Node.js process, or an npm install with a superuser privileges, **such as the common mistake**:

_\# don't do this!  
sudo node index.js_

### It Is Important To Listen

![](/images/blog/1__zIpyl7P__Llpg2T9D2Cpg7Q.jpeg)

> Roses are red,

> Violets are blue,

> Never write a regex, or you’ll DoS your task que\_\_

If you’re brain didn’t auto-complete that — You want to avoid as much as you possible writing any custom regex code on a JavaScript app (browser or Node.js), due to the fact that regular expressions require compute cycles and it is easy to write a bad regex that can lead to denial of service by blocking the event loop.

Instead, use a common validation library such as one from below, or run your regex through safe-regex to validate the pattern.

_npm install_ [_validator_](https://github.com/chriso/validator.js/) _joi safe-regex_

### Secrets Should Remain Secret

![](/images/blog/1__w1OGFI5HIQ3yMrpNBQEtHA.jpeg)

> **Roses are red,**

> **Violets are blue,**

> **Committing secrets to git? Shame on you!**

Plain-text secrets in your source code is bad, and worse when they get pushed to a repository, public or private. One workaround is to encrypt them at rest in source code but that’s not very manageable and has a lot of downsides, a better one is using a service over secure wire to access them. Another option is following the [12 factor app](https://12factor.net/) environment variables pattern.

Anyway, you should use a tool [git-secrets](https://github.com/awslabs/git-secrets) to help ensure that you don’t accidentally commit secrets like passwords and API keys or tokens to git.

_npm install_ [_git-secrets_](https://github.com/awslabs/git-secrets) _pre-git_

### Further Reading

If you’re interested in strengthening your skill around Node.js Security practices and avoiding Node.js pitfalls in production I invite you to [grab a copy of the book I wrote](http://leanpub.com/nodejssecurity):

[**Essential Node.js Security**  
_Hands-on and abundant with source code for a practical guide to Securing Node.js web applications.Node.js Secure Code…_leanpub.com](https://leanpub.com/nodejssecurity "https://leanpub.com/nodejssecurity")[](https://leanpub.com/nodejssecurity)

Also, you can find a gist of security best practices I helped contribute to in the popular [Node.js Best Practices GitHub repo](https://github.com/i0natan/nodebestpractices/tree/security-best-practices-section):

[**i0natan/nodebestpractices**  
_nodebestpractices - The largest Node.JS best practices list. Curated from the top ranked articles and always updated_github.com](https://github.com/i0natan/nodebestpractices/tree/security-best-practices-section "https://github.com/i0natan/nodebestpractices/tree/security-best-practices-section")[](https://github.com/i0natan/nodebestpractices/tree/security-best-practices-section)

Can’t wait to see your own love poems on twitter!  
ping me on [https://twitter.com/liran\_tal](https://twitter.com/liran_tal)

Happy & Secure Valentine’s day,  
Liran 💚