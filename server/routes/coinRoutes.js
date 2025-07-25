const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const CoinTransaction = require('../models/CoinTransaction');
const RedemptionCoupon = require('../models/RedemptionCoupon');

// Get user's coin balance
router.get('/balance', protect, async (req, res) => {
  try {
    console.log('Coin balance request for user:', req.user.id);
    const user = await User.findById(req.user.id).select('coinBalance');
    console.log('User found:', user);
    res.json({ coinBalance: user.coinBalance });
  } catch (error) {
    console.error('Error in coin balance route:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's coin transaction history
router.get('/transactions', protect, async (req, res) => {
  try {
    const transactions = await CoinTransaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available redemption coupons
router.get('/redemption-coupons', protect, async (req, res) => {
  try {
    const coupons = await RedemptionCoupon.find({
      user: req.user.id,
      isActive: true,
      usedAt: null,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem coins for a coupon
router.post('/redeem-coupon', protect, async (req, res) => {
  try {
    const { couponId } = req.body;
    
    const user = await User.findById(req.user.id);
    const coupon = await RedemptionCoupon.findById(couponId);
    
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    
    if (coupon.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (coupon.usedAt || !coupon.isActive || coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Coupon is not valid' });
    }
    
    if (user.coinBalance < coupon.coinsRequired) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }
    
    // Deduct coins and mark coupon as used
    user.coinBalance -= coupon.coinsRequired;
    await user.save();
    
    coupon.usedAt = new Date();
    await coupon.save();
    
    // Record the transaction
    await CoinTransaction.create({
      user: req.user.id,
      type: 'redeemed',
      amount: -coupon.coinsRequired,
      description: `Redeemed coupon: ${coupon.title}`,
      balanceAfter: user.coinBalance
    });
    
    res.json({ 
      message: 'Coupon redeemed successfully',
      coinBalance: user.coinBalance,
      coupon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available coupon options (what users can redeem)
router.get('/available-coupons', protect, async (req, res) => {
  try {
    console.log('Available coupons request for user:', req.user.id);
    const user = await User.findById(req.user.id).select('coinBalance');
    console.log('User found for coupons:', user);
    
    // Define available coupon options
    const availableCoupons = [
      {
        id: 'discount_10',
        title: '10% Off Next Purchase',
        description: 'Get 10% off your next purchase',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 500,
        coinsRequired: 50,
        validFor: 30 // days
      },
      {
        id: 'discount_20',
        title: '20% Off Next Purchase',
        description: 'Get 20% off your next purchase',
        discountType: 'percentage',
        discountValue: 20,
        minPurchaseAmount: 1000,
        coinsRequired: 100,
        validFor: 30
      },
      {
        id: 'fixed_100',
        title: '₹100 Off Next Purchase',
        description: 'Get ₹100 off your next purchase',
        discountType: 'fixed',
        discountValue: 100,
        minPurchaseAmount: 500,
        coinsRequired: 75,
        validFor: 30
      },
      {
        id: 'fixed_200',
        title: '₹200 Off Next Purchase',
        description: 'Get ₹200 off your next purchase',
        discountType: 'fixed',
        discountValue: 200,
        minPurchaseAmount: 1000,
        coinsRequired: 150,
        validFor: 30
      }
    ];
    
    // Add user's coin balance to each option
    const couponsWithAvailability = availableCoupons.map(coupon => ({
      ...coupon,
      canRedeem: user.coinBalance >= coupon.coinsRequired
    }));
    
    res.json({
      availableCoupons: couponsWithAvailability,
      userCoinBalance: user.coinBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new redemption coupon
router.post('/create-coupon', protect, async (req, res) => {
  try {
    const { couponId } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Define coupon options
    const couponOptions = {
      'discount_10': {
        title: '10% Off Next Purchase',
        description: 'Get 10% off your next purchase',
        discountType: 'percentage',
        discountValue: 10,
        minPurchaseAmount: 500,
        coinsRequired: 50
      },
      'discount_20': {
        title: '20% Off Next Purchase',
        description: 'Get 20% off your next purchase',
        discountType: 'percentage',
        discountValue: 20,
        minPurchaseAmount: 1000,
        coinsRequired: 100
      },
      'fixed_100': {
        title: '₹100 Off Next Purchase',
        description: 'Get ₹100 off your next purchase',
        discountType: 'fixed',
        discountValue: 100,
        minPurchaseAmount: 500,
        coinsRequired: 75
      },
      'fixed_200': {
        title: '₹200 Off Next Purchase',
        description: 'Get ₹200 off your next purchase',
        discountType: 'fixed',
        discountValue: 200,
        minPurchaseAmount: 1000,
        coinsRequired: 150
      }
    };
    
    const couponOption = couponOptions[couponId];
    if (!couponOption) {
      return res.status(400).json({ message: 'Invalid coupon option' });
    }
    
    if (user.coinBalance < couponOption.coinsRequired) {
      return res.status(400).json({ message: 'Insufficient coins' });
    }
    
    // Deduct coins
    user.coinBalance -= couponOption.coinsRequired;
    await user.save();
    
    // Create the coupon
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now
    
    const coupon = await RedemptionCoupon.create({
      user: req.user.id,
      ...couponOption,
      expiresAt
    });
    
    // Record the transaction
    await CoinTransaction.create({
      user: req.user.id,
      type: 'redeemed',
      amount: -couponOption.coinsRequired,
      description: `Created coupon: ${couponOption.title}`,
      balanceAfter: user.coinBalance
    });
    
    res.json({
      message: 'Coupon created successfully',
      coinBalance: user.coinBalance,
      coupon
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 