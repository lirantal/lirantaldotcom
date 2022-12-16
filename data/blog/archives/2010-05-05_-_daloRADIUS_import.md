---
title: "daloRADIUS new feature: Import CSV Users"
description: >-
    Auth-type based users import from CSV
date: '2010-05-05'
pubDate: '2010-05-05'
categories: []
keywords: []
tags: ['daloradius']
image: ~/assets/images/blog/photo-1468956398224-6d6f66e22c35.jpg
---

About 8 months ago we added a feature option to the `Management -> Users pages` to allow importing of users in the format of CSV (easy exporting from excel if you already manage it with that and a common method in general).

When importing users, you may force associating them with a `Profile` (group) and a `Plan`. Moreover it’s possible to mark these users as mac-based users so an `Auth-Type := Accept` attribute is automatically added.

