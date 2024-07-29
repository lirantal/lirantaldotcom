---
title: "Supercharging Your Vue.js 3 App with TanStack Query: A Practical Refactoring Guide"
description: >-
  Learn how to supercharge your Vue.js 3 app with TanStack Query. Discover efficient data fetching, caching, and state management in this practical refactoring guide.
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: []
slug: "supercharging-your-vuejs-3-app-with-tanstack-query-a-practical-refactoring-guide"
image: ~/assets/images/blog/
---

Hey there fellow Vue.js enthusiasts! 👋 Ever found yourself wrestling with data fetching in your Vue.js 3 app? You know, that moment when you're staring at your `fetch()` calls, thinking, "There's gotta be a better way to handle this mess of loading states, caching, and updates!" Well, grab your favorite caffeinated beverage, because we're about to get on with transforming your data fetching game with **TanStack Query**.

This is also my first time using TanStack Query because I wanted to get server updates working and decided that frontend polling is a good-enough solution for that.

Before we dive in though, here's the fetch frustration in a nutshell:

```javascript
async fetchArticles() {
  try {
    this.isLoading = true;
    const response = await fetch('/api/articles');
    const data = await response.json();
    this.articles = data;
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    this.error = 'Oops! Something went wrong.';
  } finally {
    this.isLoading = false;
  }
}
```

Sure, it works, but it's like using a butter knife to cut down a tree. It gets the job done... eventually.

## Enter TanStack Query: Your Data-Fetching Superhero

TanStack Query, the one you know from React but also available for Vue.js, is like giving your Vue.js 3 app a superpower. It's not just about fetching data; it's about managing your entire data lifecycle with elegance and efficiency. Here's a taste of what we're talking about:

