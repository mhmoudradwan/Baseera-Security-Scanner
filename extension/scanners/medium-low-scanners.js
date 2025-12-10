// Medium & Low Severity Scanners - ماسحات الشدة المتوسطة والمنخفضة
import { BaseScanner, SCANNER_TYPES } from './scanner-engine.js';

/**
 * Mixed Content Scanner - ماسح المحتوى المختلط
 */
export class MixedContentScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.MIXED_CONTENT);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];
    if (!url.startsWith('https://')) return vulnerabilities;

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const issues = [];
          const resources = ['img', 'script', 'link', 'iframe', 'video', 'audio'];
          
          resources.forEach((tag) => {
            const elements = document.querySelectorAll(tag);
            elements.forEach((el) => {
              const src = el.src || el.href;
              if (src && src.startsWith('http://')) {
                issues.push({ tag, src });
              }
            });
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Mixed Content Detected - محتوى مختلط',
            `Found ${result.result.length} HTTP resources on HTTPS page`,
            url,
            `HTTP resources: ${result.result.map(r => r.tag).join(', ')}`,
            'Use HTTPS for all resources on HTTPS pages - استخدم HTTPS لجميع الموارد'
          )
        );
      }
    } catch (error) {
      console.error('Mixed Content Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Missing SRI Scanner - ماسح SRI المفقود
 */
export class MissingSRIScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.MISSING_SRI);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const issues = [];
          
          // Check external scripts - فحص السكريبتات الخارجية
          const scripts = document.querySelectorAll('script[src]');
          scripts.forEach((script) => {
            const src = script.src;
            if (src && !src.startsWith(window.location.origin) && !script.integrity) {
              issues.push({ type: 'script', src });
            }
          });

          // Check external stylesheets - فحص أوراق الأنماط الخارجية
          const links = document.querySelectorAll('link[rel="stylesheet"][href]');
          links.forEach((link) => {
            const href = link.href;
            if (href && !href.startsWith(window.location.origin) && !link.integrity) {
              issues.push({ type: 'stylesheet', src: href });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Missing Subresource Integrity - SRI مفقود',
            `Found ${result.result.length} external resources without SRI`,
            url,
            'External resources loaded without integrity checks',
            'Add integrity and crossorigin attributes to external resources - أضف سمات integrity و crossorigin'
          )
        );
      }
    } catch (error) {
      console.error('Missing SRI Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Deprecated HTML Scanner - ماسح HTML المهمل
 */
export class DeprecatedHTMLScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.DEPRECATED_HTML);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const deprecated = ['font', 'center', 'marquee', 'blink', 'big', 'strike', 'tt'];
          const issues = [];

          deprecated.forEach((tag) => {
            const elements = document.querySelectorAll(tag);
            if (elements.length > 0) {
              issues.push({ tag, count: elements.length });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Deprecated HTML Elements - عناصر HTML مهملة',
            'Page contains deprecated HTML elements',
            url,
            result.result.map(i => `${i.tag} (${i.count})`).join(', '),
            'Replace deprecated elements with modern HTML5 and CSS - استبدل العناصر المهملة بـ HTML5 و CSS الحديثة'
          )
        );
      }
    } catch (error) {
      console.error('Deprecated HTML Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Trackers Scanner - ماسح المتتبعات
 */
export class TrackersScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.TRACKERS);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const trackers = [
            'google-analytics.com',
            'googletagmanager.com',
            'facebook.com/tr',
            'doubleclick.net',
            'hotjar.com',
            'mixpanel.com',
            'segment.com',
          ];

          const issues = [];
          const scripts = document.querySelectorAll('script[src]');
          
          scripts.forEach((script) => {
            trackers.forEach((tracker) => {
              if (script.src.includes(tracker)) {
                issues.push({ tracker, src: script.src });
              }
            });
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Tracking Scripts Detected - تم اكتشاف سكريبتات التتبع',
            `Found ${result.result.length} tracking script(s)`,
            url,
            result.result.map(i => i.tracker).join(', '),
            'Review privacy policy and implement user consent for tracking - راجع سياسة الخصوصية وطبق موافقة المستخدم'
          )
        );
      }
    } catch (error) {
      console.error('Trackers Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * CSRF Scanner - ماسح CSRF
 */
export class CSRFScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.CSRF);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          const issues = [];
          const forms = document.querySelectorAll('form[method="post"], form[method="POST"]');

          forms.forEach((form, index) => {
            const hasCSRFToken = form.querySelector(
              'input[name*="csrf"], input[name*="token"], input[name="_token"]'
            );
            
            if (!hasCSRFToken) {
              issues.push({
                formIndex: index + 1,
                action: form.action || 'current page',
              });
            }
          });

          return issues;
        },
      });

      if (result.result && result.result.length > 0) {
        vulnerabilities.push(
          this.createVulnerability(
            'Missing CSRF Protection - حماية CSRF مفقودة',
            `Found ${result.result.length} form(s) without CSRF tokens`,
            url,
            'POST forms without CSRF protection detected',
            'Implement CSRF tokens for all state-changing operations - نفذ رموز CSRF لجميع العمليات'
          )
        );
      }
    } catch (error) {
      console.error('CSRF Scanner error:', error);
    }

    return vulnerabilities;
  }
}

/**
 * Clickjacking Scanner - ماسح Clickjacking
 */
export class ClickjackingScanner extends BaseScanner {
  constructor() {
    super(SCANNER_TYPES.CLICKJACKING);
  }

  async scan(tabId, url) {
    const vulnerabilities = [];

    try {
      // Check X-Frame-Options header - فحص ترويسة X-Frame-Options
      const response = await fetch(url, { method: 'HEAD' }).catch(() => null);
      
      if (response) {
        const xFrameOptions = response.headers.get('X-Frame-Options');
        const csp = response.headers.get('Content-Security-Policy');
        
        const hasFrameProtection = xFrameOptions || (csp && csp.includes('frame-ancestors'));
        
        if (!hasFrameProtection) {
          vulnerabilities.push(
            this.createVulnerability(
              'Missing Clickjacking Protection - حماية Clickjacking مفقودة',
              'Page lacks X-Frame-Options or CSP frame-ancestors directive',
              url,
              'No clickjacking protection headers found',
              'Add X-Frame-Options: DENY or SAMEORIGIN header - أضف ترويسة X-Frame-Options'
            )
          );
        }
      }
    } catch (error) {
      console.error('Clickjacking Scanner error:', error);
    }

    return vulnerabilities;
  }
}
