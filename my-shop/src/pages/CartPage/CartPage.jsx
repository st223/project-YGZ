import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { NavLink, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import './CartPage.css';

export function CartPage() {
  const location = useLocation();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    total, 
    clearCart,
    bounce
  } = useCart();
  
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = "Корзина | YG Bikes";
  }, [location]);

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Здесь будет реальный запрос к API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки
    setIsOrderSuccess(true);
    clearCart();
    setIsProcessing(false);
  };

  const closeModal = () => {
    setIsOrderSuccess(false);
  };

  return (
    <>
      <Header />
      <div className="cart-page">
        <h1 className="cart-title">Корзина</h1>
        
        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Ваша корзина пуста</p>
            <NavLink to="/" className="cart-continue-shopping">
              Вернуться к покупкам
            </NavLink>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details">
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                      <p className="cart-item-specs">{item.specs}</p>
                      <p className="cart-item-price">
                        {item.price.toLocaleString()} ₽ × {item.quantity} = 
                        <span className="item-total">
                          {(item.price * item.quantity).toLocaleString()} ₽
                        </span>
                      </p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-control">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="quantity-btn"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          className="cart-item-quantity"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="cart-item-remove"
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
                className={`checkout-button ${bounce ? 'bounce-effect' : ''}`}
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? 'Оформляем заказ...' : 'Оформить заказ'}
              </button>
            </div>
          </>
        )}

        {isOrderSuccess && (
          <div className="modal-overlay">
            <div className="order-success-modal">
              <div className="success-icon">✓</div>
              <h2>Заказ успешно оформлен!</h2>
              <p>Спасибо за покупку в YG Bikes!</p>
              <p>Номер вашего заказа: #{Math.floor(Math.random() * 1000000)}</p>
              <div className="modal-actions">
                <NavLink 
                  to="/" 
                  className="modal-button"
                  onClick={closeModal}
                >
                  Вернуться в магазин
                </NavLink>
                <NavLink 
                  to="/account/orders" 
                  className="modal-button primary"
                  onClick={closeModal}
                >
                  Мои заказы
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}