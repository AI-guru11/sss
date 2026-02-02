// ==============================================
// MAIN APPLICATION LOGIC
// تطبيق مجموعة الصافي
// ==============================================
// ملاحظة: البيانات موجودة في مجلد data/
// - data/config.js    → إعدادات الموقع
// - data/products.js  → المنتجات
// - data/portfolio.js → المشاريع
// - data/partners.js  → الشركاء
// - data/services.js  → الخدمات

// ==============================================
// 1. MAIN APP LOGIC
// ==============================================
function fikraApp() {
  return {
    theme: 'dark',
    mobileOpen: false,
    headerShrink: 0,

    init() {
      const saved = localStorage.getItem('fikra_theme');
      if (saved === 'idea') this.setTheme('idea');
      else this.setTheme('dark');

      const onScroll = () => {
        const y = window.scrollY || 0;
        this.headerShrink = Number(Math.max(0, Math.min(1, y / 120)).toFixed(3));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    },

    setTheme(mode) {
      this.theme = mode;
      const html = document.documentElement;
      if (mode === 'idea') {
        html.classList.add('idea');
        html.classList.remove('dark');
      } else {
        html.classList.remove('idea');
        html.classList.add('dark');
      }
      localStorage.setItem('fikra_theme', mode);
    },

    toggleTheme() {
      this.setTheme(this.theme === 'idea' ? 'dark' : 'idea');
    }
  };
}

// ==============================================
// 2. BRIEF WIZARD
// ==============================================
function briefWizard() {
  return {
    step: 1,
    preferences: { category: '', style: '' },
    contact: { name: '', phone: '' },

    // استيراد البيانات من ملف portfolio.js
    get portfolioDB() {
      return window.PORTFOLIO_DATA?.briefProjects || [];
    },
    matches: [],

    setCategory(cat) { this.preferences.category = cat; this.step = 2; },
    setStyle(style) { this.preferences.style = style; this.step = 3; this.findMatches(); },

    findMatches() {
      this.matches = this.portfolioDB.filter(p => (p.category === this.preferences.category) && (p.style === this.preferences.style));
      if (this.matches.length === 0) this.matches = this.portfolioDB.filter(p => p.category === this.preferences.category).slice(0, 2);
    },

    sendRequest() {
      if (!this.contact.name || !this.contact.phone) return;
      const msg = `✨ *استفسار جديد (Style Finder)* ✨\n────────────────\n🎨 *التفضيلات:* ${this.preferences.category} / ${this.preferences.style}\n👤 *العميل:* ${this.contact.name}\n📱 *جوال:* ${this.contact.phone}`;
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    reset() { this.step = 1; this.preferences = { category: '', style: '' }; this.matches = []; this.contact = { name: '', phone: '' }; }
  };
}

// ==============================================
// 3. PRODUCTS SHOP
// ==============================================
function productsShop() {
  return {
    cart: [],
    activeCategory: 'all',

    // استيراد البيانات من ملف products.js
    get categories() {
      return window.PRODUCTS_DATA?.categories || [];
    },

    get products() {
      return window.PRODUCTS_DATA?.products || [];
    },

    filterByCategory(id) { this.activeCategory = id; },

    get newArrivals() {
      let items = this.products.filter(p => p.tag === 'new');
      if (this.activeCategory !== 'all') items = items.filter(p => p.category === this.activeCategory);
      return items;
    },

    get bestSellers() {
      let items = this.products.filter(p => p.tag === 'best');
      if (this.activeCategory !== 'all') items = items.filter(p => p.category === this.activeCategory);
      return items;
    },

    addToCart(product) { if (!this.isInCart(product.id)) this.cart.push(product); },
    isInCart(id) { return this.cart.some(p => p.id === id); },
    get cartTotal() { return this.cart.reduce((sum, item) => sum + item.price, 0); },
    checkout() {
      if (this.cart.length === 0) return;
      const itemsList = this.cart.map((i, index) => `${index + 1}. ${i.name} - (${i.price} ر.س)`).join('\n');
      const msg = `🛒 *طلب منتجات*\n────────────────\n${itemsList}\n────────────────\n💰 *الإجمالي: ${this.cartTotal} ر.س*`;
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };
}

// ==============================================
// 4. TRANSFORMATIONS DATA
// ==============================================
function transformationsData() {
  // استيراد البيانات من ملف portfolio.js
  const data = window.PORTFOLIO_DATA?.transformations || {};
  return {
    title: data.title || '',
    desc: data.desc || '',
    stats: data.stats || []
  };
}

// ==============================================
// 5. WORK GALLERY
// ==============================================
function workGallery() {
  return {
    active: null,
    modalOpen: false,
    // استيراد البيانات من ملف portfolio.js
    get projects() {
      return window.PORTFOLIO_DATA?.galleryProjects || [];
    }
  };
}

// ==============================================
// 6. PARTNERS CAROUSEL
// ==============================================
function partnersCarousel() {
  return {
    get partners() {
      return window.PARTNERS_DATA || [];
    }
  };
}

// ==============================================
// 7. HELPER UTILS (Slider Logic)
// ==============================================
function beforeAfter() {
  return {
    pos: 50, dragging: false,
    start(e) { this.dragging = true; this.update(e); },
    end() { this.dragging = false; },
    move(e) { if (this.dragging) this.update(e); },
    update(e) {
      const rect = this.$el.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].pageX : e.pageX;
      this.pos = Math.min(100, Math.max(0, ((pageX - rect.left) / rect.width) * 100));
    }
  };
}

// ==============================================
// Export Global Functions
// ==============================================
window.fikraApp = fikraApp;
window.briefWizard = briefWizard;
window.productsShop = productsShop;
window.transformationsData = transformationsData;
window.workGallery = workGallery;
window.partnersCarousel = partnersCarousel;
window.beforeAfter = beforeAfter;
