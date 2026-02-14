# Security Policy & Best Practices
# سياسة الأمان وأفضل الممارسات

## Overview / نظرة عامة

This document outlines the security measures implemented in the Safi Group website and provides best practices for maintaining a secure deployment.

يوضح هذا المستند إجراءات الأمان المطبقة في موقع مجموعة الصافي ويقدم أفضل الممارسات للحفاظ على نشر آمن.

---

## 🔒 Security Measures Implemented / الإجراءات الأمنية المطبقة

### 1. Input Validation & XSS Prevention ✅

**Status:** Implemented in `js/security.js`

All user inputs are sanitized before use to prevent Cross-Site Scripting (XSS) attacks:

- **Functions affected:**
  - `briefWizard.sendRequest()` - Contact name, phone, preferences
  - `productsShop.checkout()` - Product names, descriptions
  - `productsShop.orderProduct()` - Product details
  - `priceCalculator.orderViaWhatsApp()` - Calculator inputs
  - `whatsappWidget.sendMessage()` - User messages

**Sanitization methods:**
- `sanitizeInput()` - HTML entity encoding
- `sanitizeForURL()` - URL-safe text encoding
- `sanitizeName()` - Name validation (Arabic/English)
- `sanitizePhone()` - Phone number validation

**Example:**
```javascript
const safeName = SecurityUtils.sanitizeName(userInput);
const safeMessage = SecurityUtils.sanitizeForURL(messageText);
```

---

### 2. Secure External Dependencies ✅

**Status:** Implemented in `index.html`, `portfolio.html`, `services.html`

All external CDN dependencies use:
- **Pinned versions** (no `@latest` or `@3.x.x`)
- **Subresource Integrity (SRI) hashes** for integrity verification
- **crossorigin="anonymous"** attribute for CORS

**Dependencies secured:**
- Tailwind CSS: `v3.4.1`
- Alpine.js: `v3.13.3`
- Alpine.js Focus Plugin: `v3.13.3`

**Example:**
```html
<script defer src="https://unpkg.com/alpinejs@3.13.3/dist/cdn.min.js" 
        integrity="sha384-8xS8EyG8hIS23wHhKwvBkv/TLY5AxAFVL8kNJIvxFcGbCN2kgPDSMJjFLmqBWBvQ" 
        crossorigin="anonymous"></script>
```

---

### 3. Content Security Policy (CSP) ✅

**Status:** Implemented in `.htaccess` and `server-config.md`

Restrictive CSP headers prevent unauthorized resource loading:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.airtable.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self' https://wa.me;
  upgrade-insecure-requests;
```

**Note:** `'unsafe-inline'` is required for Tailwind CSS inline styles.

---

### 4. Security Headers ✅

**Status:** Implemented in `.htaccess` and `server-config.md`

All recommended security headers are configured:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Frame-Options` | `DENY` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controls referrer info |
| `Permissions-Policy` | (restrictive) | Disables unnecessary browser features |
| `Cross-Origin-*-Policy` | (restrictive) | Prevents information leaks |

**HSTS** (Strict-Transport-Security) is available but commented out until HTTPS is configured.

---

### 5. localStorage Error Handling ✅

**Status:** Implemented in `js/security.js` and `js/app.js`

Safe localStorage wrapper (`SafeStorage`) handles:
- Private browsing mode
- Storage quota exceeded
- Browser security restrictions
- Fallback to in-memory state when localStorage unavailable

**Functions updated:**
- `fikraApp.init()` - Theme persistence
- `fikraApp.setTheme()` - Theme saving
- `whatsappWidget.init()` - Widget state
- `whatsappWidget.close()` - Closed state

**Example:**
```javascript
const theme = SecurityUtils.SafeStorage.getItem('fikra_theme', 'dark');
SecurityUtils.SafeStorage.setItem('fikra_theme', 'idea');
```

---

### 6. Rate Limiting ✅

**Status:** Implemented in `js/security.js` and `js/app.js`

Client-side rate limiting prevents spam and abuse:

| Action | Limit | Window |
|--------|-------|--------|
| Brief Wizard | 2 requests | 2 minutes |
| Product Checkout | 3 requests | 1 minute |
| Price Calculator | 3 requests | 1 minute |
| WhatsApp Widget | 3 requests | 1 minute |

**Features:**
- Per-action tracking with unique keys
- Configurable limits and time windows
- User feedback with cooldown timers
- Automatic reset after window expiration

**Example:**
```javascript
if (!SecurityUtils.whatsappRateLimiter.isAllowed('checkout')) {
  const cooldown = SecurityUtils.whatsappRateLimiter.getRemainingCooldown('checkout');
  alert(`Please wait ${cooldown} seconds`);
  return;
}
```

