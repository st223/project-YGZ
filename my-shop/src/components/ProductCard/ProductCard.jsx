import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  return (
    <div className="product-card">
      <img 
        src={product.image} 
        alt={product.name} 
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-specs">{product.specs}</p>
        <p className="product-price">{product.price.toLocaleString()} ₽</p>
        <button 
          className="product-button"
          onClick={() => addToCart(product)}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}