---
title: How to add client-side search with PageFind to your Astro blog static website
description: >-
  PageFind client-side search for Astro is simple but if you want to add search
  capabilities to a personal blog then you might think of Algolia first. However,
  let me show you how an easy PageFind integration would be more suitable for a 
  static-site generation type of blog tech.
date: '2023-01-24'
pubDate: '2023-01-24'
categories: []
keywords: []
tags: ["astro", "search", "static website", "pagefind", "blog"]
image: ~/assets/images/blog/photo-1589002615196-a7dc3df5bed3.jpg
---

[PageFind](https://pagefind.app) is a client-side search tool that can be used to add search to your static website. It's a great tool for adding search to your Astro blog, as it's a client-side tool that doesn't require any server-side processing.

PageFind works by crawling your static website's build directory and creating a search index from it. It then generates a set of assets that you can include in your website's HTML. These assets include a search box UI that you can add to your website, and a JavaScript and CSS files that you can include in your website's HTML.

This makes it a great fit for Server-side Generated (SSG) static websites, such as Astro, Hugo, Eleventy, SvelteKit, and others.

Let's learn how to add a fully static client-side search to an [Astro](https://astro.build/) blog website.

## Install PageFind client-side search

Some developers may have security rules to prevent installing packages that have post-install scripts. This is great, because it helps to mitigate incidents of malicious packages.
If you are one of them, you should update your local project's `.npmrc` file to allow installing packages that have post-install scripts. The reason for that is that `PageFind` is natively a Rust-based tool, and it performs a post-install script to download the pre-built binary for your platform.

Update your `.npmrc` file to allow installing packages that have post-install scripts:

```sh
ignore-scripts=false
```

Then proceed to installing `PageFind`:

```sh
npm install --save-dev pagefind
```

## Add PageFind to your Astro project

First off, you need to add the `PageFind` component to your Astro project. You can do that by creating a new file in your project's `src/components` directory, and name it `PageFind.astro`.

```astro

<div id="search" class="ml-3 p-4 -mt-8"></div>

<script>
	window.addEventListener('DOMContentLoaded', (event) => {
	  new PagefindUI({ element: '#search', resetStyles: false});
	});

    window.addEventListener('keydown', (event) => {
        if (event.key === '/' || event.key === '.') {
            console.log('you pressed the slash');
            event.preventDefault();
            document.querySelector('div#search input').focus();
        }
    });
</script>

<style is:global>
	.dark {
		--pagefind-ui-primary: #eeeeee;
		--pagefind-ui-text: #eeeeee;
		--pagefind-ui-background: #152028;
		--pagefind-ui-border: #152028;
		--pagefind-ui-tag: #152028;
	}
</style>
```

Don't forget the `is:global` attribute on the `<style>` tag. This is required to make the styles global, so they can be applied to the search box your website's dark mode layout toggles.

You'll notice that this also includes a `dark` class that you can use to style the search box when your website is in dark mode. You can also add your own custom styles to the search box. This will automatically enable the classic `dark` and `light` modes that are available in some themes for Astro.

## Add PageFind search component to the blog page

Update your blog page to include the `PageFind` component. You can do that by adding the following line to your `src/pages/[...blog]/[...page].astro` file, if that's where you have your blog page:

```astro
---
import PageFindSearch from '~/components/widgets/PageFindSearch.astro';
---

<!--    wherever in the page component that you want to add the search box
        just add it:
-->

<PageFindSearch />
```

## Include the PageFind CSS and JavaScript assets in your Astro project

Next, you need to include the PageFind CSS and JavaScript assets in your Astro project. They are automatically generated when you run the `pagefind` CLI tool and are placed within your resulting client-side build directory, such as `dist/`.

You specifically need to add the following two head-level meta tags:

```html
		<link href="/_pagefind/pagefind-ui.css" rel="stylesheet" />
		<script src="/_pagefind/pagefind-ui.js" type="text/javascript"></script>
```

You can do that by adding the following lines to your `src/layouts/BaseLayout.astro` file, or any other page that you want to include the search box on and update the layout as shown in the next example:

```astro
<!DOCTYPE html>
<html lang="en" class="motion-safe:scroll-smooth 2xl:text-[20px]">
	<head>
		<MetaTags {...meta} />
		<link href="/_pagefind/pagefind-ui.css" rel="stylesheet" />
		<script src="/_pagefind/pagefind-ui.js" type="text/javascript"></script>		
	</head>
```

## Update your package.json to include run-scripts for PageFind

Next, update your project's `package.json` file to include run-scripts for PageFind. These scripts need to be able to run *after* Astro's build process because PageFind expects to crawl a `dist/` directory and create its search index from it.

You can do that by making the following updates to your `package.json` file's `scripts` configuration:

```json
  "scripts": {
    "dev": "astro build && npm run postbuild && astro preview",
    "start": "npm run dev",
    "build": "astro build",
    "postbuild": "pagefind --source dist/",
    ...
  }
```

Now we have a dedicated `postbuild` command that generates the search index and assets for PageFind. For local development, as we want to experiment with the search box, we modified the `npm run dev` command to split out the build process, so we can then run `postbuild` and then fire off `astro preview` to see the results.

## Add hotkey to focus the search box

How about a cool bonus section in this blog to add a hotkey to focus the search box? This is a great way to make it easy for your website's visitors to find what they are looking for.

To make that happen, we're going to add an event listener to the `window` object that listens for the `/` key. When that key is pressed, we'll focus the search box input field.

Open your `src/components/PageFind.astro` file and add the following lines to the `<script>` tag:

```astro
    window.addEventListener('keydown', (event) => {
        if (event.key === '/' || event.key === '.') {
            event.preventDefault();
            document.querySelector('div#search input').focus();
        }
    });
```

You'll notice that I also bound the listener to the `.` key. The reason is more of a personal preference. In a Hebrew keyboard layout, the `/` key is located on the same key as the `.` key, which means that if I'm on Hebrew input mode then I may press the `.` key. So I added the `.` key as a fallback and basically made it so that the search box will be focused whenever the `/` or `.` key is pressed.

## Build your Astro project with Search

That's it!

Now you can build your Astro project and see the search box in action. You can also try out the hotkey to focus the search box.

Here is a video of how it looks like on my website:

<video width="100%" controls>
  <source src="/images/blog/pagefind-on-astro.mp4" type="video/mp4">
</video>