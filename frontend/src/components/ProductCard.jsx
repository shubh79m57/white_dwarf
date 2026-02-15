import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categoryIcons = {
    Chairs: '🪑',
    Tables: '🍽️',
    Sofas: '🛋️',
    Storage: '📚',
    Lighting: '💡',
    Decor: '🏺',
};

export default function ProductCard({ product, index }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <Link
            to={`/catalog/${product.id}`}
            className="product-card"
            style={{ animationDelay: `${index * 0.05}s` }}
            id={`product-${product.id}`}
        >
            <div className="product-img" data-category={product.category}>
                <span className="product-emoji">{categoryIcons[product.category] || '🪑'}</span>
                <div className="product-overlay">
                    <span className="product-view-btn">View Details →</span>
                </div>
            </div>
            <div className="product-info">
                <span className="product-category-badge">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description.substring(0, 80)}...</p>
                <div className="product-footer">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                    <button
                        className={`add-to-cart-btn ${added ? 'added' : ''}`}
                        onClick={handleAddToCart}
                        id={`add-cart-${product.id}`}
                    >
                        {added ? '✓ Added' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
