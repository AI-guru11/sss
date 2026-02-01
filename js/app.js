// ========================================
// EXTRACTED FROM index.html
// Original lines 1654-2220 (inline script)
// ========================================

// ==============================================
// SITE CONFIGURATION (Single Source of Truth)
// ==============================================
const SITE_CONFIG = {
// Contact Information
whatsapp: ‘966555862272’,        // International format without +
email: ‘safigroup@gmail.com’,
address: ‘Muhayl Asir, Saudi Arabia’,
phone: {
display: ‘+966 555 862 272’,   // User-facing format
tel: ‘+966555862272’           // tel: link format
},
location: {
city: ‘Muhayl Asir, Saudi Arabia’,
mapsUrl: ‘https://maps.google.com/?q=Muhayl%20Asir%2C%20Saudi%20Arabia’
},

// Social Media Links
social: {
instagram: ‘#’,  // TODO: Add real Instagram URL
twitter: ‘#’,    // TODO: Add real X/Twitter URL
behance: ‘#’     // TODO: Add real Behance URL
},

// Branding
brand: {
name: ‘مجموعة الصافي’,
tagline: ‘SAFI GROUP’,
// Real logo file (keep transparent PNG)
logoPath: ‘assets/logo.webp’
}
};

// ==============================================
// ANALYTICS HELPER
// ==============================================
// Global analytics event emitter
// Users can listen to these events and send to their analytics platform:
// window.addEventListener(‘safi_analytics’, (e) => {
//   gtag(‘event’, e.detail.event, e.detail);
//   // or plausible(e.detail.event, { props: e.detail });
//   // or fathom.trackGoal(e.detail.event, e.detail);
// });
function trackAnalytics(eventName, data = {}){
const event = new CustomEvent(‘safi_analytics’, {
detail: {
event: eventName,
timestamp: new Date().toISOString(),
…data
}
});
window.dispatchEvent(event);
console.log(’[Analytics]’, eventName, data);
}

// ==============================================
// MAIN APP
// ==============================================
function fikraApp(){
return {
theme: ‘dark’,   // ‘dark’ | ‘idea’
mobileOpen: false,
headerShrink: 0,
isOffline: false,

```
init(){
  // Restore theme
  const saved = localStorage.getItem('fikra_theme');
  if(saved === 'idea') this.setTheme('idea');
  else this.setTheme('dark');

  // Reveal on scroll
  const nodes = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });
  nodes.forEach(n=>io.observe(n));

  // Register service worker (real file, not blob)
  this.registerServiceWorker();

  // Listen for online/offline events
  window.addEventListener('online', () => {
    this.isOffline = false;
  });
  window.addEventListener('offline', () => {
    this.isOffline = true;
  });

  // Set initial offline status
  this.isOffline = !navigator.onLine;

  // Header shrink on scroll
  const onScroll = () => {
    // Compact after small threshold
    const y = window.scrollY || 0;
    const t = Math.max(0, Math.min(1, y / 120));
    this.headerShrink = Number(t.toFixed(3));
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
},

registerServiceWorker(){
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
},

setTheme(mode){
  this.theme = mode;
  const html = document.documentElement;
  if(mode === 'idea'){
    html.classList.add('idea');
    html.classList.remove('dark');
  }else{
    html.classList.remove('idea');
    html.classList.add('dark');
  }
  localStorage.setItem('fikra_theme', mode);

  // Analytics: Theme toggled
  trackAnalytics('theme_toggled', { theme: mode });
},

toggleTheme(){
  this.setTheme(this.theme === 'idea' ? 'dark' : 'idea');
}
```

}
}

