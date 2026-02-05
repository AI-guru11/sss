# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Safi Group (مجموعة الصافي)** — A creative agency portfolio website featuring a modern bento glass UI design with Arabic RTL layout. This is a static PWA (Progressive Web App) for an advertising and marketing agency based in Muhayl Asir, Saudi Arabia.

## Tech Stack

- **HTML5/CSS3/Vanilla ES6+ JavaScript** — No build tools, no Node.js
- **Tailwind CSS** via CDN with inline configuration (`darkMode: 'class'`)
- **Alpine.js 3.x** for reactive UI components (x-data, x-show, x-for, @click directives)
- **Alpine Focus Plugin** for focus management in modals
- **PWA** with service worker for offline-first support
- **Tajawal** Arabic font from Google Fonts

## Development Commands

```bash
# Run local development server
python -m http.server 5000 --bind 0.0.0.0

# Site accessible at http://localhost:5000
```

## Architecture

### File Structure

```
/
├── index.html              # Single-page app (~600 lines)
├── manifest.json           # PWA manifest (RTL, Arabic, standalone)
├── service-worker.js       # Offline-first caching (v11)
├── CLAUDE.md               # This file
│
├── css/
│   └── style.css           # Theme system, glass effects, animations
│
├── js/
│   └── app.js              # Alpine.js component functions
│
├── data/                   # Data-driven content layer
│   ├── config.js           # Site branding, contact, location, social
│   ├── products.js         # Product catalog (24 items, 7 categories)
│   ├── portfolio.js        # Brief wizard projects + gallery + stats
│   ├── services.js         # Service categories and design styles
│   └── partners.js         # Client/partner logos (8 orgs)
│
└── assets/
    ├── logo.webp           # Main brand logo
    └── icons/
        ├── icon-192.webp   # PWA icon (small)
        └── icon-512.webp   # PWA icon (large)
```

### Data-Driven Architecture

Content is separated from presentation. All dynamic data lives in `/data/*.js` files:

| File | Exports | Purpose |
|------|---------|---------|
| `config.js` | `SITE_CONFIG` | WhatsApp, email, brand info, location, social links |
| `products.js` | `PRODUCTS_DATA` | Categories array + products array with prices |
| `portfolio.js` | `PORTFOLIO_DATA` | Brief projects, gallery projects, transformation stats |
| `services.js` | `SERVICES_DATA` | Service categories, design style options |
| `partners.js` | `PARTNERS_DATA` | Partner organization icons and names |

Data files export to `window` global scope and are accessed via Alpine.js getters:
```javascript
get products() { return window.PRODUCTS_DATA?.products || []; }
```

### Alpine.js Components (defined in `js/app.js`)

| Function | Purpose |
|----------|---------|
| `fikraApp()` | Main app state: theme toggle, mobile menu, header scroll behavior |
| `briefWizard()` | Multi-step client inquiry form with style matching |
| `productsShop()` | Product catalog with cart and WhatsApp checkout |
| `workGallery()` | Portfolio projects modal gallery |
| `transformationsData()` | Transformation section statistics |
| `partnersCarousel()` | Infinite-scroll partner logos |
| `beforeAfter()` | Drag slider for before/after comparisons |

### Theming System

Two themes controlled via CSS variables:

| Variable | Dark (`:root`) | Light (`html.idea`) |
|----------|----------------|---------------------|
| `--bg` | `#0A0A0A` | `#F8F6F3` |
| `--fg` | `#FAFAFA` | `#1A1A1A` |
| `--card` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.03)` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |

- Theme persisted in `localStorage` as `fikra_theme`
- Toggle via `toggleTheme()` method switches between `dark` and `idea` classes

### Site Configuration

All contact/brand info centralized in `data/config.js`:
```javascript
SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: { name: 'مجموعة الصافي', tagline: 'SAFI GROUP', logo: 'assets/logo.webp' },
  location: { city: 'محايل عسير', cityEn: 'Muhayl Asir, Saudi Arabia' }
}
```

### Glass UI Pattern

Cards use the `.noise` class which provides:
- Semi-transparent background with `backdrop-blur`
- CSS variable borders (`var(--border)`)
- Pseudo-element texture overlay (radial gradients)
- Glass edge highlight via linear gradients
- Automatic adaptation to dark/light themes

### WhatsApp Integration

No backend contact forms. All inquiries go via WhatsApp:
- Brief Wizard sends formatted preferences message
- Product cart checkout sends itemized order
- Messages constructed with template strings and `encodeURIComponent()`

## Service Worker

**Current version:** `v11` (in `CACHE_VERSION` constant)

**Caching strategies:**
| Request Type | Strategy |
|--------------|----------|
| Navigation (HTML) | Network-first, cache fallback to `index.html` |
| Same-origin assets | Stale-while-revalidate |
| Cross-origin (CDN) | Cache-first with `no-cors` mode |

**Cached assets:** All core HTML/CSS/JS, data files, icons, and logo. Product images cached dynamically on first load.

**When deploying changes:** Increment `CACHE_VERSION` in `service-worker.js`.

## Development Constraints

1. **No Node.js/NPM** — Use CDN-hosted libraries only (Tailwind, Alpine.js)
2. **RTL Layout** — All UI is right-to-left Arabic; use `dir="rtl"` and RTL-aware CSS
3. **Service Worker** — Update `CACHE_VERSION` when deploying changes
4. **Glass UI Pattern** — Cards use `.noise` class with `backdrop-blur`, CSS variable borders
5. **Data Separation** — Content changes go in `/data/*.js`, not in HTML

## Workflow Protocol

### Safe-Edit Rule
Never edit a file without reading it first. Follow: Read -> Think -> Edit

### Modular Development
Complete one functional module fully before moving to the next. Each Alpine.js component should be self-contained and testable.

### Content Updates
- To add products: Edit `data/products.js`
- To add portfolio items: Edit `data/portfolio.js`
- To change contact info: Edit `data/config.js`
- To modify services: Edit `data/services.js`
- To update partners: Edit `data/partners.js`

### UI Standards
- Follow existing glass/bento aesthetic
- Maintain professional typography and whitespace
- Use CSS variables for colors to ensure theme compatibility
- Test both dark and light themes when making visual changes

### Deployment Checklist
1. Test locally with `python -m http.server 5000`
2. Verify both themes work correctly
3. Check mobile responsive layout
4. Increment `CACHE_VERSION` in `service-worker.js`
5. Test PWA offline functionality

## Key Implementation Details

### Mobile Menu
- Controlled by `mobileOpen` state in `fikraApp()`
- Slide-out animation with backdrop blur
- Closes on link click or outside tap

### Header Scroll Effect
- `headerShrink` value (0-1) calculated from scroll position
- Used for dynamic padding/opacity transitions
- Throttled via `{ passive: true }` scroll listener

### Product Categories
Categories defined in `data/products.js`: print, gifts, boards, rollup, exhibitions, illuminated, packages

### Brief Wizard Flow
1. Select category (step 1)
2. Choose design style (step 2)
3. View matched portfolio examples (step 3)
4. Enter contact info and send via WhatsApp
