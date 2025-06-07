import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { Header } from '../../components/Header/Header';
import './CategoryPage.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

export function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Загружаем продукты по категории
        const response = await axios.get(`http://localhost:5000/api/products/category/${categoryId}`);
        setProducts(response.data);
        
        // Устанавливаем заголовок категории (можно адаптировать под вашу логику)
        setCategoryTitle(categoryId.charAt(0).toUpperCase() + categoryId.slice(1));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="category-page">
      <Header />
      <h1 className="category-header">{categoryTitle}</h1>
      <div className="products-container">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>В этой категории пока нет товаров</p>
        )}
      </div>
    </div>
  );
}