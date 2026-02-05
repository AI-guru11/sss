# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Safi Group (مجموعة الصافي)** — A creative agency portfolio website featuring a modern bento glass UI design with Arabic RTL layout. This is a static PWA (Progressive Web App) for an advertising and marketing agency based in Muhayl Asir, Saudi Arabia.

## Tech Stack

- **HTML5/CSS3/Vanilla ES6+ JavaScript** — No build tools, no Node.js
- **Tailwind CSS** via CDN (`https://cdn.tailwindcss.com`) with inline configuration (`darkMode: 'class'`)
- **Alpine.js 3.x** for reactive UI components (x-data, x-show, x-for, @click directives)
- **Alpine Focus Plugin 3.x** for focus management in modals
- **PWA** with service worker for offline-first support
- **Tajawal** Arabic font from Google Fonts (weights: 400, 500, 700, 800)

## Development Commands

```bash
# Run local development server
python -m http.server 5000 --bind 0.0.0.0

# Site accessible at http://localhost:5000
```

No build step required. All dependencies are loaded via CDN.

## Architecture

### File Structure

```
/
├── index.html              # Single-page app (602 lines)
├── manifest.json           # PWA manifest (RTL, Arabic, standalone)
├── service-worker.js       # Offline-first caching (v11)
├── CLAUDE.md               # This file
├── DEVELOPMENT_ROADMAP.md  # Implementation log (aspirational — see note below)
├── replit.md               # Replit deployment guide
├── .gitignore              # Git ignore rules (venvs, .env, __pycache__)
│
├── css/
│   └── style.css           # Theme system, glass effects, animations (158 lines)
│
├── js/
│   └── app.js              # Alpine.js component functions (194 lines, 7 functions)
│
├── data/                   # Data-driven content layer
│   ├── config.js           # Site branding, contact, location, social
│   ├── products.js         # Product catalog (24 items, 7 categories incl. "all")
│   ├── portfolio.js        # Brief wizard projects (6) + gallery projects (3) + stats
│   ├── services.js         # Service categories, design styles, "Why Safi" points
│   └── partners.js         # Client/partner logos (8 orgs)
│
├── assets/
│   ├── logo.webp           # Main brand logo
│   └── icons/
│       ├── icon-192.webp   # PWA icon (small)
│       └── icon-512.webp   # PWA icon (large)
│
└── (tooling — not part of the website)
    ├── product_manager.py  # AI product description generator (OpenRouter API)
    └── products.json       # AI-generated product output (not used by site)
```

> **Note on `DEVELOPMENT_ROADMAP.md`:** This file describes 13 features across 3 phases, but many (AI consultant, analytics dashboard, campaign simulator, brand playground, collaboration hub, educational hub, service comparison) are **not implemented** in the current codebase. Only the 7 component functions in `js/app.js` exist. Treat the roadmap as aspirational documentation, not as a description of current functionality.

### Data-Driven Architecture

Content is separated from presentation. All dynamic data lives in `/data/*.js` files and is exported to the `window` global scope:

| File | Global Export | Purpose |
|------|--------------|---------|
| `config.js` | `window.SITE_CONFIG` | WhatsApp number, email, brand info, location, social links |
| `products.js` | `window.PRODUCTS_DATA` | Categories array (7) + products array (24) with prices |
| `portfolio.js` | `window.PORTFOLIO_DATA` | Brief projects (6), gallery projects (3), transformation stats |
| `services.js` | `window.SERVICES_DATA` | "Why Safi" points (3), brief categories (3), design styles (3) |
| `partners.js` | `window.PARTNERS_DATA` | Partner organization icons and names (8) |

Data files are loaded as `<script>` tags in `index.html` head and accessed in Alpine.js via getters:
```javascript
get products() { return window.PRODUCTS_DATA?.products || []; }
```

### Alpine.js Components (defined in `js/app.js`)

All 7 functions are also explicitly exported to `window` at the bottom of `app.js`:

| Function | Purpose | Key State |
|----------|---------|-----------|
| `fikraApp()` | Main app: theme toggle, mobile menu, header scroll | `theme`, `mobileOpen`, `headerShrink` |
| `briefWizard()` | 3-step client inquiry form with style matching | `step`, `preferences`, `contact`, `matches` |
| `productsShop()` | Product catalog with cart and WhatsApp checkout | `cart`, `activeCategory` + computed getters |
| `workGallery()` | Portfolio projects gallery | `active`, `modalOpen` |
| `transformationsData()` | Transformation section statistics (read-only) | `title`, `desc`, `stats` |
| `partnersCarousel()` | Infinite-scroll partner logos (read-only) | getter for `partners` |
| `beforeAfter()` | Drag slider for before/after comparisons | `pos`, `dragging` |

### Tailwind CSS Inline Configuration

Custom theme extensions defined in `index.html` `<script>` block:

