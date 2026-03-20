# CyberIntel Ghost Theme

A dark, premium-looking Ghost theme designed specifically for publications focused on **Cyber Intelligence**, **Cybersecurity**, and **Geopolitics**.

## Features

- **Dark Theme Priority:** Neon accents (green, purple, red, burgundy) on deep dark backgrounds.
- **Cyber Aesthetic:** Terminal-style UI elements, CRT scanline overlay, and matrix-style glow effects.
- **Hero Section:** Dynamic terminal typewriter animation out of the box.
- **Component Styling:** Custom dark cards, code blocks, quote blocks, and tables.
- **Custom Error Page:** Terminal-style 404/500 pages mimicking a command line scan.
- **Responsive Images:** Fully optimized `srcset` with WebP and AVIF formats for maximum performance.
- **Multilingual Support:** Fully localizable with built-in English (`en`) and Turkish (`tr`) locales.
- **Membership Support:** Custom styled `signup`, `signin`, and `account` pages perfectly integrated with the dark theme.
- **Developer Ready:** Built with PostCSS, Rollup, and Handlebars.

## Installation

1. Run the build command to generate the final CSS and JS assets:
```bash
npm install --legacy-peer-deps
npm run build
```

2. Zip the theme using the provided script:
```bash
npm run zip
```

3. Upload the generated `cyberintel-ghost-theme.zip` file to your Ghost Admin interface under **Settings > Design > Change theme > Upload theme**.

## Development

This theme uses PostCSS for CSS variables and nesting, and Rollup for JS bundling.

```bash
# Start the development server with live reload
npm run dev
```

During development, Assets are compiled to `assets/built/`. Standard Ghost Handlebars conventions apply.

## Custom Settings

Ghost automatically pulls custom configurations from `package.json`. The following settings are available in Ghost Admin:
- **Posts per page:** Defaults to `12`.
- **Card Assets:** Enabled by default.

## GScan Verification

Before uploading to production, ensure your theme meets Ghost's requirements using the GScan tool:

```bash
npm run test
```

Or test the zip file directly if you have GScan installed globally:
```bash
gscan -z cyberintel-ghost-theme.zip
```

For more documentation on Ghost theme development, visit the official [Ghost Themes Documentation](https://docs.ghost.org/themes).

## Context / Inspiration
Modeled to feel like a high-level threat intelligence dashboard, this theme transforms standard blogs into professional OSINT and cyber analysis platforms.

***
Built on top of the TryGhost/Starter template.
