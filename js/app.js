// ==============================================
// SITE CONFIGURATION (إعدادات الموقع)
// ==============================================
const SITE_CONFIG = {
  // معلومات التواصل الرئيسية
  whatsapp: '966555862272', // الرقم الدولي بدون +
  email: 'safigroup@gmail.com',
  
  // معلومات العلامة التجارية
  brand: {
    name: 'مجموعة الصافي',
    tagline: 'SAFI GROUP'
  },
  
  // الموقع الجغرافي
  location: {
    city: 'Muhayl Asir, Saudi Arabia',
    mapsUrl: 'https://maps.google.com/?q=Muhayl+Asir' // تم إصلاح الرابط
  }
};

// ==============================================
// 1. MAIN APP LOGIC (المنطق الرئيسي)
// ==============================================
function fikraApp() {
  return {
    theme: 'dark',
    mobileOpen: false,
    headerShrink: 0,

    init() {
      // استعادة الوضع (ليلي/نهاري) من الذاكرة
      const saved = localStorage.getItem('fikra_theme');
      if (saved === 'idea') this.setTheme('idea');
      else this.setTheme('dark');

      // تأثير تقلص الهيدر عند التمرير
      const onScroll = () => {
        const y = window.scrollY || 0;
        // معادلة بسيطة لحساب نسبة التقلص من 0 إلى 1
        this.headerShrink = Number(Math.max(0, Math.min(1, y / 120)).toFixed(3));
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); // تشغيل فوري للتأكد
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
// 2. BRIEF WIZARD (معالج بدء المشروع)
// ==============================================
function briefWizard() {
  return {
    step: 1,
    error: '',
    
    // الخيارات المتاحة
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

    // بيانات النموذج
    form: { 
      type: '', 
      budget: '', 
      timeline: '', 
      name: '', 
      company: '', 
      whatsapp: '' 
    },

    // الانتقال للخطوة التالية
    next() {
      this.error = '';
      
      // التحقق من المدخلات (Validation)
      if (this.step === 1 && !this.form.type) {
        this.error = 'الرجاء اختيار نوع المشروع';
        return;
      }
      if (this.step === 2 && !this.form.budget) {
        this.error = 'الرجاء تحديد الميزانية المتوقعة';
        return;
      }
      if (this.step === 3 && !this.form.timeline) {
        this.error = 'الرجاء تحديد موعد التسليم';
        return;
      }
      if (this.step === 4) {
        if (!this.form.name || this.form.name.length < 2) {
          this.error = 'الاسم مطلوب (حرفين على الأقل)';
          return;
        }
        if (!this.form.whatsapp || this.form.whatsapp.length < 9) {
          this.error = 'رقم الواتساب مطلوب للتواصل';
          return;
        }
      }

      this.step++;
    },

    // الرجوع للخلف
    prev() {
      this.step = Math.max(1, this.step - 1);
      this.error = '';
    },

    // إعادة تعيين النموذج
    reset() {
      this.step = 1;
      this.form = { type: '', budget: '', timeline: '', name: '', company: '', whatsapp: '' };
      this.error = '';
    },

    // إنشاء رسالة الواتساب النهائية
    get message() {
      return `✨ *طلب مشروع جديد - ${SITE_CONFIG.brand.name}* ✨
────────────────
📌 *نوع المشروع:* ${this.form.type}
💰 *الميزانية:* ${this.form.budget}
⏳ *الوقت:* ${this.form.timeline}
────────────────
👤 *الاسم:* ${this.form.name}
🏢 *الشركة:* ${this.form.company || 'غير محدد'}
📱 *رقم العميل:* ${this.form.whatsapp}
────────────────
ملاحظات إضافية:
`;
    },

    // رابط الإرسال
    get whatsappUrl() {
      return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(this.message)}`;
    }
  };
}

// ==============================================
// 3. PRODUCTS SHOP (المتجر الإلكتروني)
// ==============================================
function productsShop() {
  return {
    activeCategory: 'all',
    searchQuery: '',
    cart: [],
    
    // التصنيفات
    categories: [
      { id: 'all', name: 'الكل' },
      { id: 'neon', name: 'نيون' },
      { id: 'print', name: 'طباعة' },
      { id: 'gifts', name: 'هدايا' },
      { id: 'stands', name: 'ستاندات' }
    ],

    // قاعدة بيانات المنتجات (يمكنك التعديل هنا)
    products: [
      { id: 1, name: 'لوحة نيون مخصصة', price: 350, category: 'neon', categoryName: 'نيون', description: 'صمم اسمك أو شعارك بإضاءة LED نيون جذابة وموفرة للطاقة.' },
      { id: 2, name: 'رول أب ستاند (Rollup)', price: 280, category: 'stands', categoryName: 'ستاندات', description: 'ستاند عرض متنقل مقاس 85x200 سم مع طباعة فاخرة.' },
      { id: 3, name: 'أقلام دعائية (بكج 50)', price: 125, category: 'gifts', categoryName: 'هدايا', description: 'أقلام بلاستيكية عالية الجودة مع طباعة الشعار بلون واحد.' },
      { id: 4, name: 'كروت شخصية (1000 كرت)', price: 180, category: 'print', categoryName: 'طباعة', description: 'ورق كوشيه 350 جرام، طباعة وجهين، مع طبقة حماية (سلوفان).' },
      { id: 5, name: 'كوب سيراميك (طباعة حرارية)', price: 25, category: 'gifts', categoryName: 'هدايا', description: 'كوب أبيض مطبوع عليه شعارك أو تصميمك الخاص.' },
      { id: 6, name: 'بنر جداري (للمتر المربع)', price: 45, category: 'print', categoryName: 'طباعة', description: 'طباعة بنر خارجي مقاوم للشمس والمطر بجودة عالية.' },
      { id: 7, name: 'بوب أب ستاند (Pop Up)', price: 1800, category: 'stands', categoryName: 'ستاندات', description: 'جدارية إعلانية متنقلة للمعارض مقاس 3x3 متر.' },
      { id: 8, name: 'لوحة نيون (Open)', price: 250, category: 'neon', categoryName: 'نيون', description: 'لوحة جاهزة بعبارة Open للمحلات التجارية.' }
    ],

    // فلترة المنتجات حسب التصنيف والبحث
    get filteredProducts() {
      let result = this.products;

      // 1. فلترة التصنيف
      if (this.activeCategory !== 'all') {
        result = result.filter(p => p.category === this.activeCategory);
      }

      // 2. فلترة البحث
      if (this.searchQuery) {
        const lowerQuery = this.searchQuery.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(lowerQuery));
      }

      return result;
    },

    // تغيير التصنيف
    filterByCategory(id) {
      this.activeCategory = id;
    },

    // إضافة للسلة
    addToCart(product) {
      if (!this.isInCart(product.id)) {
        this.cart.push(product);
      }
    },

    // التحقق هل المنتج في السلة
    isInCart(id) {
      return this.cart.some(p => p.id === id);
    },

    // حساب الإجمالي
    get cartTotal() {
      return this.cart.reduce((sum, item) => sum + item.price, 0);
    },

    // إتمام الطلب (Checkout)
    checkout() {
      if (this.cart.length === 0) return;

      const itemsList = this.cart.map((i, index) => `${index + 1}. ${i.name} - (${i.price} ر.س)`).join('\n');
      
      const msg = `🛒 *طلب شراء جديد من المتجر*
────────────────
${itemsList}
────────────────
💰 *الإجمالي النهائي: ${this.cartTotal} ر.س*
────────────────
يرجى تأكيد الطلب وتزويدي بطريقة الدفع.`;

      window.open(`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };
}

// ==============================================
// 4. WORK GALLERY (معرض الأعمال)
// ==============================================
function workGallery() {
  return {
    active: null, // المشروع المفتوح حالياً
    modalOpen: false,

    projects: [
      { id: 1, title: 'Conference Branding', subtitle: 'هوية بصرية لمؤتمر تقني', bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)', tags: ['طباعة', 'هوية'] },
      { id: 2, title: 'Coffee Shop Neon', subtitle: 'تصميم وتنفيذ إضاءة نيون', bg: 'linear-gradient(135deg, #2c0b0e 0%, #5c181f 100%)', tags: ['نيون', 'ديكور'] },
      { id: 3, title: 'Marketing Campaign', subtitle: 'حملة إعلانية للسوشيال ميديا', bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', tags: ['تصميم', 'إعلانات'] }
    ]
  };
}

// ==============================================
// 5. BEFORE/AFTER SLIDER (سلايدر قبل وبعد)
// ==============================================
function beforeAfter() {
  return {
    pos: 50,
    dragging: false,
    
    start(e) {
      this.dragging = true;
      this.update(e);
    },
    end() {
      this.dragging = false;
    },
    move(e) {
      if (this.dragging) this.update(e);
    },
    update(e) {
      // حساب موقع الماوس/اللمس نسبة للعنصر
      const rect = this.$el.getBoundingClientRect();
      const pageX = e.touches ? e.touches[0].pageX : e.pageX;
      const x = pageX - rect.left;
      // تحويله لنسبة مئوية (0 - 100)
      this.pos = Math.min(100, Math.max(0, (x / rect.width) * 100));
    }
  };
}

// ==============================================
// EXPORT TO WINDOW (جعل الدوال عامة لـ Alpine)
// ==============================================
window.SITE_CONFIG = SITE_CONFIG;
window.fikraApp = fikraApp;
window.briefWizard = briefWizard;
window.productsShop = productsShop;
window.workGallery = workGallery;
window.beforeAfter = beforeAfter;