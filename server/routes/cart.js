const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Получить корзину
router.get('/', async (req, res) => {
  try {
    let cart;
    if (req.user) {
      // Для авторизованных пользователей
      cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    } else {
      // Для гостей (по sessionId)
      if (!req.session.cartId) {
        return res.json({ items: [] });
      }
      cart = await Cart.findById(req.session.cartId).populate('items.productId');
    }

    if (!cart) return res.json({ items: [] });

    // Форматируем ответ для фронтенда
    const formattedItems = cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Добавить/обновить товар в корзине
// Добавить/обновить товар в корзине
router.put('/', async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Некорректные данные корзины' });
    }

    const productIds = items.map(item => item.id);
    const products = await Product.find({ _id: { $in: productIds } });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Некоторые товары не найдены' });
    }

    let cart;
    if (req.user) {
      // Логика для авторизованных пользователей
      cart = await Cart.findOne({ userId: req.user._id });
      
      if (!cart) {
        cart = new Cart({
          userId: req.user._id,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        });
      } else {
        cart.items = items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }));
      }
      await cart.save();
    } else {
      // Логика для гостей (остается без изменений)
      if (!req.session.cartId) {
        cart = new Cart({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }))
        });
        await cart.save();
        req.session.cartId = cart._id;
        await req.session.save();
      } else {
        cart = await Cart.findById(req.session.cartId);
        if (!cart) {
          cart = new Cart({
            items: items.map(item => ({
              productId: item.id,
              quantity: item.quantity
            }))
          });
          await cart.save();
          req.session.cartId = cart._id;
          await req.session.save();
        } else {
          cart.items = items.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }));
          await cart.save();
        }
      }
    }

    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    const formattedItems = populatedCart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Удалить товар из корзины
router.delete('/:productId', async (req, res) => {
  try {
    let cart;
    if (req.user) {
      cart = await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { items: { productId: req.params.productId } } },
        { new: true }
      ).populate('items.productId');
    } else {
      if (!req.session.cartId) {
        return res.json({ items: [] });
      }
      cart = await Cart.findByIdAndUpdate(
        req.session.cartId,
        { $pull: { items: { productId: req.params.productId } } },
        { new: true }
      ).populate('items.productId');
    }

    const formattedItems = cart ? cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    })) : [];

    res.json({ items: formattedItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Очистить корзину
router.delete('/clear', async (req, res) => {
  try {
    if (req.user) {
      await Cart.findOneAndDelete({ userId: req.user._id });
    } else if (req.session.cartId) {
      await Cart.findByIdAndDelete(req.session.cartId);
      req.session.cartId = null;
    }
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;