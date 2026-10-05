import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==============================================================================
// Cart Component (Customer View)
// Maintained with React State & localStorage, routes to /checkout
// ==============================================================================

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart, onClearCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `StyleHub | Shopping Cart (${cart.length} items)`;
  }, [cart.length]);

  const [couponCode, setCouponCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  // Subtotal & Totals
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const totalItemsCount = cart.reduce((count, item) => count + (Number(item.quantity) || 1), 0);
  const discountAmount = Math.round(subtotal * discountRate);
  const grandTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();

    if (code === 'STYLE10') {
      setDiscountRate(0.1);
      setAppliedPromo('STYLE10');
      setCouponFeedback({ type: 'success', text: 'Coupon STYLE10 applied! 10% discount added.' });
    } else if (code === 'STYLE20') {
      setDiscountRate(0.2);
      setAppliedPromo('STYLE20');
      setCouponFeedback({ type: 'success', text: 'Coupon STYLE20 applied! 20% discount added.' });
    } else if (code === '') {
      setCouponFeedback({ type: 'danger', text: 'Please enter a coupon code.' });
    } else {
      setCouponFeedback({ type: 'danger', text: `"${code}" is invalid. Try STYLE10 or STYLE20.` });
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4.5rem' }}></i>
          <h3 className="fw-bold mt-3 mb-2">Your Shopping Cart is Empty</h3>
          <p className="text-muted">
            Looks like you haven't added any clothing items to your cart yet.
          </p>
          <Link to="/products" className="btn btn-accent btn-lg px-4 mt-2">
            <i className="bi bi-bag-plus me-2"></i> Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-0">Shopping Cart</h2>
          <small className="text-muted">{totalItemsCount} item(s) in your cart</small>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to empty your entire cart?')) {
              onClearCart();
            }
          }}
          className="btn btn-outline-danger btn-sm"
        >
          <i className="bi bi-trash3 me-1"></i> Empty Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Items Table */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '45%' }}>Product</th>
                    <th scope="col">Price</th>
                    <th scope="col" className="text-center">Quantity</th>
                    <th scope="col" className="text-end">Subtotal</th>
                    <th scope="col" className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Link to={`/products/${item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="cart-item-img me-3"
                            />
                          </Link>
                          <div>
                            <h6 className="mb-0 fw-semibold">
                              <Link to={`/products/${item.id}`} className="text-dark text-decoration-none">
                                {item.name}
                              </Link>
                            </h6>
                            <small className="text-muted">Size: {item.size}</small>
                          </div>
                        </div>
                      </td>
                      <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td>
                        <div className="d-flex justify-content-center align-items-center gap-1">
                          <button
                            className="btn btn-outline-secondary cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="fw-bold px-2">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary cart-qty-btn"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.stock && item.quantity >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-end fw-bold">
                        ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            if (window.confirm(`Remove "${item.name}" from cart?`)) {
                              onRemoveFromCart(item.id);
                            }
                          }}
                          title="Remove Item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3">
            <Link to="/products" className="btn btn-outline-secondary btn-sm">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon Promo */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Bag Subtotal:</span>
                <span className="fw-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountRate > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Coupon Discount ({appliedPromo}):</span>
                  <span className="fw-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Estimated Delivery:</span>
                <span className="text-success fw-semibold">{subtotal >= 999 ? 'FREE' : '₹99'}</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="h6 fw-bold mb-0">Total Amount:</span>
                <span className="h5 fw-bold text-accent mb-0">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Promo Code Input Form */}
              <form onSubmit={handleApplyCoupon} className="mb-3">
                <label className="form-label small fw-semibold">Have a Promo Code?</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Try STYLE10 or STYLE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn btn-dark btn-sm" type="submit">
                    Apply
                  </button>
                </div>
                {couponFeedback && (
                  <div className={`small mt-1 text-${couponFeedback.type}`}>
                    {couponFeedback.text}
                  </div>
                )}
              </form>

              {/* Checkout Action Button */}
              <div className="d-grid">
                <button
                  onClick={handleProceedToCheckout}
                  className="btn btn-accent btn-lg"
                >
                  <i className="bi bi-shield-check me-2"></i> Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
