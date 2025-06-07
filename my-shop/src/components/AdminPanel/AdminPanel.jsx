import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

export function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    specs: '',
    image: '',
    category: 'bmx'
  });

  // Получение списка продуктов
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      
      // Гарантируем, что получили массив (даже если бэкенд возвращает объект)
      const receivedProducts = Array.isArray(response.data) 
        ? response.data 
        : response.data?.products || [];
      
      setProducts(receivedProducts);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProducts([]); // В случае ошибки устанавливаем пустой массив
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData);
      await fetchProducts(); // Обновляем список после добавления
      setFormData({
        name: '',
        price: '',
        specs: '',
        image: '',
        category: 'bmx'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      await fetchProducts(); // Обновляем список после удаления
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="admin-panel">
      <h1>Админ-панель</h1>
      
      <h2>Добавить велосипед</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Название"
          required
        />
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Цена"
          required
        />
        <textarea
          name="specs"
          value={formData.specs}
          onChange={handleInputChange}
          placeholder="Характеристики"
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleInputChange}
          placeholder="URL изображения"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="bmx">BMX</option>
          <option value="mtb">MTB</option>
          <option value="road">Шоссейные</option>
          <option value="city">Городские</option>
        </select>
        <button type="submit">Добавить</button>
      </form>

      <h2>Список велосипедов ({products.length})</h2>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} className="product-item">
              <h3>{product.name}</h3>
              <p>{product.price} ₽</p>
              <p>{product.category}</p>
              <button 
                onClick={() => deleteProduct(product._id)}
                className="delete-btn"
              >
                Удалить
              </button>
            </div>
          ))
        ) : (
          <p>Нет добавленных велосипедов</p>
        )}
      </div>
    </div>
  );
}