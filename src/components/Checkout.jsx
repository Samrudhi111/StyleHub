import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../services/api';

// ==============================================================================
// Checkout Component (Customer View)
// Integrates React State -> Axios -> Express POST /api/orders -> Mongoose -> MongoDB
// ==============================================================================

const Checkout = ({ cart, user, onClearCart }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'StyleHub | Checkout';
  }, []);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    street: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    paymentMethod: 'cod'
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Subtotals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const totalAmount = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shipping.email || !shipping.street || !shipping.city || !shipping.pincode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add products before checking out.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Prepare payload compliant with backend Mongoose Order schema
      const orderPayload = {
        userId: shipping.email.trim(),
        products: cart.map((item) => ({
          productId: Number(item.productId || item.id) || 1,
          name: item.name,
          size: item.size || 'M',
          quantity: Number(item.quantity || 1),
          unitPrice: Number(item.price)
        })),
        totalAmount: totalAmount,
        shippingAddress: {
          street: shipping.street,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode
        }
      };

      // Axios POST /api/orders
      const response = await createOrder(orderPayload);
      const created = response.data || response;

      setPlacedOrder(created);
      onClearCart();
    } catch (err) {
      console.error('[Checkout Error]', err);
      setErrorMessage(err.message || 'Failed to place order. Ensure Express backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully created in MongoDB
  if (placedOrder) {
    return (
      <div className="container py-5 text-center">
        <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '4.5rem' }}></i>
          <h2 className="fw-bold mt-3 mb-2">Order Confirmed!</h2>
          <p className="text-muted">
            Your order has been recorded in the StyleHub MongoDB database with status{' '}
            <span className="badge bg-primary">Processing</span>.
          </p>

          <div className="alert alert-light border my-3 text-start small">
            <div><strong>Order ID:</strong> {placedOrder.orderId || placedOrder._id}</div>
            <div><strong>Customer Email:</strong> {placedOrder.userId}</div>
            <div><strong>Total Paid/Payable:</strong> ₹{placedOrder.totalAmount?.toLocaleString('en-IN')}</div>
            <div><strong>Items:</strong> {placedOrder.products?.length || cart.length} product(s)</div>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-2">
            <Link to="/my-orders" className="btn btn-accent">
              <i className="bi bi-clock-history me-1"></i> View My Orders
            </Link>
            <Link to="/products" className="btn btn-outline-dark">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">Nothing to Checkout</h3>
          <p className="text-muted">Your cart is currently empty. Explore our collection to add items.</p>
          <Link to="/products" className="btn btn-accent mt-2">
            <i className="bi bi-bag-plus me-1"></i> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="section-title mb-1">Checkout & Order Placement</h2>
        <p className="text-muted">Complete your shipping information to record your order directly in MongoDB via Express API</p>
      </div>

      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
          <button type="button" className="btn-close" onClick={() => setErrorMessage(null)}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left: Shipping Details Form */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0"><i className="bi bi-geo-alt-fill me-2 text-warning"></i> Shipping & Delivery Details</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handlePlaceOrder}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Recipient Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Samrudhi Shinde"
                      value={shipping.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Email (Order Identifier)</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="e.g. samrudhi@example.com"
                      value={shipping.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Contact Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      placeholder="10-digit mobile"
                      value={shipping.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      placeholder="e.g. 411001"
                      maxLength="6"
                      value={shipping.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold">Street Address / House No.</label>
                    <textarea
                      name="street"
                      rows="2"
                      className="form-control"
                      placeholder="Flat 302, Green Valley Apartments, MG Road"
                      value={shipping.street}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="e.g. Pune"
                      value={shipping.city}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">State</label>
                    <select
                      name="state"
                      className="form-select"
                      value={shipping.state}
                      onChange={handleChange}
                    >
                      <option>Maharashtra</option>
                      <option>Karnataka</option>
                      <option>Delhi</option>
                      <option>Gujarat</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Uttar Pradesh</option>
                      <option>West Bengal</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="col-12 mt-4">
                    <h6 className="fw-bold mb-2">Payment Method</h6>
                    <div className="border rounded p-3 bg-light">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="cod"
                          value="cod"
                          checked={shipping.paymentMethod === 'cod'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="cod">
                          <i className="bi bi-cash-coin me-1 text-success"></i> Cash on Delivery (COD)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="upi"
                          value="upi"
                          checked={shipping.paymentMethod === 'upi'}
                          onChange={handleChange}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="upi">
                          <i className="bi bi-qr-code-scan me-1 text-primary"></i> UPI / Online Simulated
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mt-4 d-grid">
                    <button
                      type="submit"
                      className="btn btn-accent btn-lg fw-bold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting Order to MongoDB...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-bag-check-fill me-2"></i> Confirm & Place Order (₹{totalAmount.toLocaleString('en-IN')})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '90px' }}>
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0"><i className="bi bi-receipt me-2 text-accent"></i> Order Summary ({cart.length} Items)</h5>
            </div>
            <div className="card-body p-4">
              <div className="cart-summary-items mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                        className="me-2"
                      />
                      <div>
                        <div className="fw-semibold small text-truncate" style={{ maxWidth: '170px' }}>
                          {item.name}
                        </div>
                        <small className="text-muted">Size: {item.size} | Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <div className="fw-bold small">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Subtotal:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Delivery Charges:</span>
                <span className={deliveryCharge === 0 ? 'text-success fw-bold' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between align-items-center">
                <span className="h6 fw-bold mb-0">Total Payable:</span>
                <span className="h5 fw-bold text-accent mb-0">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="alert alert-info py-2 small mt-3 mb-0">
                <i className="bi bi-info-circle me-1"></i> Data will be submitted via Axios REST call to <code>POST /api/orders</code>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
