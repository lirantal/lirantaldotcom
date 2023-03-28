---
title: How to write your book with AsciiDoc
description: >-
  If you are looking for a way to write your book in a format that is easy to read and write, and that can be easily converted to other formats such as PDF, ePUB and HTML, then AsciiDoc is a great choice. Let me show you how to get started with AsciiDoc Book Starter GitHub repository and an automated setup.
date: '2023-03-28'
pubDate: '2023-03-28'
categories: []
keywords: []
tags: ["writing", "content", "book", "author", "asciidoc", "selfpublishing", "asciidoctor"]
slug: how-to-write-your-book-with-asciidoc
image: ~/assets/images/blog/photo-1611716524065-622312678d68.jpeg
---

This article is based on the [AsciiDoc Book Starter](https://github.com/lirantal/asciidoc-book-starter) template repository on GitHub for authoring books using AsciiDoc.

I've briefly explored other formats such as Markdown, Latex, and Pandoc but I've found AsciiDoc to be the most flexible and powerful format for authoring books. It is easily readable and writable to a human, has a lax syntax and good set of defaults for authoring books, and it can be easily converted to other formats such as PDF, ePUB and HTML.

AsciiDoc is also a very powerful format for authoring technical documentation, and is widely used in the media and content publishing industry, such as in O'Reilly's books.

## Basics of AsciiDoc and Writing

An important observation to get started when authoring a book with AsciiDoc is the notion of the language vs the implementations. AsciiDoc is a language that's intended to be a lightweight semantic markup. To generate output from AsciiDoc we use text processor tools such as [Asciidoctor](https://asciidoctor.org/), which is free and open source.

Get up to date with the latest AsciiDoc syntax and features by reading the [AsciiDoc User Guide](https://asciidoctor.org/docs/asciidoc-writers-guide/).

## Features of my Asciidoc Book Starter

My [AsciiDoc Book Starter](https://github.com/lirantal/asciidoc-book-starter) GitHub repository features the following advantages to help you get started quickly with your book authoring journey.

## Asciidoc book authoring 

Book authoring experience provides the following features with this repository:
- Table of Contents (TOC) generation.
- Template prelude chapters: A `Preface`, and a `Forward`.
- Template chapters with commonly used formatting in books.
- Chapters are structured into their own chapter directories so they can be co-located with their images and other assets, such as code snippets.
- A PDF output that uses a theme, and can be customized.
- A PDF output that uses custom fonts (Google's open fonts family). Specifically, an [Open Sans](https://fonts.google.com/specimen/Open+Sans) font for the body text, and a [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro?query=source+code+pro) font for source code snippets and inline code.

### Asciidoc book generation

Batteries-included book generation features:
- No need for a local installation of Asciidoctor, as the book generation is done via Docker.
- No need for special CI setup, as the book generation is done via Docker.
- Docker-based scripts to generate the book in various formats, including PDF, HTML and ePUB.

## Getting Started with AsciiDoc Book Starter

We start off by getting familiar with the repository structure and the various files that are part of it.

The top-level directory structure looks like this:

```
.
├── README.md
├── book
│   ├── chapter-01.adoc
│   ├── preface.adoc
│   ├── foreword.adoc
│   ├── index.adoc
│   ├── fonts/
│   ├── images/
│   └── themes/
├── create-book-epub.sh
├── create-book-pdf.sh
└── interactive-asciidoctor-shell.sh
```

The `book` directory is where the book content is stored:
- The `index.adoc` file is the main entry point for the book, and it's where we include all the other chapters and prelude chapters.
- The `images/` directory is where you can store images that are used in the book.
- The `chapter-01.adoc` is an example chapter that you can use as a template for your own chapters.
- In the same directory, you'll find the theme-able PDF `themes` directory, and the `fonts` directory which contains the fonts used in the book.

## Generate the AsciiDoc book

The following sections describe how to generate the book in various formats and without requiring you to have a local Ruby runtime environment or otherwise, since it is all done via Docker.

### Building the AsciiDoc book locally

To build the book locally, you'll need to have Docker installed on your machine. Once you have Docker installed, you can run the following command to build the book in PDF format:

```bash
./create-book-pdf.sh
```

Then you can find the generated PDF file in the `book` directory. If you're on a macOS, you can open it with your default PDF reader as follows:

```bash
open book/index.pdf
```

### Helpful AsciiDoc Scripts

The asciidoc book starter repository also provides a few helpful scripts to help you generate other book output formats and debug the asciidoctor tool:
- `create-book-epub.sh` - Generates the book in ePUB format.
- `interactive-asciidoctor-shell.sh` - Starts an interactive shell inside the Docker image with the `asciidoctor` tool installed.

## AsciiDoc Book Assets

Static assets for the book are stored in the `book` directory, and include the following:
- The `images` directory is where you can store images that are used in the book. Inside this directory is a `cover.jpeg` image used for the book's cover, and a `space.jpeg` used as an example for an image in the book.
- The `fonts` directory is where you can store fonts that are used in the book. It currently houses the [Open Sans](https://fonts.google.com/specimen/Open+Sans) and [Source Code Pro](https://fonts.google.com/specimen/Source+Code+Pro?query=source+code+pro) fonts, both with their original `.zip` file archived as downloaded from the Google Fonts website as well as extracted each to its own directory.

## Summary

In conclusion, I found Asciidoc to be a bit overwhelming and a steep learning curve to begin with, but once you conquer that hill, I'm sure you'll find Asciidoc a great format for authoring books.

I hope you'll find the [AsciiDoc Book Starter](https://github.com/lirantal/asciidoc-book-starter) repository useful for your own book authoring journey.