- Caching: Say goodbye to unnecessary API calls. TanStack Query remembers your data, so you don't have to.
- Background Updates: Keep your data fresh without pestering your users. (I used `refetchInterval` in this guide, we'll get to it)
- Error Handling: Gracefully handle those pesky network hiccups.
- Loading States: No more manual `isLoading` flags!
- Pagination and Infinite Scrolling: Handle complex data scenarios with ease.

And the best part? It plays beautifully with Vue.js 3's Composition API. It's like they were made for each other.

In this write-up I'll walk through a refactor of an articles component from using basic `fetch()` calls to leveraging the full power of TanStack Query.

## Setting Up TanStack Query in a Vue.js 3 Project

First things first, we need to add TanStack Query to our project. Open up your terminal, navigate to your project directory, and run:

```bash
npm install --save @tanstack/vue-query
```

Now that we've got the package installed, it's time to tell Vue about our shiny new toy. We're going to set up the Vue Query plugin in our app's entry point.

Typically, in a Vue.js 3 project, you'll have a `src/plugins/index.js` file where all your plugins are configured. If you don't have this file, go ahead and create it. We're going to modify this file to include TanStack Query.

Here's what your `src/plugins/index.js` file should look like after adding TanStack Query:

```javascript
// src/plugins/index.js

import { loadFonts } from './webfontloader'
import { VueQueryPlugin } from '@tanstack/vue-query'
import vuetify from './vuetify'
import pinia from '../store'
import router from '../router'

export function registerPlugins(app) {
  loadFonts()
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(VueQueryPlugin)
}
```

The change we actually did is:

1. We import `VueQueryPlugin` from `@tanstack/vue-query`.
2. In the `registerPlugins` function, we add `.use(VueQueryPlugin)` to the chain of plugin registrations.

If you want to get fancy, you can customize the `VueQueryPlugin` with some options. For example:

```javascript
import { VueQueryPlugin } from '@tanstack/vue-query'

export function registerPlugins(app) {
  // ... other plugins
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 minutes
        },
      },
    },
  })
}
```

This configuration sets a default `staleTime` of 5 minutes for all queries. We'll dive deeper into what this means later, but for now, just know it's like telling TanStack Query, "Hey, consider my data fresh for 5 minutes before you think about fetching it again."

To make sure everything's hooked up correctly, you can add a simple log in your main Vue component:

```vue
<script setup>
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
console.log('TanStack Query is ready:', !!queryClient)
</script>
```

If you see "TanStack Query is ready: true" in your console, pop open the champagne (or your beverage of choice) – you're all set!

## Refactoring fetch() in favor of TanStack Query Component

It's time to take our Articles component and give it the TanStack Query glow-up. We're going to transform our old-school `fetch()` implementation into a sleek, reactive data-fetching powerhouse.

Let's start by looking at our original implementation that uses `fetch()`. It probably looks something like this:

```vue
<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <v-list v-else>
      <v-list-item
        v-for="articleItem in articlesList"
        :key="articleItem.id"
        :title="articleItem.title"
        :value="articleItem.value"
      >
        <!-- Article item content -->
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchArticles } from "@/services/ContentOps.js";

const articlesList = ref([]);
const isLoading = ref(false);
const error = ref(null);

const refreshArticles = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await fetchArticles();
    articlesList.value = response.data.map((article) => ({
      id: article.id,
      title: article.title,
      value: article.id,
      // ... other properties
    }));
  } catch (err) {
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

onMounted(refreshArticles);
</script>
```

This works, but it's like using a flip phone in the age of smartphones. Let's upgrade!

Let's refactor this component using TanStack Query's `useQuery` hook. Prepare to be amazed by how much cleaner and more powerful our code becomes 😆

```vue
<template>
  <div>
    <div v-if="isPending">Loading...</div>
    <div v-else-if="isError">Error: {{ error.message }}</div>
    <v-list v-else>
      <v-list-item
        v-for="articleItem in data"
        :key="articleItem.id"
        :title="articleItem.title"
        :value="articleItem.value"
      >
        <!-- Article item content -->
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { useQuery } from '@tanstack/vue-query';
import { fetchArticles } from "@/services/ContentOps.js";

const { isPending, isError, data, error } = useQuery({
  queryKey: ['articlesList'],
  queryFn: async () => {
    const response = await fetchArticles();
    return response.data.map((article) => ({
      id: article.id,
      title: article.title,
      value: article.id,
      // ... other properties
    }));
  },
});
</script>
```

Sleek, ain't it? Here's what's going on...

The `useQuery` hook is the star of our refactoring show. It takes an object with two crucial options:

- **queryKey**: This is like a unique ID for our query. Here, we're using `['articlesList']`. TanStack Query uses this key for caching and invalidation. If you had different types of article lists, you might use keys like `['articlesList', 'featured']` or `['articlesList', 'recent']`.

- **queryFn**: This is our data fetching function. It's similar to our old `refreshArticles` function, but now it's integrated directly into the query configuration. TanStack Query will call this function when it needs to fetch or refetch the data.

What is really cool about TanStack Query is that it doesn't aim to replace your existing data fetching logic. You can keep using `fetch()` or `axios` or whatever you like. TanStack Query just helps you manage the data lifecycle in a more efficient and declarative way.

### Handling Loading and Error States in the Template

Notice how our template has been simplified:

- `isPending` replaces our manual `isLoading` ref.
- `isError` and `error` are provided directly by the query, no need to manage them ourselves.
- We can directly use `data` in our v-for loop, no need for a separate `articlesList` ref.

TanStack Query manages all these states for us, making our component much more declarative and easier to reason about.

## Adapting the UI for Query States

Now that we've got TanStack Query humming along in our Vue.js app, let's polish our UI to take full advantage of those sweet, sweet query states.

Remember our old friend, the loading spinner? Well, it's about to get an upgrade. Let's revamp our template to handle `isPending` and `isError` states with style:

```vue
<template>
  <div>
    <v-skeleton-loader
      v-if="isPending"
      type="article, article, article"
      :loading="isPending"
    >
      <v-card>Loading...</v-card>
    </v-skeleton-loader>

    <v-alert
      v-else-if="isError"
      type="error"
      :title="error.name"
    >
      {{ error.message }}
    </v-alert>

    <v-list v-else>
      <v-list-item
        v-for="articleItem in data"
        :key="articleItem.id"
        :title="articleItem.title"
        :value="articleItem.value"
      >
        <!-- Article item content -->
      </v-list-item>
    </v-list>
  </div>
</template>
```

We're using Vuetify components to create a more engaging loading state with `v-skeleton-loader` and a informative error state with `v-alert`. Your users will appreciate the polish!

Notice how our `v-for` loop is now directly using `data` from the query result. No more manual state management! This is the power of TanStack Query – it gives you the data when it's ready, and handles all the intermediate states for you.

## Handling User Interactions

First, let's add a filter toggle to our component:

```vue
<template>
  <div>
    <v-switch
      v-model="filterMyArticles"
      label="Show only my articles"
      @change="onMyArticlesFilter"
    ></v-switch>

    <!-- ... rest of the template ... -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { fetchArticles } from "@/services/ContentOps.js";

const filterMyArticles = ref(false);

const { isPending, isError, data, error } = useQuery({
  queryKey: ['articlesList', { filterOnlyMyArticles: filterMyArticles.value }],
  queryFn: () => fetchArticles(null, { filterOnlyMyArticles: filterMyArticles.value }),
});

function onMyArticlesFilter() {
  // The query will automatically refetch when filterMyArticles changes!
}
</script>
```

Here's where the magic happens. We've added `filterOnlyMyArticles` to our query key. When this value changes, TanStack Query knows it needs to refetch the data. No manual refetching required.

The `queryKey` is like a unique identifier for your query. When any part of it changes, TanStack Query assumes the data needs to be refreshed. It's a simple yet powerful way to handle dynamic queries.

Alright, we've got our query up and running, but let's make sure we're following best practices to keep our app slick and performant.

### Organizing Query Functions and Hooks

As your app grows, you'll want to keep your queries organized. Here's a pattern we can follow:

1. Create a `hooks` folder in your `src` directory.
2. For each major feature, create a file like `useArticles.js`:

```javascript
// src/hooks/useArticles.js
import { useQuery } from '@tanstack/vue-query';
import { fetchArticles } from "@/services/ContentOps.js";

export function useArticles(filterOnlyMyArticles) {
  return useQuery({
    queryKey: ['articlesList', { filterOnlyMyArticles }],
    queryFn: () => fetchArticles(null, { filterOnlyMyArticles }),
    staleTime: 5 * 60 * 1000,
  });
}
```

Now you can use this hook in any component:

```vue
<script setup>
import { ref } from 'vue';
import { useArticles } from '@/hooks/useArticles';

const filterMyArticles = ref(false);
const { isPending, isError, data, error } = useArticles(filterMyArticles);
</script>
```

This approach keeps your components clean and your queries reusable!

### Performance Implications and Optimizations

TanStack Query is pretty smart out of the box, but here are some tips to squeeze out even more performance:

1. **Use `staleTime`**: This tells TanStack Query how long data should be considered fresh. Set it higher for data that doesn't change often.

2. **Prefetching**: If you know the user is likely to need certain data soon, prefetch it:

   ```javascript
   const queryClient = useQueryClient();
   queryClient.prefetchQuery(['articlesList', { filterOnlyMyArticles: true }], 
     () => fetchArticles(null, { filterOnlyMyArticles: true }));
   ```

3. **Pagination**: For large datasets, use the `useInfiniteQuery` hook to implement efficient pagination or infinite scrolling.

### Error Handling and Retry Strategies

TanStack Query has built-in retry logic, but you can customize it:

```javascript
useQuery({
  queryKey: ['articlesList'],
  queryFn: fetchArticles,
  // Will retry failed requests 3 times before displaying an error
  retry: 3,
  // Exponential back-off strategy
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

For more specific error handling, you can use the `onError` callback:

```javascript
useQuery({
  queryKey: ['articlesList'],
  queryFn: fetchArticles,
  onError: (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized error, maybe redirect to login
    }
  },
});
```

## Wrapping Up

And there you have it, folks! We've taken our Vue.js app (well, mine technically 😅) from manual data fetching to a TanStack Query powerhouse. I quite enjoyed how short and easy was the refactor, to be honest.
