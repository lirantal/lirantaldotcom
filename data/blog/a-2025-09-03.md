---
title: "What do AI-first DevTool Companies Look Like and how DevRel Practices Change?"
description: >-
  If you're in Developer Relations and you haven't yet adapted your practices to the post-GPT era, you might be missing out on the next big thing in developer tools. In this write-up, I want to unpack what AI-first developer relations practices look like and specifically draw a direct line to developer tool companies that aim to be AI-first.
date: '2025-12-12'
pubDate: '2025-12-12'
categories: []
keywords: []
draft: true
tags: ["AI", "DevTool", "DevRel"]
slug: "ai-first-devtool-companies-and-devrel"
image: ~/assets/images/blog/gamified-learning.png
---

Developer relations (DevRel) has always been an ever-changing field, and the reason is deeply rooted in the nature of technology always evolving and as a developer advocate, the need to adopt education materials, demo applications, and content to match the latest trends and technologies.

In the last decade, pre-GPT era, technology trends were myriad and some honorary mentions in the web development space include Serverless computing, JAMstack, GraphQL, React Server Components, and more. Each of these paradigm shifts was significant and impactful to warrant a counter shift in how developers build applications, and called for developer relation professionals to adapt their skill-set accordingly.

> *ChatGPT 3.5 entered the chat...*

If we considered those shifts as pivotal, then November 30th, 2022, the day OpenAI announced ChatGPT 3.5 will be forever remembered and marked as the day that introduced a monumental shift in how developers build applications, and by proxy, how developer relations professionals engage with developers. post-GPT era, the DevRel playbook must adopt to complement AI-first developer tool (DevTool) companies and many prior tactics are no longer relevant.

In this write-up, I want to unpack what AI-first developer relations practices look like and specifically draw a direct line to developer tool companies that aim to be AI-first.

## AI-first Documentation Context

I've written before [what LLMs.txt](https://lirantal.com/blog/what-is-an-llms-txt-file) are but in short, it's a way to expose large data context to LLMs in the way LLMs like best to ingest data: structured text files.

