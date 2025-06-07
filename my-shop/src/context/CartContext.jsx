import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bounce, setBounce] = useState(false);
  const [cartId, setCartId] = useState(null); // Добавляем cartId в состояние

  // Загрузка корзины с сервера
  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: cartId ? { 'x-cart-id': cartId } : {} // Отправляем cartId если есть
      });
      setCart(response.data.items || []);
      // Сохраняем cartId из ответа (для гостей)
      if (response.data.cartId) {
        setCartId(response.data.cartId);
      }
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      setError('Не удалось загрузить корзину');
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Анимация
  useEffect(() => {
    if (cart.length > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  // Синхронизация с сервером
  const syncWithServer = async (updatedCart) => {
    try {
      await axios.put('http://localhost:5000/api/cart', 
        { 
          items: updatedCart.map(item => ({
            id: item.id, // Отправляем только ID!
            quantity: item.quantity
          }))
        },
        {
          headers: cartId ? { 'x-cart-id': cartId } : {}
        }
      );
    } catch (err) {
      console.error('Ошибка синхронизации корзины:', err);
      throw err;
    }
  };

  // Добавление товара
  const addToCart = async (product) => {
    try {
      const existingItem = cart.find(item => item.id === product._id);
      const updatedCart = existingItem
        ? cart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...cart, { 
            id: product._id, 
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1 
          }];

      setCart(updatedCart);
      await syncWithServer(updatedCart);
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      await fetchCart();
      throw err;
    }
  };

  // Удаление товара
  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: cartId ? { 'x-cart-id': cartId } : {}
      });
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
      await fetchCart();
      throw err;
    }
  };

  // Обновление количества
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    
    try {
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      
      setCart(updatedCart);
      await syncWithServer(updatedCart);
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      await fetchCart();
      throw err;
    }
  };

  // Очистка корзины
  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: cartId ? { 'x-cart-id': cartId } : {}
      });
      setCart([]);
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
      throw err;
    }
  };

  // Вычисляемые значения
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        cartCount,
        bounce,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}