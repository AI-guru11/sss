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
// 3. PRODUCTS SHOP (ENHANCED VERSION)
// ==============================================
function productsShop() {
  return {
    cart: [],
    activeCategory: 'all',
    viewMode: 'grid', // 'grid' or 'list'
    selectedProduct: null,
    modalOpen: false,
    isAnimating: false,

    // استيراد البيانات من ملف products.js
    get categories() {
      return window.PRODUCTS_DATA?.categories || [];
    },

    get products() {
      return window.PRODUCTS_DATA?.products || [];
    },

    get imagesPath() {
      return window.PRODUCTS_DATA?.imagesPath || 'assets/products/';
    },

    // تصفية المنتجات حسب الفئة
    get filteredProducts() {
      if (this.activeCategory === 'all') {
        return this.products;
      }
      return this.products.filter(p => p.category === this.activeCategory);
    },

    // عدد المنتجات في كل فئة
    getCategoryCount(categoryId) {
      if (categoryId === 'all') return this.products.length;
      return this.products.filter(p => p.category === categoryId).length;
    },

    // تغيير الفئة مع تأثير حركي
    filterByCategory(id) {
      if (this.isAnimating) return;
      this.isAnimating = true;
      this.activeCategory = id;

      // إعادة تفعيل الحركة بعد انتهائها
      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    },

    // تغيير طريقة العرض
    setViewMode(mode) {
      this.viewMode = mode;
    },

    // حساب نسبة الخصم
    getDiscount(product) {
      if (!product.originalPrice || product.originalPrice <= product.price) return 0;
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    },

    // عرض النجوم للتقييم
    getStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
      return { full: fullStars, half: hasHalf, empty: emptyStars };
    },

    // فتح نافذة تفاصيل المنتج
    openProductModal(product) {
      this.selectedProduct = product;
      this.modalOpen = true;
      document.body.style.overflow = 'hidden';
    },

    // إغلاق نافذة التفاصيل
    closeProductModal() {
      this.modalOpen = false;
      this.selectedProduct = null;
      document.body.style.overflow = '';
    },

    // إضافة للسلة
    addToCart(product) {
      if (!this.isInCart(product.id)) {
        this.cart.push(product);
      }
    },

    // إزالة من السلة
    removeFromCart(productId) {
      this.cart = this.cart.filter(p => p.id !== productId);
    },

    // التحقق إذا المنتج في السلة
    isInCart(id) {
      return this.cart.some(p => p.id === id);
    },

    // حساب إجمالي السلة
    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },

    // إتمام الطلب عبر واتساب
    checkout() {
      if (this.cart.length === 0) return;
      const itemsList = this.cart.map((i, index) => `${index + 1}. ${i.name} - (${i.price} ر.س)`).join('\n');
      const msg = `🛒 *طلب منتجات - مجموعة الصافي*\n────────────────\n${itemsList}\n────────────────\n💰 *الإجمالي: ${this.cartTotal} ر.س*\n\n📝 يرجى إرسال تفاصيل التصميم المطلوب`;
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    // طلب منتج واحد عبر واتساب
    orderProduct(product) {
      const msg = `🛍️ *طلب منتج*\n────────────────\n📦 *المنتج:* ${product.name}\n💰 *السعر:* ${product.price} ر.س\n📝 *الوصف:* ${product.description}\n────────────────\n\nأرغب في طلب هذا المنتج`;
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    },

    // تهيئة lazy loading للصور
    init() {
      this.initLazyLoading();
    },

    // Lazy Loading للصور
    initLazyLoading() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
              }
            }
          });
        }, {
          rootMargin: '50px 0px',
          threshold: 0.01
        });

        // مراقبة جميع الصور الكسولة
        setTimeout(() => {
          document.querySelectorAll('.lazy-image').forEach(img => {
            imageObserver.observe(img);
          });
        }, 100);
      }
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
