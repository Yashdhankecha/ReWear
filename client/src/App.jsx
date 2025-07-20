import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import GoogleCallback from './pages/GoogleCallback';
import MyListings from './pages/MyListings';
import BrowseItems from './pages/BrowseItems';
import Profile from './pages/Profile';
import About from './pages/About';
import Community from './pages/Community';
import ProductDetail from './pages/ProductDetail';
import Notifications from './pages/Notifications';
import TestBuySell from './pages/TestBuySell';
import Redemption from './pages/Redemption';
import ListItem from './pages/ListItem';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HowItWorks from './pages/HowItWorks';
import PointsSystem from './pages/PointsSystem';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import OwnerDashboard from './pages/OwnerDashboard';

// Styles - Now using Tailwind CSS via CDN

// Wrapper component to conditionally render Navbar and Footer
function AppContent() {
  const location = useLocation();
  
  // Routes where we don't want to show Navbar and Footer
  const authRoutes = ['/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];
  const shouldShowNavbarFooter = !authRoutes.includes(location.pathname);

  // Hide Footer for owner dashboard
  const isOwnerDashboard = location.pathname === '/owner/dashboard';

  // Helper to check if user is owner
  const isOwnerUser = () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.role === 'owner';
    }
    return false;
  };

  return (
    <div className="App">
      {shouldShowNavbarFooter && <Navbar />}
      <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/google-callback" element={<GoogleCallback />} />
            <Route path="/browse" element={<BrowseItems />} />
            <Route path="/test-buy-sell" element={<TestBuySell />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/points" element={<PointsSystem />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <Dashboard />
              }
            />
            <Route
              path="/list"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <ListItem />
              }
            />
            <Route
              path="/my-listings"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <ProtectedRoute>
                      <MyListings />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
              }
            />
            <Route
              path="/redemption"
              element={
                isOwnerUser()
                  ? <Navigate to="/owner/dashboard" replace />
                  : <ProtectedRoute>
                      <Redemption />
                    </ProtectedRoute>
              }
            />

            {/* Admin dashboard route */}
            <Route path="/admin/dashboard" element={
              isOwnerUser()
                ? <Navigate to="/owner/dashboard" replace />
                : (typeof window !== 'undefined' && (JSON.parse(localStorage.getItem('user'))?.role === 'admin' || JSON.parse(localStorage.getItem('user'))?.role === 'owner'))
                  ? <AdminDashboard />
                  : <Navigate to="/login" replace />
            } />

            {/* Admin orders management route */}
            <Route path="/admin/orders" element={
              isOwnerUser()
                ? <Navigate to="/owner/dashboard" replace />
                : (typeof window !== 'undefined' && (JSON.parse(localStorage.getItem('user'))?.role === 'admin' || JSON.parse(localStorage.getItem('user'))?.role === 'owner'))
                  ? <AdminOrders />
                  : <Navigate to="/login" replace />
            } />

            {/* Admin users management route */}
            <Route path="/admin/users" element={
              isOwnerUser()
                ? <Navigate to="/owner/dashboard" replace />
                : (typeof window !== 'undefined' && (JSON.parse(localStorage.getItem('user'))?.role === 'admin' || JSON.parse(localStorage.getItem('user'))?.role === 'owner'))
                  ? <AdminUsers />
                  : <Navigate to="/login" replace />
            } />

            {/* Owner dashboard route */}
            <Route path="/owner/dashboard" element={
              (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user'))?.role === 'owner')
                ? <ProtectedRoute><OwnerDashboard /></ProtectedRoute>
                : <Navigate to="/login" replace />
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* New route for editing a list item */}
            <Route path="/edit/:id" element={<ListItem />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {!isOwnerDashboard && shouldShowNavbarFooter && <Footer />}
        </div>
      );
}

function App() {
  // Test API connection on app load
  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(response => response.json())
      .then(data => {
        console.log('API Health Check:', data);
      })
      .catch(error => {
        console.error('API Health Check Failed:', error);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
