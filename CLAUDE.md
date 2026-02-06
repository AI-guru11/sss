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
├── index.html              # Single-page app (~850 lines)
├── manifest.json           # PWA manifest (RTL, Arabic, standalone)
├── service-worker.js       # Offline-first caching (v11)
├── CLAUDE.md               # This file
│
├── css/
│   └── style.css           # Theme system, glass effects, animations, slider system
│
├── js/
│   └── app.js              # Alpine.js component functions
│
├── data/                   # Data-driven content layer
│   ├── config.js           # Site branding, contact, location, social
│   ├── products.js         # Product catalog (24 items, 7 categories)
│   ├── portfolio.js        # Brief wizard + Our Works (15 projects, 6 categories)
│   ├── services.js         # Main services (3 pillars, 24 sub-services) + brief wizard data
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
| `products.js` | `PRODUCTS_DATA` | Categories (7) + products (24) with prices |
| `portfolio.js` | `PORTFOLIO_DATA` | Brief projects + Our Works (15 projects, 6 categories) + gallery + stats |
| `services.js` | `SERVICES_DATA` | Main services (3 pillars: Creative Design, Marketing, Advertising/Printing) + brief wizard categories/styles |
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
| `productsShop()` | Product catalog with category-based horizontal sliders, cart management, WhatsApp checkout. Dual-mode: slider view (all categories) + grid view (single category). RTL-aware scroll navigation. |
| `workGallery()` | Portfolio projects modal gallery |
| `transformationsData()` | Transformation section statistics |
| `partnersCarousel()` | Infinite-scroll partner logos |
| `beforeAfter()` | Drag slider for before/after comparisons |

**Inline Alpine.js Components (in `index.html`):**
| Component | Purpose |
|-----------|---------|
| `#services` | Services section: displays 3 main service pillars with nested sub-services (24 total). Bento glass cards with gradients. |
| `#our-works` | Our Works section: category-based horizontal sliders (same system as products). 15 projects across 6 categories. Dual-mode view. |

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
- To add products: Edit `data/products.js` (categories array + products array)
- To add Our Works projects: Edit `data/portfolio.js` (ourWorks array, ensure category matches workCategories)
- To add/modify main services: Edit `data/services.js` (mainServices array - 3 pillars with sub-services)
- To update Brief Wizard projects: Edit `data/portfolio.js` (briefProjects array)
- To change contact info: Edit `data/config.js`
- To update partners: Edit `data/partners.js`

**Important:** When adding new categories to products or portfolio, update both the category definitions and the items array to maintain consistency.

### UI Standards
- Follow existing glass/bento aesthetic with `.noise` class
- Maintain professional typography and whitespace
- Use CSS variables for colors to ensure theme compatibility
- Test both dark and light themes when making visual changes
- **Slider System Constraints:**
  - Use existing `.horizontal-slider`, `.slider-container`, `.slider-arrow` classes
  - Desktop: 3 cards visible (`flex: 0 0 calc(33.333% - 1rem)`)
  - Mobile: 1.5 cards visible (`flex: 0 0 66.666%`)
  - RTL-aware scroll: direction multiplied by -1
  - Navigation arrows appear on hover (desktop only)
  - Maintain `scroll-snap-type: x mandatory` for smooth UX

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

### Product Slider System
**Architecture:** Category-based horizontal sliders with dual-mode view
- **Slider Mode (default):** All categories displayed in separate horizontal rows
- **Grid Mode:** Single category expanded in traditional grid layout
- **Categories:** print, gifts, boards, rollup, exhibitions, illuminated (7 total, 24 products)

**Key Methods (in `productsShop()`):**
```javascript
categoriesWithProducts     // Filters categories with products > 0
getProductsByCategory(id)  // Returns products for specific category
scrollSlider(id, dir)      // RTL-aware horizontal scroll (dir * -1)
viewAllCategory(id)        // Switches to grid view for category
```

**Responsive Behavior:**
- Desktop: 3 cards per row, glassmorphism arrows on hover
- Mobile: 1.5 cards per row (hints more content), swipe to scroll
- Snap scrolling: `scroll-snap-type: x mandatory`

### Services Section (#services)
**Data Source:** `SERVICES_DATA.mainServices` (3 pillars)
- Creative Design: 6 services (Branding, Ad Campaigns, Social Media, Digital Illustration, Packaging, Motion)
- Marketing: 4 services (Strategy, Social Media Management, SEO, Google Ads)
- Advertising & Printing: 14 services (Signs, Stickers, Printing, Exhibitions, Gifts, Fences)

**Layout:** Responsive grid (1/2/3 columns), Bento glass cards with nested sub-service items

### Our Works Section (#our-works)
**Data Source:** `PORTFOLIO_DATA.ourWorks` (15 projects, 6 categories)
- Uses same slider system as products
- Categories: creative-design, marketing, advertising-printing, branding, events, digital
- Each work: gradient background, icon, tags, description
- Dual-mode: slider view (all categories) + grid view (single category)

### Brief Wizard Flow
1. Select category (step 1)
2. Choose design style (step 2)
3. View matched portfolio examples (step 3)
4. Enter contact info and send via WhatsApp
