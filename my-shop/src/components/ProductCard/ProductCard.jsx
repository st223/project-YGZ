import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity } = useCart();
  
  const cartItem = cart.find(item => item.id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => addToCart(product);
  const handleIncrement = () => updateQuantity(product._id, quantity + 1);
  const handleDecrement = () => updateQuantity(product._id, quantity - 1);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-specs">{product.specs}</p>
        <p className="product-price">{product.price.toLocaleString()} ₽</p>
        
        {quantity > 0 ? (
          <div className="quantity-control-rect">
            <button className="quantity-btn-rect minus" onClick={handleDecrement}>-</button>
            <span className="quantity-value-rect">{quantity}</span>
            <button className="quantity-btn-rect plus" onClick={handleIncrement}>+</button>
          </div>
        ) : (
          <button className="product-button" onClick={handleAdd}>
            В корзину
          </button>
        )}
      </div>
    </div>
  );
}