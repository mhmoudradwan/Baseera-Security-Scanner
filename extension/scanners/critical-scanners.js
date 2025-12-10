// Critical Severity Scanners - ماسحات الشدة الحرجة
import { BaseScanner, SCANNER_TYPES } from './scanner-engine.js';

/**
 * XSS Scanner - ماسح XSS
 * Detects potential Cross-Site Scripting vulnerabilities
 */
export class XSSScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.XSS);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      // Execute script in page context - تنفيذ السكريبت في سياق الصفحة
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const xssPatterns = [
            /<script[^>]*>[\s\S]*?<\/script>/gi,
            /on\w+\s*=\s*["'][^"']*["']/gi,
            /javascript:/gi,
            /<iframe[^>]*>/gi,
            /<embed[^>]*>/gi,
          ];

          const issues = [];
          const html = document.documentElement.outerHTML;

          // Check for inline scripts - التحقق من السكريبتات المضمنة
          const scripts = document.querySelectorAll('script:not([src])');
          if (scripts.length > 0) {
            issues.push({
              type: 'inline_scripts',
              count: scripts.length,
              evidence: `Found ${scripts.length} inline script(s)`,
            });
          }

          // Check for event handlers - التحقق من معالجات الأحداث
          const elementsWithEvents = document.querySelectorAll('[onclick],[onload],[onerror]');
          if (elementsWithEvents.length > 0) {
            issues.push({
              type: 'event_handlers',
              count: elementsWithEvents.length,
              evidence: `Found ${elementsWithEvents.length} inline event handler(s)`,
            });
          }

          // Check URL parameters - التحقق من معاملات URL
          const urlParams = new URLSearchParams(window.location.search);
          const reflectedParams = [];
          urlParams.forEach((value, key) => {
            if (html.includes(value) && value.length > 3) {
              reflectedParams.push({ key, value });
            }
          });

          if (reflectedParams.length > 0) {
            issues.push({
              type: 'reflected_params',
              params: reflectedParams,
              evidence: `URL parameters reflected in page: ${reflectedParams.map(p => p.key).join(', ')}`,
            });
          }

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        result.result.forEach((issue) => {
          vulnerabilities.push(
            this.createVulnerability(
              'Potential XSS Vulnerability - ثغرة XSS محتملة',
              `Cross-Site Scripting vulnerability detected: ${issue.type}`,
              url,
              issue.evidence,
              'Sanitize all user inputs, use Content Security Policy, and avoid inline scripts - قم بتعقيم جميع مدخلات المستخدم واستخدم CSP وتجنب السكريبتات المضمنة'
            )
          );
        });
      }
    } catch (error) {
      console.error('XSS Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * SQL Injection Scanner - ماسح حقن SQL
 * Detects potential SQL injection vulnerabilities in forms and URLs
 */
export class SQLInjectionScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.SQL_INJECTION);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const sqlPatterns = [
            /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)\b)/gi,
            /(\bUNION\b.*\bSELECT\b)/gi,
            /(\bOR\b.*=.*)/gi,
            /('|"|\-\-|;)/g,
          ];

          const issues = [];
          const url = window.location.href;

          // Check URL parameters - فحص معاملات URL
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.forEach((value, key) => {
            sqlPatterns.forEach((pattern) => {
              if (pattern.test(value)) {
                issues.push({
                  location: `URL parameter: ${key}`,
                  evidence: `Suspicious SQL pattern in parameter value: ${value}`,
                });
              }
            });
          });

          // Check forms - فحص النماذج
          const forms = document.querySelectorAll('form');
          forms.forEach((form, index) => {
            const action = form.action || 'current page';
            const inputs = form.querySelectorAll('input[name], textarea[name]');
            
            if (inputs.length > 0 && !form.querySelector('input[type="hidden"][name*="token"]')) {
              issues.push({
                location: `Form ${index + 1} (action: ${action})`,
                evidence: 'Form may be vulnerable to SQL injection - missing CSRF protection',
              });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        result.result.forEach((issue) => {
          vulnerabilities.push(
            this.createVulnerability(
              'Potential SQL Injection - حقن SQL محتمل',
              'SQL Injection vulnerability may exist in this form or parameter',
              issue.location,
              issue.evidence,
              'Use parameterized queries, input validation, and prepared statements - استخدم الاستعلامات المعلمة والتحقق من المدخلات'
            )
          );
        });
      }
    } catch (error) {
      console.error('SQL Injection Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * API Keys Scanner - ماسح مفاتيح API
 * Detects exposed API keys in client-side code
 */
export class APIKeysScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.API_KEYS);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const apiKeyPatterns = [
            { name: 'AWS', pattern: /AKIA[0-9A-Z]{16}/g },
            { name: 'Google API', pattern: /AIza[0-9A-Za-z\-_]{35}/g },
            { name: 'Firebase', pattern: /firebase[0-9A-Za-z\-_]{20,}/gi },
            { name: 'Stripe', pattern: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24}/g },
            { name: 'GitHub', pattern: /gh[pousr]_[A-Za-z0-9_]{36}/g },
            { name: 'Generic API Key', pattern: /api[_-]?key[\s]*[:=][\s]*['"]([^'"]{20,})['"] /gi },
          ];

          const issues = [];
          const scripts = document.querySelectorAll('script');
          const html = document.documentElement.outerHTML;

          // Check inline scripts and HTML - فحص السكريبتات المضمنة و HTML
          apiKeyPatterns.forEach(({ name, pattern }) => {
            const matches = html.match(pattern);
            if (matches && matches.length > 0) {
              issues.push({
                keyType: name,
                count: matches.length,
                evidence: `Found ${matches.length} ${name} key(s) exposed in client code`,
              });
            }
          });

          // Check localStorage and sessionStorage - فحص التخزين المحلي
          try {
            const storage = { ...localStorage, ...sessionStorage };
            Object.entries(storage).forEach(([key, value]) => {
              apiKeyPatterns.forEach(({ name, pattern }) => {
                if (pattern.test(value)) {
                  issues.push({
                    keyType: name,
                    location: `Storage key: ${key}`,
                    evidence: `${name} key found in browser storage`,
                  });
                }
              });
            });
          } catch (e) {
            // Storage access might be blocked - قد يكون الوصول للتخزين محظوراً
          }

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        result.result.forEach((issue) => {
          vulnerabilities.push(
            this.createVulnerability(
              'Exposed API Keys - مفاتيح API مكشوفة',
              `${issue.keyType} key(s) exposed in client-side code`,
              issue.location || 'Client-side code',
              issue.evidence,
              'Store API keys securely on the server side, never in client code - خزن مفاتيح API بشكل آمن على الخادم وليس في كود العميل'
            )
          );
        });
      }
    } catch (error) {
      console.error('API Keys Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Insecure Forms Scanner - ماسح النماذج غير الآمنة
 * Detects forms submitting data over HTTP
 */
export class InsecureFormsScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.INSECURE_FORMS);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const issues = [];
          const forms = document.querySelectorAll('form');

          forms.forEach((form, index) => {
            const action = form.action || window.location.href;
            const method = form.method || 'GET';

            // Check if form submits over HTTP - التحقق من إرسال النموذج عبر HTTP
            if (action.startsWith('http://')) {
              const hasPasswordField = form.querySelector('input[type="password"]');
              const hasEmailField = form.querySelector('input[type="email"]');
              const hasSensitiveFields = hasPasswordField || hasEmailField;

              issues.push({
                formIndex: index + 1,
                action,
                method,
                hasSensitiveFields,
                evidence: `Form submits to HTTP endpoint${hasSensitiveFields ? ' with sensitive data' : ''}`,
              });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        result.result.forEach((issue) => {
          vulnerabilities.push(
            this.createVulnerability(
              'Insecure Form Submission - إرسال نموذج غير آمن',
              `Form ${issue.formIndex} submits data over insecure HTTP connection`,
              issue.action,
              issue.evidence,
              'Always use HTTPS for form submissions, especially with sensitive data - استخدم دائماً HTTPS لإرسال النماذج'
            )
          );
        });
      }
    } catch (error) {
      console.error('Insecure Forms Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Command Injection Scanner - ماسح حقن الأوامر
 * Detects potential command injection vulnerabilities
 */
export class CommandInjectionScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.COMMAND_INJECTION);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const cmdPatterns = [
            /(\||&|;|`|\$\(|\${)/g,
            /(\.\.\/|\.\.\\)/g,
            /(\bcat\b|\bls\b|\bwhoami\b|\bpwd\b)/gi,
          ];

          const issues = [];
          const urlParams = new URLSearchParams(window.location.search);

          urlParams.forEach((value, key) => {
            cmdPatterns.forEach((pattern) => {
              if (pattern.test(value)) {
                issues.push({
                  parameter: key,
                  value,
                  evidence: 'Suspicious command injection pattern in URL parameter',
                });
              }
            });
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        result.result.forEach((issue) => {
          vulnerabilities.push(
            this.createVulnerability(
              'Potential Command Injection - حقن أوامر محتمل',
              'Command injection vulnerability may exist',
              `URL parameter: ${issue.parameter}`,
              issue.evidence,
              'Validate and sanitize all inputs, avoid shell command execution - تحقق من جميع المدخلات وتجنب تنفيذ أوامر Shell'
            )
          );
        });
      }
    } catch (error) {
      console.error('Command Injection Scanner error:', error);
    }

    return vulnerabilities;
  }
}
