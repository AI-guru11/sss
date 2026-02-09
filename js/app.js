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
    // 3D Parallax state
    parallaxX: 0,
    parallaxY: 0,
    targetParallaxX: 0,
    targetParallaxY: 0,
    animationFrameId: null,

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

      // Initialize 3D parallax effect
      this.init3DParallax();
    },

    init3DParallax() {
      // Check if device supports DeviceOrientation (mobile gyroscope)
      if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              this.enableGyroscope();
            } else {
              this.enableMouseParallax();
            }
          })
          .catch(() => {
            this.enableMouseParallax();
          });
      } else if (window.DeviceOrientationEvent) {
        // Android and other devices
        this.enableGyroscope();
      } else {
        // Desktop fallback
        this.enableMouseParallax();
      }

      // Start animation loop
      this.animate3DParallax();
    },

    enableGyroscope() {
      window.addEventListener('deviceorientation', (e) => {
        // beta: front-to-back tilt (-180 to 180)
        // gamma: left-to-right tilt (-90 to 90)
        const beta = e.beta || 0;
        const gamma = e.gamma || 0;

        // Normalize to -1 to 1 range
        this.targetParallaxX = Math.max(-1, Math.min(1, gamma / 45));
        this.targetParallaxY = Math.max(-1, Math.min(1, (beta - 45) / 45));
      }, { passive: true });
    },

    enableMouseParallax() {
      const heroSection = document.getElementById('hero-section');
      if (!heroSection) return;

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize to -1 to 1 range based on distance from center
        this.targetParallaxX = (e.clientX - centerX) / (rect.width / 2);
        this.targetParallaxY = (e.clientY - centerY) / (rect.height / 2);
      }, { passive: true });

      // Reset on mouse leave
      heroSection.addEventListener('mouseleave', () => {
        this.targetParallaxX = 0;
        this.targetParallaxY = 0;
      });
    },

    animate3DParallax() {
      // Smooth interpolation (easing)
      const easing = 0.08;
      this.parallaxX += (this.targetParallaxX - this.parallaxX) * easing;
      this.parallaxY += (this.targetParallaxY - this.parallaxY) * easing;

      // Update all floating elements
      const elements = document.querySelectorAll('[data-parallax]');
      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.3;
        const x = this.parallaxX * 30 * speed; // Max 30px movement
        const y = this.parallaxY * 30 * speed;
        const rotateX = -this.parallaxY * 10 * speed; // Rotation effect
        const rotateY = this.parallaxX * 10 * speed;

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      // Continue animation loop
      this.animationFrameId = requestAnimationFrame(() => this.animate3DParallax());
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
// 3. PRODUCTS SHOP (ENHANCED VERSION WITH SLIDER)
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

    // ========================================
    // SLIDER SYSTEM - NEW METHODS
    // ========================================

    // الحصول على الفئات التي تحتوي على منتجات (بدون "الكل")
    get categoriesWithProducts() {
      return this.categories.filter(cat =>
        cat.id !== 'all' && this.getProductsByCategory(cat.id).length > 0
      );
    },

    // الحصول على المنتجات حسب الفئة
    getProductsByCategory(categoryId) {
      return this.products.filter(p => p.category === categoryId);
    },

    // تمرير السلايدر بالسهم
    scrollSlider(categoryId, direction) {
      const slider = document.getElementById(`slider-${categoryId}`);
      if (!slider) return;

      const scrollAmount = slider.offsetWidth * 0.8;
      slider.scrollBy({
        left: direction * scrollAmount * -1, // RTL: reverse direction
        behavior: 'smooth'
      });
    },

    // عرض جميع المنتجات في فئة معينة
    viewAllCategory(categoryId) {
      this.activeCategory = categoryId;
      // التمرير إلى أعلى القسم
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
// 8. TESTIMONIALS CAROUSEL
// ==============================================
function testimonialsCarousel() {
  return {
    currentIndex: 0,
    autoplayInterval: null,
    isHovered: false,

    get testimonials() {
      return window.TESTIMONIALS_DATA || [];
    },

    get current() {
      return this.testimonials[this.currentIndex] || {};
    },

    get visibleTestimonials() {
      const items = [];
      const total = this.testimonials.length;
      for (let i = 0; i < 3; i++) {
        const index = (this.currentIndex + i) % total;
        items.push({ ...this.testimonials[index], position: i });
      }
      return items;
    },

    init() {
      this.startAutoplay();
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    },

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    },

    goTo(index) {
      this.currentIndex = index;
    },

    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        if (!this.isHovered) this.next();
      }, 5000);
    },

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
    },

    getStars(rating) {
      return Array(5).fill(0).map((_, i) => i < rating ? 'full' : 'empty');
    }
  };
}

// ==============================================
// 9. FAQ ACCORDION
// ==============================================
function faqAccordion() {
  return {
    openItem: null,
    searchQuery: '',

    get faqs() {
      return window.FAQ_DATA || [];
    },

    get filteredFaqs() {
      if (!this.searchQuery.trim()) return this.faqs;
      const query = this.searchQuery.toLowerCase();
      return this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    },

    toggle(id) {
      this.openItem = this.openItem === id ? null : id;
    },

    isOpen(id) {
      return this.openItem === id;
    }
  };
}

