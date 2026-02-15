import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ isOpen, onClose }) {
    const { login, signup } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!form.email || !form.password) {
            setError('Please fill in all required fields');
            return;
        }

        if (mode === 'signup' && !form.name) {
            setError('Please enter your name');
            return;
        }

        if (mode === 'login') {
            login({ email: form.email });
        } else {
            signup({ name: form.name, email: form.email });
        }
        setForm({ name: '', email: '', password: '' });
        onClose();
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-header">
                    <h2 className="modal-title">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="modal-subtitle">
                        {mode === 'login'
                            ? 'Sign in to your White Dwarf account'
                            : 'Join White Dwarf for the best experience'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="auth-tabs">
                    <button
                        className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                        onClick={() => { setMode('login'); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
                        onClick={() => { setMode('signup'); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'signup' && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                        />
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <button type="submit" className="btn btn-primary btn-lg btn-full">
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                    {' '}
                    <button className="auth-switch-btn" onClick={switchMode}>
                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
}
