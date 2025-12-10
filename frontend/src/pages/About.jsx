import { Link } from 'react-router-dom';

// About Page Component - مكون صفحة من نحن
const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6 text-center">About Baseera</h1>
          <p className="text-xl text-gray-300 mb-12 text-center">عن بصيرة - Your Security Companion</p>

          <div className="bg-background-light p-8 rounded-lg border border-primary/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission - مهمتنا</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Baseera Security Scanner is dedicated to making web security accessible to everyone. We believe 
              that every website, regardless of size or budget, deserves robust security scanning capabilities.
            </p>
            <p className="text-gray-300 leading-relaxed text-right">
              بصيرة ماسح الأمان مكرس لجعل أمان الويب متاحًا للجميع. نحن نؤمن بأن كل موقع ويب، بغض النظر عن الحجم 
              أو الميزانية، يستحق قدرات فحص أمان قوية.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-background-light p-6 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-bold text-white mb-3">🎯 Vision</h3>
              <p className="text-gray-300">
                To become the go-to security scanning tool for developers and security professionals worldwide.
              </p>
            </div>

            <div className="bg-background-light p-6 rounded-lg border border-primary/20">
              <h3 className="text-2xl font-bold text-white mb-3">💡 Values</h3>
              <p className="text-gray-300">
                Security, Accessibility, Innovation, and Community-driven development.
              </p>
            </div>
          </div>

          <div className="bg-background-light p-8 rounded-lg border border-primary/20">
            <h2 className="text-3xl font-bold text-white mb-6">Our Services - خدماتنا</h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xl">{service.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">{service.title}</h4>
                    <p className="text-gray-400">{service.description}</p>
                  </div>
                </div>
              ))}
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

const services = [
  {
    icon: '🔍',
    title: 'Automated Vulnerability Scanning',
    description: 'Detect 20+ types of security vulnerabilities automatically with our Chrome extension.',
  },
  {
    icon: '📊',
    title: 'Comprehensive Reports',
    description: 'Get detailed reports with actionable recommendations for fixing vulnerabilities.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'Your data is secure. We only store essential information and never share it.',
  },
  {
    icon: '🚀',
    title: 'Fast & Reliable',
    description: 'Lightning-fast scans that complete in seconds without compromising accuracy.',
  },
];

export default About;