A good call out here is Bun, the server-side JavaScript runtime, which hosts a `llms.txt` endpoint in their website (https://bun.sh/llms-full.txt) to allow LLMs to easily access the needed context to answer questions about Bun:

![bun javascript server runtime llms.txt file](/images/blog/bun-llms-txt.png)

If you open up the `llms-full.txt` file you'll see the content is large and comprehensive but it isn't designed for human consumption. This isn't your usual Developer Experience (DX) docs page but rather very meticulously crafted to be machine-readable and consumable by LLMs.

## AI-first Documentation Crawl

In another aspect of developer experience, let's expand on the documentation itself which many developer tool companies hold in high regard as a key pillar of their product. We can probably agree the documentation is often the first place developers go to when they want to learn how to use a tool and it's a pillar for onboarding users and a direct PLG influencing vehicle for your product success.

Pre-GPT era, DX teams engineered for humans consuming the documentation and have optimized for readability and overall usability. One example, is that documentation web pages would have buttons that clicking them to copy commands to the clipboard, or clicking them would navigate you to a specific page in the web application such as your settings page to configure your API key.

In the post-GPT era, we optimize for LLM crawlers and AI agents that open the documentation page and consume it. Instead of expecting AI agents to point-and-click we could engineer for an experience that is much more akin to the way LLMs consume data and operate with the data. AI agents, more and more prevalent, have access to tools (MCP Servers), that can execute commands. In this case, we can optimize the docs experience for AI agents by providing an actual `cURL` command snippet that includes the header for user-specific authorized requests and the URL and query string parameters for the specific action. This would allow the AI agent to not only consume the documentation page but also follow-up with an action that is relevant to the workflow being executed.

Real-life example of this is Vercel's documentation page for their AI Agentic workflows. [Per Lee Rob](https://x.com/leerob/status/1924907637629489274), formerly Vercel head of DevRel, Vercel's replacing navigation links with copy-paste commands to allow agents crawling the documentation pages to follow-up on agentic workflows:

![vercel replaces button clicks with curl commands for optimized ai agents developer experience](/images/blog/vercel-ai-agentic-workflows.png)

In this context, browser-use agents are increasingly being used to crawl documentation pages and extract relevant information for developers. This is a powerful way to make documentation more accessible and useful, as it allows developers to quickly find the information they need without having to manually search through the documentation.

## AI-first LLM Capabilities

LLMs and Agentic AI workflows are increasingly embraced by developers and the key to unlock access to your devtool and product capabilities is through the Model Context Protocol and MCP Servers.

There's been a lot that has been written already about the Model Context Protocol (MCP) and how it enables AI agents to invoke tools and open a new user interaction process with your product capabilities, so I'll avoid repeating the take here but I'm a big fan of MCPs and while MCPs are not tied to developer specifically (as in, imagine your Mom using Claude Code and asking it to book a flight), they are a great segue to developers and agentic code workflows.

In the context of developer tool companies, MCPs are like APIs. If you don't have an API for developers to interact with your product in a programmatic and scripted way, are you really a devtool company? Similarly, MCPs. If you want to tap into the growing adoption of AI agents, AI coding assistants and fully autonomous agentic workflows - that's where MCPs come in.

A good demonstration of that (and yes I'm biased, because I work at Snyk) is the Snyk MCP Server.

Why is the Snyk MCP Server not just a product pitch but an actual value offer to developers? Easy - what are the chances that the LLMs hallucinate some non-existent package? what are the chances that LLMs generate insecure code? what are the chances that LLMs are able to accurately fix vulnerabilities in code without introducing new ones? For all of these security concerns the answer is "very likely" and definitely "> 0% chance" of that happening which is exactly the point.

![Snyk MCP Server](/images/blog/snyk-mcp-server.png)

## AI-first SEO

We mentioned `llms.txt` as a way for LLMs to consume contextual data about your devtool company and product offering but there's a side-benefit to that: SEO, or more accurately: LLM SEO.

LLM SEO is the practice of optimizing LLM responses to favorably rank your product high and in a positive light as the answer to a question that LLMs are asked.

So back to `llms.txt` files - they are actively crawled by LLMs as part of their training data, which in turn, means that there's potentially a higher chance for your product to be surfaced and featured as a recommendation in an LLM response.

A good demonstration of this is Tally Forms. Marie Martens, Co-founder of Tally [shared on X](https://x.com/MarieMartens/status/1932355206550851903):

![tally forms LLM SEO](/images/blog/tally-forms-llm-seo.png)

Another reference of that is [Vercel's documentations llms.txt file](https://x.com/leerob/status/1930687146790146515).

Remember, optimizing for LLM SEO (or AI SEO) doesn't mean you should trade off traditional SEO practices but rather complement them with LLM-specific query response optimizations.

## AI-first Assisted Guides

From Developer Experience (DX) to Agentic Experience (AX), the shift in mindset and ecosystem adoption is real.

One well established demonstration of that in practice is the Astro docs (Astro is a static site generator) which [@astrodotbuild](https://x.com/astrodotbuild) added, a ["Build with AI page"](https://docs.astro.build/en/guides/build-with-ai/) to their docs:

![astro docs explain how to build with ai](/images/blog/astro-build-with-ai.png)

As you can see from the screenshot, the page ultimately caters to developers who embrace AI and to plausibly to AI agents themselves. The purpose of this tool is to communicate, clarify and enable product adoption of the Astro static site generator in the context of AI-first development practices. 

This "Build with AI" documentation page layers all the AI-native practices and building blocks that are often utilized in an agentic workflow:

- LLMs.txt files, which provide context to LLMs about the product.
- MCP Servers that allow AI agents to interact with the product capabilities.
- Context and rules files that provide additional information to LLMs. 
