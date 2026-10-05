import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/api';

// ==============================================================================
// MyOrders Component (Customer View)
// Integrates React -> Axios -> Express GET /api/orders -> Mongoose -> MongoDB
// ==============================================================================

const MyOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchEmail, setSearchEmail] = useState(user?.email || '');

  const loadOrders = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('[Orders Fetch Error]', err);
      setErrorMessage(err.message || 'Unable to retrieve orders from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'StyleHub | My Orders';
    loadOrders();
  }, []);

  // Filter orders by active user or searched email
  const displayOrders = orders.filter((o) => {
    if (!searchEmail.trim()) return true;
    return (o.userId || '').toLowerCase().includes(searchEmail.trim().toLowerCase());
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge bg-success"><i className="bi bi-check2-circle me-1"></i> Delivered</span>;
      case 'Shipped':
        return <span className="badge bg-info text-dark"><i className="bi bi-truck me-1"></i> Shipped</span>;
      case 'Cancelled':
        return <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i> Cancelled</span>;
      default:
        return <span className="badge bg-warning text-dark"><i className="bi bi-hourglass-split me-1"></i> Processing</span>;
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-1">My Orders & Purchase History</h2>
          <p className="text-muted mb-0">Live order tracking powered by MongoDB & Express REST API</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadOrders} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Orders
        </button>
      </div>

      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
        </div>
      )}

      {/* Filter by email */}
      <div className="card shadow-sm border-0 mb-4 bg-light">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-auto">
              <label className="fw-semibold small text-muted">Filter by Customer Email:</label>
            </div>
            <div className="col-12 col-md-4">
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Search email (e.g. samrudhi@example.com)"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
            {searchEmail && (
              <div className="col-auto">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setSearchEmail('')}>
                  Show All Orders
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading orders...</span>
          </div>
          <p className="mt-3 text-muted">Retrieving order documents from MongoDB...</p>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="card shadow-sm border-0 text-center py-5">
          <div className="card-body">
            <i className="bi bi-box2 text-muted" style={{ fontSize: '3.5rem' }}></i>
            <h4 className="fw-bold mt-3 mb-1">No Orders Found</h4>
            <p className="text-muted">
              {searchEmail
                ? `No orders matching "${searchEmail}". Try clearing the search filter.`
                : "You haven't placed any orders yet."}
            </p>
            <Link to="/products" className="btn btn-accent mt-2">
              <i className="bi bi-bag-plus me-1"></i> Shop Collection Now
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {displayOrders.map((order) => (
            <div key={order._id || order.orderId} className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center py-3">
                  <div>
                    <span className="fw-bold me-2">Order #{order.orderId || order._id}</span>
                    <span className="small text-secondary">
                      Placed on {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="mt-2 mt-sm-0">
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="card-body p-4">
                  <div className="row g-3">
                    {/* Products Ordered */}
                    <div className="col-12 col-md-7 border-end-md">
                      <h6 className="fw-bold mb-3 text-muted">Ordered Items:</h6>
                      <div className="list-group list-group-flush">
                        {order.products?.map((item, idx) => (
                          <div key={idx} className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-semibold">{item.name}</div>
                              <small className="text-muted">
                                Size: <span className="badge bg-light text-dark border">{item.size || 'M'}</span> | Qty: {item.quantity}
                              </small>
                            </div>
                            <div className="fw-bold">
                              ₹{(Number(item.unitPrice || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address & Total */}
                    <div className="col-12 col-md-5 ps-md-4">
                      <h6 className="fw-bold mb-2 text-muted">Shipping Destination:</h6>
                      <p className="small mb-3 text-secondary">
                        {order.shippingAddress?.street ? (
                          <>
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                          </>
                        ) : (
                          <em>Address registered with order</em>
                        )}
                      </p>

                      <div className="border-top pt-3">
                        <div className="d-flex justify-content-between mb-1 small">
                          <span className="text-muted">Customer Email:</span>
                          <span className="fw-semibold">{order.userId}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="h6 fw-bold mb-0">Total Paid:</span>
                          <span className="h5 fw-bold text-accent mb-0">
                            ₹{order.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
