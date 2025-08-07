# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website called "ramblings and musings" - a personal blog/writing collection. The site contains essays, poems, and personal reflections hosted as individual HTML pages.

## Structure

- `index.html` - Main landing page with navigation menu
- `*.html` - Individual essay/story pages (coffee.html, beliefs.html, etc.)
- `/css/` - Stylesheets (normalize.css, skeleton.css, custom.css)  
- `/images/` - Static assets (favicon, etc.)
- `README.md` - Simple project description
- `.gitignore` - Git ignore file for common development files
- No build system, package managers, or dependencies

## Development

This is a pure HTML/CSS static site with no build process:

- **Local Development**: Open HTML files directly in browser or use a simple HTTP server
- **No Build Commands**: Files are served as-is
- **No Testing Framework**: Content is manually reviewed
- **Deployment**: Files can be directly uploaded to any static hosting service

## Architecture

- **Framework**: None - vanilla HTML/CSS
- **Styling**: Uses Skeleton CSS framework as base with custom overrides
- **Typography**: EB Garamond font from Google Fonts
- **Layout**: Responsive design with mobile/desktop breakpoints
- **Navigation**: Simple anchor links from index.html to individual pages and external projects

## Content Structure

Each content page follows a consistent structure:
- Standard HTML5 boilerplate with shared CSS imports
- Container div with either `story-container` or `menu-container` class
- Page title, optional subtitle, and content
- Responsive typography scaling based on viewport

## Common Operations

- **Add New Content**: Create new HTML file in root directory following existing page structure
- **Update Styling**: Modify `/css/custom.css`
- **Update Navigation**: Edit links in `index.html`
- **Add External Links**: Update the menu links in `index.html` to include new projects or external sites