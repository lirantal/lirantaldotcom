---
title: A Snyk peek into Node.js and npm’s state of open source security report 2019
description: >-
  In the State of Open Source Security Report 2019, we set out to measure the
  pulse of the open source security landscape throughout the…
date: '2019-10-09T14:05:00.000Z'
categories: []
keywords: []
tags: []
slug: >-
  a-snyk-peek-into-node-js-and-npms-state-of-open-source-security-report-2019-2209a5adc1e0
pubDate: '2019-10-09T14:05:00.000Z'
image: ~/assets/images/blog/862777f77ae5e16d5fa7285b288f7caa.jpeg
---

In the [State of Open Source Security Report 2019](https://snyk.io/stateofossecurity/), we set out to measure the pulse of the open source security landscape throughout the different language ecosystems and have analyzed responses from over five hundred open source maintainers and users who provided us with insights into their processes and knowledge of open source security risks as well as the skill level of the average maintainer.

In addition to gaining insights from survey takers, we also analyzed data from multiple public and private sources, including Snyk’s own vulnerability database, to evaluate how security issues differ across languages, how fast it takes users to adopt version upgrades that provide security fixes, and much more. In this year’s report, we also investigated how vulnerabilities impact Docker users, and what you should know to mitigate the security risk.

[Run a quick test](https://snyk.io/test) to check for known vulnerabilities in public GitHub repos and npm packages.

### The npm ecosystem

When we checked the Snyk vulnerability database, we identified several vulnerability types that have a unique and significant presence in the JavaScript & Node.js ecosystems. The first family of vulnerability types is Path and Directory Traversal which stand out in the npm ecosystem, with record numbers for both 2017 and 2018–146 and 143 disclosures respectively. The other ecosystems are much further behind, or do I mean ahead? Either way, having less vulnerabilities reported is a good thing for them!

Hundreds of these vulnerabilities can be attributed to the security research work that Snyk performed in collaboration with [Liang Gong](https://github.com/JacksonGL), a security researcher at Facebook and CS Ph.D. at Berkeley. The research uncovered tens of Directory Traversal vulnerabilities in the npm ecosystem. Furthermore, the research showed that static and dynamic web servers are commonly found in the npm registry, as this is a repeating need for many developer use-cases.

![](/images/blog/0__cebwWse7wKzRuF3w.png)

Another interesting vulnerability type is one that is almost completely unique to Node.js, called Regular Expression Denial of Service (ReDoS). This kind of attack exploits the non-linear worst-case complexity vulnerabilities that some regex patterns can lead to. For a single-threaded runtime, this could be devastating, and this is why Node.js is significantly affected by this type of vulnerability. This may of course change with the increase in popularity we’re seeing among serverless technologies. A pay-per-use model will mean that a ReDoS attack will cause a dynamic scaling of the system which could lead to an expensive outcome for the service owner — a Denial of Funding situation perhaps!

The Node.js runtime is known to have many strengths. The single threaded event-loop is one, and this can also be its weakest link when used incorrectly. This happens more regularly than one might think. In a March 2018, a security release of the official Node.js runtime included a patch to fix a high severity ReDoS vulnerability in the core path module, which affected the Node.js 4.x release lines. The fix for the vulnerability that was found by [James Davis](https://twitter.com/thedavisjam) of Virginia Tech was also ported to Node.js 6.x and later versions to mitigate the problem.

To emphasize how unique this vulnerability is to Node.js we examined other ecosystems between the years of 2016 to 2019 and found that PHP had only one ReDoS vulnerability reported in 2017. The Java and Ruby ecosystems each saw one vulnerability reported in 2018. Node.js, on the other hand, had 116 vulnerabilities in total reported over the last three years, and the rate of disclosure is showing a growing trend. That said, it’s important to distinguish between vulnerabilities that exist in code versus vulnerabilities that are actually reported. These numbers do not provide insight about the number of vulnerabilities that were added into code-bases during this time, but rather how many were discovered and eliminated from code bases. We could equally have looked at this graph and been pleased that focus is being put on finding and eliminating ReDoS vulnerabilities, as this would mean that we are likely to see fewer issues in the wild going forward.

![](/images/blog/0__lufb49va7JucSMHI.png)

[Continue reading](https://snyk.io/opensourcesecurity-2019/) on more findings of the report

_Originally published at_ [_https://snyk.io_](https://snyk.io/blog/a-snyk-peek-into-node-js-and-npms-state-of-open-source-security-report-2019/) _on October 9, 2019._