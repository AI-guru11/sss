// ==============================================
// بيانات الخدمات
// Services Data
// ==============================================
// يمكنك إضافة أو تعديل الخدمات بسهولة من هنا

const SERVICES_DATA = {

  // لماذا الصافي - النقاط الرئيسية
  whySafi: [
    {
      title: 'Speed/الكفاءة والسرعة',
      description: 'نعمل بوضوح وكفاءة: ننتقل بك من الفكرة إلى النموذج، ثم التسليم.',
      color: 'fikra-orange' // fikra-orange | fikra-violet | gray-400
    },
    {
      title: 'Craft - دقة التنفيذ',
      description: 'يكمن السر في التفاصيل: نعتني بضبط العناصر وأدق التفاصيل.',
      color: 'fikra-violet'
    },
    {
      title: 'Results/النتائج',
      description: 'نصمم لتحقيق الأهداف.',
      color: 'gray-400'
    }
  ],

  // تصنيفات مستكشف الذوق
  briefCategories: [
    {
      id: 'decor',
      title: 'ديكور وتصميم',
      description: 'تصميم داخلي، واجهات، مساحات تجارية.',
      icon: '🏠',
      bgIcon: '🏗️',
      gradient: 'from-[#2c2c2c] via-[#1a1a1a] to-black',
      hoverColor: 'fikra-orange'
    },
    {
      id: 'branding',
      title: 'هوية بصرية',
      description: 'شعارات، هوية شركات، مطبوعات.',
      icon: '✨',
      bgIcon: '🎨',
      gradient: 'from-indigo-900 via-purple-900 to-slate-900',
      hoverColor: 'fikra-violet'
    },
    {
      id: 'events',
      title: 'تنظيم فعاليات',
      description: 'مؤتمرات، معارض، حفلات، مسارح.',
      icon: '🎪',
      bgIcon: '🎉',
      gradient: 'from-rose-900 via-red-950 to-black',
      hoverColor: 'yellow-400'
    }
  ],

  // أنماط التصميم
  briefStyles: [
    {
      id: 'modern',
      title: 'مودرن / بسيط',
      description: 'خطوط نظيفة، مساحات بيضاء.',
      icon: '☁️',
      color: 'fikra-violet'
    },
    {
      id: 'classic',
      title: 'كلاسيكي / فخم',
      description: 'تفاصيل غنية، زخارف، ألوان دافئة.',
      icon: '🏛️',
      color: 'yellow-500'
    },
    {
      id: 'neon',
      title: 'نيون / جريء',
      description: 'إضاءة عالية، طابع شبابي.',
      icon: '⚡',
      color: 'fikra-orange'
    }
  ]
};

// تصدير للاستخدام العام
window.SERVICES_DATA = SERVICES_DATA;
