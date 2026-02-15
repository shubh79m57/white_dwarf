import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { DwarfProvider } from './context/DwarfContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <DwarfProvider>
                        <App />
                    </DwarfProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
