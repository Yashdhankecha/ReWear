
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
    <div className="dashboard-container fade-in">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>You have successfully logged into your account.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card slide-up">
            <h3>Profile Information</h3>
            <div className="profile-info">
              <div className="info-item">
                <label>Name:</label>
                <span>{user?.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-item">
                <label>Role:</label>
                <span className={`role-badge ${user?.role}`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className="info-item">
                <label>Email Verified:</label>
                <span className={`status-badge ${user?.isEmailVerified ? 'verified' : 'unverified'}`}>
                  {user?.isEmailVerified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
            </div>
          </div>

          <div className="dashboard-card slide-up">
            <h3>Account Activity</h3>
            <div className="activity-info">
              <div className="info-item">
                <label>Last Login:</label>
                <span>{formatDate(user?.lastLogin)}</span>
              </div>
              <div className="info-item">
                <label>Account Created:</label>
                <span>{formatDate(user?.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>User ID:</label>
                <span className="user-id">{user?.id}</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card slide-up">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button className="action-button">
                <span className="action-icon">👤</span>
                <span>Edit Profile</span>
              </button>
              <button className="action-button">
                <span className="action-icon">🔒</span>
                <span>Change Password</span>
              </button>
              <button className="action-button">
                <span className="action-icon">⚙️</span>
                <span>Settings</span>
              </button>
              <button className="action-button">
                <span className="action-icon">📊</span>
                <span>Analytics</span>
              </button>
            </div>
          </div>

          <div className="dashboard-card slide-up">
            <h3>Security Status</h3>
            <div className="security-status">
              <div className="security-item">
                <span className="security-icon">🔐</span>
                <div className="security-info">
                  <h4>Two-Factor Authentication</h4>
                  <p className="status-text disabled">Not Enabled</p>
                </div>
              </div>
              <div className="security-item">
                <span className="security-icon">📧</span>
                <div className="security-info">
                  <h4>Email Verification</h4>
                  <p className={`status-text ${user?.isEmailVerified ? 'enabled' : 'disabled'}`}>
                    {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </p>
                </div>
              </div>
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <div className="security-info">
                  <h4>Account Security</h4>
                  <p className="status-text enabled">Active</p>
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