function briefWizard(){
const STORAGE_KEY = ‘safi_brief_wizard’;

return {
step: 1,
error: ‘’,
showResumeBanner: false,
isSubmitting: false, // Loading state for Next button
isRedirecting: false, // Loading state for WhatsApp redirect
projectTypes: [
{ value: ‘Design’, label: ‘Design’, desc: ‘هوية / UI / حملات’ },
{ value: ‘Events’, label: ‘Events’, desc: ‘مؤتمرات / فعاليات’ },
{ value: ‘Ads’, label: ‘Ads’, desc: ‘إعلانات / محتوى’ },
],
budgets: [’< 5k SAR’, ‘5k – 15k SAR’, ‘15k – 50k SAR’, ‘50k+ SAR’],
timelines: [
{ value: ‘Urgent (1–2 weeks)’, label: ‘عاجل’, desc: ‘1–2 أسبوع’ },
{ value: ‘1 month’, label: ‘متوسط’, desc: ‘شهر’ },
{ value: ‘2–3 months’, label: ‘موسع’, desc: ‘2–3 أشهر’ },
],
form: {
type: ‘’,
budget: ‘’,
timeline: ‘’,
name: ‘’,
company: ‘’,
whatsapp: ‘’,
},
// Real-time validation state
touched: {
name: false,
company: false,
whatsapp: false,
},
fieldErrors: {
name: ‘’,
company: ‘’,
whatsapp: ‘’,
},

```
// Real-time validation methods
validateName(){
  this.touched.name = true;
  if(!this.form.name || this.form.name.trim().length < 2){
    this.fieldErrors.name = 'الاسم يجب أن يكون حرفين على الأقل';
    return false;
  }
  this.fieldErrors.name = '';
  return true;
},

validateCompany(){
  this.touched.company = true;
  if(!this.form.company || this.form.company.trim().length < 2){
    this.fieldErrors.company = 'اسم الشركة يجب أن يكون حرفين على الأقل';
    return false;
  }
  this.fieldErrors.company = '';
  return true;
},

validateWhatsapp(){
  this.touched.whatsapp = true;
  const phone = this.form.whatsapp.trim();

  if(!phone){
    this.fieldErrors.whatsapp = 'رقم واتساب مطلوب';
    return false;
  }

  // International format: +[country code][number] or just digits
  // Should be between 10-15 digits
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parentheses
  const phoneRegex = /^\+?\d{10,15}$/;

  if(!phoneRegex.test(cleanPhone)){
    this.fieldErrors.whatsapp = 'صيغة غير صحيحة. مثال: +966501234567';
    return false;
  }

  this.fieldErrors.whatsapp = '';
  return true;
},

isFieldValid(field){
  return this.touched[field] && !this.fieldErrors[field] && this.form[field];
},

// LocalStorage persistence
saveToStorage(){
  try{
    const data = {
      step: this.step,
      form: this.form,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }catch(e){
    // Silently fail if localStorage is blocked (privacy mode)
    console.warn('Could not save to localStorage:', e);
  }
},

loadFromStorage(){
  try{
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved){
      const data = JSON.parse(saved);
      // Only restore if saved within last 7 days
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if(data.timestamp && data.timestamp > sevenDaysAgo){
        this.form = {...data.form};
        this.step = data.step || 1;
        this.showResumeBanner = true;
        return true;
      }else{
        // Old data, clear it
        this.clearStorage();
      }
    }
  }catch(e){
    console.warn('Could not load from localStorage:', e);
  }
  return false;
},

clearStorage(){
  try{
    localStorage.removeItem(STORAGE_KEY);
    this.showResumeBanner = false;
  }catch(e){
    console.warn('Could not clear localStorage:', e);
  }
},

dismissResumeBanner(){
  this.showResumeBanner = false;
},

startFresh(){
  this.clearStorage();
  this.reset();
},

get message(){
  const lines = [
    `${SITE_CONFIG.brand.name} — New Brief`,
    '-----------------------',
    `Type: ${this.form.type || '—'}`,
    `Budget: ${this.form.budget || '—'}`,
    `Timeline: ${this.form.timeline || '—'}`,
    '',
    `Name: ${this.form.name || '—'}`,
    `Company: ${this.form.company || '—'}`,
    `Client WhatsApp: ${this.form.whatsapp || '—'}`,
    '',
    'Notes:',
    '- Please share any references/links if available.',
  ];
  return lines.join('\n');
},

get whatsappUrl(){
  const text = encodeURIComponent(this.message);
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`;
},

validateStep(){
  this.error = '';
  if(this.step === 1 && !this.form.type) return 'اختر نوع المشروع.';
  if(this.step === 2 && !this.form.budget) return 'اختر الميزانية.';
  if(this.step === 3 && !this.form.timeline) return 'اختر الجدول الزمني.';
  if(this.step === 4){
    // Trigger all validations
    const nameValid = this.validateName();
    const companyValid = this.validateCompany();
    const whatsappValid = this.validateWhatsapp();

    if(!nameValid || !companyValid || !whatsappValid){
      return 'يرجى تصحيح الأخطاء في الحقول';
    }
  }
  return '';
},

async next(){
  this.isSubmitting = true;
  // Small delay to show loading state (improves perceived responsiveness)
  await new Promise(resolve => setTimeout(resolve, 300));

  const err = this.validateStep();
  if(err){
    this.error = err;
    this.isSubmitting = false;
    return;
  }
  this.error = ''; // Clear error on success

  // Analytics: Track step completion
  const currentStep = this.step;
  trackAnalytics('wizard_step_completed', {
    step: currentStep,
    stepName: ['type', 'budget', 'timeline', 'contact', 'confirmation'][currentStep - 1]
  });

  this.step = Math.min(5, this.step + 1);
  this.saveToStorage(); // Auto-save progress
  this.isSubmitting = false;
},

prev(){
  this.error = '';
  this.step = Math.max(1, this.step - 1);
  this.saveToStorage(); // Auto-save progress
},

reset(){
  this.step = 1;
  this.error = '';
  this.form = { type:'', budget:'', timeline:'', name:'', company:'', whatsapp:'' };
  this.touched = { name: false, company: false, whatsapp: false };
  this.fieldErrors = { name: '', company: '', whatsapp: '' };
  this.clearStorage(); // Clear saved data on reset
},

// Initialize: load saved data if available
init(){
  const hadSavedData = this.loadFromStorage();

  // Analytics: Track wizard start
  trackAnalytics('wizard_started', {
    resumed: hadSavedData,
    step: this.step
  });
},

// Handle WhatsApp redirect with loading state
async sendViaWhatsApp(){
  this.isRedirecting = true;

  // Analytics: Track brief submission
  trackAnalytics('brief_submitted', {
    type: this.form.type,
    budget: this.form.budget,
    timeline: this.form.timeline,
    hasCompany: !!this.form.company
  });

  // Show overlay for 1 second before redirect
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Clear saved data since wizard is being submitted
  this.clearStorage();
  // Redirect to WhatsApp
  window.open(this.whatsappUrl, '_blank');
  this.isRedirecting = false;
}
```

}
}

function workGallery(){
return {
isLoading: true,
modalOpen: false,
active: null,

```
init(){
  // Simulate gallery content loading
  setTimeout(() => {
    this.isLoading = false;
  }, 800);
},

featured: {
  id: 'featured',
  title: 'Brand Refresh — Before/After',
  subtitle: 'تحسين بصري + وضوح رسالة + إحساس premium.',
  tags: ['Brand', 'UI', 'Motion'],
  desc: 'هذا مثال توضيحي: نفس المحتوى، لكن إعادة توزيع العناصر + ألوان صحيحة + حركة خفيفة = نتيجة "تبيع" أسرع.'
},

projects: [
  {
    id: 1,
    title: 'Conference Landing',
    subtitle: 'Hero typography + CTA system',
    tags: ['Events', 'Landing', 'Bento'],
    h: 240,
    bg: 'linear-gradient(135deg, rgba(229,57,53,.22), rgba(255,255,255,.06), rgba(129,216,208,.18))',
    desc: 'صفحة هبوط فعالية مع تسلسل معلومات واضح وتحويل سريع.'
  },
  {
    id: 2,
    title: 'Packaging System',
    subtitle: 'Print-ready identity',
    tags: ['Printing', 'Packaging', 'Craft'],
    h: 310,
    bg: 'radial-gradient(circle at 30% 30%, rgba(129,216,208,.22), transparent 55%), radial-gradient(circle at 70% 70%, rgba(229,57,53,.22), transparent 55%)',
    desc: 'نظام تغليف متكامل: ألوان، خامات، تشطيب.'
  },
  {
    id: 3,
    title: 'Ad Campaign Set',
    subtitle: 'Hook + message consistency',
    tags: ['Ads', 'Content', 'Performance'],
    h: 260,
    bg: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(129,216,208,.18)), radial-gradient(circle at 60% 40%, rgba(229,57,53,.20), transparent 60%)',
    desc: 'حملة إعلانية مرئية: وحدات متعددة بنفس الDNA.'
  },
  {
    id: 4,
    title: 'Bento Service Hub',
    subtitle: 'Apple/Stripe-inspired grid',
    tags: ['UI', 'Bento', 'Glass'],
    h: 340,
    bg: 'linear-gradient(135deg, rgba(129,216,208,.20), rgba(229,57,53,.18), rgba(255,255,255,.06))',
    desc: 'واجهة خدمات بتصميم bento مع glassmorphism.'
  },
  {
    id: 5,
    title: 'Brand Kit v1',
    subtitle: 'Typography + tone + rules',
    tags: ['Brand', 'Guidelines', 'Type'],
    h: 230,
    bg: 'radial-gradient(circle at 35% 35%, rgba(229,57,53,.24), transparent 55%), linear-gradient(180deg, rgba(255,255,255,.08), transparent)',
    desc: 'باكدج براند: خطوط، ألوان، أسلوب كلام.'
  },
],

