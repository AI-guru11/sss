// ==============================================
// بيانات معرض الأعمال والمشاريع
// Portfolio & Projects Data
// ==============================================
// يمكنك إضافة أو تعديل المشاريع بسهولة من هنا

const PORTFOLIO_DATA = {

  // ═══════════════════════════════════════
  // مشاريع مستكشف الذوق (Brief Wizard)
  // تستخدم للفلترة حسب التصنيف والنمط
  // ═══════════════════════════════════════
  briefProjects: [
    {
      id: 1,
      title: 'فندق قصر السحاب',
      category: 'decor',    // decor | branding | events
      style: 'classic',     // classic | modern | neon
      img: 'linear-gradient(135deg, #2c1a1a, #4a3b3b)',
      desc: 'ديكور داخلي كلاسيكي فاخر.'
    },
    {
      id: 2,
      title: 'مقهى سايبر نيون',
      category: 'decor',
      style: 'neon',
      img: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      desc: 'إضاءة نيون وتصميم عصري.'
    },
    {
      id: 3,
      title: 'هوية شركة تقنية',
      category: 'branding',
      style: 'modern',
      img: 'linear-gradient(135deg, #1a2980, #26d0ce)',
      desc: 'شعار وهوية بصرية بأسلوب بسيط.'
    },
    {
      id: 4,
      title: 'مطعم برجر مودرن',
      category: 'decor',
      style: 'modern',
      img: 'linear-gradient(135deg, #ff512f, #dd2476)',
      desc: 'تصميم داخلي بألوان حيوية.'
    },
    {
      id: 5,
      title: 'حفل زفاف ملكي',
      category: 'events',
      style: 'classic',
      img: 'linear-gradient(135deg, #ECE9E6, #FFFFFF)',
      desc: 'تنظيم وتنسيق كلاسيكي فخم.'
    },
    {
      id: 6,
      title: 'لاونج نيون',
      category: 'decor',
      style: 'neon',
      img: 'linear-gradient(135deg, #11998e, #38ef7d)',
      desc: 'أجواء ليلية بإضاءة خافتة ونيون.'
    }
  ],

  // ═══════════════════════════════════════
  // مشاريع معرض الأعمال (Work Gallery)
  // ═══════════════════════════════════════
  galleryProjects: [
    {
      id: 1,
      title: 'Conference Branding',
      subtitle: 'هوية بصرية لمؤتمر',
      bg: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)',
      tags: ['طباعة', 'هوية']
    },
    {
      id: 2,
      title: 'Coffee Shop Neon',
      subtitle: 'تنفيذ إضاءة نيون',
      bg: 'linear-gradient(135deg, #2c0b0e 0%, #5c181f 100%)',
      tags: ['نيون', 'ديكور']
    },
    {
      id: 3,
      title: 'Marketing Campaign',
      subtitle: 'حملة إعلانية',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      tags: ['تصميم', 'إعلانات']
    }
  ],

  // ═══════════════════════════════════════
  // بيانات قسم التحولات (Transformations)
  // ═══════════════════════════════════════
  transformations: {
    title: 'قصة نجاح: إعادة إحياء علامة تجارية',
    desc: 'شاهد كيف حولنا المساحة من تصميم تقليدي باهت إلى تجربة بصرية عصرية تنبض بالحياة، مما ساهم في جذب شريحة عملاء جديدة.',
    stats: [
      { label: 'زيادة المبيعات', value: '45%' },
      { label: 'تفاعل العملاء', value: '3x' }
    ]
  }
};

// تصدير للاستخدام العام
window.PORTFOLIO_DATA = PORTFOLIO_DATA;
