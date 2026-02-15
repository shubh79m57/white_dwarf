import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDwarf } from '../context/DwarfContext';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';
import DwarfChatWidget from './DwarfChatWidget';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/catalog', label: 'Catalog' },
    { path: '/studio', label: 'AI Studio' },
];

export default function Layout({ children }) {
    const location = useLocation();
    const { cartCount } = useCart();
    const { user, isLoggedIn, logout } = useAuth();
    const { dwarf, chatOpen, setChatOpen } = useDwarf();

    const [loginOpen, setLoginOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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
                    <span className="logo-text">White Dwarf</span>
                </Link>

                <nav className="main-nav">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                            id={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                        >
                            <span className="nav-label">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Login + Cart + Dwarf */}
                <div className="header-right">
                    {/* Dwarf Chat Icon */}
                    {dwarf.hasGreeted && (
                        <button
                            className={`header-icon-btn dwarf-btn ${chatOpen ? 'active' : ''}`}
                            onClick={() => setChatOpen(!chatOpen)}
                            title={dwarf.name ? `Chat with ${dwarf.name}` : 'Chat with your Dwarf'}
                        >
                            <div className="dwarf-avatar-sm">
                                {dwarf.name ? dwarf.avatar : '✦'}
                            </div>
                        </button>
                    )}

                    {/* User */}
                    {isLoggedIn ? (
                        <div className="user-menu-wrapper">
                            <button
                                className="header-icon-btn user-avatar-btn"
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                id="user-menu-btn"
                            >
                                <span className="user-avatar">{user.avatar}</span>
                            </button>
                            {userMenuOpen && (
                                <div className="user-dropdown" onMouseLeave={() => setUserMenuOpen(false)}>
                                    <div className="dropdown-header">
                                        <div className="dropdown-avatar">{user.avatar}</div>
                                        <div>
                                            <div className="dropdown-name">{user.name}</div>
                                            <div className="dropdown-email">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                                        My Orders
                                    </button>
                                    <button className="dropdown-item" onClick={() => { setUserMenuOpen(false); }}>
                                        Settings
                                    </button>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item dropdown-logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="header-icon-btn"
                            onClick={() => setLoginOpen(true)}
                            id="login-btn"
                            title="Sign in"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                    )}

                    {/* Cart */}
                    <button
                        className="header-icon-btn cart-btn"
                        onClick={() => setCartOpen(true)}
                        id="cart-btn"
                        title="Cart"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="cart-badge">{cartCount}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* LoginModal */}
            <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

            {/* CartDrawer */}
            <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            {/* DwarfChatWidget */}
            <DwarfChatWidget />

            {/* Main Content */}
            <div className="page-content">
                {children}
            </div>

            {/* Footer */}
            <footer className="app-footer">
                <div className="footer-inner">
                    <span className="footer-brand">White Dwarf</span>
                    <span className="footer-text">AI-Powered Furniture Design · © 2026</span>
                </div>
            </footer>
        </div>
    );
}
