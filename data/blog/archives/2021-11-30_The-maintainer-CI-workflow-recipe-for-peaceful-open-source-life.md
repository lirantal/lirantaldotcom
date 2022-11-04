---
title: The maintainer's CI workflows recipe for a peaceful open source life
date: '2021-11-30'
author: "Liran Tal"
pubDate: '2021-11-30'
description: My GitHub Actions hackathon application entry is about all the small things that would contribute to a better maintainer life.
image: ~/assets/images/blog/photo-1447433819943-74a20887a81e.jpeg
tags: github, opensource
---

## My Workflow

My GitHub Actions hackathon application entry is about all the small things that would contribute to a better maintainer life.

Maintainers usually get a good grip on the important things, like making sure they have a workflow that run code style checkers, tests, and that publishes a package to the registry.

Busy with these, they end up forgetting about the small things that are the details, but as important, for example: having a markdown linter in place to ensure no broken documentation.

Can we reach open source maintainer nirvana?
I can't promise you that, but I can promise I will do everything I can to put us on that direction.

With that in mind, I'm suggesting a recipe of several GitHub Actions CI workflows that you can add to your open source repositories at GitHub. I've segmented them into specific areas too.

### Markdown documentation

This recipe will introduce the following workflows:
- **Markdown Style linter** - Making sure your documentation like the `README.md` has proper 
- **Markdown Links linter** - Making sure your documentation has no broken links

### Dependency management

- **New dependencies advisor** - Add a comment in a Pull Request informing of newly added dependencies and their package health

### Pull Request engagement

- **Pull Request title update** - Do you manage multiple base branches with PRs to? If you manually updated your PR titles to include this information then now this is automated for you

- **Pull Request contribution fun note** - Welcome contributors to your project by adding a comment that thanks them and embeds an image of a cute animal

## Submission Category: 

- Maintainer Must-Haves

### Repository

The following repository demonstrates the workflow this application suggests: https://github.com/lirantal/github-actions-hackathon-actionshackathon21


### Additional Resources / Info

The recipe makes use of the following GitHub Actions from the marketplace:

- [ruzickap/action-my-markdown-linter](https://github.com/marketplace/actions/my-markdown-linter)
- [lirantal/github-action-new-dependencies-alerts](https://github.com/marketplace/actions/new-dependencies-advisor)
- [ruzickap/action-my-markdown-link-checker](https://github.com/marketplace/actions/my-markdown-link-checker)
- [circa10a/animal-action](https://github.com/marketplace/actions/animal-action)
- [lirantal/github-action-pr-title-update-branch](https://github.com/marketplace/actions/pull-request-title-update-to-include-base-branch)

## Demo

Let's put all of it together and see how they add to an overall better experience for both maintainers and contributors alike.

### Pull Request title update

![PR title update with base branch](/images/blog/g8j6tk3d8efhqd5xcxoc.png)

As you can see, a few minutes after creating the pull request, the action kicks in and updates the title so that it includes a base branch prefix (the text `[main]`).

To make that magic happen, we create a brand new GitHub Action workflow file and add this:


```yaml
name: "PR title update with base branch"
on: [pull_request]

jobs:
  pr_title_update:
    runs-on: ubuntu-latest
    name: "PR title update with base branch"
    steps:
      - name: "PR title update with base branch"
        uses: lirantal/github-action-pr-title-update-branch@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
 

### Pull Request contribution fun note

![Pull Request contribution fun note](/images/blog/a6k92dcbak1ts6g4bn12.png)

Ain't it cute to get that nice little note? I think so too ;-)

To make that magic happen, we create a brand new GitHub Action workflow file and add this:


```yaml
```
 

### New dependency advisor

I can't stress enough how important is making sure you are using healthy dependencies, and those without security vulnerabilities. How can you tell if a new one someone adds to your project is a liability or a gift? 

![Image description](/images/blog/zd8nqp52v4ubryjua42w.png)
 
Luckily, we have the Snyk Advisor, and this handy GitHub Action helping us vet it:

```yaml
name: "Deps: show dependencies metadata"
on:
  - pull_request

jobs:
  deps_check_new_dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout repo for a local instance"
        uses: actions/checkout@v2
        
      - name: "Deps: show dependencies metadata"
        uses: lirantal/github-action-new-dependencies-alerts@v1.1.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```


### Markdown Style linter

If a markdown file doesn't confirm to proper style conventions then we can find out about it in the Pull Request CI phase rather than after we see it "in production", or in other words, showing up to the whole world as the face of the repository:

![Image description](/images/blog/p50ksjc8aa2oa5wnzjh5.png) 

To make that magic happen, we create a brand new GitHub Action workflow file and add this:

```yaml
on:
  push:

name: "Markdown: style"
jobs:
  markdown_lint:
    name: "Markdown: style"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: "Markdown: style"
        uses: ruzickap/action-my-markdown-linter@v1
        with:
          config_file: .github/markdown-style-config.yml
          #debug: true
          search_paths: |
            ./
            docs/
          exclude: |
            node_modules/
            coverage/
            dist/
            tests/
            CHANGELOG.md
```

And make sure that you have the accompanying configuration file for it as such:

```yaml
# Default state for all rules
default: true

# MD033/no-inline-html - Inline HTML
MD033:
  # Allowed elements
  allowed_elements: ['p', 'br', 'h1', 'h2', 'h3', 'h4', 'a', 'img']
  
# Don't fail on line length limit of 80 chars
MD013: false

# Don't fail on first line of the file not being a markdown heading (maintainers like beautiful READMEs)
MD041: false
```

### Markdown Links linter

Want to avoid broken links in your README? Me too

That's why I can now find out about it when it happens in the CI process when I push a change via a pull request rather than after the fact:

![Image description](/images/blog/5ohpwmtaceomwoxv153u.png)
 
To make that magic happen, we create a brand new GitHub Action workflow file and add this:

```yaml
on:
  push:

name: "Markdown: broken links"
jobs:
  markdown-link-check:
    name: "Markdown: broken links"
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout project"
        uses: actions/checkout@v2

      - name: "Markdown: broken links"
        uses: ruzickap/action-my-markdown-link-checker@v1
```

That's it, have fun!