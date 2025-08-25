# Website Design Documentation

## Overview

This is Liran Tal's personal website built with Astro, featuring a blog, interactive tools, and professional information.

## Architecture

### Framework
- **Astro**: Static site generator with modern web technologies
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript

### Project Structure

```
src/
├── components/
│   └── widgets/
│       └── Footer.astro          # Site footer component
├── config.mjs                    # Site configuration
├── layouts/
│   └── PageLayout.astro          # Base page layout
├── pages/
│   ├── index.astro               # Homepage
│   ├── recognitions.astro        # Awards and recognitions page
│   ├── games/
│   │   └── chatgpt-security-models-ui.astro  # Interactive security game
│   └── books/
│       └── nodejs-secure-coding.astro        # Book page
├── assets/
├── data/
└── utils/
```

## Configuration System

### Site Configuration (`src/config.mjs`)

The site uses a centralized configuration system with the following main exports:

#### PROFILE
Contains social media links and professional profiles:
- GitHub, Twitter, LinkedIn, Mastodon URLs
- Used throughout the site for social links

#### FOOTER
Defines the footer structure with columns:
- **Open Source Projects**: Links to GitHub repositories
- **Published Author**: Books and publications
- **Awards**: GitHub Stars, OpenJS Foundation awards
- **Interactive Tools**: Games and interactive content

#### SITE
Basic site metadata:
- Name, origin, title, description
- SEO and analytics configuration

#### BLOG
Blog-specific configuration:
- Posts per page, permalinks structure
- Category and tag settings

## Components

### Footer Component (`src/components/widgets/Footer.astro`)

**Layout Structure:**
- 12-column CSS Grid layout
- Responsive design with different column spans:
  - Large screens: "Liran Tal" section (3 cols) + 4 footer columns (2 cols each) = 11/12 cols
  - Medium screens: 6 columns per section (stacked)
  - Small screens: Full width sections (stacked)

**Content Sections:**
1. **Brand section**: Site name + Recognitions link
2. **Dynamic columns**: Rendered from `FOOTER.columns` configuration
3. **Social links**: RSS, LinkedIn, Twitter, GitHub, Mastodon
4. **Copyright**: Year + theme attribution

**Styling:**
- Dark mode support with Tailwind dark: variants
- Hover effects and transitions
- Icon support via astro-icon package

## Pages

### Interactive Tools

#### ChatGPT Security Models UI (`/games/chatgpt-security-models-ui`)
- Interactive security demonstration
- Embedded iframe content
- Educational tool about AI security models

## Recent Changes

### Footer Enhancement (Aug 25, 2025)
- Added new "Interactive Tools" column to footer
- Included link to ChatGPT Security Models game
- Updated responsive grid layout to accommodate 4 footer columns
- Modified column spans: lg:col-span-2 for footer columns, lg:col-span-3 for brand section

## Design Principles

### Responsive Design
- Mobile-first approach
- Progressive enhancement for larger screens
- Consistent spacing and typography

### Content Organization
- Clear hierarchical structure
- Logical grouping in footer sections
- Easy navigation between related content

### Maintainability
- Configuration-driven content
- Reusable components
- Consistent styling patterns

## Development Notes

### Adding Footer Links
1. Update `FOOTER.columns` array in `src/config.mjs`
2. Footer component automatically renders new columns
3. Ensure grid layout accommodates column count
4. Test responsive behavior across screen sizes

### Content Management
- Blog posts stored in `data/blog/` as Markdown files
- Static assets in `src/assets/` and `public/`
- Configuration-based approach for most site content
