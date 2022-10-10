---
title: Terrified of NPM security? please don’t blindly follow the panic
description: >-
  So you too panicked over security in the npm repository due to a recent blog
  post?
date: '2018-01-07T23:41:21.587Z'
categories: []
keywords: []
tags: []
slug: npm-security-please-dont-blindly-follow-the-panic-f724871ba1a8
pubDate: '2018-01-07T23:41:21.587Z'
image: ~/assets/images/blog/bb14cb0f93730f9b142e495d8609e03b.jpeg
---

So you too panicked over security in the npm repository due to a recent blog post?

This one in particular:

[**I’m harvesting credit card numbers and passwords from your site. Here’s how.**  
_The following is a true story. Or maybe it’s just based on a true story. Perhaps it’s not true at all._hackernoon.com](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5 "https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5")[](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5)

T̶h̶a̶t̶ ̶p̶o̶s̶t̶ ̶i̶s̶ ̶a̶ ̶t̶r̶o̶l̶l̶ ̶a̶t̶ ̶b̶e̶s̶t̶.̶ ̶L̶e̶t̶ ̶m̶e̶ ̶t̶e̶l̶l̶ ̶y̶o̶u̶ ̶w̶h̶y̶.̶Ok, that’s mostly possible, and, yes be cautious about it, but let’s be clear it’s not npm’s fault, and definitely nothing new.

Let’s understand why that blog post is a c̶o̶m̶p̶l̶e̶t̶e̶ fuss, wrongly putting npmjs in a bad light, and causing panic for no reason.

### The premise of the trojan

The author describes his malicious javascript code which is bundled into a website and steals data.

In order for the author to actually get other sites data than its own, he recognizes that he needs to distribute it somehow to other websites, and chooses npm to do it.

At this point, nothing really new, and nothing surprising.  
Anyone can just push something malicious anywhere they want, whether it’s npmjs, python’s pipy registry, or whatever.

Still, the fact that your package is on the registry doesn’t count for anything, just like the fact you built a website doesn’t mean people will get there.

The real problem is how do you distribute that trojan to site owners?

The author recognizes the problem and takes the path of opening Pull Requests to GitHub projects, while sneakingly suggesting (adding) his own malicious package to the rest of the dependencies in the package.json file.

That’s it.  
That’s the golden hack right there.

The **ENTIRE PREMISE** of the trojan is exactly that. No magic.

No remote code execution on npmjs servers.  
No wu-ftpd remote exploit.  
No npmjs remote meltdown or any other 0-day attack.  
The author also didn’t phone npm support line and whistled a 2600hz to the earpiece.

#### **Let me rephrase**

The way that the malicious package’s author is able to distribute his trojan is by convincing other projects to use this dependency.

Amazing. Let me sit down to relax a bit and grasp this innovative attack vector.

So without a doubt, the author was gifted with incredible social engineering skills, and if that’s the case I can only step back and recommend:

1.  consider a career in sales or investments since you obviously mastered the elevator pitch in those PRs.
2.  consider reaching out to Kevin Mitnick so you guys can plan the computer heist of the century.

### How is npm related?

To be honest, I don’t know.

Beats me why someone would want to inspire great dread into our JavaScript community.

Why npm is the scape-goat? Let’s consider the following analogies:

*   **I am a linux kernel contributor**. I submitted my patch, fairly big one into the project and it got merged. Ubuntu is later on released with this new kernel version that includes my backdoor.   
    Would you go blaming and wrecking havoc on Ubuntu for the fact it distributed a buggy or insecure version of the Linux kernel?
*   **I am a wordpress contributor**. I submitted a patch or feature to a popular package which made its way into the 30% of the top 10 million websites. Would you now blame wordpress?
*   **If someone found a flaw in the DNS protocol**, would you go blame and shout “insecure insecure” at the millions of routers in the world which sole job is to distribute DNS traffic?

I am running out of analogies, but I really hope you get the point.

The problem is not npm. They may have issues, but this case is definitely not directly related to npm.

### Key defense arguments

Seems silly for me to even relate to these points on the blog post, but hopefully I’ll at least teach something new to someone:

> \- grabbing the cookie through document.cookie

For more than a decade now, cookies have this flag called _httpOnly_, which sole purpose is to defeat XSS attacks and malicious JavaScript code from accessing your browser cookie.

> \- The author claims his malicious code is hidden from pen-testers because they don’t work 7am-7pm hours

I… don’t even know how to respond to that. I hope the author understands this little thing about time — it’s relative.

Also, FYI, ops staff operate in a follow-the-sun model, which means no one is ever asleep and there’s always someone on the watch.

I mean seriously, it’s like you’d say the police only works at night, because who’s gonna commit crime during the day?

### Do we understand open source?

I talk to all of us when I point this question — do you understand you work within an open source community? Do you understand what it means?

Open source is built on trust. On community, communication and key values that makes it this incredible and I love it for all that it is.

Can an open source project have security vulnerabilities? **Yes**  
Can an open source project have performance problems that could incur a potential loss of millions on Christmas eve? **Yes**

As [Eric Raymond](https://en.wikipedia.org/wiki/The_Cathedral_and_the_Bazaar) elegantly put it in his paper when referring to Linus’s take on open source being vulnerable to exploitation:

> given enough eyeballs, all bugs are shallow

When you embrace open source, you also embrace the risk it brings with it. Whether it is bad code, malicious code or unmaintained code.

But that responsibility is entirely up to you. You are responsible to perform a due-diligence on the packages you install from npm. It’s not npm’s job to code review every single line of code for you. npm in that take is simply a supply chain or delivery mechanism.

### Epilogue

I recognize the blog post was made in parody, but reactions and comments I read and receive are of people taking this way too seriously to the point of panic.

I have to honestly share with you — I got quite depressed seeing all the buzz a seemingly bullying article has been making in the name of npm and security in general.

I’m a security activist, author of a Node.js Security title, regular committer to an OWASP Node.js project, and have spoken regularly about Node.js Security in several local and international conferences, including Israel’s AppSec.

Why am I telling you all that?  
because I am all in favor of raising awareness for web application security (or infosec in general), I truly am. but I feel bad for npm and the community being a punching bag for no reason.

With all due respect to David Gilbertson, I really don’t know him beyond his blog post and I’m sure he had no bad intentions, as he clearly states his post is fictional.

Still, I believe we can give a readers’s intelligence a little bit more credit with a more constructive post about dangers in web security (or npm) without scaring them. This is simply not how we build trust in the security world.

I covered many security concerns related to Node.js and npm, some of which are very much like the blog post premise, as you can learn from this talk:

But instead of fear, I would like to us to engage in constructive discussions on how we can make things better.

No marketing plug in this post. If there will be interest, I will be happy to share in a follow-up what tools and processes exist today that we can use in our projects, open source or not, to better secure them and address many security concerns, including malicious packages as the original post referred to.