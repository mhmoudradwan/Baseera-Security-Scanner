// High Severity Scanners - ماسحات الشدة العالية
import { BaseScanner, SCANNER_TYPES } from './scanner-engine.js';

/**
 * Missing CSP Scanner - ماسح CSP المفقود
 */
export class MissingCSPScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.MISSING_CSP);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null);
      
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        
        if (!csp) {
          vulnerabilities.push(
            this.createVulnerability(
              'Missing Content Security Policy - سياسة أمان المحتوى مفقودة',
              'Page does not have a Content-Security-Policy header',
              url,
              'No CSP header found',
              'Implement a strict Content-Security-Policy to prevent XSS attacks - نفذ CSP صارم لمنع هجمات XSS'
            )
          );
        }
      }
    } catch (error) {
      console.error('Missing CSP Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Weak CSP Scanner - ماسح CSP الضعيف
 */
export class WeakCSPScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.WEAK_CSP);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null);
      
      if (response) {
        const csp = response.headers.get('Content-Security-Policy');
        
        if (csp) {
          const weakPatterns = [
            { pattern: /unsafe-inline/i, issue: 'unsafe-inline directive' },
            { pattern: /unsafe-eval/i, issue: 'unsafe-eval directive' },
            { pattern: /\*/i, issue: 'wildcard (*) source' },
            { pattern: /data:/i, issue: 'data: URI scheme' },
          ];

          const issues = [];
          weakPatterns.forEach(({ pattern, issue }) => {
            if (pattern.test(csp)) {
              issues.push(issue);
            }
          });

          if (issues.length > 0) {
            vulnerabilities.push(
              this.createVulnerability(
                'Weak Content Security Policy - سياسة أمان محتوى ضعيفة',
                'CSP contains unsafe directives',
                url,
                `Weak directives found: ${issues.join(', ')}`,
                'Remove unsafe directives and use nonces or hashes - أزل التوجيهات غير الآمنة واستخدم nonces أو hashes'
              )
            );
          }
        }
      }
    } catch (error) {
      console.error('Weak CSP Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Missing HSTS Scanner - ماسح HSTS المفقود
 */
export class MissingHSTSScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.MISSING_HSTS);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];
    
    if (!url.startsWith('https://')) return vulnerabilities;

    try {
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null);
      
      if (response) {
        const hsts = response.headers.get('Strict-Transport-Security');
        
        if (!hsts) {
          vulnerabilities.push(
            this.createVulnerability(
              'Missing HSTS Header - ترويسة HSTS مفقودة',
              'HTTPS site missing Strict-Transport-Security header',
              url,
              'No HSTS header found on HTTPS site',
              'Add Strict-Transport-Security header with max-age - أضف ترويسة HSTS مع max-age'
            )
          );
        }
      }
    } catch (error) {
      console.error('Missing HSTS Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Insecure Cookies Scanner - ماسح الكوكيز غير الآمنة
 */
export class InsecureCookiesScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.INSECURE_COOKIES);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const cookies = document.cookie.split(';');
          const issues = [];

          if (cookies.length > 0 && document.cookie) {
            // Check if on HTTPS - التحقق من HTTPS
            const isHttps = window.location.protocol === 'https:';
            
            if (isHttps) {
              issues.push({
                count: cookies.length,
                evidence: 'Cookies accessible from JavaScript on HTTPS site (missing HttpOnly)',
              });
            }
          }

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Insecure Cookies - كوكيز غير آمنة',
            'Cookies accessible from JavaScript',
            url,
            result.result[0].evidence,
            'Set HttpOnly and Secure flags on sensitive cookies - عين HttpOnly و Secure على الكوكيز الحساسة'
          )
        );
      }
    } catch (error) {
      console.error('Insecure Cookies Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * CORS Misconfiguration Scanner - ماسح تكوين CORS الخاطئ
 */
export class CORSMisconfigurationScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.CORS_MISCONFIGURATION);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null);
      
      if (response) {
        const acao = response.headers.get('Access-Control-Allow-Origin');
        
        if (acao === '*') {
          vulnerabilities.push(
            this.createVulnerability(
              'CORS Misconfiguration - تكوين CORS خاطئ',
              'Access-Control-Allow-Origin set to wildcard (*)',
              url,
              'CORS allows requests from any origin',
              'Restrict CORS to specific trusted origins - قيد CORS على أصول موثوقة محددة'
            )
          );
        }
      }
    } catch (error) {
      console.error('CORS Misconfiguration Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Sensitive Files Scanner - ماسح الملفات الحساسة
 */
export class SensitiveFilesScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.SENSITIVE_FILES);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const urlObj = new URL(url);
      const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
      
      const sensitiveFiles = [
        '/.env',
        '/.git/config',
        '/config.php',
        '/phpinfo.php',
        '/backup.sql',
        '/.DS_Store',
        '/web.config',
      ];

      const foundFiles = [];

      for (const file of sensitiveFiles) {
        try {
          const response = await fetch(baseUrl + file, { method: 'HEAD' });
          if (response.ok) {
            foundFiles.push(file);
          }
        } catch (e) {
          // File not found or blocked - ملف غير موجود أو محظور
        }
      }

      if (foundFiles.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Sensitive Files Exposed - ملفات حساسة مكشوفة',
            'Sensitive configuration or backup files accessible',
            url,
            `Found: ${foundFiles.join(', ')}`,
            'Remove or restrict access to sensitive files - أزل أو قيد الوصول للملفات الحساسة'
          )
        );
      }
    } catch (error) {
      console.error('Sensitive Files Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Debug Pages Scanner - ماسح صفحات التصحيح
 */
export class DebugPagesScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.DEBUG_PAGES);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const debugPatterns = [
            /debug\s*=\s*true/gi,
            /console\.log/gi,
            /phpinfo\(/gi,
            /var_dump\(/gi,
            /print_r\(/gi,
          ];

          const issues = [];
          const html = document.documentElement.outerHTML;

          debugPatterns.forEach((pattern) => {
            const matches = html.match(pattern);
            if (matches && matches.length > 0) {
              issues.push({ pattern: pattern.source, count: matches.length });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Debug Code Detected - تم اكتشاف كود التصحيح',
            'Page contains debug code or console statements',
            url,
            'Debug patterns found in production code',
            'Remove debug code from production - أزل كود التصحيح من الإنتاج'
          )
        );
      }
    } catch (error) {
      console.error('Debug Pages Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Open Redirect Scanner - ماسح إعادة التوجيه المفتوح
 */
export class OpenRedirectScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.OPEN_REDIRECT);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const urlObj = new URL(url);
      const redirectParams = ['redirect', 'url', 'next', 'return', 'returnTo', 'goto'];
      const issues = [];

      redirectParams.forEach((param) => {
        const value = urlObj.searchParams.get(param);
        if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
          issues.push({ param, value });
        }
      });

      if (issues.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Potential Open Redirect - إعادة توجيه مفتوح محتملة',
            'URL contains redirect parameters with external URLs',
            url,
            `Parameters: ${issues.map(i => i.param).join(', ')}`,
            'Validate redirect URLs against whitelist - تحقق من عناوين إعادة التوجيه مقابل قائمة بيضاء'
          )
        );
      }
    } catch (error) {
      console.error('Open Redirect Scanner error:', error);
    }

    return vulnerabilities;
  }
}
