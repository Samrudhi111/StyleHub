import React from 'react';
import { Link } from 'react-router-dom';

// ==========================================================================
// Footer Component
// ==========================================================================

const Footer = () => {
  return (
    <footer className="site-footer bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row g-4 mb-3">
          <div className="col-12 col-md-4">
            <h5 className="brand-logo mb-2">
              <i className="bi bi-bag-heart-fill"></i> Style<span>Hub</span>
            </h5>
            <p className="text-white-50 small mb-0">
              Your one-stop destination for contemporary clothing, accessories, and trendsetting fashion.
            </p>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="fw-bold text-accent mb-2">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-white-50 text-decoration-none">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white-50 text-decoration-none">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none">
                  Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-4">
            <h6 className="fw-bold text-accent mb-2">Customer Care</h6>
            <p className="text-white-50 small mb-1">
              <i className="bi bi-envelope me-2"></i> support@stylehub.example
            </p>
            <p className="text-white-50 small mb-0">
              <i className="bi bi-telephone me-2"></i> +91 98765 43210
            </p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-white-50 small">
          &copy; {new Date().getFullYear()} StyleHub. All rights reserved. Premium Fashion for Everyone.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
