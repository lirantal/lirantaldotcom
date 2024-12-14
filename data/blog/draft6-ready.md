---
title: "Customizing Astro Starlight Sidebar for Gated Content with Authentication"
description: >-
  Learn how I got the Starlight documentation framework in Astro to create a gated content website with authentication for my Bun Security course
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: []
slug: "customizing-astro-starlight-sidebar-gated-content-auth"
image: ~/assets/images/blog/custom-astro-starlight-sidebar-for-gated-content-with-auth.jpg
---

The Astro framework powers this personal blog, my [Node.js Secure Coding](https://www.nodejs-security.com) website, and now my newly launched [Bun Security](https://bunsecurity.dev) website. I've been using Astro for a while now and I'm a big fan of the framework. It's fast, it's simple, and it's a joy to work with.

For the Bun Security course, because this is an online self-paced educational content, I settled on using Starlight as the documentation framework. Starlight is a static site generator that's built on top of Astro, and it comes with pre-built components, layout and design that provides a UI for documentation websites and that fits well with course content too.

Specifically for the Bun Security course, I wanted to created a mix of open content about news and security topics for the Bun server-side JavaScript runtime, but also to have gated content which makes up the course material. This is where things get a bit more interesting and require some customization to get this working.

So to set us off for the rest of this Astro Starlight customization journey, we're going to leverage the following parts:
- Astro as the foundational framework that powers the website
- Starlight as the documentation framework that provides the UI and layout to put content in
- Clerk as the authentication provider that will be used to decide on access to the gated content

Next up, the customizable part of Starlight are going to be the sidebar items which we don't want to just publicly show and have pre-generated but rather generate the content via server-side rendering (so we can decide on access to the content based on the user's authentication status), and the ability to customize Starlight's sidebar to get granular control of the sidebar items (allows us to decide whether to show the chapter name and the sub-chapters or not).

Let's begin.

## Astro's Starlight configuration

The following is my stock configuration for the Starlight integration part of Astro:

```js
    starlight({
      prerender: false,
      title: "Bun Security Essentials | Course",
      sidebar: [
        {
          label: "Getting started",
          autogenerate: { directory: "course/getting-started" },
        },
        {
          label: "Bun Security Introduction",
          autogenerate: { directory: "course/introduction" },
        },
        //
        // ... more chapters go here...
        //
        {
          label: "👉 ",
          link: "/",
          badge: { text: 'Buy the Course', variant: 'note' },
        },
      ],
      social: {
        github: "https://github.com/lirantal",
      },
      disable404Route: true,
      customCss: ["./src/assets/styles/starlight.css"],
      favicon: "/favicon.ico",
      components: {
        SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
        Sidebar: "./src/components/ui/starlight/Sidebar.astro",
      },
    }),
```

In the above, I'll call out the two important parts:
- The `prerender` option has to be set to `false` so that we can control the sidebar items and generate them dynamically and also generate the actual site's content dynamically based on the user's authentication status.
- The `Sidebar` component override which allows to customize the sidebar items and generate them dynamically.

## Customizing the Starlight Sidebar

The Sidebar component is where we can decide which content to render for the sidebar items and we're going to use the Clerk authentication SDK to do so based on the user's authentication status.

```astro
---
import type { Props } from "@astrojs/starlight/props";
import Default from "@astrojs/starlight/components/Sidebar.astro";

const user = await Astro.locals.currentUser();

const strippedSidebar = Astro.props.sidebar.filter((entry) => {

  const allowedEntries = [
    'Getting started',
  ]

  if ((entry.type === "group" || entry.type ==='link') && allowedEntries.includes(entry.label)) {
    return true;
  }

  if (user) {
    return true;
  } else {
    entry.label = `[Locked]`;
    entry.entries = [];
    entry.badge = {
      text: "Get Full Course",
      variant: "tip",
    };
    return true;
  }
});

const strippedProps: Props = { ...Astro.props, sidebar: strippedSidebar };
---

<Default {...strippedProps} />
```

The `user` variable information is available due to the Clerk integration and the middleware that gets used as part of the Clerk setup into an Astro project.

Next up, we create our own instance of `strippedSidebar` which is made up of our own logic (authentication based) on how to render the items for the sidebar. In this case, we're only allowing the "Getting started" chapter to be publicly available, and the rest of the chapters are gated behind the authentication.

## How does it look?

Here is a screenshot of the Starlight sidebar with the customization applied so you can get a visual. This is from my [Bun Security](https://bunsecurity.dev) website:

![bun security website with custom Starlight sidebar](/images/blog/custom-astro-starlight-sidebar-for-gated-content-with-auth.png)