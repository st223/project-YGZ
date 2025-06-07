import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '../components/Header/Header';
import './AuthForms.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/account');
      } else {
        setError(data.error || 'Ошибка входа');
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
            <h2>Вход</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
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
                Войти
              </button>
            </form>
            <p className="auth-link">
              Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}