import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from "../../components/Header/Header";
import { categories } from '../../data/categories';
import { CategoryCard } from '../../components/CategoryCard/CategoryCard';
import './Home.css';

export function Home() {
    const location = useLocation();
    
    useEffect(() => {
        document.title = "Каталог | YG Bikes";
    }, [location]);

    return (
        <div className="home-page">
        <Header />
            <h1 className="catalog-title">Каталог велосипедов</h1>
            <div className="categories-grid">
                {categories.map((category, index) => (
                    <CategoryCard 
                        key={index}
                        title={category.title}
                        imageUrl={category.imageUrl}
                    />
                ))}
            </div>
        </div>
    );
}