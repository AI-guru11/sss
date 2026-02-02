// ==============================================
// بيانات المنتجات والتصنيفات
// Products & Categories Data
// ==============================================
// يمكنك إضافة أو تعديل المنتجات بسهولة من هنا
//
// لإضافة صورة منتج:
// 1. ضع الصورة في مجلد: assets/products/
// 2. أضف اسم الصورة في حقل image (مثال: 'cards.webp')
// 3. الصيغ المدعومة: webp, jpg, png
// 4. إذا لم تضع صورة، سيظهر الإيموجي (icon) بدلاً منها

const PRODUCTS_DATA = {

  // مسار مجلد صور المنتجات
  imagesPath: 'assets/products/',

  // تصنيفات المنتجات
  categories: [
    { id: 'all', name: 'الكل' },
    { id: 'print', name: 'طباعة' },
    { id: 'gifts', name: 'هدايا' },
    { id: 'boards', name: 'لوحات' },
    { id: 'rollup', name: 'رول اب' },
    { id: 'exhibitions', name: 'معارض' },
    { id: 'illuminated', name: 'لوحات مضيئة' }
  ],

  // قائمة المنتجات
  // tag: 'best' = الأكثر طلباً | 'new' = وصل حديثاً
  // image: اسم ملف الصورة (اختياري) - إذا لم يوجد سيظهر الإيموجي
  products: [
    // ═══════════════════════════════════════
    // قسم الطباعة (print)
    // ═══════════════════════════════════════
    {
      id: 1,
      name: 'كروت عمل (1000)',
      price: 180,
      tag: 'best',
      category: 'print',
      icon: '📇',
      image: '', // ← ضع اسم الصورة هنا مثل: 'cards.webp'
      categoryName: 'طباعة',
      description: 'ورق مقوى 350 جرام.'
    },
    {
      id: 2,
      name: 'بروشور A4',
      price: 250,
      tag: 'new',
      category: 'print',
      icon: '📄',
      image: '',
      categoryName: 'طباعة',
      description: 'طباعة ملونة وجهين.'
    },
    {
      id: 3,
      name: 'فلاير A5 (500)',
      price: 150,
      tag: 'best',
      category: 'print',
      icon: '📋',
      image: '',
      categoryName: 'طباعة',
      description: 'ورق كوشيه لامع.'
    },
    {
      id: 4,
      name: 'ستيكر مقصوص',
      price: 35,
      tag: 'new',
      category: 'print',
      icon: '🏷️',
      image: '',
      categoryName: 'طباعة',
      description: 'للمتر المربع.'
    },

    // ═══════════════════════════════════════
    // قسم الهدايا (gifts)
    // ═══════════════════════════════════════
    {
      id: 5,
      name: 'أقلام (50)',
      price: 125,
      tag: 'best',
      category: 'gifts',
      icon: '🖊️',
      image: '',
      categoryName: 'هدايا',
      description: 'أقلام مع طباعة.'
    },
    {
      id: 6,
      name: 'كوب سيراميك',
      price: 25,
      tag: 'new',
      category: 'gifts',
      icon: '☕',
      image: '',
      categoryName: 'هدايا',
      description: 'طباعة حرارية ثابتة.'
    },
    {
      id: 7,
      name: 'ميدالية مفاتيح',
      price: 15,
      tag: 'best',
      category: 'gifts',
      icon: '🔑',
      image: '',
      categoryName: 'هدايا',
      description: 'معدن مع طباعة.'
    },
    {
      id: 8,
      name: 'تيشيرت مطبوع',
      price: 45,
      tag: 'new',
      category: 'gifts',
      icon: '👕',
      image: '',
      categoryName: 'هدايا',
      description: 'قطن عالي الجودة.'
    },

    // ═══════════════════════════════════════
    // قسم اللوحات (boards)
    // ═══════════════════════════════════════
    {
      id: 9,
      name: 'لوحة كلادينج',
      price: 85,
      tag: 'best',
      category: 'boards',
      icon: '🪧',
      image: '',
      categoryName: 'لوحات',
      description: 'للمتر المربع.'
    },
    {
      id: 10,
      name: 'لوحة فوم بورد',
      price: 45,
      tag: 'new',
      category: 'boards',
      icon: '📐',
      image: '',
      categoryName: 'لوحات',
      description: 'للمتر المربع.'
    },
    {
      id: 11,
      name: 'لوحة أكريليك',
      price: 120,
      tag: 'best',
      category: 'boards',
      icon: '✨',
      image: '',
      categoryName: 'لوحات',
      description: 'للمتر المربع شفاف.'
    },
    {
      id: 12,
      name: 'بنر جداري',
      price: 35,
      tag: 'new',
      category: 'boards',
      icon: '🖼️',
      image: '',
      categoryName: 'لوحات',
      description: 'للمتر المربع.'
    },

    // ═══════════════════════════════════════
    // قسم رول اب (rollup)
    // ═══════════════════════════════════════
    {
      id: 13,
      name: 'رول أب عادي',
      price: 280,
      tag: 'best',
      category: 'rollup',
      icon: '📜',
      image: '',
      categoryName: 'رول اب',
      description: 'ستاند 85x200 سم.'
    },
    {
      id: 14,
      name: 'رول أب عريض',
      price: 380,
      tag: 'new',
      category: 'rollup',
      icon: '📜',
      image: '',
      categoryName: 'رول اب',
      description: 'ستاند 100x200 سم.'
    },
    {
      id: 15,
      name: 'رول أب وجهين',
      price: 450,
      tag: 'best',
      category: 'rollup',
      icon: '🔄',
      image: '',
      categoryName: 'رول اب',
      description: 'عرض من الجهتين.'
    },
    {
      id: 16,
      name: 'X بانر',
      price: 180,
      tag: 'new',
      category: 'rollup',
      icon: '❌',
      image: '',
      categoryName: 'رول اب',
      description: 'ستاند 60x160 سم.'
    },

    // ═══════════════════════════════════════
    // قسم المعارض (exhibitions)
    // ═══════════════════════════════════════
    {
      id: 17,
      name: 'بوب أب 3x3',
      price: 1800,
      tag: 'best',
      category: 'exhibitions',
      icon: '🎪',
      image: '',
      categoryName: 'معارض',
      description: 'جدارية للمعارض.'
    },
    {
      id: 18,
      name: 'كاونتر عرض',
      price: 950,
      tag: 'new',
      category: 'exhibitions',
      icon: '🛒',
      image: '',
      categoryName: 'معارض',
      description: 'طاولة استقبال.'
    },
    {
      id: 19,
      name: 'خيمة ترويجية',
      price: 2500,
      tag: 'best',
      category: 'exhibitions',
      icon: '⛺',
      image: '',
      categoryName: 'معارض',
      description: '3x3 متر مطبوعة.'
    },
    {
      id: 20,
      name: 'فلاق بانر',
      price: 350,
      tag: 'new',
      category: 'exhibitions',
      icon: '🚩',
      image: '',
      categoryName: 'معارض',
      description: 'علم ريشة 3 متر.'
    },

    // ═══════════════════════════════════════
    // قسم اللوحات المضيئة (illuminated)
    // ═══════════════════════════════════════
    {
      id: 21,
      name: 'لوحة نيون LED',
      price: 350,
      tag: 'best',
      category: 'illuminated',
      icon: '⚡',
      image: '',
      categoryName: 'لوحات مضيئة',
      description: 'إضاءة LED جذابة.'
    },
    {
      id: 22,
      name: 'لوحة Open',
      price: 250,
      tag: 'new',
      category: 'illuminated',
      icon: '💡',
      image: '',
      categoryName: 'لوحات مضيئة',
      description: 'جاهزة للمحلات.'
    },
    {
      id: 23,
      name: 'لايت بوكس',
      price: 180,
      tag: 'best',
      category: 'illuminated',
      icon: '💠',
      image: '',
      categoryName: 'لوحات مضيئة',
      description: 'للمتر المربع.'
    },
    {
      id: 24,
      name: 'حروف بارزة مضيئة',
      price: 95,
      tag: 'new',
      category: 'illuminated',
      icon: '🔤',
      image: '',
      categoryName: 'لوحات مضيئة',
      description: 'للحرف الواحد.'
    }
  ]
};

// تصدير للاستخدام العام
window.PRODUCTS_DATA = PRODUCTS_DATA;
