---
title: Comparing React and Angular secure coding practices | Snyk
description: >-
  As a follow-up to Snyk’s State of JavaScript frameworks security report 2019,
  this section of the report is about Angular and React…
date: '2019-10-30T00:01:35.000Z'
categories: []
keywords: []
tags: []
slug: comparing-react-and-angular-secure-coding-practices-snyk-96315e3faf7d
pubDate: '2019-10-30T00:01:35.000Z'
image: ~/assets/images/blog/f8e264edee29e37dc0b11613b993ce3f.jpeg
---

As a follow-up to Snyk’s State of JavaScript frameworks security report 2019, this section of the report is about Angular and React projects overall security posture.

The full report is available here: [https://bit.ly/js-security-report](https://bit.ly/js-security-report)

In this section, we explore both the Angular and the React project security postures. This includes secure coding conventions, built-in in secure capabilities, responsible disclosure policies, and dedicated security documentation for the project.

The following table lays out a few of the security components we found to be essential for best-practice maintenance of any open source package, and an indication of how Angular and React manage said components (if at all).

Comparing React and Angular’s security policy components:

[![](https://cdn-images-1.medium.com/max/800/1*LJePWE1UMQENiZW1Y9bBOQ.png)](https://snyk.io/blog/comparing-react-and-angular-secure-coding-practices/)

### Angular secure coding practices

Angular v2 and later, have a completely different architecture than Angular v1, such as unidirectional data binding. What’s more, the v2 and later versions have left automatic data interpolation via watchers behind, as well as other techniques that were often the cause for many of the Angular v1 security vulnerabilities.

Ahead of Time (AoT) compilation mitigates issues such as Angular templating expression injection and allows for build-time security instead  
 of run-time security. However, dynamically interpolating templates on the client-side still leaves the door open for security vulnerabilities in the form of Angular code injection. In their own best practices documentation, Angular clearly emphasize that this dynamic interpolating is highly unadvisable. With respect to Angular’s documentation, these are highly discouraged as Angular’s best practices clearly point out.

To mitigate Cross-Site Scripting vulnerabilities, Angular employs by default context-aware output encoding, or malicious code sanitization. Moreover, method naming conventions are much better understood, in terms of their impact, if a developer consciously chooses to use them, as opposed to earlier Angular versions, namely Angular v1.x.

Methods such as **bypassSecurityTrustHtml(value)** or **bypassSecurityTrustUrl()** implicitly convey the dangers of using them to insert data into the DOM. Moreso, Angular provides a built-in DomSanitizer to explicitly sanitize values.

### React secure coding practices

React by default encodes almost all data values when creating DOM elements. To provide users with an escape hatch to insert HTML content into the DOM, React is equipped with the eloquently-named function **dangerouslySetInnerHTML()**, clearly conveying the dangers of using it.

Contexts that are unattended by the React security model and are handled by the users include creating:

*   HTML anchor (link) elements with user- provided input as the source for the href attribute value. This mostly applies to versions prior to the recently released React v16.9 which mitigates **_javascript:_**\-based URLs in attribute values and other contexts such as form actions, iFrame sources, and others.
*   React components from user-provided input

React’s server-side rendering could potentially introduce XSS vulnerabilities if malicious user input is injected as-is to a JavaScript context without being properly encoded or sanitized.

### HTTP security

Starting with version 1.2, Angular v1.x release branches have introduced compatibility support for Content Security Policy (CSP) which is necessary due to the use of **eval()** and **Function()** methodology to interpolate expressions.

Cross-Site Request Forgery (CSRF) enables web applications to trust the origin of a request. In newer Angular versions, CSRF support mechanism is built-in to the HTTP client with the **@angular/common/ http** module. In Angular v1.x versions similar capability is supported through the **$http** provider.

Unlike Angular, React doesn’t include an HTTP client and as such, it is unable to provide CSRF support out-of-the-box. As React aims to be a minimalistic view library, handling this concern is up to the developer, using custom code or community-powered modules.

We **highly recommend** **to download** the [full version of the report](https://bit.ly/js-security-report) in its digital format, but have also made the following general sections available as blog posts:

*   [The state of JavaScript frameworks security report 2019](https://snyk.io/blog/javascript-frameworks-security-report-2019/)
*   [Angular vs React: Security Bakeoff 2019](https://snyk.io/blog/angular-vs-react-security-bakeoff-2019)
*   [2019 Side by Side Comparison of Angular and React Security Vulnerabilities](https://snyk.io/blog/2019-side-by-side-comparison-of-angular-and-react-security-vulnerabilities)
*   [Angular vs React: The Security Risk of Indirect Dependencies](https://snyk.io/blog/angular-vs-react-the-security-risk-of-indirect-dependencies)
*   [Comparing React and Angular Secure Coding Practices](https://snyk.io/blog/comparing-react-and-angular-secure-coding-practices/)
*   [84% of all websites are impacted by jQuery XSS vulnerabilities](https://snyk.io/blog/84-percent-of-all-websites-impacted-by-jquery-xss-vulnerabilities/)

_Originally published at_ [_https://snyk.io_](https://snyk.io/blog/comparing-react-and-angular-secure-coding-practices/) _on October 30, 2019._