openModal(project){
  this.active = project;
  this.modalOpen = true;

  // Analytics: Track project view
  trackAnalytics('project_viewed', {
    projectId: project.id,
    projectTitle: project.title,
    projectTags: project.tags
  });
},
closeModal(){
  this.modalOpen = false;
  this.active = null;
}
```

}
}

function beforeAfter(){
return {
pos: 50,
dragging: false,
start(e){
if(e.pointerType === ‘mouse’ && e.button !== 0) return;
this.dragging = true;
this.updateFromEvent(e);
},
move(e){
if(!this.dragging) return;
this.updateFromEvent(e);
},
end(){ this.dragging = false; },
updateFromEvent(e){
const rect = e.currentTarget.getBoundingClientRect();
const x = e.clientX - rect.left;
const p = (x / rect.width) * 100;
this.pos = Math.max(0, Math.min(100, p));
}
}
}

// ==============================================
// PRODUCTS SHOP - ENHANCED VERSION
// ==============================================
function productsShop() {
return {
// State
activeCategory: ‘all’,
cart: [],
searchQuery: ‘’,
sortBy: ‘default’, // default, price-asc, price-desc, name
viewMode: ‘grid’, // grid, list
isLoading: true,

```
// Modal States
quickViewProduct: null,
detailProduct: null,
showQuickView: false,
showDetail: false,
showCart: false,

