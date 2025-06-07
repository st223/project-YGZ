// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Получаем токен из заголовка
  const token = req.header('x-auth-token');
  
  // Проверяем наличие токена
  if (!token) {
    return res.status(401).json({ error: 'Нет токена, авторизация отклонена' });
  }

  try {
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Токен недействителен' });
  }
};