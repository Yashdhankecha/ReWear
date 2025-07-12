import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      // Store the token and redirect to dashboard
      localStorage.setItem('token', token);
      toast.success('Google login successful!');
      navigate('/dashboard');
    } else if (error) {
      toast.error('Google login failed. Please try again.');
    }
  }, [searchParams, navigate]);

  // Redirect if already authenticated (only after loading is complete)
  useEffect(() => {
    console.log('Login useEffect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    if (isAuthenticated && !isLoading) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Clear error when component mounts - only once
  useEffect(() => {
    clearError();
  }, []); // Empty dependency array - only run once

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    console.log('Login attempt started');
    console.log('Form data:', formData);
    
    const result = await login(formData.email, formData.password);

    console.log('Login result:', result);

    if (result.success) {
      console.log('Login successful, navigating to dashboard');
      toast.success('Login successful!');
      // Add a small delay before navigation to ensure state is updated
      setTimeout(() => {
        console.log('Executing navigation to dashboard');
        navigate('/dashboard');
      }, 150);
    } else {
      console.log('Login failed:', result.error);
      toast.error(result.error);
    }
  };

  const handleGoogleLogin = () => {
    // Get the base API URL without the /api suffix
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    // Remove /api if it's already in the base URL
    const cleanBaseUrl = baseUrl.replace(/\/api$/, '');
    window.location.href = `${cleanBaseUrl}/api/auth/google`;
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="form-options">
            <Link
              to="/forgot-password"
              className="forgot-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="google-auth-button"
          disabled={isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="auth-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
