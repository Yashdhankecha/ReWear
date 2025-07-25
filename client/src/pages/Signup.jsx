import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup, isAuthenticated, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated (only after loading is complete)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }

    if (formData.name.length < 2) {
      toast.error('Name must be at least 2 characters long');
      return false;
    }

    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log('Signup attempt started');
    console.log('Form data:', formData);

    const result = await signup(formData.name, formData.email, formData.password);

    console.log('Signup result:', result);

    if (result.success) {
      console.log('Signup successful, navigating to verify email');
      toast.success('Account created successfully! Please check your email for verification.');
      setTimeout(() => {
        navigate('/verify-email', {
          state: {
            email: formData.email,
            fromSignup: true
          }
        });
      }, 150);
    } else {
      console.log('Signup failed:', result.error);
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
    <div className="min-h-screen w-screen bg-slate-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-400/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      <div className="w-full mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 px-8">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl animate-glow">
              <span className="text-4xl">♻️</span>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent leading-tight">
              Start Your<br />
              <span className="text-white">Sustainable</span><br />
              Journey
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-md">
              Join thousands of users who are making a difference through sustainable fashion. 
              Create your account and start contributing to a greener future.
            </p>
            <div className="grid grid-cols-1 gap-4 text-gray-400">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span>Free to join and use</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span>Secure and private</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span>Help the environment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-dark-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-dark-700/50">
            <div className="text-center mb-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">♻️</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Join ReWear</h2>
                <p className="text-gray-400 font-medium">Create your sustainable fashion account</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
                  className="w-full px-4 py-4 border-2 border-dark-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-dark-700/50 backdrop-blur-sm text-white placeholder-gray-400"
            />
          </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
                  className="w-full px-4 py-4 border-2 border-dark-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-dark-700/50 backdrop-blur-sm text-white placeholder-gray-400"
            />
          </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                    className="w-full px-4 py-4 pr-12 border-2 border-dark-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-dark-700/50 backdrop-blur-sm text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-dark-600"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
                <small className="text-xs text-gray-400 mt-2 block">
              Must contain at least 6 characters with uppercase, lowercase, and number
            </small>
          </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                    className="w-full px-4 py-4 pr-12 border-2 border-dark-600 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-dark-700/50 backdrop-blur-sm text-white placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-400 transition-colors p-2 rounded-lg hover:bg-dark-600"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-800 text-gray-400">or</span>
              </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-slate-800 border border-slate-700 text-gray-300 py-4 px-6 rounded-xl font-medium hover:bg-slate-700 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

            <div className="text-center mt-6">
              <p className="text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
            >
              Sign in here
            </Link>
          </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