---

### 7. External Link Validation ✅

**Status:** Implemented in `js/security.js` and `js/app.js`

All WhatsApp URLs are validated before opening:

**Validation checks:**
- Phone number format (10-15 digits)
- Message text sanitization
- URL structure validation
- Official `wa.me` domain only

**Secure function:**
```javascript
const success = SecurityUtils.openWhatsAppSafely(phoneNumber, message);
```

**Security features:**
- `noopener,noreferrer` window options
- Error handling and logging
- User feedback on failures

---

### 8. API Key Protection ✅

**Status:** Documented in `js/airtable-service.js` and `js/airtable-config.example.js`

**⚠️ CRITICAL SECURITY WARNING:**

**Current Implementation:**
- Airtable credentials are loaded client-side for DEVELOPMENT/DEMO only
- `js/airtable-config.js` is in `.gitignore` and NOT committed to version control
- Service uses local fallback when credentials are not configured

**REQUIRED FOR PRODUCTION:**

❌ **DO NOT use client-side Airtable API calls in production**

✅ **MUST implement a backend proxy:**

1. **Create a backend server** (Node.js, Python, PHP, etc.)
2. **Store credentials securely** in environment variables (`.env` file on server)
3. **Create backend API endpoints:**
   ```
   GET /api/products
   POST /api/submit-form
   ```
4. **Backend fetches from Airtable** using server-side credentials
5. **Frontend calls your backend**, NOT Airtable directly
6. **Implement authentication & rate limiting** on backend

**Example backend (Node.js/Express):**
```javascript
// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');

app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_PAT}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});
```

---

## 🛡️ Security Checklist / قائمة التحقق الأمنية

### Before Deployment / قبل النشر

- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure security headers in `.htaccess` or server config
- [ ] Test CSP policy doesn't break functionality
- [ ] Enable HSTS header (only after HTTPS is working)
- [ ] Remove or secure Airtable integration
- [ ] Test all forms and inputs for XSS vulnerabilities
- [ ] Verify rate limiting is working correctly
- [ ] Check localStorage fallbacks work in private mode
- [ ] Ensure sensitive files are not accessible (`.env`, `.htaccess`, `airtable-config.js`)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)

### After Deployment / بعد النشر

- [ ] Run security header scan: https://securityheaders.com/
- [ ] Run Mozilla Observatory: https://observatory.mozilla.org/
- [ ] Verify CSP: https://csp-evaluator.withgoogle.com/
- [ ] Test all WhatsApp integrations
- [ ] Monitor console for security warnings
- [ ] Check browser DevTools for CSP violations
- [ ] Verify rate limiting prevents abuse
- [ ] Test in private/incognito mode

---

## 🚨 Reporting Security Vulnerabilities / الإبلاغ عن الثغرات الأمنية

If you discover a security vulnerability, please:

1. **DO NOT** create a public GitHub issue
2. Contact the maintainers privately
3. Provide detailed information about the vulnerability
4. Allow time for a fix before public disclosure

---

## 📚 Additional Resources / موارد إضافية

### Security Testing Tools / أدوات اختبار الأمان

- **OWASP ZAP** - Vulnerability scanner
- **Burp Suite** - Web security testing
- **Security Headers** - https://securityheaders.com/
- **Mozilla Observatory** - https://observatory.mozilla.org/
- **CSP Evaluator** - https://csp-evaluator.withgoogle.com/

### Best Practices / أفضل الممارسات

1. **Keep dependencies updated** - Regularly update Alpine.js, Tailwind CSS
2. **Monitor security advisories** - Subscribe to security mailing lists
3. **Regular backups** - Backup website files and database regularly
4. **Log monitoring** - Review server logs for suspicious activity
5. **HTTPS everywhere** - Force HTTPS for all connections
6. **Strong CSP** - Regularly review and tighten CSP policy
7. **Input validation** - Never trust user input
8. **Rate limiting** - Implement both client and server-side rate limiting
9. **Minimal privileges** - Use least-privilege principle for API access
10. **Security training** - Keep team updated on security best practices

---

## 🔄 Update History / سجل التحديثات

| Date | Version | Changes |
|------|---------|---------|
| 2024-02 | 1.0 | Initial security implementation |

---

## 📞 Contact / التواصل

For security-related questions or to report vulnerabilities, contact the development team.

---

**Remember:** Security is an ongoing process, not a one-time task. Regularly review and update these measures as new threats emerge.

**تذكر:** الأمان عملية مستمرة وليست مهمة لمرة واحدة. راجع وحدّث هذه الإجراءات بانتظام مع ظهور تهديدات جديدة.