```javascript
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { taj: ['Tajawal', 'sans-serif'] },
      colors: {
        'fikra-orange': '#E53935',  // Red accent (CTAs, highlights)
        'fikra-violet': '#81D8D0',  // Teal/cyan accent (secondary)
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-orange': '0 0 20px rgba(229, 57, 53, 0.3)',
        'glow-violet': '0 0 20px rgba(129, 216, 208, 0.3)',
      },
      animation: { 'infinite-scroll': 'infinite-scroll 40s linear infinite' },
    }
  }
}
```

### Theming System

Two themes controlled via CSS custom properties in `css/style.css`:

| Variable | Dark (`:root`) | Light (`html.idea`) |
|----------|----------------|---------------------|
| `--bg` | `#050505` | `#F3F4F6` |
| `--bg2` | `#0a0a0a` | `#E5E7EB` |
| `--fg` | `rgba(255,255,255,0.95)` | `#111827` |
| `--muted` | `rgba(255,255,255,0.65)` | `#4B5563` |
| `--card` | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.7)` |
| `--border` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.08)` |
| `--grid` | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.04)` |
| `--blob-cyan` | `rgba(129,216,208,0.15)` | `rgba(129,216,208,0.25)` |
| `--blob-red` | `rgba(229,57,53,0.15)` | `rgba(229,57,53,0.25)` |
| `--edge-line-strong` | `rgba(255,255,255,0.55)` | `rgba(0,0,0,0.2)` |
| `--edge-line-soft` | `rgba(255,255,255,0.18)` | `rgba(0,0,0,0.05)` |

- Theme persisted in `localStorage` as `fikra_theme`
- Toggle via `toggleTheme()` method switches between `dark` and `idea` classes on `<html>`
- Body uses CSS variable references: `bg-[color:var(--bg)]`, `text-[color:var(--fg)]`

### Site Configuration

All contact/brand info centralized in `data/config.js`:
```javascript
SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: { name: 'مجموعة الصافي', tagline: 'SAFI GROUP', logo: 'assets/logo.webp' },
  location: { city: 'محايل عسير', cityEn: 'Muhayl Asir, Saudi Arabia', mapsUrl: '...' },
  social: { twitter: '', instagram: '', snapchat: '', tiktok: '' }
}
```

### Glass UI Pattern

Cards use the `.noise` class (defined in `css/style.css`) which provides:
- Semi-transparent background with `var(--card)` and optional `backdrop-blur`
- CSS variable borders (`var(--border)`)
- `::before` pseudo-element: radial-gradient texture overlay with `mix-blend-mode: overlay` (dark) / `normal` (light)
- `::after` pseudo-element: glass edge highlight lines using `--edge-line-strong` / `--edge-line-soft`
- Automatic adaptation to dark/light themes (light mode overrides texture and edge colors)
- Header/footer noise edges are hidden via `display: none !important`

### WhatsApp Integration

No backend contact forms. All inquiries go via WhatsApp:
- Brief Wizard (`sendRequest()`) sends formatted preferences message
- Product cart (`checkout()`) sends itemized order with total
- Messages constructed with template strings and `encodeURIComponent()`
- Opens in new tab via `window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=...`)`

### HTML Section Structure (`index.html`)

| Section | HTML id | x-data Binding | Description |
|---------|---------|----------------|-------------|
| Background | — | — | Fixed decorative blobs + grid overlay |
| Header | — | `fikraApp()` | Sticky nav, theme toggle, mobile drawer |
| Hero | — | — | Gradient title, 2 CTAs |
| Partners | — | `partnersCarousel()` | Infinite-scroll carousel (8 partners, duplicated for seamless loop) |
| Services | `#services` | — | "Why Safi" (3 points) + CTA card |
| Products | `#products` | `productsShop()` | Category filter + New Arrivals + Best Sellers + floating checkout |
| Transformations | `#transformations` | `transformationsData()` + `beforeAfter()` | Case study stats + before/after slider |
| Brief Wizard | `#brief` | `briefWizard()` | 3-step form: category → style → matches + contact |
| Work Gallery | `#work` | `workGallery()` + `beforeAfter()` | Before/after card + project cards with tags |
| Footer | — | — | Copyright with auto year |

## Service Worker

**Current version:** `v11` (in `CACHE_VERSION` constant)

**Cache name pattern:** `safi-pwa-v11`

**Caching strategies:**
| Request Type | Strategy |
|--------------|----------|
| Navigation (HTML) | Network-first, cache fallback to `./index.html` |
| Same-origin assets | Stale-while-revalidate |
| Cross-origin (CDN) | Cache-first with `no-cors` mode |

**Cached core assets:** `./`, `./index.html`, `./css/style.css`, `./js/app.js`, `./manifest.json`, all 5 data files, icons, and logo. Product images (from `assets/products/`) are cached dynamically on first load.

