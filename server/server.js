require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/products');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Разрешаем передачу куков
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(session({
  secret: process.env.JWt_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/ygshop' }),
  cookie: { 
    secure: false, // Для HTTPS установите true
    maxAge: 1000 * 60 * 60 * 24 // 1 день
  }
}));
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoutes);

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