// Quantities (for cart)
quantities: {},

categories: [
  { id: 'all', name: 'الكل', icon: 'grid', color: 'from-fikra-violet to-fikra-orange' },
  { id: 'neon', name: 'نيون', icon: 'zap', color: 'from-red-500 to-orange-500' },
  { id: 'canvas', name: 'كانفس', icon: 'frame', color: 'from-purple-500 to-pink-500' },
  { id: 'stands', name: 'ستاندات', icon: 'presentation', color: 'from-blue-500 to-cyan-500' },
  { id: 'gifts', name: 'هدايا', icon: 'gift', color: 'from-green-500 to-emerald-500' },
  { id: 'stickers', name: 'ملصقات', icon: 'sticker', color: 'from-yellow-500 to-amber-500' },
  { id: 'printing', name: 'طباعة', icon: 'shirt', color: 'from-indigo-500 to-violet-500' },
  { id: 'cards', name: 'كروت', icon: 'creditcard', color: 'from-rose-500 to-red-500' },
],

products: [
  // نيون
  { 
    id: 1, 
    name: 'لوحة نيون مخصصة - صغيرة', 
    description: 'لوحة نيون LED بتصميمك الخاص، مثالية للمكاتب والغرف.',
    longDescription: 'لوحة نيون LED عالية الجودة مصممة خصيصاً لك. تتميز بإضاءة ناعمة وموفرة للطاقة، مثالية لإضفاء لمسة عصرية على مكتبك أو غرفتك. تأتي مع وحدة تحكم لتعديل السطوع وكابل طويل للتوصيل.',
    price: 350, 
    oldPrice: 450,
    category: 'neon', 
    categoryName: 'نيون', 
    icon: 'neon',
    size: '30×20 سم',
    features: ['LED موفر للطاقة', 'تحكم بالسطوع', 'ضمان سنتين', 'تصميم مخصص'],
    inStock: true,
    badge: 'خصم 22%'
  },
  { 
    id: 2, 
    name: 'لوحة نيون مخصصة - كبيرة', 
    description: 'لوحة نيون LED احترافية للمحلات والمطاعم.',
    longDescription: 'لوحة نيون احترافية بحجم كبير مناسبة للمحلات التجارية والمطاعم والكافيهات. إضاءة قوية وثابتة مع عمر افتراضي طويل. تشمل التركيب والتوصيل.',
    price: 750, 
    oldPrice: null,
    category: 'neon', 
    categoryName: 'نيون', 
    icon: 'neon-lg',
    size: '60×40 سم',
    features: ['إضاءة احترافية', 'مقاوم للرطوبة', 'تركيب مجاني', 'ضمان 3 سنوات'],
    inStock: true,
    badge: 'الأكثر طلباً'
  },
  
  // كانفس
  { 
    id: 3, 
    name: 'لوحة كانفس - مقاس وسط', 
    description: 'طباعة عالية الجودة على قماش كانفس مشدود.',
    longDescription: 'لوحة كانفس مطبوعة بدقة عالية على قماش قطني فاخر ومشدود على إطار خشبي متين. ألوان زاهية تدوم طويلاً، مثالية لتزيين المنازل والمكاتب.',
    price: 180, 
    oldPrice: 220,
    category: 'canvas', 
    categoryName: 'كانفس', 
    icon: 'canvas',
    size: '40×60 سم',
    features: ['قماش قطني 100%', 'إطار خشبي', 'ألوان ثابتة', 'جاهز للتعليق'],
    inStock: true,
    badge: null
  },
  { 
    id: 4, 
    name: 'لوحة كانفس - مقاس كبير', 
    description: 'لوحة كانفس فاخرة بإطار خشبي.',
    longDescription: 'لوحة كانفس فاخرة بمقاس كبير، مطبوعة بتقنية Giclée للحصول على أعلى جودة ممكنة. إطار خشبي سميك مع حواف ملونة.',
    price: 320, 
    oldPrice: null,
    category: 'canvas', 
    categoryName: 'كانفس', 
    icon: 'canvas-lg',
    size: '60×90 سم',
    features: ['طباعة Giclée', 'إطار سميك', 'حواف ملونة', 'حماية UV'],
    inStock: true,
    badge: null
  },
  
  // ستاندات
  { 
    id: 5, 
    name: 'ستاند رول أب', 
    description: 'ستاند عرض قابل للطي مع طباعة عالية الدقة.',
    longDescription: 'ستاند رول أب احترافي بهيكل ألمنيوم خفيف وقوي. يتميز بسهولة التركيب والفك، مثالي للمعارض والفعاليات. يأتي مع حقيبة حمل.',
    price: 280, 
    oldPrice: 350,
    category: 'stands', 
    categoryName: 'ستاندات', 
    icon: 'rollup',
    size: '80×200 سم',
    features: ['هيكل ألمنيوم', 'سهل التركيب', 'حقيبة حمل', 'طباعة HD'],
    inStock: true,
    badge: 'الأكثر مبيعاً'
  },
  { 
    id: 6, 
    name: 'ستاند X-Banner', 
    description: 'ستاند خفيف وسهل التركيب للمعارض.',
    longDescription: 'ستاند X-Banner اقتصادي وعملي، مثالي للمعارض والمؤتمرات. هيكل معدني خفيف مع طباعة على بانر فينيل عالي الجودة.',
    price: 150, 
    oldPrice: null,
    category: 'stands', 
    categoryName: 'ستاندات', 
    icon: 'xbanner',
    size: '60×160 سم',
    features: ['خفيف الوزن', 'اقتصادي', 'سهل الحمل', 'بانر فينيل'],
    inStock: true,
    badge: null
  },
  
  // هدايا دعائية
  { 
    id: 7, 
    name: 'أقلام دعائية', 
    description: 'أقلام جافة بطباعة الشعار. حد أدنى 50 قطعة.',
    longDescription: 'أقلام دعائية عالية الجودة بتصميم أنيق. طباعة الشعار بالليزر أو السلك سكرين. متوفرة بعدة ألوان. مثالية للتوزيع في المؤتمرات والفعاليات.',
    price: 125, 
    oldPrice: null,
    category: 'gifts', 
    categoryName: 'هدايا', 
    icon: 'pen',
    size: '50 قطعة',
    features: ['طباعة ليزر', 'ألوان متعددة', 'جودة عالية', 'كتابة سلسة'],
    inStock: true,
    badge: null
  },
  { 
    id: 8, 
    name: 'ميداليات مفاتيح', 
    description: 'ميداليات معدنية بتصميم مخصص. حد أدنى 30 قطعة.',
    longDescription: 'ميداليات مفاتيح معدنية فاخرة بتصميم مخصص. حفر بالليزر أو طباعة ملونة. متوفرة بأشكال متعددة: دائري، مربع، قلب، وأشكال مخصصة.',
    price: 180, 
    oldPrice: 220,
    category: 'gifts', 
    categoryName: 'هدايا', 
    icon: 'keychain',
    size: '30 قطعة',
    features: ['معدن فاخر', 'حفر ليزر', 'أشكال متعددة', 'تغليف فردي'],
    inStock: true,
    badge: null
  },
  { 
    id: 9, 
    name: 'أكواب سيراميك', 
    description: 'أكواب بطباعة حرارية عالية الجودة. حد أدنى 20 قطعة.',
    longDescription: 'أكواب سيراميك بيضاء عالية الجودة مع طباعة حرارية ثابتة. آمنة للاستخدام في الميكروويف وغسالة الصحون. سعة 330 مل.',
    price: 240, 
    oldPrice: null,
    category: 'gifts', 
    categoryName: 'هدايا', 
    icon: 'mug',
    size: '20 قطعة',
    features: ['سيراميك عالي الجودة', 'طباعة حرارية', 'آمن للميكروويف', 'سعة 330 مل'],
    inStock: true,
    badge: null
  },
  
  // ملصقات
  { 
    id: 10, 
    name: 'ملصقات فينيل', 
    description: 'ملصقات مقاومة للماء بتصميمك. مقاس حتى 10×10 سم.',
    longDescription: 'ملصقات فينيل عالية الجودة مقاومة للماء والخدش. مثالية للمنتجات والتغليف والسيارات. قص حسب الشكل (Die-cut) متاح.',
    price: 95, 
    oldPrice: 120,
    category: 'stickers', 
    categoryName: 'ملصقات', 
    icon: 'sticker',
    size: '100 قطعة',
    features: ['مقاوم للماء', 'مقاوم للخدش', 'قص حسب الشكل', 'لاصق قوي'],
    inStock: true,
    badge: 'الأكثر طلباً'
  },
  { 
    id: 11, 
    name: 'ستيكرات شفافة', 
    description: 'ملصقات شفافة للتغليف والمنتجات.',
    longDescription: 'ملصقات شفافة احترافية بطباعة عالية الدقة. مثالية للتغليف الفاخر والمنتجات. تضفي مظهراً أنيقاً ومحترفاً.',
    price: 120, 
    oldPrice: null,
    category: 'stickers', 
    categoryName: 'ملصقات', 
    icon: 'sticker-clear',
    size: '100 قطعة',
    features: ['شفاف بالكامل', 'طباعة HD', 'مظهر فاخر', 'سهل التطبيق'],
    inStock: true,
    badge: null
  },
  
  // طباعة على الملابس
  { 
    id: 12, 
    name: 'تيشيرت مطبوع', 
    description: 'تيشيرت قطن 100% بطباعة DTF عالية الجودة.',
    longDescription: 'تيشيرت قطن 100% بجودة ممتازة. طباعة DTF حديثة تضمن ألوان زاهية ومتانة عالية. متوفر بجميع المقاسات من S إلى 3XL.',
    price: 75, 
    oldPrice: 95,
    category: 'printing', 
    categoryName: 'طباعة', 
    icon: 'tshirt',
    size: 'S - 3XL',
    features: ['قطن 100%', 'طباعة DTF', 'ألوان ثابتة', 'جميع المقاسات'],
    inStock: true,
    badge: null
  },
  { 
    id: 13, 
    name: 'هودي مطبوع', 
    description: 'هودي فليس بطباعة أمامية أو خلفية.',
    longDescription: 'هودي فليس دافئ ومريح بطباعة DTF. خامة ناعمة من الداخل. متوفر بجيب كنغر وأربطة قبعة. جميع المقاسات متاحة.',
    price: 145, 
    oldPrice: null,
    category: 'printing', 
    categoryName: 'طباعة', 
    icon: 'hoodie',
    size: 'S - 3XL',
    features: ['فليس دافئ', 'جيب كنغر', 'قبعة مريحة', 'طباعة أمامية/خلفية'],
    inStock: true,
    badge: 'جديد'
  },
  
  // كروت شخصية
  { 
    id: 14, 
    name: 'كروت شخصية عادية', 
    description: 'كروت بزنس فاخرة، ورق 350 جرام.',
    longDescription: 'كروت شخصية احترافية بورق 350 جرام سميك. طباعة على الوجهين بألوان CMYK. تشطيب مات أو لامع حسب الاختيار.',
    price: 85, 
    oldPrice: null,
    category: 'cards', 
    categoryName: 'كروت', 
    icon: 'card',
    size: '100 كرت',
    features: ['ورق 350 جرام', 'طباعة وجهين', 'تشطيب مات/لامع', 'تصميم مجاني'],
    inStock: true,
    badge: null
  },
  { 
    id: 15, 
    name: 'كروت شخصية فاخرة', 
    description: 'كروت مع طباعة ذهبية أو فضية وقص ليزر.',
    longDescription: 'كروت شخصية فاخرة VIP بلمسات ذهبية أو فضية (Hot Foil). قص ليزر للأشكال المميزة. ورق فاخر 400 جرام. الخيار المثالي لرجال الأعمال.',
    price: 180, 
    oldPrice: 250,
    category: 'cards', 
    categoryName: 'كروت', 
    icon: 'card-vip',
    size: '100 كرت',
    features: ['طباعة ذهبية/فضية', 'قص ليزر', 'ورق 400 جرام', 'تصميم VIP'],
    inStock: true,
    badge: 'فاخر'
  },
],

