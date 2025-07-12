const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String },
  brand: { type: String },
  points: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'swapped'], default: 'pending' },
  flagged: { type: Boolean, default: false },
  images: [{ type: String }],
  category: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Like New', 'Good', 'Fair'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', ItemSchema); 