const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Получить профиль
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

// История заказов
router.get('/orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.orders);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

module.exports = router;
