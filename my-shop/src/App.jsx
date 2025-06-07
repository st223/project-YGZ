import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { CategoryPage } from "./pages/CategoryPage/CategoryPage";
import { CartPage } from './pages/CartPage/CartPage';
import { Account } from './pages/Account/Account';
import { ProfileTab } from './pages/Account/ProfileTab';
import { OrdersTab } from './pages/Account/OrdersTab';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<Account />}>
            <Route index element={<ProfileTab />} />
            <Route path="profile" element={<ProfileTab />} />
            <Route path="orders" element={<OrdersTab />} />
          </Route>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
