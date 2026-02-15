import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import furnitureData from '../data/furnitureData';

const categories = [
    { name: 'Chairs', icon: '🪑', count: 2 },
    { name: 'Tables', icon: '🪵', count: 3 },
    { name: 'Sofas', icon: '🛋️', count: 2 },
    { name: 'Storage', icon: '📦', count: 2 },
    { name: 'Lighting', icon: '💡', count: 2 },
    { name: 'Decor', icon: '🏺', count: 1 },
];

const emojiMap = {
    'nordic-chair': '🪑',
    'glass-coffee-table': '☕',
    'velvet-sofa': '🛋️',
    'modular-shelf': '📐',
    'pendant-light': '💡',
    'dining-table': '🍽️',
    'accent-chair': '💺',
    'floor-lamp': '🏮',
    'sectional-sofa': '🛌',
    'ceramic-vase': '🏺',
    'console-table': '🪞',
    'bookcase': '📚',
};

export default function HomePage() {
    const navigate = useNavigate();
    const featured = furnitureData.slice(0, 4);

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-badge">AI-Powered Design</span>
                    <h1 className="hero-title">
                        Design Your<br /> Dream Space
                    </h1>
                    <p className="hero-desc">
                        Browse curated furniture, customize with AI, and preview in augmented reality — all in one place.
                    </p>
                    <div className="hero-actions">
                        <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>
                            Browse Catalog
                        </button>
                        <button className="btn btn-lg" onClick={() => navigate('/studio')}>
                            Design Something New
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">12+</div>
                            <div className="hero-stat-label">Curated pieces</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <div className="hero-stat-value">AI</div>
                            <div className="hero-stat-label">Powered design</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <div className="hero-stat-value">AR</div>
                            <div className="hero-stat-label">Preview ready</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Shop by Category</h2>
                    <Link to="/catalog" className="section-link">View all →</Link>
                </div>
                <div className="category-grid">
                    {categories.map(cat => (
                        <div
                            key={cat.name}
                            className="category-card"
                            onClick={() => navigate(`/catalog?category=${cat.name}`)}
                        >
                            <span className="category-icon">{cat.icon}</span>
                            <span className="category-name">{cat.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="home-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <div className="step-icon">🔍</div>
                        <h3 className="step-title">Browse & Choose</h3>
                        <p className="step-desc">Explore our curated collection of premium furniture designs.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <div className="step-icon">✨</div>
                        <h3 className="step-title">Customize with AI</h3>
                        <p className="step-desc">Modify colors, materials, and styles using AI-powered generation.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">3</span>
                        <div className="step-icon">📱</div>
                        <h3 className="step-title">Preview in AR</h3>
                        <p className="step-desc">See your custom piece in your room through augmented reality.</p>
                    </div>
                </div>
            </section>

            {/* Featured */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Featured Pieces</h2>
                    <Link to="/catalog" className="section-link">See all →</Link>
                </div>
                <div className="featured-grid">
                    {featured.map(item => (
                        <Link
                            key={item.id}
                            to={`/catalog/${item.id}`}
                            className="featured-card"
                        >
                            <div className="featured-img" data-category={item.category}>
                                <span className="featured-emoji">{emojiMap[item.id] || '🪑'}</span>
                            </div>
                            <div className="featured-info">
                                <div className="featured-category">{item.category}</div>
                                <div className="featured-name">{item.name}</div>
                                <div className="featured-price">${item.price.toLocaleString()}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="cta-banner">
                <h2 className="cta-title">Have something unique in mind?</h2>
                <p className="cta-desc">
                    Describe your ideal furniture piece and let our AI bring it to life in 3D.
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/studio')}>
                    Open AI Studio
                </button>
            </section>
        </div>
    );
}
