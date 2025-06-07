import { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

export function Header() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        // Проверяем валидность токена на сервере
        await axios.get('/api/auth/check', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsLoggedIn(true);
      } catch (err) {
        // Если токен невалидный, удаляем его
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    } finally {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/login');
    }
  };

  if (isLoading) {
    return <header className="header">Загрузка...</header>;
  }

  return (
    <header className="header">
      <div className="logo">
        <span className="logo-part-1">YG</span>
        <span className="logo-part-2">Bikes</span>
      </div>
      
      <nav className="nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active-link' : ''}`
          }
        >
          Каталог
        </NavLink>
        
        <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            `nav-link ${isActive ? 'active-link' : ''}`
          }
        >
          Корзина {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </NavLink>

        {isLoggedIn ? (
          <div className="user-section">
            <div className="user-avatar" onClick={() => navigate('/account')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        ) : (
          <button className="login-button" onClick={() => navigate('/login')}>
            Войти
          </button>
        )}
      </nav>
    </header>
  );
}