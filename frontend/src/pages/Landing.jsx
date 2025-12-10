import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Landing Page Component - مكون الصفحة الرئيسية
const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - قسم البطل */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
              <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Baseera Security Scanner
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              مساعدك الأمني الذكي لفحص الثغرات
              <br />
              Your Smart Security Assistant for Vulnerability Scanning
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition"
              >
                Dashboard - لوحة التحكم
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition"
                >
                  Get Started - ابدأ الآن
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3 bg-background-lighter text-white font-semibold rounded-lg hover:bg-background-light transition border border-primary"
                >
                  Login - تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Animated Background - خلفية متحركة */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section - قسم الميزات */}
      <section className="py-20 px-4 bg-background-light">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Features - الميزات
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-primary/20 hover:border-primary transition"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - قسم الإحصائيات */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - قسم دعوة العمل */}
      <section className="py-20 px-4 bg-background-light">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Secure Your Website?
            <br />
            هل أنت مستعد لتأمين موقعك؟
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Start scanning your website for vulnerabilities in seconds with our Chrome extension
            <br />
            ابدأ فحص موقعك بحثاً عن الثغرات في ثوانٍ مع امتداد Chrome الخاص بنا
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition"
            >
              Sign Up Free - التسجيل مجاناً
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

// Features data - بيانات الميزات
const features = [
  {
    title: 'Real-time Scanning - فحص فوري',
    description: 'Scan websites in real-time and detect vulnerabilities instantly',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: '20+ Vulnerability Types - أكثر من 20 نوع ثغرة',
    description: 'Comprehensive scanning covering all major security vulnerabilities',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    title: 'Detailed Reports - تقارير مفصلة',
    description: 'Get comprehensive reports with recommendations for fixing vulnerabilities',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Chrome Extension - امتداد Chrome',
    description: 'Easy to use browser extension for scanning any website',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: 'Dashboard Analytics - تحليلات لوحة التحكم',
    description: 'Track your scans and vulnerabilities with beautiful charts',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Free for Everyone - مجاني للجميع',
    description: 'Start with 10 scans per hour as a guest, or 100 per day as a user',
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Stats data - بيانات الإحصائيات
const stats = [
  { value: '20+', label: 'Vulnerability Types - أنواع الثغرات' },
  { value: '100%', label: 'Free & Open Source - مجاني ومفتوح المصدر' },
  { value: '<1s', label: 'Scan Speed - سرعة الفحص' },
  { value: '24/7', label: 'Available - متاح دائماً' },
];

export default Landing;
