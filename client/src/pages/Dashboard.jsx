
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen w-screen bg-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <header className="relative z-10 bg-dark-800/50 backdrop-blur-xl border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">♻️</span>
              </div>
              <h1 className="text-2xl font-bold text-white">ReWear Dashboard</h1>
            </div>
            <button 
              onClick={handleLogout} 
              className="bg-red-600/20 text-red-400 px-6 py-3 rounded-xl font-medium hover:bg-red-600/30 transition-all duration-300 border border-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full mx-auto px-8 lg:px-12 py-12">
        <div className="mb-12">
          <h2 className="text-5xl font-bold text-white mb-4">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-xl text-gray-300">You have successfully logged into your ReWear account.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Profile Information */}
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-dark-700/50 hover:border-primary-500/20 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Profile Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dark-600/50">
                <span className="text-gray-400">Name:</span>
                <span className="font-medium text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-600/50">
                <span className="text-gray-400">Email:</span>
                <span className="font-medium text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-600/50">
                <span className="text-gray-400">Role:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                }`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Email Verified:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  user?.isEmailVerified ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {user?.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-dark-700/50 hover:border-primary-500/20 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Account Activity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-dark-600/50">
                <span className="text-gray-400">Last Login:</span>
                <span className="font-medium text-white">{formatDate(user?.lastLogin)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-600/50">
                <span className="text-gray-400">Account Created:</span>
                <span className="font-medium text-white">{formatDate(user?.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">User ID:</span>
                <span className="font-mono text-sm text-gray-500">{user?.id}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-dark-700/50 hover:border-primary-500/20 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center p-4 rounded-xl border border-dark-600/50 hover:bg-dark-700/50 hover:border-primary-500/30 transition-all duration-300 group">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Edit Profile</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-xl border border-dark-600/50 hover:bg-dark-700/50 hover:border-primary-500/30 transition-all duration-300 group">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔒</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Change Password</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-xl border border-dark-600/50 hover:bg-dark-700/50 hover:border-primary-500/30 transition-all duration-300 group">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚙️</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Settings</span>
              </button>
              <button className="flex flex-col items-center p-4 rounded-xl border border-dark-600/50 hover:bg-dark-700/50 hover:border-primary-500/30 transition-all duration-300 group">
                <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white">Analytics</span>
              </button>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-dark-700/50 hover:border-primary-500/20 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-lg">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Security Status</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-700/30 border border-dark-600/30">
                <span className="text-2xl">🔐</span>
                <div>
                  <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                  <p className="text-sm text-red-400">Not Enabled</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-700/30 border border-dark-600/30">
                <span className="text-2xl">📧</span>
                <div>
                  <h4 className="font-medium text-white">Email Verification</h4>
                  <p className={`text-sm ${user?.isEmailVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-700/30 border border-dark-600/30">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h4 className="font-medium text-white">Account Security</h4>
                  <p className="text-sm text-green-400">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
