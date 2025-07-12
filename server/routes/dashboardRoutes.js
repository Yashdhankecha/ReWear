const express = require('express');
const Item = require('../models/Item');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/overview', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments();
    const swapsCompleted = await Item.countDocuments({ status: 'swapped' });
    const itemsAwaiting = await Item.countDocuments({ status: 'pending' });
    const flaggedItems = await Item.countDocuments({ flagged: true });
    const featuredItems = await Item.find().limit(5); // or use a 'featured' flag

    res.json({
      totalItems,
      swapsCompleted,
      itemsAwaiting,
      flaggedItems,
      featuredItems,
    });
  } catch (err) {
    res.status(500).json({ error: 'Dashboard data fetch failed' });
  }
});

// New endpoint for browsing items with filtering and pagination
router.get('/items', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      status, 
      condition, 
      minPoints, 
      maxPoints,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (condition) filter.condition = condition;
    if (minPoints || maxPoints) {
      filter.points = {};
      if (minPoints) filter.points.$gte = parseInt(minPoints);
      if (maxPoints) filter.points.$lte = parseInt(maxPoints);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get items with pagination
    const items = await Item.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    // Get unique categories for filter options
    const categories = await Item.distinct('category');
    const conditions = await Item.distinct('condition');

    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        categories,
        conditions
      }
    });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Get single item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).lean();
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ data: item });
  } catch (err) {
    console.error('Error fetching item:', err);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// Add new item (listing) - requires authentication
router.post('/items', protect, async (req, res) => {
  try {
    const {
      title,
      description,
      size,
      color,
      brand,
      points,
      category,
      condition,
      images
    } = req.body;

    // Validate required fields
    if (!title || !description || !size || !points || !category || !condition) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!Array.isArray(images) || images.length === 0 || !images[0]) {
      return res.status(400).json({ error: 'At least one image URL is required.' });
    }
    if (isNaN(points) || points <= 0) {
      return res.status(400).json({ error: 'Points must be a positive number.' });
    }

    // Create new item with user ID
    const newItem = new Item({
      title,
      description,
      size,
      color,
      brand,
      points,
      category,
      condition,
      images,
      user: req.user.id, // Add the user ID from the authenticated request
      status: 'pending', // New items are pending approval by default
    });
    await newItem.save();
    res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item.' });
  }
});

// Get user's listed products (items they created)
router.get('/user/listed', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalItems = await Item.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (err) {
    console.error('Error fetching user listed items:', err);
    res.status(500).json({ error: 'Failed to fetch listed items' });
  }
});

// Get user's bought products (items they swapped for)
// Note: This would need a separate model for tracking swaps/transactions
// For now, we'll return an empty array as placeholder
router.get('/user/bought', protect, async (req, res) => {
  try {
    // TODO: Implement swap/transaction tracking
    // For now, return empty array as placeholder
    res.json({
      items: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
    });
  } catch (err) {
    console.error('Error fetching user bought items:', err);
    res.status(500).json({ error: 'Failed to fetch bought items' });
  }
});

// Buy an item (direct purchase)
router.post('/items/:id/buy', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { message = '' } = req.body;
    
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (item.user.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot buy your own item' });
    }
    
    // Create transaction
    const transaction = new Transaction({
      item: id,
      buyer: req.user.id,
      seller: item.user,
      offerAmount: item.points,
      type: 'buy',
      message
    });
    
    await transaction.save();
    
    // Update item status to pending
    await Item.findByIdAndUpdate(id, { status: 'pending' });
    
    res.json({ 
      success: true, 
      message: 'Purchase request sent to seller',
      transaction: transaction
    });
  } catch (err) {
    console.error('Error creating buy transaction:', err);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

// Make an offer for an item
router.post('/items/:id/offer', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { offerAmount, message = '' } = req.body;
    
    if (!offerAmount || offerAmount <= 0) {
      return res.status(400).json({ error: 'Valid offer amount is required' });
    }
    
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    if (item.user.toString() === req.user.id) {
      return res.status(400).json({ error: 'You cannot offer on your own item' });
    }
    
    // Create transaction
    const transaction = new Transaction({
      item: id,
      buyer: req.user.id,
      seller: item.user,
      offerAmount,
      type: 'offer',
      message
    });
    
    await transaction.save();
    
    res.json({ 
      success: true, 
      message: 'Offer sent to seller',
      transaction: transaction
    });
  } catch (err) {
    console.error('Error creating offer transaction:', err);
    res.status(500).json({ error: 'Failed to process offer' });
  }
});

