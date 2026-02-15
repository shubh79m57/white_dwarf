import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import furnitureData, { categories } from '../data/furnitureData.js';
import ProductCard from '../components/ProductCard.jsx';

export default function CatalogPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        let items = furnitureData;

        if (activeCategory !== 'All') {
            items = items.filter(item => item.category === activeCategory);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.tags.some(t => t.includes(q))
            );
        }

        return items;
    }, [activeCategory, searchQuery]);

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        if (cat === 'All') {
            searchParams.delete('category');
        } else {
            searchParams.set('category', cat);
        }
        setSearchParams(searchParams);
    };

    return (
        <div className="catalog-page">
            {/* Header */}
            <div className="catalog-header">
                <div>
                    <h1 className="catalog-title">Furniture Collection</h1>
                    <p className="catalog-subtitle">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                        {activeCategory !== 'All' && ` in ${activeCategory}`}
                    </p>
                </div>
                <Link to="/studio" className="btn btn-primary" id="catalog-design-btn">
                    ✦ Design New
                </Link>
            </div>

            {/* Filters */}
            <div className="catalog-filters">
                <div className="category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                            id={`filter-${cat.toLowerCase()}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search furniture..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        id="catalog-search"
                    />
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="product-grid">
                    {filteredProducts.map((item, i) => (
                        <ProductCard key={item.id} product={item} index={i} />
                    ))}
                </div>
            ) : (
                <div className="empty-catalog">
                    <div className="empty-icon">🔍</div>
                    <h3>No furniture found</h3>
                    <p>Try a different category or search term</p>
                    <button className="btn" onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}>
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
