import React, { useState, useEffect } from 'react';

// ==========================================================================
// StyleHub – Experiment 9: MERN Integration Component
// Demonstrates Full Stack Integration:
// React (Frontend Client) <---> Node/Express API <---> MongoDB / Database
// ==========================================================================

const API_BASE_URL = 'http://127.0.0.1:5001/api/products';

const MernDemo = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);

  // Form State for Adding New Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    price: '',
    stock: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // 1. Fetch Products from Backend API on Component Mount
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
      setApiOnline(true);
    } catch (err) {
      console.warn('[MERN Integration] Backend API not reached, using fallback sample data:', err.message);
      setApiOnline(false);
      setError('Backend API is currently offline. Start the backend with: node experiments/exp7/http_server.js');
      // Fallback local products to keep UI interactive
      setProducts([
        { id: 1, name: "Men's Classic Oxford Shirt", category: "Men", price: 1299, stock: 15 },
        { id: 2, name: "Women's Floral Summer Dress", category: "Women", price: 1899, stock: 10 },
        { id: 3, name: "Kids Cotton Dinosaur Tee", category: "Kids", price: 599, stock: 20 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Handle Product Submission to Backend (POST request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setStatusMessage({ type: 'warning', text: 'Please fill in product name and price.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      if (apiOnline) {
        const response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error(`Server returned status ${response.status}`);
        const result = await response.json();
        
        setStatusMessage({ type: 'success', text: `Product "${result.product.name}" saved to database successfully!` });
        setProducts(prev => [...prev, result.product]);
      } else {
        // Mock success when offline
        const mockNew = {
          id: products.length + 1,
          name: formData.name,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock) || 10
        };
        setProducts(prev => [...prev, mockNew]);
        setStatusMessage({ type: 'info', text: `[Offline Mode] Product "${mockNew.name}" added locally.` });
      }

      setFormData({ name: '', category: 'Men', price: '', stock: '' });
    } catch (err) {
      setStatusMessage({ type: 'danger', text: `Failed to save product: ${err.message}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <span className="badge bg-dark px-3 py-2 text-uppercase mb-2 text-accent">Store Inventory Management</span>
          <h2 className="fw-bold">Real-Time Product Catalog & Stock Operations</h2>
          <p className="text-muted">
            Direct synchronization with warehouse inventory, live RESTful endpoints, and instant catalog updates.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <span className={`badge rounded-pill ${apiOnline ? 'bg-success' : 'bg-warning text-dark'}`}>
              <i className={`bi ${apiOnline ? 'bi-cloud-check-fill' : 'bi-cloud-slash-fill'} me-1`}></i>
              {apiOnline ? 'Backend Connected (127.0.0.1:5001)' : 'Offline / Standalone Mode'}
            </span>
            <button className="btn btn-sm btn-outline-secondary" onClick={fetchProducts} disabled={loading}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh Data
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className={`alert alert-${statusMessage.type} alert-dismissible fade show`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i> {statusMessage.text}
          <button type="button" className="btn-close" onClick={() => setStatusMessage(null)}></button>
        </div>
      )}

      {error && !apiOnline && (
        <div className="alert alert-secondary small text-center mb-4">
          <i className="bi bi-lightbulb-fill me-1 text-warning"></i> {error}
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Form to Add New Product to Database */}
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0"><i className="bi bi-cloud-arrow-up-fill me-2 text-info"></i> Add Product via REST API</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="e.g. Classic Linen Shirt"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <label className="form-label fw-semibold">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      className="form-control"
                      placeholder="1499"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      placeholder="20"
                      value={formData.stock}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send-fill me-2"></i> Post to Backend API
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Products Catalog Fetched from API */}
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0"><i className="bi bi-database-check me-2 text-success"></i> Synced Catalog ({products.length} Items)</h5>
              <span className="badge bg-secondary">Real-Time State</span>
            </div>
            <div className="card-body p-4">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading database records...</span>
                  </div>
                  <p className="mt-3 text-muted">Fetching items from database API...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  No products found in database.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(item => (
                        <tr key={item.id}>
                          <td><span className="badge bg-light text-dark border">#{item.id}</span></td>
                          <td className="fw-semibold">{item.name}</td>
                          <td><span className="badge bg-info-subtle text-info-emphasis">{item.category}</span></td>
                          <td className="text-primary fw-bold">₹{item.price}</td>
                          <td>
                            <span className={`badge ${item.stock > 10 ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                              {item.stock} in stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MernDemo;
