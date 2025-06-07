import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '../components/Header/Header';
import './AuthForms.css';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения');
    }
  };

  return (
    <>
      <Header />
      <div className="auth-page">
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Регистрация</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="auth-button">
                Зарегистрироваться
              </button>
            </form>
            <p className="auth-link">
              Уже есть аккаунт? <a href="/login">Войти</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}