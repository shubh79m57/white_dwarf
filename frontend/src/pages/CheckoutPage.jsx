import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDwarf } from '../context/DwarfContext';

const categoryIcons = {
    Chairs: '🪑', Tables: '🍽️', Sofas: '🛋️',
    Storage: '📚', Lighting: '💡', Decor: '🏺',
};

const SHIPPING_RATE = 49;
const TAX_RATE = 0.08;

export default function CheckoutPage() {
    const { cartItems, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCart();
    const { user, isLoggedIn } = useAuth();
    const { triggerGreeting } = useDwarf();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Review, 2: Shipping, 3: Payment, 4: Confirmation
    const [address, setAddress] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [orderId, setOrderId] = useState('');

    const shipping = cartCount > 0 ? SHIPPING_RATE : 0;
    const tax = cartTotal * TAX_RATE;
    const orderTotal = cartTotal + shipping + tax;

    if (cartItems.length === 0 && step < 4) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <div style={{ fontSize: '3rem' }}>🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some items before checking out.</p>
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/catalog')}>
                        Browse Catalog
                    </button>
                </div>
            </div>
        );
    }

    const handlePlaceOrder = () => {
        const id = 'WD-' + Date.now().toString(36).toUpperCase();
        setOrderId(id);
        clearCart();
        setStep(4);
        triggerGreeting(id);
    };

    const isAddressValid = address.fullName && address.email && address.phone
        && address.line1 && address.city && address.state && address.zip;

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout</h1>

            {/* Progress Steps */}
            <div className="checkout-steps">
                {['Cart Review', 'Shipping', 'Payment', 'Confirmation'].map((label, i) => (
                    <div key={label} className={`checkout-step ${step > i ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
                        <div className="checkout-step-dot">{step > i + 1 ? '✓' : i + 1}</div>
                        <span className="checkout-step-label">{label}</span>
                        {i < 3 && <div className="checkout-step-line" />}
                    </div>
                ))}
            </div>

            <div className="checkout-layout">
                {/* Main Content */}
                <div className="checkout-main">
                    {/* Step 1: Cart Review */}
                    {step === 1 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Review Your Items</h2>
                            <div className="checkout-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="checkout-item">
                                        <div className="checkout-item-img">
                                            <span>{categoryIcons[item.category] || '🪑'}</span>
                                        </div>
                                        <div className="checkout-item-details">
                                            <h3 className="checkout-item-name">{item.name}</h3>
                                            <span className="checkout-item-category">{item.category}</span>
                                        </div>
                                        <div className="checkout-item-qty">
                                            <div className="qty-control">
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="checkout-item-price">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </div>
                                        <button className="checkout-item-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                                    </div>
                                ))}
                            </div>
                            <div className="checkout-nav">
                                <button className="btn" onClick={() => navigate('/catalog')}>← Continue Shopping</button>
                                <button className="btn btn-primary btn-lg" onClick={() => setStep(2)}>
                                    Continue to Shipping →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Shipping Address */}
                    {step === 2 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Shipping Address</h2>
                            <div className="address-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={address.fullName}
                                            onChange={e => setAddress({ ...address, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            placeholder="you@example.com"
                                            value={address.email}
                                            onChange={e => setAddress({ ...address, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Phone *</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="+91 98765 43210"
                                            value={address.phone}
                                            onChange={e => setAddress({ ...address, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Country</label>
                                        <select
                                            className="form-input"
                                            value={address.country}
                                            onChange={e => setAddress({ ...address, country: e.target.value })}
                                        >
                                            <option>India</option>
                                            <option>United States</option>
                                            <option>United Kingdom</option>
                                            <option>Canada</option>
                                            <option>Germany</option>
                                            <option>France</option>
                                            <option>Australia</option>
                                            <option>Japan</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address Line 1 *</label>
                                    <input
                                        className="form-input"
                                        placeholder="123 Main Street"
                                        value={address.line1}
                                        onChange={e => setAddress({ ...address, line1: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Address Line 2</label>
                                    <input
                                        className="form-input"
                                        placeholder="Apt, suite, floor (optional)"
                                        value={address.line2}
                                        onChange={e => setAddress({ ...address, line2: e.target.value })}
                                    />
                                </div>
                                <div className="form-row form-row-3">
                                    <div className="form-group">
                                        <label className="form-label">City *</label>
                                        <input
                                            className="form-input"
                                            placeholder="Mumbai"
                                            value={address.city}
                                            onChange={e => setAddress({ ...address, city: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">State *</label>
                                        <input
                                            className="form-input"
                                            placeholder="Maharashtra"
                                            value={address.state}
                                            onChange={e => setAddress({ ...address, state: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">ZIP Code *</label>
                                        <input
                                            className="form-input"
                                            placeholder="400001"
                                            value={address.zip}
                                            onChange={e => setAddress({ ...address, zip: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="checkout-nav">
                                <button className="btn" onClick={() => setStep(1)}>← Back to Cart</button>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => setStep(3)}
                                    disabled={!isAddressValid}
                                >
                                    Continue to Payment →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="checkout-section">
                            <h2 className="checkout-section-title">Payment Method</h2>
                            <div className="payment-methods">
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="payment-option-icon">💳</div>
                                    <div>
                                        <div className="payment-option-title">Credit / Debit Card</div>
                                        <div className="payment-option-desc">Visa, Mastercard, RuPay</div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={() => setPaymentMethod('upi')}
                                    />
                                    <div className="payment-option-icon">📱</div>
                                    <div>
                                        <div className="payment-option-title">UPI</div>
                                        <div className="payment-option-desc">PhonePe, Google Pay, Paytm</div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="netbanking"
                                        checked={paymentMethod === 'netbanking'}
                                        onChange={() => setPaymentMethod('netbanking')}
                                    />
                                    <div className="payment-option-icon">🏦</div>
                                    <div>
                                        <div className="payment-option-title">Net Banking</div>
                                        <div className="payment-option-desc">All major banks</div>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={() => setPaymentMethod('cod')}
                                    />
                                    <div className="payment-option-icon">💵</div>
                                    <div>
                                        <div className="payment-option-title">Cash on Delivery</div>
                                        <div className="payment-option-desc">Pay when delivered</div>
                                    </div>
                                </label>
                            </div>

                            {/* Card Details (shown only if card selected) */}
                            {paymentMethod === 'card' && (
                                <div className="card-form">
                                    <div className="form-group">
                                        <label className="form-label">Card Number</label>
                                        <input
                                            className="form-input"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardInfo.number}
                                            onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })}
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Name on Card</label>
                                        <input
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={cardInfo.name}
                                            onChange={e => setCardInfo({ ...cardInfo, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Expiry Date</label>
                                            <input
                                                className="form-input"
                                                placeholder="MM/YY"
                                                value={cardInfo.expiry}
                                                onChange={e => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">CVV</label>
                                            <input
                                                type="password"
                                                className="form-input"
                                                placeholder="•••"
                                                value={cardInfo.cvv}
                                                onChange={e => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'upi' && (
                                <div className="card-form">
                                    <div className="form-group">
                                        <label className="form-label">UPI ID</label>
                                        <input className="form-input" placeholder="yourname@upi" />
                                    </div>
                                </div>
                            )}

                            <div className="checkout-nav">
                                <button className="btn" onClick={() => setStep(2)}>← Back to Shipping</button>
                                <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder}>
                                    Place Order — ${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="checkout-section checkout-confirmation">
                            <div className="confirmation-icon">✅</div>
                            <h2 className="confirmation-title">Order Placed Successfully!</h2>
                            <p className="confirmation-id">Order ID: <strong>{orderId}</strong></p>
                            <p className="confirmation-msg">
                                Thank you for your purchase! We'll send a confirmation email with tracking details shortly.
                            </p>
                            <div className="confirmation-details">
                                <div className="confirmation-row">
                                    <span>Shipping to</span>
                                    <span>{address.fullName}, {address.city}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span>Payment</span>
                                    <span style={{ textTransform: 'uppercase' }}>{paymentMethod}</span>
                                </div>
                                <div className="confirmation-row">
                                    <span>Estimated delivery</span>
                                    <span>5-7 business days</span>
                                </div>
                            </div>
                            <div className="confirmation-actions">
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary Sidebar */}
                {step < 4 && (
                    <aside className="checkout-summary">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="summary-item">
                                    <span>{item.name} × {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${cartTotal.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>${shipping}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (8%)</span>
                            <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${orderTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="summary-secure">🔒 Secure checkout</div>
                    </aside>
                )}
            </div>
        </div>
    );
}
