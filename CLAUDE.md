# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Safi Group (مجموعة الصافي)** — A creative agency portfolio website featuring a modern Anima-inspired bento glass UI design with Arabic RTL layout. The design uses a Red (#E53935) to Mint Green (#81D8D0) gradient palette with refined glassmorphism effects. This is a static PWA (Progressive Web App) for an advertising and marketing agency based in Muhayl Asir, Saudi Arabia.

## Tech Stack

- **HTML5/CSS3/Vanilla ES6+ JavaScript** — No build tools, no Node.js
- **Tailwind CSS** via CDN with inline configuration (`darkMode: 'class'`)
- **Alpine.js 3.x** for reactive UI components (x-data, x-show, x-for, @click directives)
- **Alpine Focus Plugin** for focus management in modals
- **PWA** with service worker for offline-first support
- **Tajawal** Arabic font (self-hosted woff2 via `@font-face` in `css/style.css`)

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
├── index.html              # Main single-page app (1,454 lines)
├── portfolio.html          # Standalone portfolio page (275 lines)
├── services.html           # Standalone services page (243 lines)
├── manifest.json           # PWA manifest (RTL, Arabic, standalone)
├── service-worker.js       # Offline-first caching (v25)
├── products.json           # Legacy product data (may be deprecated)
├── product_manager.py      # Python utility for product management
├── .gitignore              # Git ignore patterns (venv, __pycache__, .env, airtable-config.js)
├── .htaccess               # Apache web server configuration
├── CLAUDE.md               # This file — Developer guidelines & project documentation
├── DEVELOPMENT_ROADMAP.md  # Feature roadmap and planned improvements
├── SECURITY.md             # Security policies and best practices
├── replit.md               # Replit environment setup guide
└── server-config.md        # Server configuration documentation
│
├── css/
│   └── style.css           # Theme system, glass effects, animations, slider system (2,355 lines)
│
├── js/
│   ├── app.js              # Alpine.js component functions (12 components, 837 lines)
│   ├── floating-glyphs.js  # CSS-based floating icon animations for brief wizard (112 lines)
│   ├── nebula.js           # Liquid mesh background animation — Red & Mint blobs (233 lines)
│   ├── mesh-gradient.js    # Mesh gradient utilities (175 lines)
│   ├── security.js         # XSS prevention, input sanitization, safe storage (378 lines)
│   ├── airtable-service.js # Airtable API integration service (237 lines)
│   └── airtable-config.example.js # Configuration template (42 lines)
│
├── data/                   # Data-driven content layer
│   ├── config.js           # Site branding, contact, location, social
│   ├── products.js         # Product catalog (24 items, 7 categories)
│   ├── portfolio.js        # Brief wizard + Our Works (15 projects, 6 categories)
│   ├── services.js         # Main services (3 pillars, 24 sub-services) + brief wizard data
│   ├── partners.js         # Client/partner logos (8 orgs)
│   ├── testimonials.js     # Customer testimonials (6 items) + company stats (STATS_DATA)
│   └── faq.js              # Frequently asked questions (8 items, 5 categories)
│
└── assets/
    ├── logo.webp           # Main brand logo
    └── icons/
        ├── icon-192.webp   # PWA icon (small, maskable)
        └── icon-512.webp   # PWA icon (large, maskable)
