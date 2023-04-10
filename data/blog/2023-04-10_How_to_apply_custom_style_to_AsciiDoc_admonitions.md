---
title: How to apply custom admonition styles to AsciiDoc
description: >-
  Customizing AsciiDoc can be challenging at times, especially when it comes to admonitions. In this article, I'll show you how to apply custom admonition styles to your AsciiDoc book.
date: '2023-04-10'
pubDate: '2023-04-10'
categories: []
keywords: []
draft: false
tags: ["writing", "content", "book", "author", "asciidoc", "selfpublishing", "asciidoctor"]
slug: how-to-apply-custom-admonition-styles-to-asciidoc
image: ~/assets/images/blog/
---

## What are AsciiDoc admonitions?

AsciiDoc admonitions are a way to highlight important information in your document. If you've ever read a book and seen a note or warning in the margin, you've seen an admonition.

They are a way to draw attention to a particular piece of information in your book or document. They are also a way to add a visual cue to your document to help the reader understand the importance of the information, or provide them with tips, or fun facts.

## What are the default admonition styles?

AsciiDoc comes with a set of default admonition styles that you can use in your book. These are the default styles that are available and they're described in the [AsciiDoc User Guide](https://asciidoctor.org/docs/user-manual/#admonition) as follows:
- `NOTE`
- `TIP`
- `IMPORTANT`
- `WARNING`
- `CAUTION`

The default set of admonition styles are great and they can be customized to your liking through the PDF theming capabilities of `asciidoctor-pdf`. Here's how you'd apply a custom admonition style to your theme in an AsciiDoc document:

```yaml
admonition:
  font-size: $base-font-size
  font-color: $theme-colors-admonition-font
  text-align: left
  # all admonitions will have a width of 0 because
  # we want to disable drawing them altogether
  column-rule-color: $theme-colors-tip-background
  column-rule-width: 0
  background-color: #FFFFFF
  border-color: #E6E8FA
  border-radius: 3
  border-style: dashed
  font-kerning: none
  font-style: normal
  padding: 0.3cm
  icon:
    # icon name specified as:
    # <icon set>-<icon name>
    # all prawn icon sets are supported, see: https://github.com/jessedoyle/prawn-icon/tree/master
    # for Font Awesome 5, use the fas- prefix
    note:
      # we are disabling fonts, hence it is 0
      # otherwise, use $base-font-size
      size: 0
      name: $theme-admonition-note-icon-name
      stroke-color: $base-font-color
    tip:
      # we are disabling fonts, hence it is 0
      # otherwise, use $base-font-size
      size: 0
      name: $theme-admonition-tip-icon-name
      stroke-color: $base-font-color
    warning:
      # we are disabling fonts, hence it is 0
      # otherwise, use $base-font-size
      size: 0
      name: fas-fire
      stroke-color: $base-font-color
      # or, instead of an icon you can provide an image:
      # image: bulb.png
```

A lot of custom styling can be applied which is great, however, if you want to add your own custom admonition styles this isn't possible out of the box with the AsciiDoc PDF toolchain. To differentiate your AsciiDoc admonition style you'd have to declare a custom Ruby extension that will enable this.

## How to add custom admonition styles to AsciiDoc

The `asciidcotor-pdf` GitHub repository has an [examples directory](https://github.com/asciidoctor/asciidoctor-pdf/tree/main/docs/modules/extend/examples) with a lot of examples of how to customize the PDF output of your AsciiDoc documents using Ruby extensions. 

The repository also includes the Ruby code file [pdf-converter-admonition-theme-per-type.rb](./pdf-converter-admonition-theme-per-type.rb) to allow you to theme admonitions per type, such as:

```yaml
admonition:
  text-align: left
  column-rule-color: #eeeeee
  column-rule-width: 0.5
  
admonition_tip:
  background-color: #ede8fa
  border-color: #872de6
  text-align: left
  border-radius: 3
  border-style: dashed
  font-kerning: none
  padding: 0.3cm
```

Then, to apply the custom theming as part of the PDF generation, you need to instruct the `asciidoctor-pdf` command line tool to load the Ruby extension using the `-r` command line argument which  references the local extension Ruby file once you downloaded it and made it available on disk:

```bash
$ asciidoctor-pdf \
    -r ./themes/pdf-converter-admonition-theme-per-type.rb \
    -a pdf-themesdir=./themes \
    -a pdf-theme="basic" \
    -D ./output \
    ./book/index.adoc
```

Dan Allen, the co-creator of AsciiDoc, updated the official documentation for [extended converter use-cases](https://docs.asciidoctor.org/pdf-converter/latest/extend/use-cases/) to include a section on how to add custom admonition styles to AsciiDoc.

This article is based on the [AsciiDoc Book Starter](https://github.com/lirantal/asciidoc-book-starter) template repository on GitHub for authoring books using AsciiDoc.
