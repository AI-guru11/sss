// ==============================================
// AIRTABLE INTEGRATION SERVICE
// خدمة الاتصال بقاعدة بيانات Airtable
// ==============================================

// ⚠️ SECURITY WARNING - API KEY PROTECTION
// ========================================
// NEVER expose Airtable API keys or Personal Access Tokens (PAT) in client-side code.
// This service is provided for DEVELOPMENT and DEMO purposes only.
// 
// For PRODUCTION, you MUST:
// 1. Move Airtable API calls to a secure backend server (Node.js, Python, PHP, etc.)
// 2. Use environment variables to store API keys on the server
// 3. Create a backend API endpoint that your frontend calls (e.g., /api/products)
// 4. The backend endpoint fetches data from Airtable and returns it to the frontend
// 5. NEVER commit js/airtable-config.js to version control (it's in .gitignore)
//
// تحذير أمني - حماية مفاتيح API
// لا تعرض أبداً مفاتيح API الخاصة بـ Airtable في كود العميل (client-side).
// هذه الخدمة مخصصة للتطوير والتجربة فقط.
// في الإنتاج، يجب نقل استدعاءات API إلى خادم خلفي آمن.
// ========================================

// ⚠️ SECURITY: Credentials loaded from js/airtable-config.js (not committed to git)
// See js/airtable-config.example.js for setup instructions

// Get credentials from external config file
function getCredentials() {
  if (window.AIRTABLE_CONFIG_CREDENTIALS) {
    return window.AIRTABLE_CONFIG_CREDENTIALS;
  }
  return {
    pat: 'PASTE_YOUR_PAT_HERE',
    baseId: 'PASTE_YOUR_BASE_ID',
    tableId: 'PASTE_YOUR_TABLE_ID'
  };
}

const credentials = getCredentials();
const AIRTABLE_PAT = credentials.pat;
const BASE_ID = credentials.baseId;

// Airtable API Configuration
const AIRTABLE_CONFIG = {
  tableName: credentials.tableId,  // Table ID (more reliable than table name)
  apiUrl: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    'Authorization': `Bearer ${AIRTABLE_PAT}`,
    'Content-Type': 'application/json'
  }
};

// ==============================================
// AIRTABLE SERVICE CLASS
// ==============================================
class AirtableService {
  constructor() {
    this.isConfigured = this.checkConfiguration();
    this.cache = null;
    this.cacheTimestamp = null;
    this.cacheDuration = 5 * 60 * 1000; // 5 minutes cache
  }

  // Check if credentials are configured
  checkConfiguration() {
    const hasToken = AIRTABLE_PAT && AIRTABLE_PAT !== 'PASTE_YOUR_PAT_HERE';
    const hasBase = BASE_ID && BASE_ID !== 'PASTE_YOUR_BASE_ID_HERE';

    if (!hasToken || !hasBase) {
      console.warn('⚠️ Airtable credentials not configured. Using local fallback data.');
      return false;
    }

    console.log('✅ Airtable service configured and ready');
    return true;
  }

  // Fetch products from Airtable
  async fetchProducts() {
    // If not configured, return null to trigger fallback
    if (!this.isConfigured) {
      return null;
    }

    // Return cached data if still valid
    if (this.cache && this.cacheTimestamp && (Date.now() - this.cacheTimestamp < this.cacheDuration)) {
      console.log('📦 Using cached Airtable data');
      return this.cache;
    }

    try {
      console.log('🔄 Fetching products from Airtable...');

      const response = await fetch(
        `${AIRTABLE_CONFIG.apiUrl}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}`,
        {
          method: 'GET',
          headers: AIRTABLE_CONFIG.headers
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Map Airtable records to our product format
      const products = this.mapAirtableRecords(data.records);

      // Cache the results
      this.cache = products;
      this.cacheTimestamp = Date.now();

      console.log(`✅ Successfully fetched ${products.length} products from Airtable`);
      return products;

    } catch (error) {
      console.error('❌ Airtable fetch failed:', error.message);
      console.warn('🔄 Falling back to local data...');
      return null; // Trigger fallback to local data
    }
  }

  // Map Airtable records to product format
  mapAirtableRecords(records) {
    return records.map((record, index) => {
      const fields = record.fields;

      // Extract image URL from Airtable attachment array
      let imageUrl = '';
      if (fields.Image && Array.isArray(fields.Image) && fields.Image.length > 0) {
        imageUrl = fields.Image[0].url;
      }

      // Extract category and generate category ID
      const categoryName = fields.Category || 'غير مصنف';
      const categoryId = this.getCategoryId(categoryName);

      return {
        id: record.id || `product-${index + 1}`,
        name: fields.Name || 'منتج بدون اسم',
        price: parseFloat(fields.Price) || 0,
        originalPrice: fields.OriginalPrice ? parseFloat(fields.OriginalPrice) : null,
        category: categoryId,
        categoryName: categoryName,
        description: fields.Description || 'لا يوجد وصف متاح',
        image: imageUrl,
        icon: this.getCategoryIcon(categoryId),
        tag: fields.Tag || null,
        inStock: fields.InStock !== false, // Default to true if not specified
        rating: fields.Rating ? parseFloat(fields.Rating) : 5,
        features: fields.Features ? fields.Features.split('\n') : []
      };
    });
  }

  // Generate category ID from category name
  getCategoryId(categoryName) {
    const categoryMap = {
      'تصميم الهوية': 'identity-design',
      'Identity Design': 'identity-design',
      'اللافتات': 'signage',
      'Signage': 'signage',
      'الطباعة': 'printing',
      'Printing': 'printing',
      'الطباعة': 'print',
      'الهدايا': 'gifts',
      'اللوحات': 'boards',
      'رول أب': 'rollup',
      'المعارض': 'exhibitions',
      'الإضاءة': 'illuminated'
    };

    return categoryMap[categoryName] || categoryName.toLowerCase().replace(/\s+/g, '-');
  }

  // Get category icon
  getCategoryIcon(categoryId) {
    const iconMap = {
      'identity-design': '🎨',
      'signage': '🪧',
      'printing': '🖨️',
      'print': '🖨️',
      'gifts': '🎁',
      'boards': '📋',
      'rollup': '📜',
      'exhibitions': '🏢',
      'illuminated': '💡'
    };

    return iconMap[categoryId] || '📦';
  }

  // Extract unique categories from products
  extractCategories(products) {
    const categoriesMap = new Map();

    products.forEach(product => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, {
          id: product.category,
          name: product.categoryName,
          icon: product.icon,
          count: 0
        });
      }
      categoriesMap.get(product.category).count++;
    });

    // Add "all" category
    const categories = [
      {
        id: 'all',
        name: 'الكل',
        icon: '🛍️',
        count: products.length
      },
      ...Array.from(categoriesMap.values())
    ];

    return categories;
  }

  // Clear cache (useful for manual refresh)
  clearCache() {
    this.cache = null;
    this.cacheTimestamp = null;
    console.log('🗑️ Airtable cache cleared');
  }
}

// ==============================================
// EXPORT SERVICE INSTANCE
// ==============================================
window.AirtableService = new AirtableService();
console.log('📡 Airtable Service initialized');
