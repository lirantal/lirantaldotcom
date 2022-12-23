---
title: "Drupal Performance Tips: know your database"
description: >-
    speed performance and how to Drupal optimize for better results and server response time.
date: '2014-12-15'
pubDate: '2014-12-15'
categories: []
keywords: []
tags: ['drupal', 'database']
image: ~/assets/images/blog/photo-1468956398224-6d6f66e22c35.jpg
---

In the spirit of the computer video game [Doom](http://doom.wikia.com/wiki/Doom) and its [skill levels](http://doom.wikia.com/wiki/Skill_level), we’ll review a few ways you can improve your [Drupal](http://drupal.org/) speed performance and optimize for better results and server response time. These tips that we’ll cover may be at times specific to Drupal 6 versions, although you can always learn the best practices from these examples and apply them on your own code base.

![Doom](/images/blog/doom2.jpg)

Doom skill levels: (easiest first)

## Database indexes and SQL queries

[![drupal_perf-1](/images/blog/drupal_perf-1.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-1.png)

**This post is rated “I’m too young too die” difficulty level**.

[Drupal](http://drupal.org/) 6 shipped with all tables being  [MyISAM](http://drupal.stackexchange.com/questions/20893/drupal-database-innodb-or-myisam), and then Drupal 7 changed all that and shipped with all of its tables using the  [InnoDB](http://drupal.stackexchange.com/questions/20893/drupal-database-innodb-or-myisam) database engine. Each one with its own  [strengths and weaknesses](https://www.drupal.org/node/1553474)  but it’s quite clear that InnoDB will probably perform better for your Drupal site (though it has quite a bit of fine tuning configuration to be tweaked on my.cnf).

Some modules, whether on Drupal 6, or those on Drupal 7 that simply upgraded but didn’t quite review all of their code, might ship with queries like  [SELECT COUNT() which if you have migrated your tables to InnoDB (or simply using Drupal 7) then this will hinder on database performance](http://www.percona.com/blog/2006/12/01/count-for-innodb-tables/). That’s mainly because InnoDB and MyISAM work differently, and where-as this proved as quite a fast responding query being executed on a MyISAM database which uses the main index to store this information, for InnoDB the situation is different and will result in doing a full table scan for the count. Obviously, on an InnoDB configuration running such queries on large tables will result in very poor performance

[![drupal_perf-5](/images/blog/drupal_perf-5.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-5.png)

Note to ponder upon – what about the Views module which uses similar type of COUNT() queries to create the pagination for its views?

## Removing unused modules

If you’re using a  [Drupal](http://drupal.org/) [distribution](https://www.drupal.org/documentation/build/distributions) which is great for kick-starting a project with many features built-in, you should still review added modules which are managed through the  [installation profile](https://www.drupal.org/node/306267)  as they might prove un-necessary for your product as time goes and your product evolves and matures. Remember that even if you’re not using a distribution, you might have added some modules to meet a functionality, which you no longer use and you disabled through CSS, through the menus, through the theme, but you forgot all about removing the actual module. These un-used modules account for memory footprint as they are loaded through PHP and they can also account for Drupal hooks, which is even worse in terms of performance for you.

Remember to  **review your installed modules base on Drupal**  and remove any un-used functionality:

[![drupal_perf-2](https://web.archive.org/web/20150206054454im_/http://enginx.com/wp-content/uploads/2014/11/drupal_perf-2.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-2.png)[  
](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-1.png)

## Replace views blocks with vanilla blocks

When we start out building  [Drupal](https://www.drupal.org/) websites, we gradually build functionality and a common use case is creating a view, then you might want to create some blocks, very much related to the view, so you create a block view using the  [Views](https://www.drupal.org/project/views) module. Then you maybe combine it with  [Panels](https://www.drupal.org/project/panels) or  [Context](https://www.drupal.org/project/context), it doesn’t really matter, but essentially you’ve been using the UI tools which are for ease of use, and the overhead for that lies in quite a bit of abstraction layer which later may cost in performance. Replacing the quicklinks and help and support blocks that were used in our theme’s sidebar from being a view based block to a simple programmatiaclly created block implementation proved to reduce a sizzling amount of ~200ms to ~2ms of server time spent on doing the same operation. That accounted for about ~200ms of page load time redduction for each page load, as this item was featured in many pages consistently on our theme.

[![drupal_perf-3](https://web.archive.org/web/20150206054517im_/http://enginx.com/wp-content/uploads/2014/11/drupal_perf-3.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-3.png)

## know your DB engines

[Drupal](http://drupal.org/) 6 shipped with all tables being  [MyISAM](http://drupal.stackexchange.com/questions/20893/drupal-database-innodb-or-myisam), and then Drupal 7 changed all that and shipped with all of its tables using the  [InnoDB](http://drupal.stackexchange.com/questions/20893/drupal-database-innodb-or-myisam) database engine. Each one with its own  [strengths and weaknesses](https://www.drupal.org/node/1553474)  but it’s quite clear that InnoDB will probably perform better for your Drupal site (though it has quite a bit of fine tuning configuration to be tweaked on my.cnf).

Some modules, whether on Drupal 6, or those on Drupal 7 that simply upgraded but didn’t quite review all of their code, might ship with queries like  [SELECT COUNT() which if you have migrated your tables to InnoDB (or simply using Drupal 7) then this will hinder on database performance](http://www.percona.com/blog/2006/12/01/count-for-innodb-tables/). That’s mainly because InnoDB and MyISAM work differently, and where-as this proved as quite a fast responding query being executed on a MyISAM database which uses the main index to store this information, for InnoDB the situation is different and will result in doing a full table scan for the count. Obviously, on an InnoDB configuration running such queries on large tables will result in very poor performance

[![drupal_perf-5](https://web.archive.org/web/20150206054445im_/http://enginx.com/wp-content/uploads/2014/11/drupal_perf-5.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-5.png)

Note to ponder upon – what about the Views module which uses similar type of COUNT() queries to create the pagination for its views?

## be humble on hook_init()

[Drupal](https://www.drupal.org/) is known for its plethora of  [hooks](https://www.drupal.org/node/292), and their use is abundant through-out any Drupal modules to plug into the way that Drupal works. That’s fine, though once you’ve decided you’re moving on with Drupal as your live web application/website and you’re using modules from the eco-system, that is when you need to spend some more time reviewing modules a little bit closer than just their download counts or issues on drupal.org

[hook_init](https://api.drupal.org/api/drupal/developer%21hooks%21core.php/function/hook_init/6)() runs on every page load. Imagine you’re having a few modules implementing this hook, then you already have impact on your server response time performance for every page access in Drupal. Maybe those modules have a very slight overhead there, maybe that’s part of what they do, and that’s fine, but it may at times benefit you to review and investigate if the code there, that maybe your team added too, is better being re-factored to some other place and not on every page load.

There is another perspective for it of course, maybe things do need to take place on every page load, but their implementation in the code might be faulty. Imagine you’re doing some expensive IO on every page load, like calling an API, or querying a heavy table. Maybe you can re-factor to cache this information?

[![drupal_perf-4](https://web.archive.org/web/20150206054438im_/http://enginx.com/wp-content/uploads/2014/11/drupal_perf-4.png)](http://enginx.com/wp-content/uploads/2014/11/drupal_perf-4.png)
