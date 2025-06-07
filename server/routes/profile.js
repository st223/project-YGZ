const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Получить профиль
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Формируем ответ в ожидаемом формате
    const profileData = {
      fullName: user.name || `${user.firstName} ${user.lastName}` || 'Не указано',
      email: user.email,
      phone: user.phone || null,
      address: user.address || null,
      recentOrders: user.orders || []
    };

    res.json(profileData);
  } catch (err) {
    console.error('Ошибка при получении профиля:', err);
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

// История заказов
router.get('/orders', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user.orders || []);
  } catch (err) {
    console.error('Ошибка при получении заказов:', err);
    res.status(500).json({ error: 'Ошибка при получении заказов' });
  }
});

// Выход из системы
router.post('/logout', auth, async (req, res) => {
  try {

    res.json({ message: 'Выход выполнен успешно' });
    
    req.user.tokens = req.user.tokens.filter(token => token !== req.token);
    await req.user.save();
    res.json({ message: 'Выход выполнен успешно' });
  } catch (err) {
    console.error('Ошибка при выходе:', err);
    res.status(500).json({ error: 'Ошибка при выходе из системы' });
  }
});
module.exports = router;