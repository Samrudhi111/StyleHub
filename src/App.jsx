import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Products from './components/Products';
import ProductDetails from './components/ProductDetails';
import Registration from './components/Registration';
import Login from './components/Login';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import MyOrders from './components/MyOrders';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Contact from './components/Contact';
import LifecycleDemo from './components/LifecycleDemo';
import MernDemo from './components/MernDemo';
import NotFound from './components/NotFound';
import { fetchProducts } from './services/api';

// ==============================================================================
// Master StyleHub Single Page Application (Experiment 9 - Full-Stack MERN)
// Integrates React (Vite) <---> Axios <---> Express API <---> Mongoose <---> MongoDB
// ==============================================================================

const App = () => {
  // 1. STATE: Products Catalog – Retrieved from MongoDB via Express REST API (Axios)
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // 2. STATE: Shopping Cart (Synchronized with localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('stylehub_spa_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // 3. STATE: Logged-in User Session (Synchronized with localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('stylehub_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // 4. STATE: Selected Category for cross-page navigation
  const [selectedCategory, setSelectedCategory] = useState('All');

  // 5. STATE: Transient Floating Alert Notification
  const [alert, setAlert] = useState(null);

  // Helper to trigger temporary flash alert
  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  // --------------------------------------------------------------------------
  // LIFECYCLE 1: Fetch Products from Express REST API using Axios
  // --------------------------------------------------------------------------
  const loadLiveProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      console.log('[StyleHub SPA] Requesting products from Express REST API via Axios...');
      const liveData = await fetchProducts();
      setProducts(liveData || []);
      console.log(`[StyleHub SPA] Successfully loaded ${liveData?.length || 0} products from MongoDB.`);
    } catch (err) {
      console.error('[StyleHub SPA] Products API Error:', err.message);
      setProductsError(err.message || 'Could not connect to backend REST API.');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    loadLiveProducts();
  }, [loadLiveProducts]);

  // --------------------------------------------------------------------------
  // LIFECYCLE 2: Synchronize Cart State with LocalStorage
  // --------------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('stylehub_spa_cart', JSON.stringify(cart));
  }, [cart]);

  // --------------------------------------------------------------------------
  // LIFECYCLE 3: Synchronize User State with LocalStorage
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (user) {
      localStorage.setItem('stylehub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('stylehub_user');
    }
  }, [user]);

  // Add Item to Cart Handler
  const handleAddToCart = (product) => {
    const prodId = product.id || product.productId || product._id;
    const prodPrice = Number(product.price || 0);
    const prodStock = Number(product.stock !== undefined ? product.stock : 99);
    const prodQty = Number(product.quantity || 1);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === prodId);
      if (existing) {
        if (existing.quantity >= prodStock) {
          showAlert(`Only ${prodStock} items available in stock!`, 'warning');
          return prevCart;
        }
        showAlert(`Increased "${product.name}" quantity to ${existing.quantity + prodQty}`);
        return prevCart.map((item) =>
          item.id === prodId ? { ...item, quantity: item.quantity + prodQty } : item
        );
      } else {
        showAlert(`Added "${product.name}" to cart!`);
        return [
          ...prevCart,
          {
            id: prodId,
            productId: prodId,
            name: product.name,
            price: prodPrice,
            size: product.size ? (Array.isArray(product.size) ? product.size[0] : product.size.split(',')[0].trim()) : 'M',
            image: product.image,
            stock: prodStock,
            quantity: prodQty
          }
        ];
      }
    });
  };

  // Update Item Quantity in Cart
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showAlert('Item removed from cart', 'info');
  };

  // Clear Entire Cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Logout Handler
  const handleLogout = () => {
    setUser(null);
    showAlert('You have been signed out successfully', 'info');
  };

  // Total Item Count for Navbar Badge
  const totalCartCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);

  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        {/* Navigation Bar with Router Links */}
        <Navbar
          cartCount={totalCartCount}
          user={user}
          onLogout={handleLogout}
        />

        {/* Transient Floating Alert */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-4 shadow`}
            style={{ zIndex: 1080, minWidth: '320px' }}
            role="alert"
          >
            <i className="bi bi-info-circle-fill me-2"></i> {alert.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Dynamic Route View rendering with React Router */}
        <main className="flex-grow-1">
          <Routes>
            {/* PUBLIC PAGES */}
            {/* 1. Home Page */}
            <Route
              path="/"
              element={
                <Home
                  products={products}
                  onAddToCart={handleAddToCart}
                  setSelectedCategory={setSelectedCategory}
                />
              }
            />

            {/* 2. Products Catalog Page (MongoDB -> Express -> Axios -> React) */}
            <Route
              path="/products"
              element={
                <Products
                  products={products}
                  loading={loadingProducts}
                  error={productsError}
                  onRefresh={loadLiveProducts}
                  selectedCategory={selectedCategory}
                  onAddToCart={handleAddToCart}
                />
              }
            />

            {/* 3. Product Details Page */}
            <Route
              path="/products/:id"
              element={
                <ProductDetails
                  products={products}
                  onAddToCart={handleAddToCart}
                />
              }
            />

            {/* 4. About Us Page */}
            <Route path="/about" element={<About />} />

            {/* 5. Contact Us Page */}
            <Route path="/contact" element={<Contact />} />

            {/* 6. User Registration Page */}
            <Route
              path="/register"
              element={<Registration setUser={setUser} />}
            />

            {/* 7. User Login Page */}
            <Route
              path="/login"
              element={<Login user={user} setUser={setUser} />}
            />

            {/* CUSTOMER PAGES */}
            {/* 8. User Profile */}
            <Route
              path="/profile"
              element={<Profile user={user} onLogout={handleLogout} cartCount={totalCartCount} />}
            />

            {/* 9. Shopping Cart Page */}
            <Route
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                />
              }
            />

            {/* 10. Checkout Page (Submits Order to MongoDB via Axios) */}
            <Route
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  user={user}
                  onClearCart={handleClearCart}
                />
              }
            />

            {/* 11. Customer My Orders Page */}
            <Route
              path="/my-orders"
              element={<MyOrders user={user} />}
            />

            {/* ADMIN PAGES */}
            {/* 12. Admin Dashboard (Manage Products, Add/Edit/Delete, Stock, Orders) */}
            <Route
              path="/admin"
              element={
                <AdminDashboard
                  user={user}
                  onCatalogUpdated={loadLiveProducts}
                />
              }
            />

            {/* DEMONSTRATION & LAB EXPERIMENT PAGES */}
            <Route path="/lifecycle-demo" element={<LifecycleDemo />} />
            <Route path="/mern-demo" element={<MernDemo />} />

            {/* 13. 404 Not Found Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
