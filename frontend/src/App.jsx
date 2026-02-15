import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import StudioPage from './pages/StudioPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';

export default function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/catalog/:id" element={<ProductDetail />} />
                <Route path="/studio" element={<StudioPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
        </Layout>
    );
}
