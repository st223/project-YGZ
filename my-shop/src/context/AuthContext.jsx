// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/check', { 
          withCredentials: true 
        });
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials, {
        withCredentials: true
      });
      setUser(response.data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка выхода');
      return false;
    }
  };

  // Функция регистрации
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/register', userData, {
        withCredentials: true
      });
      setUser(response.data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Кастомный хук для удобного использования
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}