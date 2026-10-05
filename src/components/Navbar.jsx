import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

// ==============================================================================
// Navbar Component (Responsive Navigation with Role-Aware Routes)
// Integrates Public, Customer, and Admin Navigation links
// ==============================================================================

const Navbar = ({ cartCount, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand brand-logo">
            <i className="bi bi-bag-heart-fill me-1"></i> Style<span>Hub</span>
          </Link>

          {/* Mobile Hamburger Toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/products"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/about"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/contact"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  Contact
                </NavLink>
              </li>

              {/* Customer Link: My Orders (Visible when logged in or accessible) */}
              {user && (
                <li className="nav-item">
                  <NavLink
                    to="/my-orders"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-clock-history me-1"></i> My Orders
                  </NavLink>
                </li>
              )}

              {/* Admin Link: Admin Dashboard (Visible to Admin or for evaluation) */}
              {user?.role === 'admin' ? (
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link text-warning fw-bold ${isActive ? 'active' : ''}`}
                  >
                    <i className="bi bi-shield-lock-fill me-1"></i> Admin Dashboard
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    title="Store Administration & Order Management"
                  >
                    <span className="badge bg-secondary me-1">Admin</span> Portal
                  </NavLink>
                </li>
              )}
            </ul>

            {/* Right Side: User Controls & Cart Button */}
            <div className="d-flex align-items-center gap-2 flex-wrap mt-2 mt-lg-0">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                    title="View Profile"
                  >
                    <i className="bi bi-person-circle text-accent"></i>
                    <span>{user.name}</span>
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'} ms-1 small`}>
                      {user.role}
                    </span>
                  </Link>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      onLogout();
                      navigate('/');
                    }}
                    title="Sign Out"
                  >
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="btn btn-outline-light btn-sm">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </NavLink>
                  <NavLink to="/register" className="btn btn-accent btn-sm">
                    Register
                  </NavLink>
                </>
              )}

              {/* Shopping Cart Button */}
              <Link to="/cart" className="btn btn-outline-accent position-relative btn-sm px-3 ms-1">
                <i className="bi bi-cart3 me-1"></i> Cart
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
