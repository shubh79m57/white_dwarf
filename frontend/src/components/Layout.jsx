import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/catalog', label: 'Catalog', icon: '🛍️' },
    { path: '/studio', label: 'AI Studio', icon: '✦' },
];

export default function Layout({ children }) {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="app-shell">
            {/* Header / Navigation */}
            <header className="app-header">
                <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                    <div className="logo-icon">✦</div>
                    <span className="logo-text gradient-text">White Dwarf</span>
                </Link>

                <nav className="main-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            id={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                        >
                            <span className="nav-icon">{link.icon}</span>
                            <span className="nav-label">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="header-badge">AI · 3D · AR</div>
            </header>

            {/* Main Content */}
            <div className="page-content">
                {children}
            </div>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-inner">
                    <span className="footer-brand gradient-text">White Dwarf</span>
                    <span className="footer-text">AI-Powered Furniture Design · © 2026</span>
                </div>
            </footer>
        </div>
    );
}
