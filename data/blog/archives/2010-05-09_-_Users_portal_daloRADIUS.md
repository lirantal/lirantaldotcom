---
title: "daloRADIUS Users Portal changes"
description: >-
    Users portal login changes related to authentication
date: '2010-05-09'
pubDate: '2010-05-09'
categories: []
keywords: []
tags: ['daloradius']
image: ~/assets/images/blog/photo-1468956398224-6d6f66e22c35.jpg
---

The old way of users to authenticate to the users portal by checking against their set password in the `radcheck` table is deprecated (which is not good for `pin-cards` or `mac-based` users since the `auth-type` would be accept instead of a password attribute).

The new is that you set for the user a password and toggle whether the user is permitted to login or not (and possibly also to update his contact settings)

![](https://web.archive.org/web/20140703115537im_/http://www.daloradius.com/images/screenshots/new_feature-users_portal_login.png)