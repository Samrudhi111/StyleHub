import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==============================================================================
// Profile Component (Customer & Admin View)
// Displays authenticated user details and shortcuts to relevant features
// ==============================================================================

const Profile = ({ user, onLogout, cartCount }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'StyleHub | User Profile';
  }, []);

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '500px' }}>
          <i className="bi bi-person-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">You are not signed in</h3>
          <p className="text-muted">Please log in to your StyleHub account to view your profile and orders.</p>
          <div className="d-flex justify-content-center gap-2 mt-2">
            <Link to="/login" className="btn btn-accent px-4">
              <i className="bi bi-box-arrow-in-right me-1"></i> Login
            </Link>
            <Link to="/register" className="btn btn-outline-dark px-4">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card shadow-sm border-0 overflow-hidden">
            {/* Header banner */}
            <div className="bg-dark text-white p-4 text-center">
              <div
                className="rounded-circle bg-accent text-dark d-inline-flex align-items-center justify-content-center fw-bold fs-2 mb-2"
                style={{ width: '80px', height: '80px' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="fw-bold mb-0 text-white">{user.name}</h3>
              <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-warning text-dark'} mt-2 text-uppercase`}>
                <i className={`bi ${user.role === 'admin' ? 'bi-shield-check' : 'bi-person-check'} me-1`}></i>
                {user.role || 'customer'} Account
              </span>
            </div>

            {/* Profile body */}
            <div className="card-body p-4">
              <h6 className="fw-bold text-muted mb-3">ACCOUNT INFORMATION</h6>
              <div className="list-group list-group-flush mb-4">
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted"><i className="bi bi-person me-2"></i> Full Name:</span>
                  <span className="fw-semibold">{user.name}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted"><i className="bi bi-envelope me-2"></i> Email Address:</span>
                  <span className="fw-semibold">{user.email}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted"><i className="bi bi-telephone me-2"></i> Mobile Number:</span>
                  <span className="fw-semibold">{user.mobile || '9876543210'}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted"><i className="bi bi-shield-lock me-2"></i> Security Status:</span>
                  <span className="badge bg-success-subtle text-success">Verified Active</span>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div className="p-3 border rounded text-center bg-light">
                    <i className="bi bi-cart3 fs-3 text-accent"></i>
                    <div className="fw-bold mt-1">{cartCount} Item(s)</div>
                    <Link to="/cart" className="small text-decoration-none text-muted">View Cart &rarr;</Link>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 border rounded text-center bg-light">
                    <i className="bi bi-bag-check fs-3 text-primary"></i>
                    <div className="fw-bold mt-1">My Orders</div>
                    <Link to="/my-orders" className="small text-decoration-none text-muted">Track Status &rarr;</Link>
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="alert alert-warning mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <i className="bi bi-shield-shaded me-2"></i>
                    <strong>Administrator Controls:</strong> Manage product stock and orders.
                  </div>
                  <Link to="/admin" className="btn btn-dark btn-sm">
                    Open Admin Dashboard &rarr;
                  </Link>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <Link to="/products" className="btn btn-outline-secondary btn-sm">
                  &larr; Return to Shopping
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="btn btn-outline-danger btn-sm"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
