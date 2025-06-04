import { useState } from 'react';
import { useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import './Account.css';

export function Account() {
  const location = useLocation();

  // Функция для определения активной вкладки
  const isActiveTab = (path) => {
    return location.pathname === '/account' && path === 'profile' 
      || location.pathname.includes(path);
  };

  useEffect(() => {
      document.title = "Личный кабинет | YG Bikes";
  }, [location]);

  return (
    <>
        <Header />
        <div className="account-page">
            <div className="account-container">
                <h1 className="account-title">Личный кабинет</h1>
                
                <div className="account-tabs">
                    <NavLink 
                        to="profile" 
                        className={`account-tab ${isActiveTab('profile') ? 'active-tab' : ''}`}
                    >
                        Мои данные
                    </NavLink>
                    <NavLink 
                        to="orders" 
                        className={`account-tab ${isActiveTab('orders') ? 'active-tab' : ''}`}
                    >
                        Мои заказы
                    </NavLink>
                </div>

                <div className="account-content">
                    <Outlet />
                </div>
            </div>
        </div>
    </>
  );
}