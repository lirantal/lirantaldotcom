---
title: Interview with Liran Tal, author of daloRADIUS
description: >-
  daloRADIUS is a web application written in PHP with the purpose to manage a RADIUS (Remote Authentication Dial In User Service) deployment, suited for both WISPs (Wireless Internet Service Providers) and Hotspots.
date: '2008-06-23'
pubDate: '2008-06-23'
categories: []
keywords: []
tags: ['daloradius', 'opensource', 'wifi', 'radius']
image: ~/assets/images/blog/photo-1648413344466-93666a521e74.jpg
canonical: http://fsmsh.com/2910
---

**Hello Liran. Thank you for answering our questions! First of all, you are the main developer of daloRADIUS... What is it in very simple terms?**

daloRADIUS is a web application written in PHP with the purpose to manage a RADIUS (Remote Authentication Dial In User Service) deployment, suited for both WISPs (Wireless Internet Service Providers) and Hotspots.

![](http://freesoftwaremagazine.com/articles/interview_liran_tal_author_daloradius/daloradius_logo.jpg)

daloRADIUS' logo

I am the lead developer but the truly great help from users is simply priceless. I doubt I would have had the strength to continue development as far as I have without the amazing support from my users.

**When did you start developing it?**

Last year, a while before the first release I started working on several WISP projects. Prior to that I was dealing a lot with many components of the Access Cloud of an ISP: the l2tpns project for IPSec L2TP VPNs, SSL-Explorer for web VPNs, FreeRADIUS and some other software. I was quickly deploying setups here and there and started looking for a good way of managing users.

I found dialupadmin -- which comes bundled with FreeRADIUS -- and later phpradadmin. I initially joined the latter project but found it wasn't developing the way I thought it should have. The author was very rigid about the design ( something I can definitely relate to now! ), so I quit.

I started developing daloRADIUS after that. Even though I had prior experience with other software projects on and off SourceForge, having something built from zero and growing with it along with the community is simply priceless. It's like my baby!

**How far do you feel the project's gone since its beginning?**

I feel that it has gone a very long way since it began (mid-2007). It is definitely more mature and stable for production deployment now. I even know of a couple of medium-large enterprises which deployed it and the positive and constructive feedback fuels my appetite for more development and professional features.

**How much help did you receive from the community? Do you get a good number of patches? Or is it mainly bug reports?**

Some users provide patches here and there, most of them have been pushed into SVN with no trouble (I'm a very open minded guy). I would say that most of the feedback from the community regarding development is based on bug reports and feature requests rather than actual development.

I feel that I really need to credit a few guys who joined me right from the start with amazing support, in particular these are Giso Kegal, Carlos Cesario and Evgeniy Kozhuhovskiy who have adopted daloRADIUS from the very beginning and helped the development by adding language translation support (which is a remarkable effort) as well as other features and bug fixes.

**What are the competing projects? What are, in your opinion, their strengths and their weaknesses?**

The competing projects are probably dialupadmin, phpmyprepaid and hotcakes.

Dialupadmin is good on basic and straight-forward administration but it lacks innovative features and its development has been on hold for a couple of years.

Phpmyprepaid is something that I haven't used but I did see it here and there and its set of features is rather limited to only serve Hotspots. I would say that its upside is that it's straight to the point--add/edit/delete users, configure billing plans, and that's about it. Though this is just from what I have seen on users deployments and from my experience with their website documentation so I could be missing a couple of things.

![](http://freesoftwaremagazine.com/articles/interview_liran_tal_author_daloradius/photo1.jpg)

Liran Tal with his partner Tal Daloya (no, it's no coincidence that her name is very similar to the software's name!)

Hotcakes is a nice attempt at achieving more complete management: it doesn't just add/delete users but rather supports dictionaries, and more freeradius related settings like realms, proxies, NAs, etc... The good side is that it also managed to get a good billing platform integrated in the software; however, I think the down side is that it's built on-top of another PHP framework which complicates things like installation and dependencies.

**In a nutshell, what are daloRADIUS' advantages in your opinion?**

daloRADIUS was definitely a pioneer. I have seen several projects grow up from daloRADIUS and others keeping up the pace by "borrowing" ideas from daloRADIUS. I believe daloRADIUS is strong because it is based on a solid foundation of management platform and, on top of that, it provides the extra features that give it the spin such as Accounting, Reports, Graphs, a built-in Hotspot management integrated with GoogleMaps for GIS and general Maintenance.

Another benefit is that daloRADIUS is solidly based on PHP and the PHP-DB package; unlike other projects, it doesn't require any framework to be installed (like cakephp or others). The interface itself is very professional, mostly based on a single CSS file which makes it ideal for commercial and non-commercial parties to adopt it and deploy it almost immediately.

![](http://freesoftwaremagazine.com/articles/interview_liran_tal_author_daloradius/screenshot.jpg)

Adding attributes to a new group profile

The best part of daloRADIUS in my opinion is the great community of users and the open mind that I keep regarding user feedback. I answer emails almost immediately (within a couple of hours) and I think that I can honestly say that 95% of the requests for features and changes that I received from users have gone into the official release.

**What about daloRADIUS' billing support?**

daloRADIUS' billing support is a little basic. Other projects have immediately provided support for billing; in my case, I added an initial support for it and quickly realized it would be best to focus on the management side and go back to billing later.

At one point I began to wonder if it would be best to take out the billing part altogether and work out an integration with a 3rd party application, such as CitrusDB. I exchanged a few emails with CitrusDB's maintainers but it didn't lead to anything constructive; hopefully in the near future, I will be able to devote more development time for better billing support in daloRADIUS.

**Have you been able to monetarise on this project?**

I haven't received any donations yet; this is unfortunate, as it would be a nice token of appreciation. I did receive numerous proposals for contract work to integrate daloRADIUS within Hotspots systems or even design the network and provide deployment of the entire installation base (freeradius, mysql, daloradius, chilli/other vendors, etc). I often had to refuse work contracts because the amount of work meant it would have seriously affected the main development of daloRADIUS. I'm very happy with the success that the project integration has showed.

**Do you think free software users can expect it to be maintained in the longer term?**

Definitely. I have never said no to a user who has requested a feature unless I thought it was more a customization request that only fit that particular user. On the contrary, I'm always on the look-out for improving the software and code-base and keeping up with users requirements. I truly believe that free software is an amazing thing and I will always keep daloRADIUS this way, at least for the core of it; commercial forks are a good thing for companies who require more customized work and a company to be behind the product to offer on-demand support (as opposed to community response via forums, mailing list, IRC, etc.).

---

-   BY  [TONY MOBILY](http://freesoftwaremagazine.com/authors/Tony%20Mobily)  IN  [INTERVIEWS](http://freesoftwaremagazine.com/sections/interviews)
-   6/23/2008
-   [PERMALINK](http://fsmsh.com/2910)
-   TAGS:  [INTERVIEW](http://freesoftwaremagazine.com/tags/interview)  [RADIUS](http://freesoftwaremagazine.com/tags/radius)

> License
> Verbatim copying and distribution of this entire article are permitted worldwide, without royalty, in any medium, provided this notice is preserved.
