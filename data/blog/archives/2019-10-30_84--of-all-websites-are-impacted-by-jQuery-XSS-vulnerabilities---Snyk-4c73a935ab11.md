---
title: 84% of all websites are impacted by jQuery XSS vulnerabilities
description: >-
  This article is from Snyk’s State of JavaScript frameworks security report
  1.    In this blog post we’ll review security vulnerabilities…
date: '2019-10-30T00:01:26.000Z'
categories: []
keywords: []
tags: []
slug: >-
  84-of-all-websites-are-impacted-by-jquery-xss-vulnerabilities-snyk-4c73a935ab11
pubDate: '2019-10-30T00:01:26.000Z'
image: ~/assets/images/blog/2cb70ed5b1b503992216c3b92cbc796f.jpeg
canonical: https://snyk.io/blog/84-percent-of-all-websites-impacted-by-jquery-xss-vulnerabilities/
---

In this blog post we’ll review security vulnerabilities found in other frontend ecosystem projects.

After reviewing Angular and React as major JavaScript frameworks, we’ll take a brief review of selected JavaScript and CSS frameworks: Vue.js, jQuery and Bootstrap.

[![](https://cdn-images-1.medium.com/max/800/0*gZdcnvDzxxzIQzH_.png)](https://bit.ly/js-security-report)

### jQuery security

jQuery took web development by storm a decade ago but since then web development have been revolutionized further with single page application technologies such as Angular, and React. That said, according to W3Techs which regularly run surveys and report on web technology usage jQuery is being used within 73% of websites they scanned in August 2019.

A Snyk study from 2017 further amplifies this when it reported that [77% of sites use at least one vulnerable JavaScript library](https://snyk.io/blog/77-percent-of-sites-still-vulnerable/) and pointed out jQuery was detected in 79% of the top 5,000 URLs from Alexa. If you’re still not convinced, npm’s downloads for the jQuery npm module account to 120,641,977 for the last 12 months alone.

In total, we tracked six security vulnerabilities affecting jQuery across all of its releases to date, four of which are medium severity Cross-Site Scripting vulnerabilities, one is a medium severity Prototype Pollution vulnerability, and lastly, one is a low Denial of Service vulnerability. If you’re not using jQuery 3.4.0 and above which was released only recently, on 10th of Apr, 2019, then you are using vulnerable jQuery versions.

![](/images/blog/0__XJZyzJ4cg3bP__Pn7.png)

Since jQuery is usually found in web applications as a legacy component it is important to also understand its version usage patterns and their state of security.

W3Techs reports that of all websites using jQuery, it’s 1.x release is dominating with 83.4% of share and version 2 and 3 lag far behind with roughly 8% of all jQuery usage. When looking at the known security vulnerabilities and map them out to jQuery versions we found that four medium severity Cross-Site Scripting vulnerabilities are affecting jQuery v1 which is potentially concerning considering the 83.4% market share for anybody not employing software composition analysis to find and fix vulnerabilities in their open source components.

Many websites and web applications will further make use of jQuery libraries to extend the capabilities of jQuery and will turn to community- powered libraries to do so.

We found 13 vulnerable jQuery libraries as provided in the following table and offer the following observations:

*   Three jQuery libraries are malicious versions of open source community modules. As we can’t account for the downloads of the actual vulnerable versions since this isn’t available from the npm registry, we should call out jquery.js which is a malicious package and accounted for 5,444 downloads in the past 12 months.
*   jQuery libraries [jquery-mobile](https://snyk.io/vuln/npm:jquery-mobile), [jquery-file-upload](https://snyk.io/vuln/npm:jquery-file-upload) and [jquery-colorbox](https://snyk.io/vuln/npm:jquery-colorbox) account to more than 340,000 downloads in the past 12 months, despite including Arbitrary Code Execution and Cross-Site Scripting security vulnerabilities and not having any upgrade path to remediate them.

[![](https://cdn-images-1.medium.com/max/800/1*9MqP5WaRjPvF-0iAOKLR3g.png)](https://snyk.io/blog/84-percent-of-all-websites-impacted-by-jquery-xss-vulnerabilities/)

\*malicious packages have no fix information.

I **highly recommend** **to download** the [full version of the report](https://bit.ly/js-security-report) in its digital format, but have also made the following general sections available as blog posts:

*   [The state of JavaScript frameworks security report 2019](https://snyk.io/blog/javascript-frameworks-security-report-2019/)
*   [Angular vs React: Security Bakeoff 2019](https://snyk.io/blog/angular-vs-react-security-bakeoff-2019)
*   [2019 Side by Side Comparison of Angular and React Security Vulnerabilities](https://snyk.io/blog/2019-side-by-side-comparison-of-angular-and-react-security-vulnerabilities)
*   [Angular vs React: The Security Risk of Indirect Dependencies](https://snyk.io/blog/angular-vs-react-the-security-risk-of-indirect-dependencies)
*   [Comparing React and Angular Secure Coding Practices](https://snyk.io/blog/comparing-react-and-angular-secure-coding-practices/)
*   [84% of all websites are impacted by jQuery XSS vulnerabilities](https://snyk.io/blog/84-percent-of-all-websites-impacted-by-jquery-xss-vulnerabilities/)
