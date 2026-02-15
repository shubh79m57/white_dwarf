import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'wd_cart';

function loadCart() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.find(i => i.id === action.payload.id);
            if (existing) {
                return state.map(i =>
                    i.id === action.payload.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE_ITEM':
            return state.filter(i => i.id !== action.payload);
        case 'UPDATE_QTY':
            if (action.payload.quantity <= 0) {
                return state.filter(i => i.id !== action.payload.id);
            }
            return state.map(i =>
                i.id === action.payload.id
                    ? { ...i, quantity: action.payload.quantity }
                    : i
            );
        case 'CLEAR_CART':
            return [];
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [cartItems, dispatch] = useReducer(cartReducer, [], loadCart);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
    const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems, cartCount, cartTotal,
            addToCart, removeFromCart, updateQuantity, clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
