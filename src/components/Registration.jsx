import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

// ==============================================================================
// Registration Component (Demonstrates Controlled Forms & Axios Integration)
// Flow: React Form -> Axios -> Express POST /api/users/register -> Mongoose -> MongoDB
// ==============================================================================

const Registration = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'StyleHub | Account Registration';
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: 'Female',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const namePattern = /^[A-Za-z][A-Za-z\s.'-]{1,49}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const mobilePattern = /^[6-9]\d{9}$/;
  const pincodePattern = /^\d{6}$/;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (!namePattern.test(formData.fullName.trim())) {
      newErrors.fullName = 'Name should only contain letters and spaces (2-50 characters).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!mobilePattern.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms and conditions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      // Send user document payload to Express backend through Axios
      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        password: formData.password,
        role: formData.role
      };

      const response = await registerUser(payload);
      setIsSuccess(true);

      // Auto-set user session if setUser prop provided
      if (setUser && response?.data) {
        setUser(response.data);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('[Registration API Error]', err);
      setApiError(err.message || 'Registration failed. Backend server may be offline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card form-card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
                <h1 className="h3 text-center mb-1 fw-bold">Create Your Account</h1>
                <p className="text-center text-muted mb-4">
                  Join StyleHub to explore curated clothing & manage your orders
                </p>

                {apiError && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {apiError}
                    <button type="button" className="btn-close" onClick={() => setApiError(null)}></button>
                  </div>
                )}

                {isSuccess && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <strong>Registration Successful!</strong> Your account is registered in MongoDB.
                    <div className="mt-2">
                      <button
                        onClick={() => navigate('/login')}
                        className="btn btn-sm btn-outline-success me-2"
                      >
                        Proceed to Login &rarr;
                      </button>
                      <button
                        onClick={() => navigate('/products')}
                        className="btn btn-sm btn-accent"
                      >
                        Start Shopping
                      </button>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label htmlFor="fullName" className="form-label fw-semibold">Full Name *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Samrudhi Shinde"
                      />
                      {errors.fullName && (
                        <div className="invalid-feedback">{errors.fullName}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="role" className="form-label fw-semibold">Account Role</label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Store Admin</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address *</label>
                      <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="samrudhi@example.com"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="mobile" className="form-label fw-semibold">Mobile Number *</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        maxLength="10"
                        placeholder="10-digit mobile number"
                      />
                      {errors.mobile && (
                        <div className="invalid-feedback">{errors.mobile}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="password" className="form-label fw-semibold">Password *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="confirmPassword" className="form-label fw-semibold">Confirm Password *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="address" className="form-label fw-semibold">Address / Street</label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address or locality"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="city" className="form-label fw-semibold">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Pune"
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="state" className="form-label fw-semibold">State</label>
                      <select
                        className="form-select"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                      >
                        <option>Maharashtra</option>
                        <option>Delhi</option>
                        <option>Karnataka</option>
                        <option>Gujarat</option>
                        <option>Tamil Nadu</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="pincode" className="form-label fw-semibold">Pincode</label>
                      <input
                        type="text"
                        className="form-control"
                        id="pincode"
                        name="pincode"
                        maxLength="6"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6 digits"
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${errors.terms ? 'is-invalid' : ''}`}
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                        />
                        <label className="form-check-label small" htmlFor="terms">
                          I agree to the StyleHub Terms of Service & Privacy Policy
                        </label>
                        {errors.terms && (
                          <div className="invalid-feedback">{errors.terms}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-12 d-grid mt-4">
                      <button type="submit" className="btn btn-accent btn-lg" disabled={submitting}>
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Account in MongoDB...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-check-fill me-1"></i> Register Account
                          </>
                        )}
                      </button>
                    </div>

                    <div className="col-12 text-center mt-3">
                      <span className="text-muted small">
                        Already registered?{' '}
                        <Link to="/login" className="text-accent fw-semibold text-decoration-none">
                          Sign In Here
                        </Link>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
