import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';

export function Header() {
    const location = useLocation();
    const { cart } = useCart();

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

                <NavLink
                    to="/account"
                    className={({ isActive }) => 
                        `nav-link ${isActive ? 'active-link' : ''}`
                    }
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M20 22C20 17.5817 16.4183 14 12 14C7.58172 14 4 17.5817 4 22" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </NavLink>
            </nav>
        </header>
    );
}