// Initialize
init() {
  // Simulate loading
  setTimeout(() => {
    this.isLoading = false;
  }, 800);
  
  // Load cart from localStorage
  try {
    const savedCart = localStorage.getItem('safi_cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      this.cart = parsed.items || [];
      this.quantities = parsed.quantities || {};
    }
  } catch(e) {
    console.warn('Could not load cart:', e);
  }
},

// Save cart to localStorage
saveCart() {
  try {
    localStorage.setItem('safi_cart', JSON.stringify({
      items: this.cart,
      quantities: this.quantities
    }));
  } catch(e) {
    console.warn('Could not save cart:', e);
  }
},

// Filtered & Sorted Products
get filteredProducts() {
  let result = this.products;
  
  // Filter by category
  if (this.activeCategory !== 'all') {
    result = result.filter(p => p.category === this.activeCategory);
  }
  
  // Filter by search
  if (this.searchQuery.trim()) {
    const query = this.searchQuery.trim().toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.categoryName.includes(query)
    );
  }
  
  // Sort
  switch(this.sortBy) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'name':
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
      break;
  }
  
  return result;
},

// Category count
getCategoryCount(categoryId) {
  if (categoryId === 'all') return this.products.length;
  return this.products.filter(p => p.category === categoryId).length;
},

// Cart calculations
get cartTotal() {
  return this.cart.reduce((sum, item) => {
    const qty = this.quantities[item.id] || 1;
    return sum + (item.price * qty);
  }, 0);
},

