const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [cartItemSchema],
  createdAt: { type: Date, default: Date.now, expires: '30d' } // Автоудаление через 30 дней
});

module.exports = mongoose.model('Cart', cartSchema);