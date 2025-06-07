const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); // (если нужна авторизация)

// Добавить в корзину
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user.userId);
    user.cart.push({ productId, quantity });
    await user.save();
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при добавлении в корзину' });
  }
});

// Оформить заказ
router.post('/checkout', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const order = {
      items: user.cart,
      date: new Date(),
      total: user.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    };
    user.orders.push(order);
    user.cart = [];
    await user.save();
    res.json({ message: 'Заказ оформлен', order });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при оформлении заказа' });
  }
});

module.exports = router;
