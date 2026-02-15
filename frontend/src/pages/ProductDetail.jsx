import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import furnitureData from '../data/furnitureData.js';

const categoryIcons = {
    Chairs: '🪑',
    Tables: '🍽️',
    Sofas: '🛋️',
    Storage: '📚',
    Lighting: '💡',
    Decor: '🏺',
};

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = furnitureData.find(p => p.id === id);

    if (!product) {
        return (
            <div className="product-detail-page">
                <div className="detail-not-found glass-card">
                    <div style={{ fontSize: '3rem' }}>😕</div>
                    <h2>Product not found</h2>
                    <Link to="/catalog" className="btn btn-primary">← Back to Catalog</Link>
                </div>
            </div>
        );
    }

    // Get related products from the same category
    const related = furnitureData
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);

    const handleCustomize = () => {
        navigate(`/studio?prompt=${encodeURIComponent(product.modelPrompt)}&mode=customize`);
    };

    const handleGenerateSimilar = () => {
        const similarPrompt = `Similar to ${product.name} but with a unique twist: ${product.modelPrompt}`;
        navigate(`/studio?prompt=${encodeURIComponent(similarPrompt)}&mode=similar`);
    };

    return (
        <div className="product-detail-page">
            {/* Breadcrumb */}
            <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to="/catalog">Catalog</Link>
                <span className="breadcrumb-sep">›</span>
                <Link to={`/catalog?category=${product.category}`}>{product.category}</Link>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-current">{product.name}</span>
            </nav>

            <div className="detail-layout">
                {/* Product Image / 3D Preview Area */}
                <div className="detail-viewer glass-card">
                    <div className="detail-img" data-category={product.category}>
                        <span className="detail-emoji">{categoryIcons[product.category]}</span>
                    </div>
                    <div className="detail-img-badge">
                        <span className="badge-rotate">🔄</span> 3D Preview Available
                    </div>
                </div>

                {/* Product Info */}
                <div className="detail-info">
                    <div className="detail-meta">
                        <span className="detail-category-badge">{product.category}</span>
                        {product.tags.map(t => (
                            <span key={t} className="detail-tag">#{t}</span>
                        ))}
                    </div>

                    <h1 className="detail-name">{product.name}</h1>
                    <div className="detail-price">${product.price.toLocaleString()}</div>
                    <p className="detail-desc">{product.description}</p>

                    {/* Specifications */}
                    <div className="detail-specs glass-card">
                        <h3 className="specs-title">Design Details</h3>
                        <div className="specs-grid">
                            <div className="spec-item">
                                <span className="spec-label">Category</span>
                                <span className="spec-value">{product.category}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Style</span>
                                <span className="spec-value">{product.tags[product.tags.length - 1]}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Material</span>
                                <span className="spec-value">{product.tags[0]}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">AI Ready</span>
                                <span className="spec-value" style={{ color: 'var(--success)' }}>✓ Yes</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="detail-actions">
                        <button
                            className="btn btn-primary btn-lg btn-full"
                            onClick={handleCustomize}
                            id="customize-btn"
                        >
                            ✨ Customize This Design
                        </button>
                        <button
                            className="btn btn-lg btn-full"
                            onClick={handleGenerateSimilar}
                            id="similar-btn"
                        >
                            🔄 Generate Similar
                        </button>
                        <Link
                            to="/studio"
                            className="btn btn-lg btn-full"
                            id="design-new-btn"
                            style={{ textDecoration: 'none', textAlign: 'center' }}
                        >
                            ✦ Design Something New
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="home-section" style={{ marginTop: 'var(--space-2xl)' }}>
                    <div className="section-header">
                        <h2 className="section-title">Related Pieces</h2>
                        <Link to={`/catalog?category=${product.category}`} className="section-link">
                            View all {product.category} →
                        </Link>
                    </div>
                    <div className="featured-grid" style={{ gridTemplateColumns: `repeat(${related.length}, 1fr)` }}>
                        {related.map(item => (
                            <Link key={item.id} to={`/catalog/${item.id}`} className="featured-card glass-card">
                                <div className="featured-img" data-category={item.category}>
                                    <span className="featured-emoji">{categoryIcons[item.category]}</span>
                                </div>
                                <div className="featured-info">
                                    <span className="featured-category">{item.category}</span>
                                    <h3 className="featured-name">{item.name}</h3>
                                    <div className="featured-price">${item.price.toLocaleString()}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
