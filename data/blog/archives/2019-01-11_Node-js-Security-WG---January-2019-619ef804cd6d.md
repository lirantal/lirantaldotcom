---
title: Node.js Security WG — January 2019
description: >-
  In an effort to better promote and increase engagement in the Node.js Security
  WG we would like to share highlights more often, ideally…
date: '2019-01-11T16:01:00.857Z'
categories: []
keywords: []
tags: []
slug: node-js-security-wg-january-2019-619ef804cd6d
pubDate: '2019-01-11T16:01:00.857Z'
image: ~/assets/images/blog/cc1fafc5281c59bdf6d9d34274ea4b4c.jpeg
---

![](/images/blog/1__aEtCWWEnTDEsURL8GOuevA.jpeg)

In an effort to better promote and increase engagement in the [Node.js Security WG](https://github.com/nodejs/security-wg) we would like to share highlights more often, ideally each quarter, in the following areas:

1.  Agenda — topics that we discuss and make their way into formal processes.
2.  Security Reports Spotlight — sharing vulnerability reports for a selected set of modules or areas in the Node.js ecosystem or Node.js core project.
3.  Celebrating new WG members or other general announcements.

### Quarterly Agenda Topics

#### 1\. Security Bounty Program for Node.js Core and Ecosystem

We have two HackerOne programs that are on track, a third-party modules ecosystem where we triage reports for modules found on npm as well as a Node.js core program for security vulnerabilities reported directly on the Node runtime.

Statistics with regards to the ecosystem program:

*   95 reports written by 17 hackers have been handled
*   84% of reports have been accepted as valid
*   8% were not applicable

Overall, the quality of reports is pretty high and a solid base of hackers help keep the ecosystem safe. However, most reports only concern very low popularity modules (less than 100 download a month).

Statistics with regards to the Node.js core program:

*   Only 3 reports by 2 hackers have been resolved
*   15% of reported issues are actually valid security bugs
*   60% of reports were considered as not valid

The Node.js core program is in pretty good health, although most reports are not found to be valid regarding the scope of the program. Still, hackers show a great enthusiasm toward this program.

Since this program can award bounties to hackers thanks to the [Internet Bug Bounty](https://internetbugbounty.org/), hacker community is paying more attention to Node.js core.

Overall, both programs are still pretty young (less than 1 year old) but we can expect them to grow further in the future.

— By [Vladimir de Turckheim](https://twitter.com/poledesfetes) ([https://github.com/vdeturckheim](https://github.com/vdeturckheim))

#### 2\. Machine Readable Format for Vulnerabilities

One of the key activities for the Security WG is disclosure triaging and organizing the processes around security vulnerabilities for Node.js core and the ecosystem. The end result of that process is a maintainable and up-to-date [vulnerability database](https://github.com/nodejs/security-wg/tree/master/vuln) that can be freely queried and inspected by individuals and organizations to assert whether Node.js, or a package of specific version is vulnerable.

This means that the vulnerability database is expected to be consumed in a programmable manner, and one that makes it rather easy and clear to fetch metadata without having to create wrappers on the report such as parsing the author field of a report to extract the email address.

To enable that, we’ve set out to update the vulnerability report format so that it is easy for individuals to consume it ([https://github.com/nodejs/security-wg/issues/200](https://github.com/nodejs/security-wg/issues/200)) via programmatic APIs and we are collecting feedback from the community on that.

The feedback we gathered so far has been instrumental in merging several improvements already and there’s room to express opinions for more topics so this is an open invite to further participate in the Security WG repository ([https://github.com/nodejs/security-wg](https://github.com/nodejs/security-wg)) if this topic interests you.

Example report:

![](/images/blog/0__w3FyNeoAoT7FNcE8.jpg)

— By [Liran Tal](https://twitter.com/liran_tal) ([https://github.com/lirantal](https://github.com/lirantal))

#### 3\. Nodejs.org now has a SECURITY.TXT

Node.js has joined a growing number of projects that use the methodology of [security.txt](https://securitytxt.org/) files, an emerging standard that helps organizations describe the process for security researchers to disclose vulnerabilities in a secure manner.

Security researchers need a way to responsibly disclose their findings to affected companies and website owners. Sometimes this is not easy and requires researchers to find their way through support ticketing systems or use social media to reach out to corporate security teams. security.txt files seek to close this gap by providing all the information need to disclose a security vulnerability in one place at a well-known location.

The information provided usually includes an e-mail contact with an optional PGP key to encrypt sensitive disclosure details, as well as a link to the vulnerability disclosure policy file and possibly also to security researchers’ hall of fame.

Node.js security.txt file can be found here: [https://nodejs.org/.well-known/security.txt](https://nodejs.org/.well-known/security.txt)

— By [Marcin Hoppe](https://twitter.com/marcin_hoppe) ([https://github.com/MarcinHoppe](https://github.com/MarcinHoppe))

### Node.js Core Security News

The prior year ended with security updates for all maintained Node.js versions were released in November 2018. Many thanks to those who reported and helped resolve the issues:

*   Matteo Collina for a significant amount of work fixing vulnerabilities.
*   Sam Roberts for the OpenSSL upgrades, other code contributions and assisting in the preparation of these releases.
*   Ben Noordhuis, Fedor Indutny and Benno Fünfstück for code contributions.
*   Trevor Norris, Jan Maybach, Martin Bajanik, Arkadiy Tetelman for reporting vulnerabilities.

One of the important changes to the HTTP module in the recent Node.js 10.14.0 release was [lowering the limit](https://github.com/nodejs/node/commit/186035243fa) for the maximum HTTP header size across all release lines, including LTS, which turned out to be [problematic for some users](https://github.com/nodejs/node/issues/24692). A series of patch releases followed to allow the limit to be configurable at run-time.

See [https://nodejs.org/en/blog/vulnerability/november-2018-security-releases](https://nodejs.org/en/blog/vulnerability/november-2018-security-releases) for more information.

2018 was also the year when someone used social engineering to gain control of a popular module distributed via npm and [inject malicious code](https://thehackernews.com/2018/11/nodejs-event-stream-module.html) into it. One positive outcome of this is a heightened interest in how packages are maintained, and what the Node.js community can do to help. The Package Maintenance group was already forming to [coordinate work on the important issue of package maintenance](https://medium.com/@nodejs/call-to-action-accelerating-node-js-growth-e4862bee2919). The wide publicity around this incident accelerated interest in it.

— By Sam Roberts ([https://github.com/sam-github](https://github.com/sam-github))

### Security Reports Spotlight

Selected reports by various bug hunters:

*   [chalker](https://twitter.com/skovorodan) — **base64-url** below 2.0 allocates uninitialized Buffers when number is passed in input [https://hackerone.com/reports/321692](https://hackerone.com/reports/321692)
*   patrickrbc — Unrestricted file upload (RCE) in **express-cart** [https://hackerone.com/reports/343726](https://hackerone.com/reports/343726)
*   [tunkpun](https://twitter.com/tungpun_) — **serve** directory listing and file access even when they have been set to be ignored [https://hackerone.com/reports/330650](https://hackerone.com/reports/330650)
*   [defmax](http://nbsriharsha.blogspot.com/) — Command injection in **pdf-image** [https://hackerone.com/reports/340208](https://hackerone.com/reports/340208)
*   bl4de — **query-mysql** SQL Injection due to lack of user input sanitization allows to run arbitrary SQL queries when fetching data from database [https://hackerone.com/reports/311244](https://hackerone.com/reports/311244)

### Thank You Bug Hunters!

We’d like to extend our gratitude to the ethical hackers and security researchers who volunteer their time to help make the Node.js ecosystem more secure by submitting security reports for vulnerabilities discovered in Node.js core or 3rd party modules (npm).

![](/images/blog/0__2glAe__8ZfLN5KriE.jpg)
![](/images/blog/0__zVp__YGCCdfiLfaqX.jpg)

### New WG Members

In the 2nd half of 2018 we also celebrated the addition of the following members to the Ecosystem Triage team:

*   [Alex Knol](https://github.com/Elexy)
*   [Marcin Hoppe](https://github.com/MarcinHoppe)
*   [Matt Austin](https://github.com/matt-)

We’re happy you joined us!

—

Interested in learning more about the Security WG activities?  
Get involved: [https://github.com/nodejs/security-wg](https://github.com/nodejs/security-wg)