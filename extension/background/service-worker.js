// Service Worker - عامل الخدمة
// Background script for Chrome extension
// سكريبت الخلفية لامتداد Chrome

import { ScannerEngine } from '../scanners/scanner-engine.js';
import {
  XSSScanner,
  SQLInjectionScanner,
  APIKeysScanner,
  InsecureFormsScanner,
  CommandInjectionScanner,
} from '../scanners/critical-scanners.js';
import {
  MissingCSPScanner,
  WeakCSPScanner,
  MissingHSTSScanner,
  InsecureCookiesScanner,
  CORSMisconfigurationScanner,
  SensitiveFilesScanner,
  DebugPagesScanner,
  OpenRedirectScanner,
} from '../scanners/high-scanners.js';
import {
  MixedContentScanner,
  MissingSRIScanner,
  DeprecatedHTMLScanner,
  TrackersScanner,
  CSRFScanner,
  ClickjackingScanner,
} from '../scanners/medium-low-scanners.js';

// Initialize scanner engine - تهيئة محرك الفحص
const scannerEngine = new ScannerEngine();

// Register all scanners - تسجيل جميع الماسحات
scannerEngine.registerScanner(new XSSScanner());
scannerEngine.registerScanner(new SQLInjectionScanner());
scannerEngine.registerScanner(new APIKeysScanner());
scannerEngine.registerScanner(new InsecureFormsScanner());
scannerEngine.registerScanner(new CommandInjectionScanner());
scannerEngine.registerScanner(new MissingCSPScanner());
scannerEngine.registerScanner(new WeakCSPScanner());
scannerEngine.registerScanner(new MissingHSTSScanner());
scannerEngine.registerScanner(new InsecureCookiesScanner());
scannerEngine.registerScanner(new CORSMisconfigurationScanner());
scannerEngine.registerScanner(new SensitiveFilesScanner());
scannerEngine.registerScanner(new DebugPagesScanner());
scannerEngine.registerScanner(new OpenRedirectScanner());
scannerEngine.registerScanner(new MixedContentScanner());
scannerEngine.registerScanner(new MissingSRIScanner());
scannerEngine.registerScanner(new DeprecatedHTMLScanner());
scannerEngine.registerScanner(new TrackersScanner());
scannerEngine.registerScanner(new CSRFScanner());
scannerEngine.registerScanner(new ClickjackingScanner());

// Listen for messages from popup - الاستماع للرسائل من النافذة المنبثقة
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScan') {
    handleStartScan(request.tabId, request.url).then(sendResponse);
    return true; // Keep channel open for async response
  } else if (request.action === 'getScanResults') {
    sendResponse({ results: scannerEngine.getResults() });
  }
});

/**
 * Handle scan start - معالجة بدء الفحص
 */
async function handleStartScan(tabId, url) {
  try {
    console.log('Starting scan for:', url);
    
    // Run all scanners - تشغيل جميع الماسحات
    const results = await scannerEngine.runScan(tabId, url);
    
    console.log('Scan completed. Found vulnerabilities:', results.length);
    
    return {
      success: true,
      results,
      summary: generateSummary(results),
    };
  } catch (error) {
    console.error('Scan failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate scan summary - إنشاء ملخص الفحص
 */
function generateSummary(results) {
  const summary = {
    total: results.length,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  results.forEach((vuln) => {
    // Determine severity based on typeId - تحديد الشدة بناءً على typeId
    if (vuln.typeId >= 1 && vuln.typeId <= 5) {
      summary.critical++;
    } else if (vuln.typeId >= 6 && vuln.typeId <= 8) {
      summary.high++;
    } else if (vuln.typeId >= 9 && vuln.typeId <= 17) {
      summary.medium++;
    } else {
      summary.low++;
    }
  });

  return summary;
}

// Extension installed - تم تثبيت الامتداد
chrome.runtime.onInstalled.addListener(() => {
  console.log('Baseera Security Scanner installed - تم تثبيت بصيرة ماسح الأمان');
});
