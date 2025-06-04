import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

export function CategoryCard({ title, imageUrl }) {
    const navigate = useNavigate();

    return (
        <div 
            className="category-card"
            onClick={() => navigate(`/category/${title.toLowerCase()}`)}
        >
            <img src={imageUrl} alt={title} className="category-image" />
            <h3 className="category-title">{title}</h3>
        </div>
    );
}