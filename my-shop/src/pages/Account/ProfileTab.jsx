import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css';

export function ProfileTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });
        
        // Проверяем, что ответ содержит данные профиля
        if (!response.data) {
          throw new Error('Профиль не найден в ответе сервера');
        }
        
        setProfile(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response?.data?.error || err.message || 'Не удалось загрузить профиль');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/profile/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при выходе');
    }
  };

  if (loading) return <div className="loading">Загрузка профиля...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="error">Профиль не найден</div>;

  // Добавляем проверку на существование нужных полей
  return (
    <div className="profile-tab">
      <div className="profile-section">
        <h2>Личные данные</h2>
        <div className="profile-field">
          <label>ФИО:</label>
          <p>{profile?.fullName || 'Не указано'}</p>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <p>{profile?.email || 'Не указан'}</p>
        </div>
        {profile?.phone && (
          <div className="profile-field">
            <label>Телефон:</label>
            <p>{profile.phone}</p>
          </div>
        )}
        {profile?.address && (
          <div className="profile-field">
            <label>Адрес:</label>
            <p>{profile.address}</p>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h2>Последние заказы</h2>
        {profile?.recentOrders?.length > 0 ? (
          <ul className="orders-list">
            {profile.recentOrders.map(order => (
              <li key={order._id}>
                <div>Заказ #{order._id.slice(-6)}</div>
                <div>Сумма: {order.totalPrice} ₽</div>
                <div>Статус: {order.status}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>У вас пока нет заказов</p>
        )}
      </div>

      <button className="logout-button" onClick={handleLogout}>
        Выйти из системы
      </button>
    </div>
  );
}