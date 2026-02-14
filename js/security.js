// ==============================================
// SECURITY UTILITIES
// أدوات الحماية والأمان
// ==============================================

// ==============================================
// 1. INPUT SANITIZATION (XSS PREVENTION)
// ==============================================

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized safe text
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  
  // Create a temporary element to leverage browser's built-in HTML entity encoding
  const temp = document.createElement('div');
  temp.textContent = input;
  return temp.innerHTML;
}

/**
 * Sanitize text for URL encoding (additional layer for WhatsApp URLs)
 * Removes potentially dangerous characters that could break URL structure
 * @param {string} input - Raw text
 * @returns {string} - URL-safe text
 */
function sanitizeForURL(input) {
  if (!input || typeof input !== 'string') return '';
  
  // First sanitize HTML entities
  const sanitized = sanitizeInput(input);
  
  // Remove any remaining control characters and normalize whitespace
  return sanitized
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Sanitize product/service names (allow Arabic, English, numbers, basic punctuation)
 * @param {string} name - Product or service name
 * @returns {string} - Sanitized name
 */
function sanitizeName(name) {
  if (!name || typeof name !== 'string') return '';
  
  const sanitized = sanitizeInput(name);
  
  // Allow only safe characters: Arabic, English, numbers, spaces, and basic punctuation
  return sanitized
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s\-_.،,()؟?!]+/g, '')
    .trim();
}

/**
 * Sanitize phone number (allow only digits, +, spaces, -)
 * @param {string} phone - Phone number
 * @returns {string} - Sanitized phone number
 */
function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  
  return phone.replace(/[^\d+\s\-()]/g, '').trim();
}

// ==============================================
// 2. URL VALIDATION
// ==============================================

/**
 * Validate WhatsApp URL to ensure it only opens trusted WhatsApp links
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
function isValidWhatsAppNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') return false;
  
  // Remove all non-digit characters for validation
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Valid phone numbers are typically 10-15 digits
  return digits.length >= 10 && digits.length <= 15;
}

/**
 * Create a safe WhatsApp URL with validated inputs
 * @param {string} phoneNumber - WhatsApp phone number
 * @param {string} message - Message text
 * @returns {string|null} - Safe WhatsApp URL or null if invalid
 */
