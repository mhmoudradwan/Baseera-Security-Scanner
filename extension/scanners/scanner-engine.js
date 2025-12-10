// Scanner Engine - محرك الفحص
// Main engine for coordinating all vulnerability scanners
// المحرك الرئيسي لتنسيق جميع ماسحات الثغرات

/**
 * Scanner Types Configuration - تكوين أنواع الماسحات
 */
export const SCANNER_TYPES = {
  // Critical Severity - الشدة الحرجة
  XSS: { id: 1, name: 'xss', severity: 'Critical', enabled: true },
  SQL_INJECTION: { id: 2, name: 'sql_injection', severity: 'Critical', enabled: true },
  COMMAND_INJECTION: { id: 3, name: 'command_injection', severity: 'Critical', enabled: true },
  API_KEYS: { id: 4, name: 'api_keys', severity: 'Critical', enabled: true },
  INSECURE_FORMS: { id: 5, name: 'insecure_forms', severity: 'Critical', enabled: true },

  // High Severity - الشدة العالية
  MISSING_CSP: { id: 6, name: 'missing_csp', severity: 'High', enabled: true },
  WEAK_CSP: { id: 7, name: 'weak_csp', severity: 'High', enabled: true },
  SENSITIVE_FILES: { id: 8, name: 'sensitive_files', severity: 'High', enabled: true },

  // Medium Severity - الشدة المتوسطة
  MIXED_CONTENT: { id: 9, name: 'mixed_content', severity: 'Medium', enabled: true },
  MISSING_HSTS: { id: 10, name: 'missing_hsts', severity: 'Medium', enabled: true },
  CLICKJACKING: { id: 11, name: 'clickjacking', severity: 'Medium', enabled: true },
  INSECURE_COOKIES: { id: 12, name: 'insecure_cookies', severity: 'Medium', enabled: true },
  MISSING_SRI: { id: 13, name: 'missing_sri', severity: 'Medium', enabled: true },
  CORS_MISCONFIGURATION: { id: 14, name: 'cors_misconfiguration', severity: 'Medium', enabled: true },
  DEBUG_PAGES: { id: 15, name: 'debug_pages', severity: 'Medium', enabled: true },
  OPEN_REDIRECT: { id: 16, name: 'open_redirect', severity: 'Medium', enabled: true },
  CSRF: { id: 17, name: 'csrf', severity: 'Medium', enabled: true },

  // Low Severity - الشدة المنخفضة
  DEPRECATED_HTML: { id: 18, name: 'deprecated_html', severity: 'Low', enabled: true },
  TRACKERS: { id: 19, name: 'trackers', severity: 'Low', enabled: true },
};

/**
 * Main Scanner Engine Class - فئة محرك الفحص الرئيسي
 */
export class ScannerEngine {
  constructor() {
    this.scanners = [];
    this.results = [];
    this.onProgress = null;
  }

  /**
   * Register a scanner - تسجيل ماسح
   */
  registerScanner(scanner) {
    this.scanners.push(scanner);
  }

  /**
   * Run all scanners - تشغيل جميع الماسحات
   */
  async runScan(tabId, url) {
    this.results = [];
    const totalScanners = this.scanners.length;
    let completed = 0;

    for (const scanner of this.scanners) {
      try {
        const vulnerabilities = await scanner.scan(tabId, url);
        if (vulnerabilities && vulnerabilities.length > 0) {
          this.results.push(...vulnerabilities);
        }
      } catch (error) {
        console.error(`Scanner ${scanner.name} failed:`, error);
      }

      completed++;
      if (this.onProgress) {
        this.onProgress({
          scanner: scanner.name,
          completed,
          total: totalScanners,
          percentage: Math.round((completed / totalScanners) * 100),
        });
      }
    }

    return this.results;
  }

  /**
   * Get scan results - الحصول على نتائج الفحص
   */
  getResults() {
    return this.results;
  }

  /**
   * Clear results - مسح النتائج
   */
  clearResults() {
    this.results = [];
  }
}

/**
 * Base Scanner Class - فئة الماسح الأساسية
 */
export class BaseScanner {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.severity = config.severity;
    this.enabled = config.enabled;
  }

  /**
   * Create vulnerability object - إنشاء كائن الثغرة
   */
  createVulnerability(title, description, location, evidence, recommendation) {
    return {
      typeId: this.id,
      title,
      description,
      location,
      evidence,
      recommendation,
    };
  }

  /**
   * Override this method in derived scanners - تجاوز هذه الطريقة في الماسحات المشتقة
   */
  async scan(tabId, url) {
    throw new Error('scan() method must be implemented - يجب تطبيق طريقة scan()');
  }
}
