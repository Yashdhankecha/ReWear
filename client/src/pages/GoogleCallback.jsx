import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    
    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      setToken(token);
      toast.success('Google login successful!');
      navigate('/dashboard');
    } else if (error) {
      toast.error('Google login failed. Please try again.');
      navigate('/login');
    } else {
      // No token or error, redirect to login
      navigate('/login');
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Processing Google login...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 