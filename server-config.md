# Server Security Configuration Guide
# دليل إعدادات الحماية للخادم

## Overview / نظرة عامة

This document provides security header configurations for different web servers. The included `.htaccess` file works for Apache servers. For other servers (Nginx, IIS, etc.), use the configurations below.

يوفر هذا المستند إعدادات رؤوس الحماية لخوادم الويب المختلفة. ملف `.htaccess` المرفق يعمل مع خوادم Apache. للخوادم الأخرى (Nginx، IIS، إلخ)، استخدم الإعدادات أدناه.

---

## 🔒 Security Headers Implemented / رؤوس الحماية المطبقة

1. **Content-Security-Policy (CSP)** - Restricts resource loading to trusted sources
2. **X-Frame-Options** - Prevents clickjacking attacks
3. **X-Content-Type-Options** - Prevents MIME sniffing
4. **X-XSS-Protection** - Legacy XSS protection for older browsers
5. **Referrer-Policy** - Controls referrer information
6. **Permissions-Policy** - Restricts browser features
7. **Strict-Transport-Security (HSTS)** - Forces HTTPS (when enabled)
8. **Cross-Origin Policies** - Prevents information leaks

---

## Apache Configuration (.htaccess)

**Status:** ✅ Already configured in `.htaccess` file

The `.htaccess` file in the root directory contains all necessary security headers for Apache servers. Make sure `mod_headers` is enabled.

---

## Nginx Configuration

Add these directives to your Nginx server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/safi-group;
    
    # Security Headers
    
    # Content Security Policy
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests;" always;
    
    # Clickjacking Protection
    add_header X-Frame-Options "DENY" always;
    
    # MIME Sniffing Protection
    add_header X-Content-Type-Options "nosniff" always;
    
    # XSS Protection (legacy)
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Referrer Policy
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Permissions Policy
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" always;
    
    # Cross-Origin Policies
    add_header Cross-Origin-Embedder-Policy "require-corp" always;
    add_header Cross-Origin-Opener-Policy "same-origin" always;
    add_header Cross-Origin-Resource-Policy "same-origin" always;
    
    # HSTS (HTTPS only - uncomment when using SSL)
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Disable directory listing
    autoindex off;
    
    # Deny access to sensitive files
    location ~ /\.(git|htaccess|env) {
        deny all;
    }
    
    location ~ (SECURITY\.md|server-config\.md|airtable-config\.js|product_manager\.py)$ {
        deny all;
    }
    
    # Cache Control
    location ~* \.(css|js)$ {
        expires 1w;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(webp|png|jpg|jpeg)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location ~* \.(html|json)$ {
        expires 0;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

---

## IIS Configuration (web.config)

Create a `web.config` file in your root directory:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <httpProtocol>
            <customHeaders>
                <!-- Content Security Policy -->
                <add name="Content-Security-Policy" value="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.tailwindcss.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.airtable.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://wa.me; upgrade-insecure-requests;" />
                
                <!-- Clickjacking Protection -->
                <add name="X-Frame-Options" value="DENY" />
                
                <!-- MIME Sniffing Protection -->
                <add name="X-Content-Type-Options" value="nosniff" />
                
                <!-- XSS Protection -->
                <add name="X-XSS-Protection" value="1; mode=block" />
                
                <!-- Referrer Policy -->
                <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
                
                <!-- Permissions Policy -->
                <add name="Permissions-Policy" value="geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()" />
                
                <!-- Cross-Origin Policies -->
                <add name="Cross-Origin-Embedder-Policy" value="require-corp" />
                <add name="Cross-Origin-Opener-Policy" value="same-origin" />
                <add name="Cross-Origin-Resource-Policy" value="same-origin" />
                
                <!-- HSTS (uncomment when using HTTPS) -->
                <!-- <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains; preload" /> -->
            </customHeaders>
        </httpProtocol>
        
        <directoryBrowse enabled="false" />
        
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge">
                <add extension=".css" policy="CacheUntilChange" kernelCachePolicy="CacheUntilChange" duration="7.00:00:00" />
                <add extension=".js" policy="CacheUntilChange" kernelCachePolicy="CacheUntilChange" duration="7.00:00:00" />
                <add extension=".webp" policy="CacheUntilChange" kernelCachePolicy="CacheUntilChange" duration="30.00:00:00" />
            </clientCache>
        </staticContent>
    </system.webServer>
</configuration>
```

---

## Testing Security Headers / اختبار رؤوس الحماية

After deployment, test your security headers using these tools:

بعد النشر، اختبر رؤوس الحماية باستخدام هذه الأدوات:

1. **Security Headers Scanner**: https://securityheaders.com/
2. **Mozilla Observatory**: https://observatory.mozilla.org/
3. **CSP Evaluator**: https://csp-evaluator.withgoogle.com/

Expected Grade: A or A+

---

## Important Notes / ملاحظات هامة

### ⚠️ HSTS (Strict-Transport-Security)

**DO NOT enable HSTS unless:**
- Your site is fully configured with HTTPS
- You have a valid SSL certificate
- All resources are loaded over HTTPS

**لا تُفعّل HSTS إلا إذا:**
- كان موقعك مهيأ بالكامل مع HTTPS
- لديك شهادة SSL صالحة
- جميع الموارد يتم تحميلها عبر HTTPS

### 🔐 CSP Inline Styles

The CSP policy includes `'unsafe-inline'` for `style-src` because Tailwind CSS uses inline styles. This is a necessary trade-off for using Tailwind via CDN.

سياسة CSP تتضمن `'unsafe-inline'` لـ `style-src` لأن Tailwind CSS يستخدم أنماطاً مضمنة.

### 🌐 Airtable API

If you're NOT using Airtable integration, you can remove `https://api.airtable.com` from `connect-src` in the CSP policy.

إذا كنت لا تستخدم تكامل Airtable، يمكنك إزالة `https://api.airtable.com` من `connect-src`.

---

## Additional Security Measures / إجراءات حماية إضافية

1. **Enable HTTPS** - Always use SSL/TLS certificates
2. **Regular Updates** - Keep dependencies updated
3. **Monitor Logs** - Check server logs for suspicious activity
4. **Backup Data** - Regular backups of website and database
5. **Rate Limiting** - Implement server-level rate limiting for APIs

---

## Support / الدعم

For questions about security configuration, refer to:
- `SECURITY.md` - Complete security documentation
- `.htaccess` - Apache configuration (already configured)
- This file - Multi-server configuration guide

---

**Last Updated:** 2024
**Version:** 1.0
