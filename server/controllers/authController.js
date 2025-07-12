const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Use development database if available
    if (global.devDb) {
      try {
        // Check if user already exists
        const existingUser = await global.devDb.findUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'User already exists with this email'
          });
        }

        // Create user
        const result = await global.devDb.createUser({ name, email, password });
        
        // Generate OTP for development
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Update user with OTP
        await global.devDb.updateUser(result.userId, {
          otpCode: otp,
          otpExpires: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        });

        console.log('=== DEVELOPMENT MODE ===');
        console.log('OTP for email verification:', otp);
        console.log('Email:', email);
        console.log('=== END DEVELOPMENT MODE ===');

        res.status(201).json({
          success: true,
          message: 'User registered successfully. Please check your email for OTP verification.',
          data: {
            userId: result.userId,
            email: email,
            name: name
          }
        });
        return;
      } catch (error) {
        console.error('Development database error:', error);
        return res.status(500).json({
          success: false,
          message: error.message || 'Server error during registration'
        });
      }
    }

    // MongoDB flow (original code)
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    try {
      await emailService.sendOTPEmail(email, otp, 'verification');
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      
      // For development, if email is not configured, just log the OTP
      if (process.env.NODE_ENV === 'development') {
        console.log('=== DEVELOPMENT MODE ===');
        console.log('OTP for email verification:', otp);
        console.log('Email:', email);
        console.log('=== END DEVELOPMENT MODE ===');
      } else {
        // Delete user if email fails in production
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
          success: false,
          message: 'Failed to send verification email. Please try again.'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for OTP verification.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp } = req.body;

    // Use development database if available
    if (global.devDb) {
      try {
        // Find user
        const user = await global.devDb.findUserByEmail(email);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        // Check if already verified
        if (user.isEmailVerified) {
          return res.status(400).json({
            success: false,
            message: 'Email is already verified'
          });
        }

        // Check OTP attempts
        if (user.otpAttempts >= 5) {
          return res.status(429).json({
            success: false,
            message: 'Too many failed attempts. Please request a new OTP.'
          });
        }

        // Verify OTP
        if (!user.otpCode || user.otpCode !== otp || new Date(user.otpExpires) < new Date()) {
          await global.devDb.updateUser(user.id, {
            otpAttempts: user.otpAttempts + 1
          });
          
          return res.status(400).json({
            success: false,
            message: 'Invalid or expired OTP',
            attemptsLeft: 5 - (user.otpAttempts + 1)
          });
        }

        // Mark email as verified and clear OTP
        await global.devDb.updateUser(user.id, {
          isEmailVerified: 1,
          otpCode: null,
          otpExpires: null,
          otpAttempts: 0
        });

        // Generate token
        const token = global.devDb.generateToken(user.id);

        res.status(200).json({
          success: true,
          message: 'Email verified successfully',
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              isEmailVerified: 1,
              role: user.role
            }
          }
        });
        return;
      } catch (error) {
        console.error('Development database verification error:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error during email verification'
        });
      }
    }

    // MongoDB flow (original code)
    // Find user
    const user = await User.findOne({ email }).select('+otpCode +otpExpires +otpAttempts');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check OTP attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      user.otpAttempts += 1;
      await user.save();
      
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
        attemptsLeft: 5 - user.otpAttempts
      });
    }

    // Mark email as verified and clear OTP
    user.isEmailVerified = true;
    user.clearOTP();
    await user.save();

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the verification if welcome email fails
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email }).select('+lastOtpRequest');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Check rate limiting (1 minute between requests)
    if (user.lastOtpRequest && Date.now() - user.lastOtpRequest < 60000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting another OTP'
      });
    }

    // Generate new OTP
    const otp = user.generateOTP();
    user.otpAttempts = 0; // Reset attempts
    await user.save();

    // Send OTP email
    await emailService.sendOTPEmail(email, otp, 'verification');

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Use development database if available
    if (global.devDb) {
      try {
        // Find user
        const user = await global.devDb.findUserByEmail(email);
        console.log('Dev DB - Found user:', user ? { id: user.id, email: user.email, isVerified: user.isEmailVerified } : 'Not found');
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
          return res.status(401).json({
            success: false,
            message: 'Please verify your email before logging in'
          });
        }

        // Verify password
        const isPasswordValid = await global.devDb.verifyPassword(user, password);
        console.log('Dev DB - Password verification:', { providedPassword: password, isValid: isPasswordValid });
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
          });
        }

        // Update last login
        await global.devDb.updateUser(user.id, {
          lastLogin: new Date().toISOString()
        });

        // Generate token
        const token = global.devDb.generateToken(user.id);

        res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              isEmailVerified: user.isEmailVerified,
              role: user.role
            }
          }
        });
        return;
      } catch (error) {
        console.error('Development database login error:', error);
        return res.status(500).json({
          success: false,
          message: 'Server error during login'
        });
      }
    }

    // MongoDB flow (original code)
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email }).select('+lastOtpRequest');
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset OTP'
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check rate limiting (1 minute between requests)
    if (user.lastOtpRequest && Date.now() - user.lastOtpRequest < 60000) {
      return res.status(429).json({
        success: false,
        message: 'Please wait 1 minute before requesting another OTP'
      });
    }

    // Generate OTP for password reset
    const otp = user.generateOTP();
    await user.save();

    // Send password reset OTP email
    try {
      await emailService.sendOTPEmail(email, otp, 'reset');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send password reset email. Please try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+otpCode +otpExpires +otpAttempts');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check OTP attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
        attemptsLeft: 5 - user.otpAttempts
      });
    }

    // Update password and clear OTP
    user.password = newPassword;
    user.clearOTP();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if email is being changed and if it's already taken
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken by another user'
        });
      }
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || undefined,
        email: email || undefined
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isEmailVerified: updatedUser.isEmailVerified,
          role: updatedUser.role,
          lastLogin: updatedUser.lastLogin,
          createdAt: updatedUser.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  signup,
  verifyEmail,
  resendOTP,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  logout
};
