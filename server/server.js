require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const profileRoutes = require('./routes/profile');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes);

// Подключение к MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/ygshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB подключена'))
.catch(err => console.log('Ошибка подключения к MongoDB:', err));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});