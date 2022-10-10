---
title: Meet the Node.js Security Working Group
description: >-
  In this post I would like to acquaint you with the work being done by the
  Node.js Security Working Group (WG) and how we’re improving the…
date: '2018-05-31T15:00:24.494Z'
categories: []
keywords: []
tags: []
slug: meet-the-node-js-security-working-group-30b9f00b678
pubDate: '2018-05-31T15:00:24.494Z'
image: ~/assets/images/blog/8f6b8d1eeaf7044d229dfe923f1b15f1.jpeg
---

In this post I would like to acquaint you with the work being done by the Node.js Security Working Group (WG) and how we’re improving the state of security for the Node.js ecosystem.

### Security of Node Core

With respect to Security of Node Core, the Working Group members do not manage the triage and security releases (the project has a smaller team with access to do this), but instead it helps to define and document the processes that are followed. For example:

*   helping to define and document how CVE’s are managed
*   adopting HackerOne as a vulnerability management platform
*   defining overall processes. You can read more about some of these processes here: [https://github.com/nodejs/security-wg/tree/master/processes](https://github.com/nodejs/security-wg/tree/master/processes).

### Security of Node.js Modules in the overall ecosystem

The Node.js Security Project provides a unified process for discovering and disclosing security vulnerabilities found in the Node.js module ecosystem, which has been carried on by this working group today (this was one of the motivations for forming the Working Group)

The Working Group has defined processes for reporting vulnerabilities in modules within the ecosystem, works with module authors to ensure they are addressed and maintains a public database of vulnerabilities. You can read more about this work here: [https://github.com/nodejs/security-wg/blob/master/processes/third\_party\_vuln\_process.md](https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md).

### Getting Involved

The Node.js Security WG is composed of members of the Node.js Foundation who mostly have affiliation with security initiatives, or other relevant background. If you have a passion for security and want to help out, please get involved.

We meet regularly, on a monthly basis to discuss items on the agenda.The session is live broadcasted, via the [Node.js Foundation YouTube channel](https://www.youtube.com/channel/UCQPYJluYC_sn_Qz_XE-YbTQ), and we welcome anyone to join for updates or bring up matters to discuss.

> You’re welcome to review our last WG Agenda [meeting notes](https://github.com/nodejs/security-wg/blob/master/meetings/2018-05-17.md)

![](/images/blog/1__6Z__r6ClfhG__zRReamDGatw.png)

### Diving Deeper into some of the Initiatives

### Scope & Responsibilities

The Node.js Security WG’s set of responsibilities and scope is well documented in our [repository](https://github.com/nodejs/security-wg), and can be classified into the following two high-level initiatives:

*   Improving the state of the Node.js Security Module Ecosystem — Through the creation of many initiatives, policies, and processes that we’ll review later in the article.
*   Governing Responsible Disclosure Programs for Node.js and the npm ecosystem — building a dedicated team, setting up relevant policies, and processes to enable security researchers to report vulnerabilities found in third party Node.js modules (npm).

The first initiative is being handled largely in an open matter through the [issue queue](https://github.com/nodejs/security-wg/issues), or agenda meetings, while the second is managed behind a vale of discretion to protect users from a publicly made vulnerability report which could expose them to malicious attackers.

Let’s further expand on some of the initiatives from the above.

### A Responsible Disclosure Program for the Node.js Ecosystem

Providing a platform for bug hunters and security researchers to safely report vulnerabilities in third party modules for Node.js is essential.

We have established official channels of communication, namely through the HackerOne platform, and policies to handle vulnerabilities.

This extends to module authors as well, which are now able to discreetly engage in such vulnerability reports and work out a fix and release without the vulnerability being public before a patch is introduced and provided to users. This is defined as a responsible disclosure program.

![](/images/blog/1__YlHpEHBSqzEwF8Vz2FdlRg.png)

We set guidelines and policy for how the process looks like when a vulnerability is reported. You can read more about them in: [Third-Party Vulnerability Reporting Process](https://github.com/nodejs/security-wg/blob/master/processes/third_party_vuln_process.md)

#### A Responsible Disclosure Program for Node.js Core

The Node.js Core security group also uses a responsible disclosure program. All security bugs in Node.js are taken seriously and should be reported via [HackerOne](https://hackerone.com/nodejs) or by emailing security@nodejs.org. This will be delivered to a subset of the core team who handle security issues.

### Bug Bounty Program

The Node.js project engages in an official bug bounty program for security researchers and responsible public disclosures. The program is managed through the HackerOne platform. More on how Node.js Core handles security policies [here](https://nodejs.org/en/security/).

### The SECURITY.md Badge

Having a security policy in your project’s repository can go a long way in communicating to your users how much you value and prioritize security.

If someone found a security problem with your Node.js module, how should they report it? Who should you contact? What if they can’t reach the maintainer? What if they want to stay anonymous?

As a module maintainer you can easily provide these details to your users by embracing a _SECURITY.md_ file that you can [copy from the template the Security Working Group](https://github.com/nodejs/security-wg/blob/e2c03e62d73635a766156c6ea4f9aefb35c04603/processes/responsible_disclosure_template.md) provides.

Furthermore, adding the security badge on your repository will send a positive message to your users that you are seriously committed to security concerns.

![](/images/blog/1__YR7d2GtcCqjPdcv28M6r3A.png)

Stay tuned for follow-up posts into the activities of the Working Group!

### Feedback!

Whether you’re a module author, a security researcher or an end-user, your feedback is important and we want to hear from you on how we can improve, and what are painful areas that we can further engage on.

We also invite you to join us on an open slack channel: [https://nodejs-security-wg.herokuapp.com/](https://nodejs-security-wg.herokuapp.com/)

Also, stay tuned as we’ll be providing more insights into the activities of this group, later on!