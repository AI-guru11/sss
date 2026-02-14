// ==============================================
// AIRTABLE CONFIGURATION EXAMPLE
// ==============================================
// 
// ⚠️ SECURITY WARNING - DO NOT USE IN PRODUCTION
// ===============================================
// This configuration exposes API credentials in client-side JavaScript,
// which is NOT secure for production environments.
//
// ✅ RECOMMENDED FOR PRODUCTION:
// 1. Create a secure backend server (Node.js, Python Flask/Django, PHP, etc.)
// 2. Store Airtable credentials in environment variables on the server (.env file)
// 3. Create a backend API endpoint (e.g., /api/products) that:
//    - Accepts requests from your frontend
//    - Fetches data from Airtable using server-side credentials
//    - Returns sanitized data to the frontend
// 4. Update your frontend to call your backend API instead of Airtable directly
// 5. Implement rate limiting and authentication on your backend API
//
// 📋 CURRENT SETUP (Development/Demo Only):
// This file is meant for development and testing purposes.
// 
// تحذير أمني - لا تستخدم في الإنتاج
// هذا الإعداد يكشف بيانات اعتماد API في JavaScript من جانب العميل
// وهو غير آمن لبيئات الإنتاج.
// يُوصى بإنشاء خادم خلفي آمن وتخزين المفاتيح في متغيرات البيئة.
// ===============================================
//
// 📋 SETUP INSTRUCTIONS:
// 1. Copy this file to: js/airtable-config.js
// 2. Fill in your actual Airtable credentials below
// 3. NEVER commit airtable-config.js to git (it's in .gitignore)
// 4. Use ONLY for development/testing, NOT for production

const AIRTABLE_CONFIG_CREDENTIALS = {
  pat: 'PASTE_YOUR_PAT_HERE',      // Personal Access Token from https://airtable.com/create/tokens
  baseId: 'PASTE_YOUR_BASE_ID',     // Base ID (starts with 'app...')
  tableId: 'PASTE_YOUR_TABLE_ID'    // Table ID (starts with 'tbl...') or table name
};

// Export to window for use in airtable-service.js
window.AIRTABLE_CONFIG_CREDENTIALS = AIRTABLE_CONFIG_CREDENTIALS;
