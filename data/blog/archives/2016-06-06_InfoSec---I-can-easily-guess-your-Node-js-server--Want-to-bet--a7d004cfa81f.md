---
title: InfoSec — I can easily guess your Node.js server! Want to bet?
description: >-
  With the hope of raising awareness on information security topics, and the
  openness of the web I would like to take one step further to…
date: '2016-06-06T09:21:56.710Z'
categories: []
keywords: []
tags: []
slug: infosec-i-can-easily-guess-your-node-js-server-want-to-bet-a7d004cfa81f
pubDate: '2016-06-06T09:21:56.710Z'
image: ~/assets/images/blog/fd5de900677f061ad9a7f3e5d5924058.jpeg
---

With the hope of raising awareness on information security topics, and the openness of the web I would like to take one step further to show how a basic configuration can help secure your Node.js web application.

#### Your Web Server Says hello!

A web server is commonly reporting about itself and tells the world its name and version. It does that by replying with a response header of X-Powered-By, for example: _X-Powered-By: PHP/5.6_

So the most common thing that frameworks in Node.js do is to remove this HTTP header. That is usually done using Helmet or ExpressJS built-in option, such as:

![](/images/blog/0__Qc8uhGW4do__6etmk.)

or:

![](/images/blog/0__1F4Ae45pUsqOhmKf.)

That’s fine, but it’s not enough.

If you use cookies, then you probably use one of the most popular middleware `_express-session_` which will has a default cookie name of `_connect.sid_`.

If you’re using some framework that wraps your whole application structure then you probably didn’t even dive deep there to review all the configurations and update this default setting.

#### The Danger Zone

The danger of leaving this cookie name as is comes from the fact that you are disclosing sensitive information on which environment and server details you are running your web application. Which in turn, help attackers target their exploit automation, or manual pen-tools tailored to your setup.

#### A Model of Open Source

The OWASP wiki has a lot of details related to information security and maintains a Cookies Database list where you can find out about all of the common names and extrapolate the web server environment details.

Once I sneak peaked at it I didn’t find the Node.js reference of the cookie name and then simply updated the wiki page to maintain an up to date list.

![](/images/blog/0__RJscSc1fSJfcXIRF.)

Sharing information is important to keep security up to date.

Also, I invite you to read my newly published book [Essential Node.js Security](http://bit.ly/securenodejs)

![](/images/blog/1__1WPY7__gXrww5uoF0ZEF3BA.png)