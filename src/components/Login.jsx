import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

// ==============================================================================
// Login Component (MERN Integration)
// Flow: React -> Axios -> Express POST /api/users/login -> Mongoose -> MongoDB
// ==============================================================================

const Login = ({ setUser, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'StyleHub | Account Login';
  }, []);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [message, setMessage] = useState(null);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(loginData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    setApiError(null);

    try {
      // Axios request to Express POST /api/users/login
      const response = await loginUser({
        email: loginData.email.trim(),
        password: loginData.password
      });

      const authenticatedUser = response.data || response.user || {
        name: loginData.email.split('@')[0],
        email: loginData.email,
        role: loginData.email.includes('admin') ? 'admin' : 'customer'
      };

      // Update state and persistent localStorage session
      setUser(authenticatedUser);
      localStorage.setItem('stylehub_user', JSON.stringify(authenticatedUser));

      setMessage({
        type: 'success',
        text: `Welcome back, ${authenticatedUser.name}! (${authenticatedUser.role.toUpperCase()})`
      });

      // Programmatic navigation based on user role
      setTimeout(() => {
        if (authenticatedUser.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/products');
        }
      }, 900);
    } catch (err) {
      console.error('[Login API Error]', err);
      setApiError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick fill helper for college exam presentation
  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setLoginData({
        email: 'samrudhi@stylehub.com',
        password: 'AdminPassword123#'
      });
    } else {
      setLoginData({
        email: 'aarav.sharma@example.com',
        password: 'CustomerPassword1#'
      });
    }
    setErrors({});
    setApiError(null);
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card form-card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="bg-dark text-accent d-inline-flex p-3 rounded-circle mb-2">
                    <i className="bi bi-person-fill-lock fs-2"></i>
                  </div>
                  <h2 className="h4 fw-bold mt-2 mb-1">Sign In to StyleHub</h2>
                  <p className="text-muted small">Connect to your account via MongoDB backend</p>
                </div>

                {apiError && (
                  <div className="alert alert-danger small py-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-1"></i> {apiError}
                  </div>
                )}

                {message && (
                  <div className={`alert alert-${message.type} small py-2`} role="alert">
                    <i className="bi bi-check-circle-fill me-1"></i> {message.text}
                  </div>
                )}

                {user ? (
                  <div className="text-center py-3">
                    <div className="alert alert-info">
                      Currently logged in as <strong>{user.name}</strong> ({user.role})
                    </div>
                    <div className="d-grid gap-2">
                      {user.role === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="btn btn-dark">
                          Go to Admin Dashboard &rarr;
                        </button>
                      )}
                      <button onClick={() => navigate('/products')} className="btn btn-accent">
                        Continue Shopping &rarr;
                      </button>
                      <button
                        onClick={() => {
                          setUser(null);
                          localStorage.removeItem('stylehub_user');
                        }}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} noValidate>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        id="loginEmail"
                        name="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="e.g. samrudhi@stylehub.com"
                        value={loginData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="loginPassword" className="form-label fw-semibold">Password</label>
                        <span className="small text-muted">Secured via MongoDB</span>
                      </div>
                      <input
                        type="password"
                        id="loginPassword"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="d-grid mt-4">
                      <button type="submit" className="btn btn-accent btn-lg fw-semibold" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Authenticating via API...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick Demo Credentials Buttons */}
                    <div className="mt-4 pt-3 border-top text-center">
                      <small className="text-muted d-block mb-2 fw-semibold">Quick Test Logins (College Demo):</small>
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="button"
                          className="btn btn-outline-dark btn-sm"
                          onClick={() => handleQuickFill('admin')}
                        >
                          <i className="bi bi-shield-check me-1 text-danger"></i> Admin
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleQuickFill('customer')}
                        >
                          <i className="bi bi-person me-1 text-primary"></i> Customer
                        </button>
                      </div>
                    </div>

                    <div className="text-center mt-3">
                      <span className="text-muted small">
                        New to StyleHub?{' '}
                        <Link to="/register" className="text-accent fw-semibold text-decoration-none">
                          Create an Account
                        </Link>
                      </span>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