function createSafeWhatsAppURL(phoneNumber, message) {
  // Validate phone number
  if (!isValidWhatsAppNumber(phoneNumber)) {
    console.error('❌ Invalid WhatsApp phone number');
    return null;
  }
  
  // Sanitize message for URL
  const safeMessage = sanitizeForURL(message);
  
  // Ensure we're only creating wa.me URLs (official WhatsApp web format)
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(safeMessage);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Safely open WhatsApp URL with validation
 * @param {string} phoneNumber - WhatsApp phone number
 * @param {string} message - Message text
 * @returns {boolean} - True if URL was opened successfully
 */
function openWhatsAppSafely(phoneNumber, message) {
  const url = createSafeWhatsAppURL(phoneNumber, message);
  
  if (!url) {
    console.error('❌ Failed to create WhatsApp URL - validation failed');
    return false;
  }
  
  try {
    window.open(url, '_blank', 'noopener,noreferrer');
    return true;
  } catch (error) {
    console.error('❌ Failed to open WhatsApp URL:', error);
    return false;
  }
}

// ==============================================
// 3. RATE LIMITING
// ==============================================

class RateLimiter {
  constructor(maxAttempts = 3, windowMs = 60000) {
    this.maxAttempts = maxAttempts; // Maximum attempts
    this.windowMs = windowMs; // Time window in milliseconds
    this.attempts = new Map(); // Store attempts per action
  }
  
  /**
   * Check if an action is allowed (not rate limited)
   * @param {string} actionKey - Unique key for the action (e.g., 'whatsapp_send')
   * @returns {boolean} - True if action is allowed
   */
  isAllowed(actionKey) {
    const now = Date.now();
    const attemptData = this.attempts.get(actionKey);
    
    // No previous attempts - allow
    if (!attemptData) {
      this.recordAttempt(actionKey, now);
      return true;
    }
    
    // Check if window has expired
    if (now - attemptData.firstAttempt > this.windowMs) {
      // Window expired - reset and allow
      this.recordAttempt(actionKey, now);
      return true;
    }
    
    // Within window - check attempt count
    if (attemptData.count >= this.maxAttempts) {
      const remainingTime = Math.ceil((this.windowMs - (now - attemptData.firstAttempt)) / 1000);
      console.warn(`⚠️ Rate limit exceeded. Please wait ${remainingTime} seconds.`);
      return false;
    }
    
    // Increment attempt count and allow
    attemptData.count++;
    attemptData.lastAttempt = now;
    return true;
  }
  
  /**
   * Record a new attempt
   * @param {string} actionKey - Action key
   * @param {number} timestamp - Current timestamp
   */
  recordAttempt(actionKey, timestamp) {
    this.attempts.set(actionKey, {
      firstAttempt: timestamp,
      lastAttempt: timestamp,
      count: 1
    });
  }
  
  /**
   * Get remaining cooldown time in seconds
   * @param {string} actionKey - Action key
   * @returns {number} - Remaining seconds, or 0 if not rate limited
   */
  getRemainingCooldown(actionKey) {
    const now = Date.now();
    const attemptData = this.attempts.get(actionKey);
    
    if (!attemptData || attemptData.count < this.maxAttempts) {
      return 0;
    }
    
    const elapsed = now - attemptData.firstAttempt;
    if (elapsed > this.windowMs) {
      return 0;
    }
    
    return Math.ceil((this.windowMs - elapsed) / 1000);
  }
  
  /**
   * Reset rate limit for a specific action
   * @param {string} actionKey - Action key to reset
   */
  reset(actionKey) {
    this.attempts.delete(actionKey);
  }
  
  /**
   * Clear all rate limit data
   */
  resetAll() {
    this.attempts.clear();
  }
}

// Create global rate limiter instances
// WhatsApp rate limiter: 3 attempts per minute
const whatsappRateLimiter = new RateLimiter(3, 60000);

// Brief submission rate limiter: 2 attempts per 2 minutes
const briefRateLimiter = new RateLimiter(2, 120000);

// ==============================================
// 4. LOCAL STORAGE SAFE WRAPPER
// ==============================================

/**
 * Safe localStorage wrapper with error handling for private browsing/restricted environments
 */
const SafeStorage = {
  /**
   * Safely get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if retrieval fails
   * @returns {*} - Stored value or default
   */
  getItem(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch (error) {
      console.warn(`⚠️ localStorage.getItem failed for key "${key}":`, error.message);
      return defaultValue;
    }
  },
  
  /**
   * Safely set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   * @returns {boolean} - True if successful
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`⚠️ localStorage.setItem failed for key "${key}":`, error.message);
      return false;
    }
  },
  
  /**
   * Safely remove item from localStorage
   * @param {string} key - Storage key
   * @returns {boolean} - True if successful
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`⚠️ localStorage.removeItem failed for key "${key}":`, error.message);
      return false;
    }
  },
  
  /**
   * Check if localStorage is available
   * @returns {boolean} - True if localStorage is available
   */
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// ==============================================
// 5. FORM VALIDATION HELPERS
// ==============================================

/**
 * Validate form input is not empty
 * @param {string} input - Input value
 * @param {number} minLength - Minimum length (default: 1)
 * @returns {boolean} - True if valid
 */
function validateNotEmpty(input, minLength = 1) {
  return input && typeof input === 'string' && input.trim().length >= minLength;
}

/**
 * Validate Arabic or English name
 * @param {string} name - Name to validate
 * @returns {boolean} - True if valid
 */
function validateName(name) {
  if (!validateNotEmpty(name, 2)) return false;
  
  // Allow Arabic, English letters, and spaces (2-50 chars)
  const namePattern = /^[\u0600-\u06FFa-zA-Z\s]{2,50}$/;
  return namePattern.test(name.trim());
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
function validatePhoneNumber(phone) {
  if (!validateNotEmpty(phone, 10)) return false;
  
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

// ==============================================
// EXPORT TO GLOBAL SCOPE
// ==============================================

window.SecurityUtils = {
  // Sanitization
  sanitizeInput,
  sanitizeForURL,
  sanitizeName,
  sanitizePhone,
  
  // URL Validation
  isValidWhatsAppNumber,
  createSafeWhatsAppURL,
  openWhatsAppSafely,
  
  // Rate Limiting
  whatsappRateLimiter,
  briefRateLimiter,
  RateLimiter,
  
  // Safe Storage
  SafeStorage,
  
  // Validation
  validateNotEmpty,
  validateName,
  validatePhoneNumber
};

console.log('🔒 Security utilities loaded');
