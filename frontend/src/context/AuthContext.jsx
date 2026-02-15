import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'wd_user';

function loadUser() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadUser);

    useEffect(() => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [user]);

    const login = (userData) => {
        // Mock auth — in production this would hit the backend
        setUser({
            name: userData.name || userData.email.split('@')[0],
            email: userData.email,
            avatar: userData.name ? userData.name[0].toUpperCase() : userData.email[0].toUpperCase(),
        });
    };

    const signup = (userData) => {
        setUser({
            name: userData.name,
            email: userData.email,
            avatar: userData.name[0].toUpperCase(),
        });
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn: !!user,
            login,
            signup,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