// ==============================================
// 10. ANIMATED STATS COUNTER
// ==============================================
function statsCounter() {
  return {
    animated: false,
    counters: {
      clients: 0,
      projects: 0,
      cities: 0,
      years: 0
    },

    get stats() {
      return window.STATS_DATA || {};
    },

    init() {
      this.setupObserver();
    },

    setupObserver() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animated) {
            this.animated = true;
            this.animateCounters();
          }
        });
      }, { threshold: 0.3 });

      setTimeout(() => {
        const el = document.querySelector('[data-stats-counter]');
        if (el) observer.observe(el);
      }, 100);
    },

    animateCounters() {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      Object.keys(this.stats).forEach(key => {
        const target = this.stats[key].value;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.min(Math.round(increment * step), target);
          this.counters[key] = current;

          if (step >= steps) {
            clearInterval(timer);
            this.counters[key] = target;
          }
        }, interval);
      });
    }
  };
}

// ==============================================
// 11. PRICE CALCULATOR
// ==============================================
function priceCalculator() {
  return {
    selectedProduct: 'cards',
    quantity: 100,
    size: 'standard',
    finishing: 'matte',
    design: false,
    urgent: false,

    products: {
      cards: { name: 'كروت عمل', basePrice: 0.18, minQty: 100 },
      flyers: { name: 'فلايرات A5', basePrice: 0.30, minQty: 100 },
      brochures: { name: 'بروشورات A4', basePrice: 0.50, minQty: 50 },
      stickers: { name: 'ستيكرات', basePrice: 0.25, minQty: 50 },
      rollup: { name: 'رول أب', basePrice: 280, minQty: 1 },
      banner: { name: 'بنر (م²)', basePrice: 35, minQty: 1 }
    },

    sizes: {
      standard: { name: 'قياسي', multiplier: 1 },
      large: { name: 'كبير', multiplier: 1.5 },
      custom: { name: 'مخصص', multiplier: 1.8 }
    },

    finishings: {
      matte: { name: 'مطفي', price: 0 },
      glossy: { name: 'لامع', price: 0.02 },
      laminated: { name: 'مغلف', price: 0.05 }
    },

    get basePrice() {
      return this.products[this.selectedProduct]?.basePrice || 0;
    },

    get minQuantity() {
      return this.products[this.selectedProduct]?.minQty || 1;
    },

    get sizeMultiplier() {
      return this.sizes[this.size]?.multiplier || 1;
    },

    get finishingPrice() {
      return this.finishings[this.finishing]?.price || 0;
    },

    get subtotal() {
      const base = this.basePrice * this.quantity * this.sizeMultiplier;
      const finishing = this.finishingPrice * this.quantity;
      return base + finishing;
    },

    get designCost() {
      return this.design ? 50 : 0;
    },

    get urgentCost() {
      return this.urgent ? this.subtotal * 0.25 : 0;
    },

    get total() {
      return Math.round(this.subtotal + this.designCost + this.urgentCost);
    },

    get discount() {
      if (this.quantity >= 1000) return 15;
      if (this.quantity >= 500) return 10;
      if (this.quantity >= 250) return 5;
      return 0;
    },

    get finalPrice() {
      const discountAmount = this.total * (this.discount / 100);
      return Math.round(this.total - discountAmount);
    },

    orderViaWhatsApp() {
      const product = this.products[this.selectedProduct]?.name;
      const sizeText = this.sizes[this.size]?.name;
      const finishText = this.finishings[this.finishing]?.name;

      const msg = `💰 *طلب عرض سعر*\n────────────────\n📦 *المنتج:* ${product}\n📏 *المقاس:* ${sizeText}\n🔢 *الكمية:* ${this.quantity}\n✨ *التشطيب:* ${finishText}\n🎨 *تصميم:* ${this.design ? 'نعم' : 'لا'}\n⚡ *عاجل:* ${this.urgent ? 'نعم' : 'لا'}\n────────────────\n💵 *السعر التقديري:* ${this.finalPrice} ر.س\n${this.discount > 0 ? `🎁 *خصم الكمية:* ${this.discount}%` : ''}\n\nأرجو تأكيد الطلب`;

      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };
}

// ==============================================
// 12. FLOATING WHATSAPP WIDGET
// ==============================================
function whatsappWidget() {
  return {
    isOpen: false,
    message: '',
    hasInteracted: false,

    quickMessages: [
      'أريد الاستفسار عن الأسعار',
      'أحتاج تصميم هوية بصرية',
      'أريد طلب لوحات للمحل',
      'استفسار عن خدمات المعارض'
    ],

    init() {
      // إظهار البوب أب بعد 10 ثواني للزوار الجدد
      setTimeout(() => {
        if (!this.hasInteracted && !localStorage.getItem('wa_widget_closed')) {
          this.isOpen = true;
        }
      }, 10000);
    },

    toggle() {
      this.isOpen = !this.isOpen;
      this.hasInteracted = true;
    },

    close() {
      this.isOpen = false;
      this.hasInteracted = true;
      localStorage.setItem('wa_widget_closed', 'true');
    },

    sendMessage(text = null) {
      const msg = text || this.message || 'مرحباً، أريد الاستفسار عن خدماتكم';
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
      this.message = '';
      this.close();
    },

    selectQuickMessage(msg) {
      this.message = msg;
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
window.testimonialsCarousel = testimonialsCarousel;
window.faqAccordion = faqAccordion;
window.statsCounter = statsCounter;
window.priceCalculator = priceCalculator;
window.whatsappWidget = whatsappWidget;
