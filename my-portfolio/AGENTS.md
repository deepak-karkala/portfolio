# AGENTS.md

This file provides guidance to OpenAI Codex when working with code in this repository.

## Development Commands

```bash
# Development server with Turbopack (faster builds)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

The dev server runs on `http://localhost:3000` by default (or the next available port if 3000 is taken).

## Architecture Overview

This is a **Next.js 15.3.3** portfolio website using the **App Router** with **TypeScript** and **Tailwind CSS v4**. The site showcases AI/ML expertise through a markdown-based content management system.

### Core Architecture

**Content Management System**
- **Markdown-driven**: All content (case studies, products, playbooks, research) stored as `.md` files in `content/` directories
- **Front matter processing**: Uses `gray-matter` to parse YAML metadata from markdown files
- **Dynamic page generation**: Static site generation for all content types using Next.js dynamic routes
- **Centralized content utilities**: `lib/content.ts` provides typed content fetching functions

**Theme System**
- **CSS Custom Properties**: Uses CSS variables for theming instead of Tailwind's built-in dark mode
- **Manual toggle**: `ThemeToggle` component manages light/dark mode with localStorage persistence
- **System preference detection**: Respects user's OS dark mode preference as default
- **Warm & Earthy palette**: Current design uses sage green, terracotta, and coral colors

**Component Architecture**
- **Layout components**: `Header`, `Footer`, `ThemeToggle` provide consistent site structure  
- **Page components**: Each route has its own page component that fetches and displays relevant content
- **Dynamic routing**: `[slug]` routes for case studies, products, playbooks, and research detail pages

### Content Structure

```
content/
├── case-studies/     # Professional project case studies
├── products/         # AI product showcases  
├── playbooks/        # Educational guides and courses
├── research/         # Research projects and publications
└── blog/             # Blog posts (ready for future use)
```

Each markdown file requires this front matter structure:
```yaml
---
title: 'Content Title'
summary: 'Brief description'  
date: 'YYYY-MM-DD'
category: 'Content Category'
techStack: ['Tech1', 'Tech2']  # Optional
status: 'Status'               # Optional for products
---
```

### Theme Implementation Details

**CSS Variable System** (in `app/globals.css`):
- `:root` defines light mode colors
- `.dark` class overrides for dark mode  
- `.light` class for explicit light mode override
- System preference media query with `:not(.light)` specificity

**Color Palette Variables**:
- `--color-background`: Main background
- `--color-primary`: Text and secondary elements  
- `--color-secondary`: Accent elements
- `--color-accent`: Call-to-action buttons
- `--color-foreground`: Main text
- `--color-card-bg` / `--color-card-border`: Card styling

**Theme Toggle Logic**:
- Manages `.dark` and `.light` classes on document root
- Prevents hydration mismatches with mounted state
- Saves preference to localStorage
- Handles system preference detection

### Key Files and Patterns

**Content Utilities** (`lib/content.ts`):
- `getAllContent(contentType)`: Fetches all items of a content type
- `getContentBySlug(contentType, slug)`: Fetches single item by slug
- Convenience functions: `getCaseStudies()`, `getProducts()`, etc.
- Automatic directory creation if content folders don't exist

**Dynamic Routes**:
- `app/[content-type]/page.tsx`: List view for content type
- `app/[content-type]/[slug]/page.tsx`: Detail view for individual content

**Styling Approach**:
- **Tailwind v4** with CSS-in-JS style attributes for theme variables
- Custom utility classes: `.btn-primary`, `.btn-secondary`, `.card`
- Responsive design with mobile-first approach

## Adding New Content

1. **Create markdown file** in appropriate `content/` subdirectory
2. **Include required front matter** with title, summary, date
3. **Content automatically appears** on list and detail pages
4. **Images**: Reference from `/public/images/` directory
5. **Tech stacks**: Use array format in front matter

## Switching Color Palettes

Three predefined palettes are available in `tailwind.config.ts`:
1. **Warm & Earthy** (current): Sage green, terracotta, coral
2. **Cool & Professional**: Navy, blue-gray, teal  
3. **Modern & Sophisticated**: Charcoal, purple, amber

Comment/uncomment the desired palette in the Tailwind config, or modify the CSS variables in `globals.css` for live updates.

## Development Notes

- **Turbopack enabled** for faster development builds
- **TypeScript strict mode** enforced
- **Server components** used by default (pages are async)
- **Markdown processing** happens at build time for static generation
- **Theme state** managed client-side to prevent hydration issues