get cartItemsCount() {
  return this.cart.reduce((sum, item) => {
    return sum + (this.quantities[item.id] || 1);
  }, 0);
},

// Cart methods
filterByCategory(categoryId) {
  this.activeCategory = categoryId;
  trackAnalytics('products_filtered', { category: categoryId });
},

isInCart(productId) {
  return this.cart.some(item => item.id === productId);
},

addToCart(product) {
  if (!this.isInCart(product.id)) {
    this.cart.push({ ...product });
    this.quantities[product.id] = 1;
    this.saveCart();
    trackAnalytics('product_added_to_cart', { 
      productId: product.id, 
      productName: product.name,
      price: product.price 
    });
  }
},

removeFromCart(productId) {
  this.cart = this.cart.filter(item => item.id !== productId);
  delete this.quantities[productId];
  this.saveCart();
  trackAnalytics('product_removed_from_cart', { productId });
},

updateQuantity(productId, delta) {
  const current = this.quantities[productId] || 1;
  const newQty = Math.max(1, Math.min(99, current + delta));
  this.quantities[productId] = newQty;
  this.saveCart();
},

getQuantity(productId) {
  return this.quantities[productId] || 1;
},

clearCart() {
  this.cart = [];
  this.quantities = {};
  this.saveCart();
  trackAnalytics('cart_cleared');
},

