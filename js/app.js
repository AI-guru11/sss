// ==============================================
// SITE CONFIGURATION (إعدادات الموقع)
// ==============================================
const SITE_CONFIG = {
  whatsapp: '966555862272',
  email: 'safigroup@gmail.com',
  brand: {
    name: 'مجموعة الصافي',
    tagline: 'SAFI GROUP',
    logo: 'assets/logo.webp'
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
    preferences: { category: '', style: '' },
    contact: { name: '', phone: '' },
    
    // بيانات المعرض للفلترة
    portfolioDB: [
      { id: 1, title: 'فندق قصر السحاب', category: 'decor', style: 'classic', img: 'linear-gradient(135deg, #2c1a1a, #4a3b3b)', desc: 'ديكور داخلي كلاسيكي فاخر.' },
      { id: 2, title: 'مقهى سايبر نيون', category: 'decor', style: 'neon', img: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', desc: 'إضاءة نيون وتصميم عصري.' },
      { id: 3, title: 'هوية شركة تقنية', category: 'branding', style: 'modern', img: 'linear-gradient(135deg, #1a2980, #26d0ce)', desc: 'شعار وهوية بصرية بأسلوب بسيط.' },
      { id: 4, title: 'مطعم برجر مودرن', category: 'decor', style: 'modern', img: 'linear-gradient(135deg, #ff512f, #dd2476)', desc: 'تصميم داخلي بألوان حيوية.' },
      { id: 5, title: 'حفل زفاف ملكي', category: 'events', style: 'classic', img: 'linear-gradient(135deg, #ECE9E6, #FFFFFF)', desc: 'تنظيم وتنسيق كلاسيكي فخم.' },
      { id: 6, title: 'لاونج نيون', category: 'decor', style: 'neon', img: 'linear-gradient(135deg, #11998e, #38ef7d)', desc: 'أجواء ليلية بإضاءة خافتة ونيون.' },
    ],
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
    
    categories: [
      { id: 'all', name: 'الكل' },
      { id: 'neon', name: 'نيون' },
      { id: 'stands', name: 'ستاندات' },
      { id: 'print', name: 'طباعة' },
      { id: 'gifts', name: 'هدايا' }
    ],

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
// 4. TRANSFORMATIONS DATA (القسم الجديد)
// ==============================================
function transformationsData() {
  return {
    title: 'قصة نجاح: إعادة إحياء علامة تجارية',
    desc: 'شاهد كيف حولنا المساحة من تصميم تقليدي باهت إلى تجربة بصرية عصرية تنبض بالحياة، مما ساهم في جذب شريحة عملاء جديدة.',
    stats: [
      { label: 'زيادة المبيعات', value: '45%' },
      { label: 'تفاعل العملاء', value: '3x' }
    ]
  };
}

// ==============================================
// 5. WORK GALLERY
// ==============================================
function workGallery() {
  return {
    active: null, modalOpen: false,
    projects: [
      { id: 1, title: 'Conference Branding', subtitle: 'هوية بصرية لمؤتمر', bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)', tags: ['طباعة', 'هوية'] },
      { id: 2, title: 'Coffee Shop Neon', subtitle: 'تنفيذ إضاءة نيون', bg: 'linear-gradient(135deg, #2c0b0e 0%, #5c181f 100%)', tags: ['نيون', 'ديكور'] },
      { id: 3, title: 'Marketing Campaign', subtitle: 'حملة إعلانية', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', tags: ['تصميم', 'إعلانات'] }
    ]
  };
}

// ==============================================
// 6. HELPER UTILS (Slider Logic)
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
window.transformationsData = transformationsData;
window.workGallery = workGallery;
window.beforeAfter = beforeAfter;