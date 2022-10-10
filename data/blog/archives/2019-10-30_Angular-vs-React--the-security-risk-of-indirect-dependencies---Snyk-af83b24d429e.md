---
title: 'Angular vs React: the security risk of indirect dependencies | Snyk'
description: >-
  This is a blog mirror of Snyk’s State of JavaScript frameworks security report
  2019.
date: '2019-10-30T00:01:37.000Z'
categories: []
keywords: []
tags: []
slug: angular-vs-react-the-security-risk-of-indirect-dependencies-snyk-af83b24d429e
pubDate: '2019-10-30T00:01:37.000Z'
image: ~/assets/images/blog/d9ebc36b73eb2a4e4cbdfd11dc796714.jpeg
---

This is a blog mirror of [Snyk’s State of JavaScript frameworks security report 2019](https://snyk.io/blog/javascript-frameworks-security-report-2019/).

In this section, we review the security risk of the indirect independencies for both Angular and React, and then we also review the direct dependencies, first for Angular and then for React.

The modules reviewed in this part do not represent a complete list of vulnerable React and Angular modules; some modules may have special naming conventions (such as all modules prefixed , , or for example) that would not appear in the pattern-based search we conducted.

### The security risk of indirect dependencies

More often than not, projects based on React or Angular are generated with a scaffolding tool that provides a boilerplate with which to begin developing. With React, the developer go-to practice is to use the **create-react-app** npm package that creates a pre-configured project starting point, such as by implementing the Jest testing framework, CSS processors and other already built-in tooling. In Angular, this is made possible thanks to the **@angular/cli** npm package.

To compare the dependency health and state of the security (which reflect the level of overall security risk) for React and Angular boilerplates, we generated a sample project which resulted in rather good news — both of them include development dependencies with vulnerabilities, but neither contain any production dependency security issues.

Following are the security vulnerabilities that are introduced in your code right from the get-go when starting a project by using the Angular or React boilerplate:

It’s worthy to note that Angular relies on 952 dependencies, which contain a total of two vulnerabilities; React relies on 1257 dependencies, containing three vulnerabilities and one potential license compatibility issue.

### A note about software licenses in open source

With regards to licensing, we consider license compliance to be an important factor in overall dependency health, in addition to security issues, and for this reason include license checks in our scans as well. The results we received for licensing were based on the default configurations that were defined for our license policies prior to scanning.

Based on those results, we can see that the generated React project has a dependency on the mdn-data package, which in turn makes use of Mozilla’s copyleft license MPL-2.0. If you plan to distribute your React application with on-prem installations or other similar setups that include the mdn-data dependency, then you should check licensing requirements to make sure your project complies.

Additionally, we advise ensuring your projects are scanned based on the advice you receive from your organization’s unique policies, which may or may not raise flags for additional indirect dependencies of React as well.

### Remediating vulnerable paths

A path describes how an open source dependency is introduced to your project. For instance, let’s say you have two direct dependencies called Project A and Project B. Both of these projects introduce dependency, Project C. Project C is now associated with two different paths, because it is installed by both Project A and Project B. If Project C includes vulnerabilities, a developer must consider both of these paths in order to remediate the vulnerabilities.

With React, the three vulnerabilities spread over 16,293 vulnerable paths. Remediating the vulnerability via package upgrades becomes a daunting task with so many packages in the dependency chain that require an upgrade. In contrast, both Angular’s vulnerabilities are remediated easily via only two vulnerable paths.

The following image was taken from an August 2019 security scan report for a project generated with React’s create-react-app npm package. The report reveals the dependency chain problem to be addressed for a single security vulnerability.

![](/images/blog/0__TlXimBjBlAlzcOBq.png)

Remediating the vulnerability requires pulling new versions of lodash from every single one of the affected packages in the entire dependency chain.

Due to the prominent usage of lodash throughout the ecosystem, its vulnerable version is ultimately used by thousands of dependency paths.

### Vulnerabilities in the Angular module ecosystem

In the Angular ecosystem, module vulnerabilities manifest themselves in three areas:

*   Angular ecosystem modules
*   Malicious versions of modules
*   Developer tooling When we look at the Angular module ecosystem, we can see the following modules stand out most due to their download counts and associated vulnerabilities:

If we line up the vulnerability types based on the number of downloads of the modules that contain them, we can clearly see that XSS vulnerabilities are at the head of the chart, as is also indicated in the _OWASP Top 10 web security risks to watch out for:_

![](/images/blog/0__Z6N__O__PBRBX1XWrX.png)

### Malicious Angular modules

In total, we were able to track down three malicious versions published for the following angular modules: [angular-bmap](https://snyk.io/vuln/npm:angular-bmap), [ng-ui-library](https://snyk.io/vuln/SNYK-JS-NGUILIBRARY-449527), [ngx-pica](https://snyk.io/vuln/SNYK-JS-NGXPICA-449519).

angular-bmap is perhaps the least interesting as can be observed in its [dependency health page](https://snyk.io/vuln/npm:angular-bmap) — it features eight published versions all date back to September 2017. Nevertheless, a 0.0.9 version of angular-bmap has been published that includes malicious code that exfiltrates sensitive information related to password and credit cards from forms and sends them off to the attacker controlled URL of [https://js-metrics.com/minjs.](https://js-metrics.com/minjs.) php?pl=. This malicious 0.0.9 version has been yanked off of the npm registry.

Unlike the Angular bmap module, [ng-ui-library](https://snyk.io/vuln/SNYK-JS-NGUILIBRARY-449527) is still maintained and features over [150 versions published](https://snyk.io/vuln/npm:ng-ui-library), seven of them in 2019 alone. However, ng-ui-library version 1.0.987 specifically has been found to contain the same malicious code that we’ve seen in angular-bmap. ng-ui-library still gets nearly 400–3000 downloads a month.

Joining the same malicious code that harvests credit card information is a malicious version of [ngx-pica](https://snyk.io/vuln/SNYK-JS-NGXPICA-449519), which is an Angular v5 and Angular v7 compatible module to resize images in the browser, featuring about 800 monthly downloads.

Interestingly enough, all of these malicious versions were only found recently. They were all disclosed in June 2019, even though the malicious code was pushed in a month-old release by that time.

### Angular developer tooling

As part of the module ecosystem findings, we spotted one module that is used as a general- purpose HTTP server for serving single-page application resources for projects built with Angular, React, Vue and others.

The module [angular-http-server](https://snyk.io/vuln/npm:angular-http-server) was found vulnerable to directory traversal — twice. Both vulnerable versions are a year old and there are already a half of a dozen newer versions published. Even though the module maintainer clearly states that it is not recommended to use this tool as a production-ready service, downloads for it have been ramping up this year with a recorded downloads count of 20,670 in May 2019.

Due to the growing adoption of this Angular HTTP server developer tool we should point out that there’s a public exploit for this vulnerability.

### Vulnerabilities in the React module ecosystem

As with Angular, we found that the React ecosystem includes several malicious modules published at some point. The following represents the distribution of security vulnerability types and their counts across all vulnerable modules that we found, highlighting specifically four malicious packages [react-datepicker- plus](https://snyk.io/vuln/npm:react-datepicker-plus), [react-dates-sc](https://snyk.io/vuln/npm:react-dates-sc), [awesome\_react\_utility](https://snyk.io/vuln/SNYK-JS-AWESOMEREACTUTILITY-451009), [react- server-native](https://snyk.io/vuln/SNYK-JS-REACTSERVERNATIVE-450976).

All four malicious modules have the same malicious code that harvests credit card and other sensitive information; this attack compromised modules on the React ecosystem as well.

This goes further to emphasize that as a maintainer of an open source project it is critical to enable multi- factor authentication such as 2FA support that the npm package registry supports, to avoid putting your users at risk of someone else compromising your account and publishing malicious versions of your package.

![](/images/blog/0__jbbA__Yhine99zGBX.png)

If you haven’t done so yet, we urge you to enable 2FA on your npmjs.org developer account and follow other [npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/).

Notable vulnerable modules that we tracked in React’s ecosystem:

*   A high severity XSS vulnerability in [react-marked-markdown](https://snyk.io/vuln/npm:react-marked-markdown) which has no fix available, but this react component wrapper around the [marked](https://snyk.io/vuln/search?q=marked&type=npm) JavaScript markdown library still gets thousands of downloads, totaling 65,790 in the past 12 months.
*   For the preact users among you, the [preact-render-to-string](https://snyk.io/vuln/npm:preact-render-to-string:20180802) library is vulnerable to Cross-Site Scripting in all versions prior to 3.7.2. This library is growing in usage across the last 12 months and totaling in 3,228,049 downloads for this time-frame.
*   If you’re doing tooltips in your frontend React application you might be one of the users of [react-tooltip](https://snyk.io/vuln/npm:react-tooltip) which received just shy of one million downloads (994,903) in July 2019 alone. This library however is vulnerable to Cross-Site Scripting attacks for all versions prior to 3.8.1 as was disclosed in September 2018.
*   If you are working with SVGs a lot, good chances you are using [react-svg](https://snyk.io/vuln/npm:react-svg:20180427) which features 1,446,442 downloads in the past 12 months. In April 2018 a high severity Cross-Site Scripting vulnerability was disclosed by security researcher Ron Perris affecting all versions prior to 2.2.18.
*   A CSV Injection vulnerability in [mui-datatables](https://snyk.io/vuln/SNYK-JS-MUIDATATABLES-174185) disclosed in March 2019. This react library provides a table data related UI component based on the material ui framework and features more than 350,000 downloads in the past 12 months.

When we track all the vulnerable React modules we found, we count eight security vulnerabilities over the last three years with two in 2017, six in 2018 and two up until August 2019. This calls for responsible usage of open source and making sure you find and fix vulnerabilities as quickly as possible.

### Spotlight: Next.js security vulnerabilities

[Next.js](https://nextjs.org/) is the popular React framework delivered from ZEIT, empowering web developers to harness their knowledge of React in order to build SEO-friendly web applications, Server-side rendering applications, Progress Web Applications (PWA) and even Electron- based applications, all based on the Next.js framework.

Next.js continues to gain developer adoption, with 8,414,925 downloads over the past 12 months. As the project continues to grow it becomes increasingly important to take a look at its security status.

We tracked three high Directory Traversal vulnerabilities, and two medium severity Cross-Site Scripting vulnerabilities impacting the Next.js React framework during the course of 2017 through 2018. We should also point out that the ZEIT Security team swiftly addressed all five security vulnerabilities and provided a fix through an upgrade path for the Next.js framework within a week’s time.

Overall, ZEIT employs strong security practices that should be replicated by other open source projects. Particularly notable includes:

*   The team responds quickly to security disclosures by releasing timely security fixes. This translates into a small window during which time there is an actual security risk; ZEIT provides users with an upgrade path so they can quickly mitigate the vulnerability.
*   To avoid security regressions the team has written [security unit tests](https://github.com/zeit/next.js/blob/master/test/integration/production/test/security.js) to ensure that security mistakes do not repeat themselves.
*   Release notes [clearly communicate security-related information](https://github.com/zeit/next.js/releases/tag/7.0.2), its impact and any steps users are required to follow in order to stay up-to-date with a security fix.
*   The project maintains a mailing-list dedicated to security reports, a [responsible disclosure policy](https://zeit.co/security) and a dedicated email contact for reporting issues.

ZEIT and their management of the Next.js framework is a great example of good open source security policies; ZEIT takes matters seriously and demonstrates a true commitment to the overall security of their users with policies and actions that should be adopted by others.

Or download the [full version of the report](https://bit.ly/js-security-report) in its digital format.

_Originally published at_ [_https://snyk.io_](https://snyk.io/blog/angular-vs-react-the-security-risk-of-indirect-dependencies/) _on October 30, 2019._