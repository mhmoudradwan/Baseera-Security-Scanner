import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

// Dashboard Page Component - مكون صفحة لوحة التحكم
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scans, setScans] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scansRes, statsRes] = await Promise.all([
        axios.get('/scans'),
        axios.get('/scans/statistics'),
      ]);
      setScans(scansRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">Loading... - جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - الرأسية */}
      <header className="bg-background-light border-b border-primary/20 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Baseera Security Scanner</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout - تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Statistics Cards - بطاقات الإحصائيات */}
        {statistics && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Scans"
              value={statistics.totalScans}
              subtitle="إجمالي الفحوصات"
              icon="📊"
              color="primary"
            />
            <StatCard
              title="Critical"
              value={statistics.criticalCount}
              subtitle="حرج"
              icon="🔴"
              color="red"
            />
            <StatCard
              title="High"
              value={statistics.highCount}
              subtitle="عالي"
              icon="🟠"
              color="orange"
            />
            <StatCard
              title="Total Vulnerabilities"
              value={statistics.totalVulnerabilities}
              subtitle="إجمالي الثغرات"
              icon="🛡️"
              color="primary"
            />
          </div>
        )}

        {/* Scans Table - جدول الفحوصات */}
        <div className="bg-background-light rounded-lg border border-primary/20 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Scans - الفحوصات الأخيرة</h2>
          
          {scans.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-2">No scans yet</p>
              <p>Install the Chrome extension to start scanning websites</p>
              <p className="text-sm mt-2">لم يتم إجراء أي فحوصات بعد. قم بتثبيت امتداد Chrome لبدء فحص المواقع</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">URL</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Scanned At</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Vulnerabilities</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Risk Score</th>
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {scans.map((scan) => (
                    <tr key={scan.id} className="border-b border-primary/10 hover:bg-background/50">
                      <td className="py-3 px-4 text-white">{scan.url}</td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(scan.scannedAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                          {scan.totalVulnerabilities}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{scan.riskScore.toFixed(1)}</td>
                      <td className="py-3 px-4">
                        <button
                          className="px-3 py-1 bg-primary/20 text-primary rounded hover:bg-primary/30 transition text-sm"
                          title="View details in extension or export"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Vulnerabilities - أكثر الثغرات شيوعاً */}
        {statistics && statistics.topVulnerabilities.length > 0 && (
          <div className="bg-background-light rounded-lg border border-primary/20 p-6 mt-6">
            <h2 className="text-2xl font-bold text-white mb-6">Top Vulnerabilities - أكثر الثغرات شيوعاً</h2>
            <div className="space-y-3">
              {statistics.topVulnerabilities.map((vuln, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-background rounded">
                  <span className="text-white">{vuln.name}</span>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {vuln.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component - مكون بطاقة الإحصائية
const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'border-primary/20 bg-primary/5',
    red: 'border-red-500/20 bg-red-500/5',
    orange: 'border-orange-500/20 bg-orange-500/5',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default Dashboard;
