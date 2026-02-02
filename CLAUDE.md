# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Safi Group (مجموعة الصافي) — A creative agency portfolio website featuring a modern bento glass UI design with Arabic RTL layout. This is a static PWA (Progressive Web App) for an advertising and marketing agency based in Muhayl Asir, Saudi Arabia.

## Tech Stack

- **HTML5/CSS3/Vanilla ES6+ JavaScript** — No build tools, no Node.js
- **Tailwind CSS** via CDN with inline configuration
- **Alpine.js** for reactive UI components (x-data, x-show, @click directives)
- **PWA** with service worker for offline support
- **Tajawal** Arabic font from Google Fonts

## Development Commands

```bash
# Run local development server
python -m http.server 5000 --bind 0.0.0.0

# Site accessible at http://localhost:5000
```

## Architecture

### File Structure
- `index.html` — Single-page app with all sections (services, products, gallery, brief wizard, contact)
- `css/style.css` — CSS variables for theming (dark/light), glass effects, animations
- `js/app.js` — Alpine.js component functions and site configuration
- `service-worker.js` — Offline-first caching with stale-while-revalidate strategy

### Key Alpine.js Components (defined in `js/app.js`)
| Function | Purpose |
|----------|---------|
| `fikraApp()` | Main app state: theme toggle, mobile menu, header scroll behavior |
| `briefWizard()` | Multi-step client inquiry form with style matching |
| `productsShop()` | Product catalog with cart and WhatsApp checkout |
| `workGallery()` | Portfolio projects modal gallery |
| `beforeAfter()` | Drag slider for before/after comparisons |

### Theming System
- CSS variables in `:root` (dark) and `html.idea` (light mode)
- Theme persisted in `localStorage` as `fikra_theme`
- Toggle via `toggleTheme()` method switches between `dark` and `idea` classes

### Site Configuration
All contact/brand info centralized in `SITE_CONFIG` object in `js/app.js`:
```javascript
SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: { name: 'مجموعة الصافي', tagline: 'SAFI GROUP' }
}
```

## Development Constraints

1. **No Node.js/NPM** — Use CDN-hosted libraries only (Tailwind, Alpine.js)
2. **RTL Layout** — All UI is right-to-left Arabic; use `dir="rtl"` and RTL-aware CSS
3. **Service Worker** — Update `CACHE_VERSION` in `service-worker.js` when deploying changes
4. **Glass UI Pattern** — Cards use `.noise` class with `backdrop-blur`, CSS variable borders

## Workflow Protocol

### Safe-Edit Rule
Never edit a file without reading it first. Follow: Read → Think → Edit

### Modular Development
Complete one functional module fully before moving to the next. Each Alpine.js component should be self-contained and testable.

### UI Standards
- Follow existing glass/bento aesthetic
- Maintain professional typography and whitespace
- Use CSS variables for colors to ensure theme compatibility
