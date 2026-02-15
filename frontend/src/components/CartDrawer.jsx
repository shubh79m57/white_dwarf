import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const categoryIcons = {
    Chairs: '🪑', Tables: '🍽️', Sofas: '🛋️',
    Storage: '📚', Lighting: '💡', Decor: '🏺',
};

export default function CartDrawer({ isOpen, onClose }) {
    const { cartItems, cartTotal, cartCount, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`drawer-backdrop ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="drawer-header">
                    <h3 className="drawer-title">Your Cart ({cartCount})</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {cartItems.length === 0 ? (
                    <div className="drawer-empty">
                        <div className="drawer-empty-icon">🛒</div>
                        <p>Your cart is empty</p>
                        <button className="btn btn-primary" onClick={() => { onClose(); navigate('/catalog'); }}>
                            Browse Catalog
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="drawer-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-img">
                                        <span>{categoryIcons[item.category] || '🪑'}</span>
                                    </div>
                                    <div className="cart-item-info">
                                        <div className="cart-item-name">{item.name}</div>
                                        <div className="cart-item-price">${item.price.toLocaleString()}</div>
                                        <div className="qty-control">
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >−</button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >+</button>
                                        </div>
                                    </div>
                                    <button
                                        className="cart-item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove"
                                    >✕</button>
                                </div>
                            ))}
                        </div>

                        <div className="drawer-footer">
                            <div className="drawer-total">
                                <span>Subtotal</span>
                                <span className="drawer-total-value">${cartTotal.toLocaleString()}</span>
                            </div>
                            <button className="btn btn-primary btn-lg btn-full" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>
                            <button className="btn btn-full" onClick={onClose}>
                                Continue Shopping
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
