import { useState } from 'react';
import { Link } from 'react-router-dom';

// Contact Page Component - مكون صفحة الاتصال
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to a backend
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">Contact Us</h1>
          <p className="text-xl text-gray-300 mb-12 text-center">اتصل بنا - We'd love to hear from you</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form - نموذج الاتصال */}
            <div className="bg-background-light p-8 rounded-lg border border-primary/20">
              <h2 className="text-2xl font-bold text-white mb-6">Send Message - أرسل رسالة</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded text-green-400">
                  Message sent successfully! - تم إرسال الرسالة بنجاح!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name - الاسم
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email - البريد الإلكتروني
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject - الموضوع
                  </label>
                  <input
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message - الرسالة
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition"
                >
                  Send Message - إرسال الرسالة
                </button>
              </form>
            </div>

            {/* Contact Info Cards - بطاقات معلومات الاتصال */}
            <div className="space-y-6">
              <div className="bg-background-light p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                    <p className="text-gray-400">support@baseera-scanner.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-background-light p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Location - الموقع</h3>
                    <p className="text-gray-400">Available Globally</p>
                    <p className="text-gray-400 text-sm">متاح عالمياً</p>
                  </div>
                </div>
              </div>

              <div className="bg-background-light p-6 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Support Hours - ساعات الدعم</h3>
                    <p className="text-gray-400">24/7 Online Support</p>
                    <p className="text-gray-400 text-sm">دعم متاح على مدار الساعة</p>
                  </div>
                </div>
              </div>

              <div className="bg-background-light p-6 rounded-lg border border-primary/20">
                <h3 className="text-lg font-semibold text-white mb-3">Follow Us - تابعنا</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition">
                    <span className="text-primary">🐦</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition">
                    <span className="text-primary">📘</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition">
                    <span className="text-primary">💼</span>
                  </a>
                  <a href="#" className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition">
                    <span className="text-primary">📷</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/" className="px-8 py-3 bg-primary text-background font-semibold rounded-lg hover:bg-primary-dark transition inline-block">
              Back to Home - العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