**When deploying changes:** Increment `CACHE_VERSION` in `service-worker.js`. Old caches are automatically deleted on activation.

## Product Categories

Categories defined in `data/products.js`:

| ID | Arabic Name |
|----|-------------|
| `all` | الكل |
| `print` | طباعة |
| `gifts` | هدايا |
| `boards` | لوحات |
| `rollup` | رول اب |
| `exhibitions` | معارض |
| `illuminated` | لوحات مضيئة |

Products are tagged as `'best'` (best sellers) or `'new'` (new arrivals). Each product has: `id`, `name`, `price`, `tag`, `category`, `icon` (emoji fallback), `image` (optional file in `assets/products/`), `categoryName`, `description`.

## Development Constraints

1. **No Node.js/NPM** — Use CDN-hosted libraries only (Tailwind, Alpine.js)
2. **RTL Layout** — All UI is right-to-left Arabic; `<html lang="ar" dir="rtl">`. Use RTL-aware CSS
3. **Service Worker** — Update `CACHE_VERSION` when deploying changes
4. **Glass UI Pattern** — Cards use `.noise` class with `backdrop-blur`, CSS variable borders
5. **Data Separation** — Content changes go in `/data/*.js`, not in HTML
6. **CSS Variable Colors** — Use `color:var(--...)` syntax in Tailwind (e.g., `bg-[color:var(--bg)]`) for theme compatibility
7. **No backend** — All contact flows route through WhatsApp links

## Python Tooling (Separate from Website)

`product_manager.py` is a standalone CLI script for AI-generated product descriptions:
- Uses OpenRouter API (`https://openrouter.ai/api/v1`) with `google/gemma-3-27b-it:free` model
- Requires `.env` file with `OPENROUTER_API_KEY`
- Outputs to `products.json` (not integrated into the website's `data/products.js`)
- Dependencies: `openai`, `python-dotenv`

This tooling is **not part of the website** and does not affect the static site.

## Workflow Protocol

### Safe-Edit Rule
Never edit a file without reading it first. Follow: Read -> Think -> Edit

### Modular Development
Complete one functional module fully before moving to the next. Each Alpine.js component should be self-contained and testable.

### Content Updates
- To add products: Edit `data/products.js` — add to `products` array, optionally add category to `categories`
- To add portfolio items: Edit `data/portfolio.js` — add to `briefProjects` or `galleryProjects`
- To change contact info: Edit `data/config.js`
- To modify services: Edit `data/services.js`
- To update partners: Edit `data/partners.js`

### UI Standards
- Follow existing glass/bento aesthetic with `.noise` class
- Maintain professional typography and whitespace
- Use CSS variables for colors to ensure theme compatibility
- Test both dark (`dark` class) and light (`idea` class) themes when making visual changes
- Use Tailwind utility classes with CSS variable references: `bg-[color:var(--card)]`, `text-[color:var(--fg)]`

### Deployment Checklist
1. Test locally with `python -m http.server 5000`
2. Verify both themes work correctly
3. Check mobile responsive layout
4. Increment `CACHE_VERSION` in `service-worker.js`
5. Test PWA offline functionality

## Key Implementation Details

### Mobile Menu
- Controlled by `mobileOpen` state in `fikraApp()`
- Slide-out drawer from right side (RTL) with backdrop blur
- Closes on link click, outside tap, or Escape key (`@keydown.escape.window`)

### Header Scroll Effect
- `headerShrink` value (0-1) calculated from `window.scrollY / 120`
- Drives dynamic padding classes: `py-2` when shrunk, `py-4` when expanded
- Exposed as CSS custom property: `--shrink`
- Throttled via `{ passive: true }` scroll listener

### Brief Wizard Flow
1. Select category — `decor`, `branding`, or `events` (step 1)
2. Choose design style — `modern`, `classic`, or `neon` (step 2)
3. View matched portfolio examples from `PORTFOLIO_DATA.briefProjects` (step 3)
4. Enter name + phone, send via WhatsApp

### Product Shop Flow
1. Filter by category tabs (defaults to `'all'`)
2. Browse "New Arrivals" (`tag: 'new'`) and "Best Sellers" (`tag: 'best'`) horizontal scrollers
3. Add items to cart (toggle, no quantity)
4. Floating checkout button sends itemized order via WhatsApp

### Before/After Slider
- Reusable `beforeAfter()` component used in both Transformations and Work Gallery sections
- Tracks pointer position as percentage (`pos: 0-100`)
- Supports mouse and touch events
- Uses `clip-path: inset()` or width percentage for reveal effect

### CSS Animations
- `[data-reveal]`: Scroll reveal with `opacity` + `translateY` transition (0.8s cubic-bezier)
- `.product-card`: 3D hover effect (translateY -5px, elevated box-shadow)
- `.animate-infinite-scroll`: 40s linear infinite horizontal scroll for partner carousel
- `[x-cloak]`: Hides Alpine content until framework initializes
