// Content Script - سكريبت المحتوى
// Injected into web pages for passive scanning
// يتم حقنه في صفحات الويب للفحص السلبي

console.log('Baseera Security Scanner content script loaded - تم تحميل سكريبت المحتوى لبصيرة');

// Listen for messages from popup or background script - الاستماع للرسائل
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    sendResponse({
      url: window.location.href,
      title: document.title,
      protocol: window.location.protocol,
    });
  }
});

// Passive monitoring - المراقبة السلبية
// This script runs on every page but doesn't actively scan
// هذا السكريبت يعمل على كل صفحة لكن لا يفحص بنشاط
