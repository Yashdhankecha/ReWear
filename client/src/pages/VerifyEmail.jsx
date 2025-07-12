import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { verifyEmail, resendOTP, isAuthenticated, isLoading, clearError } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  // Redirect if already authenticated (only after loading is complete)
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      toast.error('Email not provided. Please sign up again.');
      navigate('/signup');
    }
  }, [email, navigate]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    if (!/^\d{6}$/.test(otpString)) {
      toast.error('OTP must contain only numbers');
      return;
    }

    const result = await verifyEmail(email, otpString);
    
    if (result.success) {
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    const result = await resendOTP(email);
    
    if (result.success) {
      toast.success('OTP sent successfully!');
      setResendCooldown(60); // 60 seconds cooldown
      setOtp(['', '', '', '', '', '']); // Clear current OTP
      document.getElementById('otp-0')?.focus();
    } else {
      toast.error(result.error);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Verify Your Email</h1>
          <p>We've sent a 6-digit verification code to</p>
          <strong>{email}</strong>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-container">
            <label>Enter Verification Code</label>
            <div className="otp-inputs">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="otp-input"
                  autoComplete="off"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Didn't receive the code?{' '}
            <button
              type="button"
              className="resend-button"
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend Code'
              }
            </button>
          </p>
          <p>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/signup')}
            >
              ← Back to Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
