import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import axios from 'axios';
import './CartPage.css';

export function CartPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cart, 
    isLoading, 
    error,
    removeFromCart, 
    updateQuantity, 
    total, 
    clearCart,
    bounce,
    fetchCart
  } = useCart();
  
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    document.title = "Корзина | YG Bikes";
    if (error) setLocalError(error);
  }, [location, error]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    setLocalError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/cart', {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total
      }, { withCredentials: true });

      await clearCart();
      setOrderNumber(response.data.orderNumber);
      setIsOrderSuccess(true);
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      setLocalError(err.response?.data?.message || 'Ошибка при оформлении заказа');
      await fetchCart();
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsOrderSuccess(false);
    navigate('/account/orders');
  };

  if (isLoading) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-loading">Загрузка корзины...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="cart-page">
        <h1 className="cart-title">Корзина</h1>
        
        {localError && (
          <div className="cart-error">
            {localError}
            <button onClick={() => setLocalError(null)}>×</button>
          </div>
        )}
        
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>{isOrderSuccess ? 'Заказ успешно оформлен!' : 'Ваша корзина пуста'}</p>
            <NavLink to="/" className="cart-continue-shopping">
              Вернуться к покупкам
            </NavLink>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={`${item.id}-${item.quantity}`} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-price">
                      {item.price.toLocaleString()} ₽ × {item.quantity} = 
                      <span className="item-total">
                        {(item.price * item.quantity).toLocaleString()} ₽
                      </span>
                    </p>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="remove-button"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="cart-total">
                <span>Итого:</span>
                <span>{total.toLocaleString()} ₽</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
                className={`checkout-button ${bounce ? 'bounce-effect' : ''}`}
              >
                {isProcessing ? 'Оформление...' : 'Оформить заказ'}
              </button>
            </div>
          </>
        )}

        {isOrderSuccess && (
          <div className="modal-overlay">
            <div className="order-success-modal">
              <div className="success-icon">✓</div>
              <h2>Заказ оформлен!</h2>
              <p>Номер заказа: #{orderNumber}</p>
              <div className="modal-actions">
                <button onClick={closeModal} className="modal-button">
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 