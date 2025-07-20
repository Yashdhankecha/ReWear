import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { authAPI } from '../services/api';
import jsPDF from 'jspdf';

const sampleActivities = [
  { type: 'user', message: 'New user registered: Sarah Johnson', time: '2 min ago', icon: '🧑‍💼', color: 'bg-blue-100' },
  { type: 'order', message: 'Order #ORD1234 placed by Mike Chen', time: '10 min ago', icon: '🛒', color: 'bg-green-100' },
  { type: 'flag', message: 'Item flagged for review: "Vintage Jacket"', time: '30 min ago', icon: '🚩', color: 'bg-red-100' },
  { type: 'user', message: 'User Emma Davis upgraded to premium', time: '1 hr ago', icon: '⭐', color: 'bg-yellow-100' },
];

const chartData = [
  { name: 'Mon', users: 30, orders: 12 },
  { name: 'Tue', users: 45, orders: 18 },
  { name: 'Wed', users: 60, orders: 22 },
  { name: 'Thu', users: 80, orders: 30 },
  { name: 'Fri', users: 100, orders: 40 },
  { name: 'Sat', users: 120, orders: 55 },
  { name: 'Sun', users: 140, orders: 60 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState([
    { label: 'Total Users', value: 120, icon: '👥', color: 'from-blue-500 to-blue-700', hover: 'hover:from-blue-600 hover:to-blue-800' },
    { label: 'Total Orders', value: 87, icon: '📦', color: 'from-green-500 to-green-700', hover: 'hover:from-green-600 hover:to-green-800' },
    { label: 'Pending Payments', value: 5, icon: '💰', color: 'from-yellow-500 to-yellow-700', hover: 'hover:from-yellow-600 hover:to-yellow-800' },
    { label: 'Flagged Items', value: 3, icon: '🚩', color: 'from-red-500 to-red-700', hover: 'hover:from-red-600 hover:to-red-800' },
  ]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Role-based redirect: only 'admin' or 'owner' role allowed
  if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'owner')) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const isOwner = user?.role === 'owner';

  useEffect(() => {
    if (isOwner) {
      setLoadingStats(true);
      authAPI.getPlatformStats().then(res => {
        setPlatformStats(res.summary);
      }).catch(() => {
        setPlatformStats(null);
      }).finally(() => setLoadingStats(false));
    }
  }, [isOwner]);

  const handleDownloadPDF = () => {
    if (!platformStats) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Platform Summary', 14, 18);
    doc.setFontSize(12);
    let y = 30;
    Object.entries(platformStats).forEach(([section, data]) => {
      doc.text(section.charAt(0).toUpperCase() + section.slice(1), 14, y);
      y += 6;
      Object.entries(data).forEach(([key, value]) => {
        doc.text(`${key}: ${value}`, 20, y);
        y += 6;
      });
      y += 4;
    });
    doc.save('platform-summary.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      {/* Full-width header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Profile Card */}
            <div className="flex items-center gap-4 bg-white/90 rounded-2xl shadow-lg p-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div>
                <div className="text-xl font-bold text-blue-900">{user?.name || 'Admin'}</div>
                <div className="text-blue-500 font-medium">
                  {isOwner ? 'Owner' : 'Administrator'}
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex gap-4 flex-wrap justify-center">
              <Link to="/admin/users" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>👥</span> Manage Users
              </Link>
              <Link to="/admin/orders" className="bg-gradient-to-r from-green-600 to-green-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                <span>📦</span> Manage Orders
              </Link>
              {isOwner && (
                <button
                  onClick={() => alert('Analytics feature coming soon!')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2"
                >
                  <span>📊</span> View Analytics
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content - full width */}
      <div className="p-6">
        {/* Stat Cards - Full width grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className={`rounded-2xl shadow-lg p-6 flex flex-col items-center bg-gradient-to-br ${stat.color} text-white transition-all duration-300 ${stat.hover} cursor-pointer group hover:scale-105`}>
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
              <div className="text-3xl font-bold group-hover:text-yellow-200 transition-colors duration-200">{stat.value}</div>
              <div className="text-lg mt-2 group-hover:underline">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Owner-only detailed analytics */}
        {isOwner ? (
          <>
            {/* Charts and Analytics - Full width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Real Chart */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <span>📈</span> User & Order Growth
                </h2>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#2563eb" />
                      <YAxis stroke="#2563eb" />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="orders" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <span>⚡</span> Quick Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg">📱</div>
                      <div>
                        <div className="font-semibold text-blue-900">Active Sessions</div>
                        <div className="text-sm text-blue-600">Real-time users</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">24</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">💰</div>
                      <div>
                        <div className="font-semibold text-green-900">Revenue Today</div>
                        <div className="text-sm text-green-600">Platform earnings</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">₹12,450</div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white text-lg">🚀</div>
                      <div>
                        <div className="font-semibold text-yellow-900">New Items</div>
                        <div className="text-sm text-yellow-600">Added today</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">18</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed - Full width */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <span>📰</span> Recent Activity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleActivities.map((activity, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 ${activity.color} rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
                    <span className="text-2xl bg-white rounded-full p-2 shadow border border-blue-100">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="text-blue-900 font-semibold">{activity.message}</div>
                      <div className="text-blue-400 text-xs">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Summary */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <span>📊</span> Platform Summary
              </h2>
              {loadingStats ? (
                <div className="text-blue-400">Loading platform statistics...</div>
              ) : platformStats ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {Object.entries(platformStats).map(([section, data]) => (
                      <div key={section} className="bg-blue-50 rounded-xl p-4">
                        <div className="font-bold text-blue-900 mb-2">{section.charAt(0).toUpperCase() + section.slice(1)}</div>
                        <ul className="text-blue-700 space-y-1">
                          {Object.entries(data).map(([key, value]) => (
                            <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleDownloadPDF} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:shadow-xl flex items-center gap-2">
                    <span>⬇️</span> Download as PDF
                  </button>
                </div>
              ) : (
                <div className="text-red-500">Failed to load platform statistics.</div>
              )}
            </div>
          </>
        ) : (
          /* Admin-only simplified view */
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <span>🔒</span> Admin Access
            </h2>
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-semibold text-blue-900">Welcome, Administrator!</h3>
              <p className="text-blue-600 max-w-md mx-auto">
                You have access to manage users and orders. For detailed analytics and statistics, 
                please contact the system owner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link to="/admin/users" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                  <span>👥</span> Manage Users
                </Link>
                <Link to="/admin/orders" className="bg-gradient-to-r from-green-600 to-green-400 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2">
                  <span>📦</span> Manage Orders
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-blue-200 text-lg">
          {isOwner ? (
            <>
              <span className="font-bold">Tip:</span> Use the quick actions above to manage users, orders, and view analytics. Make your admin experience powerful and enjoyable!
            </>
          ) : (
            <>
              <span className="font-bold">Note:</span> You have administrative access to manage users and orders. Contact the owner for detailed analytics and system statistics.
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 