import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bounce, setBounce] = useState(false);

  // Загрузка корзины с сервера при монтировании
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/cart');
      setCart(response.data.items || []);
    } catch (err) {
      console.error('Ошибка загрузки корзины:', err);
      setError('Не удалось загрузить корзину');
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Эффект для анимации bounce
  useEffect(() => {
    if (cart.length > 0) {
      setBounce(true);
      const timer = setTimeout(() => setBounce(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cart.length]);

  const syncWithServer = async (updatedCart) => {
    try {
      await axios.put('/api/cart', { items: updatedCart });
    } catch (err) {
      console.error('Ошибка синхронизации корзины:', err);
      throw err;
    }
  };

  const addToCart = async (product) => {
    try {
      const updatedCart = [...cart];
      const existingItem = updatedCart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        updatedCart.push({ ...product, quantity: 1 });
      }

      setCart(updatedCart);
      await syncWithServer(updatedCart);
    } catch (err) {
      console.error('Ошибка добавления в корзину:', err);
      await fetchCart(); // Восстанавливаем актуальное состояние
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      await axios.delete(`/api/cart/${productId}`);
    } catch (err) {
      console.error('Ошибка удаления из корзины:', err);
      await fetchCart();
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    
    try {
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      );
      
      setCart(updatedCart);
      await axios.put(`/api/cart/${productId}`, { quantity });
    } catch (err) {
      console.error('Ошибка обновления количества:', err);
      await fetchCart();
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart/clear');
      setCart([]);
    } catch (err) {
      console.error('Ошибка очистки корзины:', err);
      throw err;
    }
  };

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