// Quick View
openQuickView(product) {
  this.quickViewProduct = product;
  this.showQuickView = true;
  trackAnalytics('product_quick_view', { productId: product.id, productName: product.name });
},

closeQuickView() {
  this.showQuickView = false;
  this.quickViewProduct = null;
},

// Detail View
openDetail(product) {
  this.detailProduct = product;
  this.showDetail = true;
  trackAnalytics('product_detail_view', { productId: product.id, productName: product.name });
},

closeDetail() {
  this.showDetail = false;
  this.detailProduct = null;
},

// Checkout
checkout() {
  if (this.cart.length === 0) return;

  const lines = [
    `🛒 *طلب جديد من ${SITE_CONFIG.brand.name}*`,
    '═══════════════════════',
    '',
    '*📦 المنتجات:*',
    '',
    ...this.cart.map((item, i) => {
      const qty = this.quantities[item.id] || 1;
      const subtotal = item.price * qty;
      return `${i + 1}. *${item.name}*\n   الكمية: ${qty} | السعر: ${subtotal} ر.س`;
    }),
    '',
    '═══════════════════════',
    `*💰 الإجمالي: ${this.cartTotal} ر.س*`,
    '',
    '═══════════════════════',
    '',
    '*📝 بيانات العميل:*',
    '• الاسم: ',
    '• رقم الجوال: ',
    '• المدينة: ',
    '• العنوان: ',
    '',
    '*💬 ملاحظات إضافية:*',
    '',
  ];

  const message = encodeURIComponent(lines.join('\n'));
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsapp}?text=${message}`;

  trackAnalytics('checkout_initiated', {
    itemCount: this.cart.length,
    totalItems: this.cartItemsCount,
    total: this.cartTotal,
    items: this.cart.map(i => ({ name: i.name, qty: this.quantities[i.id] || 1 }))
  });

  window.open(whatsappUrl, '_blank');
},

// Format price
formatPrice(price) {
  return price.toLocaleString('ar-SA');
}
```

};
}

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener(‘DOMContentLoaded’, () => {
try {
// Ensure functions are globally available for Alpine
window.SITE_CONFIG = SITE_CONFIG;
window.trackAnalytics = trackAnalytics;
window.fikraApp = fikraApp;
window.briefWizard = briefWizard;
window.workGallery = workGallery;
window.beforeAfter = beforeAfter;
window.productsShop = productsShop;
} catch (e) {
console.error(’[BOOT ERROR]’, e);
}
});