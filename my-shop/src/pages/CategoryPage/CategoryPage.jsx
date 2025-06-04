import { useParams } from 'react-router-dom';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { categories } from '../../data/categories'; // Импортируем данные
import { Header } from '../../components/Header/Header';
import './CategoryPage.css';

export function CategoryPage() {
  const { categoryId } = useParams();
  const category = categories.find(cat => cat.title.toLowerCase() === categoryId);
  
  return (
    <div className="category-page">
      <Header />
      <h1 className="category-header">{category.title}</h1>
      <div className="products-container">
        {category.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}