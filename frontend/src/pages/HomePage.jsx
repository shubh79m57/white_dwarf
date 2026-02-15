import React from 'react';
import { Link } from 'react-router-dom';
import furnitureData, { categories } from '../data/furnitureData.js';

const categoryIcons = {
    Chairs: '🪑',
    Tables: '🍽️',
    Sofas: '🛋️',
    Storage: '📚',
    Lighting: '💡',
    Decor: '🏺',
};

const steps = [
    { icon: '🔍', title: 'Browse & Discover', desc: 'Explore our curated collection of premium furniture designs' },
    { icon: '✨', title: 'Customize with AI', desc: 'Modify any piece or generate entirely new designs with AI' },
    { icon: '📱', title: 'Preview in AR', desc: 'See your furniture in your space with QR-powered AR viewing' },
];

export default function HomePage() {
    const featured = furnitureData.slice(0, 4);
    const displayCategories = categories.filter(c => c !== 'All');

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-glow" />
                <div className="hero-content">
                    <span className="hero-badge">✦ AI-Powered Furniture Design</span>
                    <h1 className="hero-title">
                        Design Your <span className="gradient-text">Dream Space</span>
                    </h1>
                    <p className="hero-desc">
                        Browse premium furniture, customize with AI, and preview in augmented reality.
                        From concept to your living room — powered by next-gen 3D technology.
                    </p>
                    <div className="hero-actions">
                        <Link to="/catalog" className="btn btn-primary btn-lg" id="browse-catalog-btn">
                            🛍️ Browse Catalog
                        </Link>
                        <Link to="/studio" className="btn btn-lg" id="design-own-btn">
                            ✦ Design Your Own
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-value">50+</div>
                            <div className="hero-stat-label">Designs</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <div className="hero-stat-value">AI</div>
                            <div className="hero-stat-label">Powered</div>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <div className="hero-stat-value">AR</div>
                            <div className="hero-stat-label">Preview</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="home-section">
                <h2 className="section-title">Shop by Category</h2>
                <div className="category-grid">
                    {displayCategories.map(cat => (
                        <Link
                            key={cat}
                            to={`/catalog?category=${cat}`}
                            className="category-card glass-card"
                            id={`cat-${cat.toLowerCase()}`}
                        >
                            <span className="category-icon">{categoryIcons[cat]}</span>
                            <span className="category-name">{cat}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="home-section">
                <h2 className="section-title">How It Works</h2>
                <div className="steps-grid">
                    {steps.map((step, i) => (
                        <div key={i} className="step-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="step-number">{i + 1}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="home-section">
                <div className="section-header">
                    <h2 className="section-title">Featured Pieces</h2>
                    <Link to="/catalog" className="section-link">View all →</Link>
                </div>
                <div className="featured-grid">
                    {featured.map(item => (
                        <Link key={item.id} to={`/catalog/${item.id}`} className="featured-card glass-card" id={`featured-${item.id}`}>
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

            {/* CTA Banner */}
            <section className="cta-banner glass-card">
                <div className="cta-content">
                    <h2 className="cta-title">Can't find what you're looking for?</h2>
                    <p className="cta-desc">
                        Describe your dream furniture and our AI will generate a custom 3D design for you — complete with physics validation and AR preview.
                    </p>
                    <Link to="/studio" className="btn btn-primary btn-lg" id="cta-design-btn">
                        ✦ Start Designing
                    </Link>
                </div>
            </section>
        </div>
    );
}
