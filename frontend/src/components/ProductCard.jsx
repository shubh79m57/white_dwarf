import React from 'react';
import { Link } from 'react-router-dom';

const categoryIcons = {
    Chairs: '🪑',
    Tables: '🍽️',
    Sofas: '🛋️',
    Storage: '📚',
    Lighting: '💡',
    Decor: '🏺',
};

export default function ProductCard({ product, index }) {
    return (
        <Link
            to={`/catalog/${product.id}`}
            className="product-card glass-card"
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
                    <span className="product-tags">
                        {product.tags.slice(0, 2).map(t => (
                            <span key={t} className="product-tag">#{t}</span>
                        ))}
                    </span>
                </div>
            </div>
        </Link>
    );
}