// Get seller's pending transactions (notifications)
router.get('/seller/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      seller: req.user.id,
      status: 'pending'
    })
    .populate('item', 'title images points')
    .populate('buyer', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({ transactions });
  } catch (err) {
    console.error('Error fetching seller transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get buyer's transactions (purchases/offers)
router.get('/buyer/transactions', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ 
      buyer: req.user.id
    })
    .populate('item', 'title images points status')
    .populate('seller', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({ transactions });
  } catch (err) {
    console.error('Error fetching buyer transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Accept or reject a transaction
router.put('/transactions/:id/respond', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    if (transaction.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    if (transaction.status !== 'pending') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }
    
    if (action === 'accept') {
      transaction.status = 'accepted';
      // Update item status to sold
      await Item.findByIdAndUpdate(transaction.item, { status: 'sold' });
    } else if (action === 'reject') {
      transaction.status = 'rejected';
      // Reset item status to approved if it was pending
      await Item.findByIdAndUpdate(transaction.item, { status: 'approved' });
    }
    
    await transaction.save();
    
    res.json({ 
      success: true, 
      message: `Transaction ${action}ed`,
      transaction
    });
  } catch (err) {
    console.error('Error responding to transaction:', err);
    res.status(500).json({ error: 'Failed to process response' });
  }
});

// Dummy data seeding endpoint (for development/testing only)
router.post('/seed', async (req, res) => {
  try {
    await Item.deleteMany({});
    await Item.insertMany([
      {
        title: 'Vintage Denim Jacket',
        description: 'Classic blue denim jacket with a vintage wash.',
        size: 'M',
        color: 'Blue',
        brand: 'Levi\'s',
        points: 120,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&h=400&fit=crop'],
        category: 'Outerwear',
        condition: 'Like New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Summer Floral Dress',
        description: 'Lightweight dress with a colorful floral pattern.',
        size: 'S',
        color: 'Multicolor',
        brand: 'H&M',
        points: 95,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'],
        category: 'Dresses',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Designer Sneakers',
        description: 'Trendy white sneakers, gently used.',
        size: '9',
        color: 'White',
        brand: 'Nike',
        points: 150,
        status: 'swapped',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
        category: 'Shoes',
        condition: 'Like New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Wool Coat',
        description: 'Warm wool coat, perfect for winter.',
        size: 'L',
        color: 'Gray',
        brand: 'Zara',
        points: 110,
        status: 'pending',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
        category: 'Outerwear',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Silk Blouse',
        description: 'Elegant black silk blouse, lightly worn.',
        size: 'M',
        color: 'Black',
        brand: 'Uniqlo',
        points: 80,
        status: 'pending',
        flagged: true,
        images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'],
        category: 'Tops',
        condition: 'Fair',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Flagged T-Shirt',
        description: 'Basic white tee, flagged for review.',
        size: 'S',
        color: 'White',
        brand: 'Gap',
        points: 60,
        status: 'approved',
        flagged: true,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
        category: 'Tops',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Classic Trench',
        description: 'Timeless beige trench coat.',
        size: 'L',
        color: 'Beige',
        brand: 'Burberry',
        points: 130,
        status: 'swapped',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
        category: 'Outerwear',
        condition: 'Like New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Leather Handbag',
        description: 'Elegant brown leather handbag with gold hardware.',
        size: 'One Size',
        color: 'Brown',
        brand: 'Coach',
        points: 180,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'],
        category: 'Accessories',
        condition: 'Like New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Denim Jeans',
        description: 'Classic blue denim jeans with perfect fit.',
        size: '32x32',
        color: 'Blue',
        brand: 'Levi\'s',
        points: 85,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'],
        category: 'Bottoms',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Summer Hat',
        description: 'Straw hat perfect for beach days.',
        size: 'M',
        color: 'Beige',
        brand: 'H&M',
        points: 45,
        status: 'pending',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&fit=crop'],
        category: 'Accessories',
        condition: 'New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Winter Scarf',
        description: 'Warm wool scarf in navy blue.',
        size: 'One Size',
        color: 'Navy',
        brand: 'Gap',
        points: 35,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop'],
        category: 'Accessories',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Running Shoes',
        description: 'Comfortable running shoes for daily workouts.',
        size: '10',
        color: 'Black',
        brand: 'Adidas',
        points: 120,
        status: 'swapped',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'],
        category: 'Shoes',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Evening Dress',
        description: 'Elegant black evening dress for special occasions.',
        size: 'M',
        color: 'Black',
        brand: 'Zara',
        points: 200,
        status: 'approved',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
        category: 'Dresses',
        condition: 'Like New',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
      {
        title: 'Casual Sweater',
        description: 'Cozy knit sweater perfect for fall weather.',
        size: 'L',
        color: 'Gray',
        brand: 'Uniqlo',
        points: 75,
        status: 'pending',
        flagged: false,
        images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'],
        category: 'Tops',
        condition: 'Good',
        user: '507f1f77bcf86cd799439011', // Dummy user ID
      },
    ]);
    res.json({ success: true, message: 'Dummy items seeded.' });
  } catch (err) {
    res.status(500).json({ error: 'Seeding failed' });
  }
});

module.exports = router;