```

### Data-Driven Architecture

Content is separated from presentation. All dynamic data lives in `/data/*.js` files:

| File | Exports | Purpose |
|------|---------|---------|
| `config.js` | `SITE_CONFIG` | WhatsApp, email, brand info, location, social links |
| `products.js` | `PRODUCTS_DATA` | Categories (7) + products (24) with prices |
| `portfolio.js` | `PORTFOLIO_DATA` | Brief projects (6) + Our Works (15 projects, 6 categories) + gallery (3) + stats |
| `services.js` | `SERVICES_DATA` | Main services (3 pillars: Creative Design, Marketing, Advertising/Printing) + brief wizard categories/styles |
| `partners.js` | `PARTNERS_DATA` | Partner organization icons and names (8) |
| `testimonials.js` | `TESTIMONIALS_DATA`, `STATS_DATA` | Customer testimonials (6) + company statistics (clients, projects, cities, years) |
| `faq.js` | `FAQ_DATA` | FAQ items (8) with categories: delivery, design, payment, orders, quality |

Data files export to `window` global scope and are accessed via Alpine.js getters:
```javascript
get products() { return window.PRODUCTS_DATA?.products || []; }
```

### Alpine.js Components (defined in `js/app.js`)

| # | Function | Purpose |
|---|----------|---------|
| 1 | `fikraApp()` | Main app state: theme toggle, mobile menu, header scroll behavior |
| 2 | `briefWizard()` | Multi-step client inquiry form with style matching |
| 3 | `productsShop()` | Product catalog with category-based horizontal sliders, cart management, WhatsApp checkout. Dual-mode: slider view (all categories) + grid view (single category). RTL-aware scroll navigation. |
| 4 | `transformationsData()` | Transformation section statistics |
| 5 | `workGallery()` | Portfolio projects modal gallery |
| 6 | `partnersCarousel()` | Infinite-scroll partner logos |
| 7 | `beforeAfter()` | Drag slider for before/after comparisons |
| 8 | `testimonialsCarousel()` | Customer testimonials carousel with 5s autoplay, pause on hover, star ratings |
| 9 | `faqAccordion()` | FAQ accordion with search/filter functionality |
| 10 | `statsCounter()` | Animated statistics counter with IntersectionObserver trigger |
| 11 | `priceCalculator()` | Dynamic pricing calculator (6 product types, size/finishing/quantity options, volume discounts) |
| 12 | `whatsappWidget()` | Floating WhatsApp chat widget with quick messages, auto-open after 10s for new visitors |

All 12 functions are exported to `window` scope at the bottom of `js/app.js`.

**Inline Alpine.js Components (in `index.html`):**
| Component | Purpose |
|-----------|---------|
| `#services` | Services section: displays 3 main service pillars with nested sub-services (24 total). Bento glass cards with gradients. |
| `#our-works` | Our Works section: category-based horizontal sliders (same system as products). 15 projects across 6 categories. Dual-mode view. |
| `footer` | Footer with social media links from `SITE_CONFIG.social`. Icons conditionally rendered via `x-show` when URLs are populated. |

### Animation System

Dedicated JS files handle decorative animations:

| File | Class | Purpose |
|------|-------|---------|
| `js/floating-glyphs.js` | `FloatingGlyphsCSS` | CSS-based floating icon animations for the brief wizard section. Optimized for performance with CSS transitions. 3 icons (✏️, 📢, 💡) spawning every 5 seconds. |
| `js/nebula.js` | `LiquidMesh` / `LiquidBlob` | Liquid mesh background animation with 4 organic blobs (Red #E53935 & Mint #81D8D0). Non-linear motion via sin/cos, scroll-linked parallax, breathing scale, theme-aware rendering. |
| `js/mesh-gradient.js` | Utilities | Mesh gradient helper functions and utilities. |

### Theming System

Two themes controlled via CSS variables:

| Variable | Dark (`:root`) | Light (`html.idea`) |
|----------|----------------|---------------------|
| `--bg` | `#080809` | `#FAFAFA` |
| `--bg2` | `#0a0a0a` | `#F0F0F0` |
| `--fg` | `rgba(255,255,255,0.95)` | `#111827` |
| `--muted` | `rgba(255,255,255,0.60)` | `#6B7280` |
| `--card` | `rgba(18,18,20,0.7)` | `rgba(255,255,255,0.75)` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.07)` |
| `--grid` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.03)` |
| `--blob-cyan` | `rgba(129,216,208,0.15)` | `rgba(100,190,180,0.18)` |
| `--blob-red` | `rgba(229,57,53,0.12)` | `rgba(229,57,53,0.12)` |
| `--accent-red` | `#E53935` | `#D32F2F` |
| `--accent-red-light` | `#EF5350` | `#E53935` |
| `--mint-primary` | `#81D8D0` | `#64BEB4` |
| `--edge-line-strong` | `rgba(129,216,208,0.40)` | `rgba(100,190,180,0.30)` |
| `--edge-line-soft` | `rgba(229,57,53,0.12)` | `rgba(211,47,47,0.10)` |

- Theme persisted in `localStorage` as `fikra_theme`
- Toggle via `toggleTheme()` method switches between `dark` and `idea` classes

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
- Price Calculator sends detailed quote request
- Floating WhatsApp widget offers quick-message shortcuts
- Messages constructed with template strings and `encodeURIComponent()`
- All user inputs sanitized via `security.js` before URL encoding

### Security Layer

**File:** `js/security.js` (378 lines)

Comprehensive security implementation protecting against common web vulnerabilities:

**Input Sanitization Functions:**
- `sanitizeInput()` — Prevents HTML/JavaScript injection by removing script tags and event handlers
- `sanitizeForURL()` — Encodes data safely for WhatsApp URLs
- `sanitizeName()` — Allows only Arabic, English, numbers, and common punctuation
- `sanitizeEmail()` — Validates and normalizes email addresses
- `sanitizePhone()` — Normalizes phone numbers and detects malware patterns

**Safe Storage:**
- `SafeStorage` class — Wrapper around localStorage with error handling and validation
- Prevents storage quota errors
- Validates data before storing
- Safe retrieval with fallbacks

**Security Features:**
- XSS (Cross-Site Scripting) prevention
- Input validation at all entry points (Brief Wizard, Product Cart, Price Calculator, WhatsApp Widget)
- Anti-malware detection for phone numbers
- CSRF token handling for external API calls
- Content Security Policy support

**Usage Pattern:**
```javascript
// Always sanitize user input before processing
const safeName = sanitizeName(userInput);
const safeMessage = sanitizeForURL(message);
```

### Airtable Integration

**Files:**
- `js/airtable-service.js` (237 lines) — API integration service
- `js/airtable-config.example.js` (42 lines) — Configuration template

**Purpose:** Optional backend integration for storing form submissions, contact requests, or analytics.

**Configuration:** Copy `airtable-config.example.js` to `airtable-config.js` and add credentials:
```javascript
window.AIRTABLE_CONFIG = {
  apiKey: 'your_api_key',
  baseId: 'your_base_id',
  tables: { contacts: 'table_name', orders: 'table_name' }
};
```

**Note:** `airtable-config.js` is git-ignored to prevent credential leaks.

## Service Worker

**Current version:** `v25` (in `CACHE_VERSION` constant)

**Caching strategies:**
| Request Type | Strategy |
|--------------|----------|
| Navigation (HTML) | Network-first, cache fallback to `index.html` |
| Same-origin assets | Stale-while-revalidate |
| Cross-origin (CDN) | Cache-first with `no-cors` mode |

**Cached assets:** All core HTML/CSS/JS, all 7 data files, icons, and logo. Product images cached dynamically on first load.

**When deploying changes:** Increment `CACHE_VERSION` in `service-worker.js`.

## Development Constraints

1. **No Node.js/NPM** — Use CDN-hosted libraries only (Tailwind, Alpine.js)
2. **RTL Layout** — All UI is right-to-left Arabic; use `dir="rtl"` and RTL-aware CSS
3. **Service Worker** — Update `CACHE_VERSION` when deploying changes
4. **Glass UI Pattern** — Cards use `.noise` class with `backdrop-blur`, CSS variable borders
5. **Data Separation** — Content changes go in `/data/*.js`, not in HTML
6. **No Backend** — All contact/order flows use WhatsApp deep links
7. **Security First** — Always use `security.js` sanitization functions for user input

## Configuration Files

### `.gitignore`
Excludes from version control:
- `venv/` — Python virtual environment
- `__pycache__/` — Python bytecode cache
- `.env` — Environment variables
- `airtable-config.js` — Sensitive API credentials

### `.htaccess` (Apache Configuration)
- URL rewriting rules for clean URLs
- SPA (Single Page Application) routing support
- Security headers and CORS configuration
- MIME type definitions
- Caching rules for static assets

### `server-config.md`
Comprehensive server configuration documentation:
- Apache/Nginx setup instructions
- SSL/TLS certificate configuration
- Performance optimization settings
- Security best practices

### `replit.md`
Replit environment setup guide:
- Port configuration (5000)
- Python HTTP server setup
- Environment variable management
- Deployment instructions

## Python Utilities

### `product_manager.py` (1.6KB)
Command-line utility for managing product data:
- Add/edit/delete products
- Category management
- JSON file operations
- Validation and error handling

**Usage:**
```bash
python product_manager.py add --name "Product Name" --category print --price 100
python product_manager.py list --category gifts
python product_manager.py delete --id product-id
```

**Note:** Legacy tool; direct editing of `data/products.js` is now preferred.

### `products.json` (3.2KB)
Legacy product data file. May be deprecated in favor of `data/products.js`.

## Documentation Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file — AI assistant developer guidelines |
| `DEVELOPMENT_ROADMAP.md` | Feature roadmap, planned improvements, version history |
| `SECURITY.md` | Security policies, vulnerability reporting, best practices |
| `server-config.md` | Server configuration and deployment documentation |
| `replit.md` | Replit-specific environment setup |

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
- To add social media links: Edit `data/config.js` (social object — twitter, instagram, snapchat, tiktok URLs)
- To update partners: Edit `data/partners.js`
- To add testimonials: Edit `data/testimonials.js` (TESTIMONIALS_DATA array)
- To update company stats: Edit `data/testimonials.js` (STATS_DATA object)
- To add FAQ items: Edit `data/faq.js` (FAQ_DATA array, categories: delivery, design, payment, orders, quality)

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

### Testimonials Carousel
- Auto-advances every 5 seconds, pauses on hover
- Shows 3 visible testimonials at a time (rotating window)
- Star rating display with `getStars()` helper
- Data source: `TESTIMONIALS_DATA` from `data/testimonials.js`

### Stats Counter
- Animated count-up triggered by `IntersectionObserver` (threshold: 0.3)
- Counts: 500+ clients, 1200+ projects, 15 cities, 8 years
- 2-second animation with 60 steps
- Data source: `STATS_DATA` from `data/testimonials.js`

### Price Calculator
- Supports 6 product types: business cards, flyers, brochures, stickers, roll-ups, banners
- Options: size (standard/large/custom), finishing (matte/glossy/laminated), design add-on, urgent surcharge (25%)
- Volume discounts: 5% at 250+, 10% at 500+, 15% at 1000+
- Sends detailed quote via WhatsApp

### FAQ Accordion
- Search/filter across questions and answers
- Single-open accordion behavior (opening one closes others)
- 8 items across 5 categories: delivery, design, payment, orders, quality
- Data source: `FAQ_DATA` from `data/faq.js`

### Footer Social Links
- Reads from `SITE_CONFIG.social` (twitter, instagram, snapchat, tiktok)
- Icons only render when their URL is non-empty (`x-show` conditional)
- Entire social row hidden if all links are empty (`hasSocial` computed)
- Brand name dynamically pulled from `SITE_CONFIG.brand.name`
- Styled with `.footer-social-link` class (glass-consistent hover effects, theme-aware)

### WhatsApp Floating Widget
- Auto-opens after 10 seconds for new visitors (persisted in `localStorage` as `wa_widget_closed`)
- 4 quick-message shortcuts for common inquiries
- Custom message input field
- Toggle open/close with state tracking

## Project Statistics

### File Count & Size
| Category | Files | Total Size |
|----------|-------|-----------|
| HTML | 3 | ~104 KB |
| CSS | 1 | ~52 KB |
| JavaScript | 7 | ~68 KB |
| Data Files | 7 | ~47 KB |
| Assets | 3 | ~118 KB |
| Documentation | 5 | ~48 KB |
| Configuration | 5 | ~15 KB |
| **Total** | **~30 files** | **~437 KB** |

### Lines of Code
| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 1,454 | Main SPA |
| `css/style.css` | 2,355 | Complete styling system |
| `js/app.js` | 837 | Alpine.js components |
| `js/security.js` | 378 | Security layer |
| `js/airtable-service.js` | 237 | API integration |
| `js/nebula.js` | 233 | Liquid mesh animation |
| `js/mesh-gradient.js` | 175 | Gradient utilities |
| `js/floating-glyphs.js` | 112 | CSS-based animations |

### Content Scale
- **24 Products** across 7 categories
- **15 Portfolio Projects** across 6 categories
- **24 Sub-Services** under 3 main service pillars
- **6 Customer Testimonials** with ratings
- **8 FAQ Items** across 5 categories
- **8 Partner Organizations**
- **4 Company Statistics** (clients, projects, cities, years)

## Git Repository

### Branch Structure
- `main` — Production branch
- `master` — Alternative main branch
- `claude/*` — Feature branches created by Claude AI

### Recent Activity
- 56+ merged pull requests
- Active development with regular commits
- Feature-based branching workflow

### Git Hooks
Standard pre-commit hooks installed for:
- Code formatting validation
- Security checks
- File size limits

## Key Architectural Decisions

✅ **Zero Build Process** — Vanilla HTML/CSS/JS, no transpilation required
✅ **Data-Driven Architecture** — Easy content updates without code changes
✅ **Theme-Aware Design** — CSS variables enable seamless dark/light mode switching
✅ **Offline-First PWA** — Service Worker v25 with sophisticated caching strategies
✅ **RTL-First Layout** — Complete Arabic language support with proper RTL handling
✅ **Security-First Approach** — Input sanitization, XSS prevention, safe storage patterns
✅ **Performance-Optimized** — CSS-only animations, optimized asset loading, minimal JS
✅ **PWA-Enabled** — Standalone app mode, maskable icons, offline functionality
✅ **No Backend Required** — WhatsApp integration eliminates need for server-side processing
✅ **Modular Component System** — 12 self-contained Alpine.js components

## Version History

| Version | Service Worker | Key Features |
|---------|---------------|--------------|
| Current | v25 | Security layer, Airtable integration, CSS-based animations |
| Previous | v23 | Enhanced caching, improved offline support |

---

**Last Updated:** 2026-02-14
**Total Project Size:** ~437 KB (30 files)
**Technology Stack:** Vanilla JS + Alpine.js 3.x + Tailwind CSS via CDN
**Target Audience:** Creative agency clients in Saudi Arabia (Arabic-first)
**Deployment:** Static hosting with Python HTTP server for development
