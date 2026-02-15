import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="app-shell">
            {/* Header */}
            <header className="app-header">
                <div className="logo">
                    <div className="logo-icon">✦</div>
                    <span className="logo-text gradient-text">White Dwarf</span>
                </div>
                <div className="header-badge">AI · 3D · VR</div>
            </header>

            {/* Main Content */}
            {children}
        </div>
    );
}
