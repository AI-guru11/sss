// ==============================================
// SITE CONFIGURATION (إعدادات الموقع)
// ==============================================
const SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: {
    name: 'مجموعة الصافي',
    tagline: 'SAFI GROUP',
    logo: 'assets/logo.webp' // Added logo path
  },
  location: {
    city: 'Muhayl Asir, Saudi Arabia',
    mapsUrl: 'https://maps.google.com/?q=Muhayl+Asir'
  }
};

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
    error: '',
    projectTypes: [
      { value: 'Design', label: 'تصميم (Design)', desc: 'هوية بصرية / UI / سوشيال ميديا' },
      { value: 'Events', label: 'فعاليات (Events)', desc: 'تنظيم مؤتمرات / معارض' },
      { value: 'Ads', label: 'إعلانات (Ads)', desc: 'حملات إعلانية / محتوى' }
    ],
    budgets: ['أقل من 5,000', '5,000 - 15,000', '15,000 - 50,000', 'أكثر من 50,000'],
    timelines: [
      { value: 'Urgent', label: 'عاجل جداً (1-2 أسبوع)' },
      { value: '1 month', label: 'متوسط (شهر)' },
      { value: 'Relaxed', label: 'موسع (2-3 أشهر)' }
    ],
    form: { type: '', budget: '', timeline: '', name: '', company: '', whatsapp: '' },

    next() {
      this.error = '';
      if (this.step === 1 && !this.form.type) { this.error = 'الرجاء اختيار نوع المشروع'; return; }
      if (this.step === 2 && !this.form.budget) { this.error = 'الرجاء تحديد الميزانية'; return; }
      if (this.step === 3 && !this.form.timeline) { this.error = 'الرجاء تحديد الوقت'; return; }
      if (this.step === 4) {
        if (!this.form.name || this.form.name.length < 2) { this.error = 'الاسم مطلوب'; return; }
        if (!this.form.whatsapp || this.form.whatsapp.length < 9) { this.error = 'رقم الواتساب مطلوب'; return; }
      }
      this.step++;
    },
    prev() { this.step = Math.max(1, this.step - 1); this.error = ''; },
    reset() { this.step = 1; this.form = { type: '', budget: '', timeline: '', name: '', company: '', whatsapp: '' }; this.error = ''; },
    get message() {
      return `✨ *طلب مشروع جديد - ${SITE_CONFIG.brand.name}* ✨\n────────────────\n📌 *النوع:* ${this.form.type}\n💰 *الميزانية:* ${this.form.budget}\n⏳ *الوقت:* ${this.form.timeline}\n────────────────\n👤 *الاسم:* ${this.form.name}\n🏢 *الشركة:* ${this.form.company || '—'}\n📱 *جوال:* ${this.form.whatsapp}`;
    },
    get whatsappUrl() {
      return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(this.message)}`;
    }
  };
}

// ==============================================
// 3. PRODUCTS SHOP (مع الفلترة)
// ==============================================
function productsShop() {
  return {
    cart: [],
    activeCategory: 'all', // حالة الفلتر الحالية
    
    categories: [
      { id: 'all', name: 'الكل' },
      { id: 'neon', name: 'نيون' },
      { id: 'stands', name: 'ستاندات' },
      { id: 'print', name: 'طباعة' },
      { id: 'gifts', name: 'هدايا' }
    ],

    // المنتجات مع إضافة خاصية category للفلترة
    products: [
      { id: 1, name: 'لوحة نيون', price: 350, tag: 'best', category: 'neon', icon: '⚡', categoryName: 'نيون', description: 'إضاءة LED جذابة.' },
      { id: 2, name: 'رول أب', price: 280, tag: 'new', category: 'stands', icon: '📜', categoryName: 'ستاندات', description: 'ستاند 85x200 سم.' },
      { id: 3, name: 'أقلام (50)', price: 125, tag: 'best', category: 'gifts', icon: '🖊️', categoryName: 'هدايا', description: 'أقلام مع طباعة.' },
      { id: 4, name: 'كروت (1000)', price: 180, tag: 'new', category: 'print', icon: '📇', categoryName: 'طباعة', description: 'ورق مقوى 350 جرام.' },
      { id: 5, name: 'كوب سيراميك', price: 25, tag: 'best', category: 'gifts', icon: '☕', categoryName: 'هدايا', description: 'طباعة حرارية ثابتة.' },
      { id: 6, name: 'بنر جداري', price: 45, tag: 'new', category: 'print', icon: '🖼️', categoryName: 'طباعة', description: 'للمتر المربع خارجي.' },
      { id: 7, name: 'بوب أب 3x3', price: 1800, tag: 'best', category: 'stands', icon: '🎪', categoryName: 'ستاندات', description: 'جدارية للمعارض.' },
      { id: 8, name: 'لوحة Open', price: 250, tag: 'new', category: 'neon', icon: '💡', categoryName: 'نيون', description: 'جاهزة للمحلات.' }
    ],

    // دالة تغيير التصنيف
    filterByCategory(id) {
      this.activeCategory = id;
    },

    // جلب المنتجات الجديدة (مع مراعاة الفلتر)
    get newArrivals() {
      let items = this.products.filter(p => p.tag === 'new');
      if (this.activeCategory !== 'all') {
        items = items.filter(p => p.category === this.activeCategory);
      }
      return items;
    },

    // جلب الأكثر طلباً (مع مراعاة الفلتر)
    get bestSellers() {
      let items = this.products.filter(p => p.tag === 'best');
      if (this.activeCategory !== 'all') {
        items = items.filter(p => p.category === this.activeCategory);
      }
      return items;
    },

    addToCart(product) {
      if (!this.isInCart(product.id)) {
        this.cart.push(product);
      }
    },

    isInCart(id) {
      return this.cart.some(p => p.id === id);
    },

    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },

    checkout() {
      if (this.cart.length === 0) return;
      const itemsList = this.cart.map((i, index) => `${index + 1}. ${i.name} - (${i.price} ر.س)`).join('\n');
      const msg = `🛒 *طلب شراء جديد*\n────────────────\n${itemsList}\n────────────────\n💰 *الإجمالي: ${this.cartTotal} ر.س*`;
      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };
}

// ==============================================
// 4. WORK GALLERY
// ==============================================
function workGallery() {
  return {
    active: null,
    modalOpen: false,
    projects: [
      { id: 1, title: 'Conference Branding', subtitle: 'هوية بصرية لمؤتمر', bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)', tags: ['طباعة', 'هوية'] },
      { id: 2, title: 'Coffee Shop Neon', subtitle: 'تنفيذ إضاءة نيون', bg: 'linear-gradient(135deg, #2c0b0e 0%, #5c181f 100%)', tags: ['نيون', 'ديكور'] },
      { id: 3, title: 'Marketing Campaign', subtitle: 'حملة إعلانية', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', tags: ['تصميم', 'إعلانات'] }
    ]
  };
}

// ==============================================
// 5. HELPER UTILS
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

// Export Global
window.SITE_CONFIG = SITE_CONFIG;
window.fikraApp = fikraApp;
window.briefWizard = briefWizard;
window.productsShop = productsShop;
window.workGallery = workGallery;
window.beforeAfter = beforeAfter;