// Popup Script - سكريبت النافذة المنبثقة

const API_BASE_URL = 'http://localhost:5000/api';

// State management - إدارة الحالات
let currentState = 'ready'; // ready, scanning, results, settings
let scanResults = null;

// DOM Elements - عناصر DOM
const states = {
  ready: document.getElementById('readyState'),
  scanning: document.getElementById('scanningState'),
  results: document.getElementById('resultsState'),
  settings: document.getElementById('settingsState'),
};

const buttons = {
  startScan: document.getElementById('startScanBtn'),
  rescan: document.getElementById('rescanBtn'),
  dashboard: document.getElementById('dashboardBtn'),
  settings: document.getElementById('settingsBtn'),
  back: document.getElementById('backBtn'),
  login: document.getElementById('loginBtn'),
};

const elements = {
  progressBar: document.getElementById('progressBar'),
  scannerName: document.getElementById('scannerName'),
  criticalCount: document.getElementById('criticalCount'),
  highCount: document.getElementById('highCount'),
  mediumCount: document.getElementById('mediumCount'),
  lowCount: document.getElementById('lowCount'),
};

/**
 * Switch to a specific state - التبديل إلى حالة معينة
 */
function switchState(stateName) {
  Object.values(states).forEach((state) => state.classList.add('hidden'));
  states[stateName]?.classList.remove('hidden');
  currentState = stateName;
}

/**
 * Start scan - بدء الفحص
 */
async function startScan() {
  try {
    // Get current tab - الحصول على التبويب الحالي
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      alert('Cannot scan this page - لا يمكن فحص هذه الصفحة');
      return;
    }

    // Switch to scanning state - التبديل لحالة الفحص
    switchState('scanning');
    elements.progressBar.style.width = '0%';

    // Send scan request to background script - إرسال طلب الفحص للسكريبت الخلفي
    chrome.runtime.sendMessage(
      {
        action: 'startScan',
        tabId: tab.id,
        url: tab.url,
      },
      async (response) => {
        if (response.success) {
          scanResults = response.results;
          displayResults(response.summary);
          
          // Save scan to backend if logged in - حفظ الفحص للخلفية إذا كان المستخدم مسجلاً
          const token = await getAuthToken();
          if (token) {
            saveScanToBackend(tab.url, scanResults);
          }
        } else {
          alert('Scan failed: ' + response.error);
          switchState('ready');
        }
      }
    );

    // Simulate progress - محاكاة التقدم
    simulateProgress();
  } catch (error) {
    console.error('Scan error:', error);
    alert('Scan error: ' + error.message);
    switchState('ready');
  }
}

/**
 * Simulate scan progress - محاكاة تقدم الفحص
 */
function simulateProgress() {
  let progress = 0;
  const scannerNames = [
    'XSS Scanner',
    'SQL Injection Scanner',
    'API Keys Scanner',
    'CSP Scanner',
    'HSTS Scanner',
    'Mixed Content Scanner',
    'Cookies Scanner',
    'CORS Scanner',
  ];

  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
    }
    
    elements.progressBar.style.width = progress + '%';
    
    const scannerIndex = Math.floor((progress / 100) * scannerNames.length);
    elements.scannerName.textContent = scannerNames[Math.min(scannerIndex, scannerNames.length - 1)];
  }, 500);
}

/**
 * Display scan results - عرض نتائج الفحص
 */
function displayResults(summary) {
  elements.criticalCount.textContent = summary.critical || 0;
  elements.highCount.textContent = summary.high || 0;
  elements.mediumCount.textContent = summary.medium || 0;
  elements.lowCount.textContent = summary.low || 0;
  
  switchState('results');
}

/**
 * Save scan to backend - حفظ الفحص للخلفية
 */
async function saveScanToBackend(url, vulnerabilities) {
  try {
    const token = await getAuthToken();
    if (!token) return;

    const response = await fetch(`${API_BASE_URL}/scans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        vulnerabilities: vulnerabilities.map((v) => ({
          typeId: v.typeId,
          title: v.title,
          description: v.description,
          location: v.location,
          evidence: v.evidence,
          recommendation: v.recommendation,
        })),
      }),
    });

    if (response.ok) {
      console.log('Scan saved to backend - تم حفظ الفحص للخلفية');
    }
  } catch (error) {
    console.error('Failed to save scan:', error);
  }
}

/**
 * Get authentication token - الحصول على رمز المصادقة
 */
async function getAuthToken() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['authToken'], (result) => {
      resolve(result.authToken || null);
    });
  });
}

/**
 * Open dashboard - فتح لوحة التحكم
 */
function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:5173/dashboard' });
}

/**
 * Open login page - فتح صفحة تسجيل الدخول
 */
function openLogin() {
  chrome.tabs.create({ url: 'http://localhost:5173/login' });
}

// Event Listeners - مستمعي الأحداث
buttons.startScan.addEventListener('click', startScan);
buttons.rescan.addEventListener('click', startScan);
buttons.dashboard.addEventListener('click', openDashboard);
buttons.settings.addEventListener('click', () => switchState('settings'));
buttons.back.addEventListener('click', () => switchState(scanResults ? 'results' : 'ready'));
buttons.login.addEventListener('click', openLogin);

// Load settings - تحميل الإعدادات
chrome.storage.local.get(['autoScan', 'notifications'], (result) => {
  document.getElementById('autoScan').checked = result.autoScan || false;
  document.getElementById('notifications').checked = result.notifications || false;
});

// Save settings - حفظ الإعدادات
document.getElementById('autoScan').addEventListener('change', (e) => {
  chrome.storage.local.set({ autoScan: e.target.checked });
});

document.getElementById('notifications').addEventListener('change', (e) => {
  chrome.storage.local.set({ notifications: e.target.checked });
});

// Initialize - التهيئة
switchState('ready');
