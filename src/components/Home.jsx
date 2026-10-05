import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==========================================================================
// Home Component
// Route: /
// ==========================================================================

const Home = ({ products, onAddToCart, setSelectedCategory }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'StyleHub | Wear Your Style';
  }, []);

  const handleCategoryClick = (categoryName) => {
    if (setSelectedCategory) {
      setSelectedCategory(categoryName);
    }
    navigate('/products');
  };

  const featuredPreview = products.slice(0, 4);

  return (
    <div>
      {/* ================= HERO SECTION ================= */}
      <section className="hero d-flex align-items-center text-center text-white py-5">
        <div className="container py-4">
          <span className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-bold">
            New Season Arrivals 2026
          </span>
          <h1 className="display-4 fw-bold">
            Wear Your Style with <span className="text-accent">StyleHub</span>
          </h1>
          <p className="lead mx-auto hero-text my-3">
            Discover curated fashion for Men, Women, Kids, and exclusive Accessories with fast delivery and seamless online shopping.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Link to="/products" className="btn btn-accent btn-lg px-4">
              <i className="bi bi-bag-check me-2"></i> Browse Collection
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-4">
              <i className="bi bi-person-plus me-2"></i> Join StyleHub
            </Link>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITIONS ================= */}
      <section className="py-4 bg-white border-bottom">
        <div className="container">
          <div className="row g-3 text-center">
            <div className="col-6 col-md-3">
              <div className="p-3">
                <i className="bi bi-truck text-accent fs-2"></i>
                <h6 className="fw-bold mt-2 mb-1">Free Delivery</h6>
                <small className="text-muted">On orders above ₹999</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <i className="bi bi-patch-check text-accent fs-2"></i>
                <h6 className="fw-bold mt-2 mb-1">100% Genuine</h6>
                <small className="text-muted">Quality tested fabrics</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <i className="bi bi-arrow-counterclockwise text-accent fs-2"></i>
                <h6 className="fw-bold mt-2 mb-1">7-Day Returns</h6>
                <small className="text-muted">Hassle-free exchanges</small>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="p-3">
                <i className="bi bi-shield-lock text-accent fs-2"></i>
                <h6 className="fw-bold mt-2 mb-1">Secure Checkout</h6>
                <small className="text-muted">Safe online payments</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SHOP BY CATEGORY ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-4">Shop by Category</h2>
          <div className="row g-4">
            {/* Men */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="card category-card text-center h-100 shadow-sm"
                onClick={() => handleCategoryClick('Men')}
              >
                <div className="card-body py-4">
                  <i className="bi bi-person-standing category-icon"></i>
                  <h5 className="card-title mt-3">Men</h5>
                  <p className="card-text text-muted">Shirts, denim jackets, hoodies, and trousers.</p>
                  <span className="badge bg-light text-dark border">Shop Men</span>
                </div>
              </div>
            </div>

            {/* Women */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="card category-card text-center h-100 shadow-sm"
                onClick={() => handleCategoryClick('Women')}
              >
                <div className="card-body py-4">
                  <i className="bi bi-person-standing-dress category-icon"></i>
                  <h5 className="card-title mt-3">Women</h5>
                  <p className="card-text text-muted">Dresses, kurtis, tops, and high-rise jeans.</p>
                  <span className="badge bg-light text-dark border">Shop Women</span>
                </div>
              </div>
            </div>

            {/* Kids */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="card category-card text-center h-100 shadow-sm"
                onClick={() => handleCategoryClick('Kids')}
              >
                <div className="card-body py-4">
                  <i className="bi bi-emoji-smile category-icon"></i>
                  <h5 className="card-title mt-3">Kids</h5>
                  <p className="card-text text-muted">Graphic tees, dungarees, and playful daily wear.</p>
                  <span className="badge bg-light text-dark border">Shop Kids</span>
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div
                className="card category-card text-center h-100 shadow-sm"
                onClick={() => handleCategoryClick('Accessories')}
              >
                <div className="card-body py-4">
                  <i className="bi bi-watch category-icon"></i>
                  <h5 className="card-title mt-3">Accessories</h5>
                  <p className="card-text text-muted">Watches, polarized sunglasses, and leather bags.</p>
                  <span className="badge bg-light text-dark border">Shop Accessories</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TRENDING STYLES ================= */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title mb-0">Trending Styles</h2>
              <small className="text-muted">Explore popular clothing this season</small>
            </div>
            <Link to="/products" className="btn btn-outline-accent btn-sm">
              View All Products &rarr;
            </Link>
          </div>

          <div className="row g-4">
            {featuredPreview.map((item) => (
              <div key={item.id} className="col-12 col-sm-6 col-md-3">
                <div className="card product-card h-100 shadow-sm">
                  <Link to={`/products/${item.id}`} className="product-img-wrapper">
                    <img src={item.image} alt={item.name} className="product-img" />
                    <span className="product-badge-category">{item.category}</span>
                  </Link>
                  <div className="card-body d-flex flex-column p-3">
                    <h6 className="card-title fw-bold text-truncate mb-1">
                      <Link to={`/products/${item.id}`} className="text-dark text-decoration-none">
                        {item.name}
                      </Link>
                    </h6>
                    <small className="text-muted mb-2">Size: {item.size}</small>
                    <div className="mt-auto d-flex align-items-center justify-content-between">
                      <span className="product-price">₹{item.price.toLocaleString('en-IN')}</span>
                      <div className="btn-group">
                        <Link to={`/products/${item.id}`} className="btn btn-sm btn-outline-secondary">
                          <i className="bi bi-eye"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-accent"
                          onClick={() => onAddToCart(item)}
                        >
                          <i className="bi bi-cart-plus me-1"></i> Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
