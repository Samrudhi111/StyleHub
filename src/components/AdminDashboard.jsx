import React, { useState, useEffect } from 'react';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
  updateOrderStatus
} from '../services/api';

// ==============================================================================
// AdminDashboard Component (Admin View)
// Integrates Full CRUD for Products & Order Monitoring via Axios & REST API
// ==============================================================================

const AdminDashboard = ({ user, onCatalogUpdated }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'add' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Filters for product management table
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Form State for Add Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Men',
    description: '',
    price: '',
    size: 'S, M, L, XL',
    color: 'Classic Black',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
    featured: false
  });

  // State for Editing a Product
  const [editingProduct, setEditingProduct] = useState(null);

  // Load Data from MongoDB via Axios
  const loadDashboardData = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const [prodData, ordData] = await Promise.all([
        fetchProducts(),
        fetchOrders()
      ]);
      setProducts(prodData || []);
      setOrders(ordData || []);
    } catch (err) {
      console.error('[Admin Dashboard Load Error]', err);
      setFeedback({
        type: 'danger',
        message: err.message || 'Failed to communicate with Express server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'StyleHub | Admin Dashboard';
    loadDashboardData();
  }, []);

  const notifySuccess = (msg) => {
    setFeedback({ type: 'success', message: msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const notifyError = (msg) => {
    setFeedback({ type: 'danger', message: msg });
  };

  // --------------------------------------------------------------------------
  // ADD PRODUCT HANDLER (POST /api/products)
  // --------------------------------------------------------------------------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      notifyError('Please specify product name and price.');
      return;
    }

    try {
      const sizesArray = newProduct.size
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description || 'Premium StyleHub apparel item.',
        price: Number(newProduct.price),
        size: sizesArray.length ? sizesArray : ['M'],
        color: newProduct.color,
        stock: Number(newProduct.stock || 0),
        image: newProduct.image || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600',
        featured: Boolean(newProduct.featured)
      };

      const created = await createProduct(payload);
      notifySuccess(`Product "${created.name}" created successfully in MongoDB!`);

      // Reset form
      setNewProduct({
        name: '',
        category: 'Men',
        description: '',
        price: '',
        size: 'S, M, L, XL',
        color: 'Classic Black',
        stock: 20,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600',
        featured: false
      });

      // Reload products & notify parent
      await loadDashboardData();
      if (onCatalogUpdated) onCatalogUpdated();
      setActiveTab('products');
    } catch (err) {
      notifyError(`Failed to create product: ${err.message}`);
    }
  };

  // --------------------------------------------------------------------------
  // EDIT PRODUCT HANDLER (PUT /api/products/:id)
  // --------------------------------------------------------------------------
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const idToUpdate = editingProduct._id || editingProduct.productId || editingProduct.id;
      const sizesArray = typeof editingProduct.size === 'string'
        ? editingProduct.size.split(',').map((s) => s.trim())
        : editingProduct.size;

      const payload = {
        name: editingProduct.name,
        category: editingProduct.category,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        size: sizesArray,
        color: editingProduct.color,
        stock: Number(editingProduct.stock),
        image: editingProduct.image,
        featured: Boolean(editingProduct.featured)
      };

      await updateProduct(idToUpdate, payload);
      notifySuccess(`Product "${editingProduct.name}" updated successfully!`);
      setEditingProduct(null);

      await loadDashboardData();
      if (onCatalogUpdated) onCatalogUpdated();
    } catch (err) {
      notifyError(`Failed to update product: ${err.message}`);
    }
  };

  // --------------------------------------------------------------------------
  // DELETE PRODUCT HANDLER (DELETE /api/products/:id)
  // --------------------------------------------------------------------------
  const handleDeleteProduct = async (product) => {
    const idToDelete = product._id || product.productId || product.id;
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}" from MongoDB?`);
    if (!confirmDelete) return;

    try {
      await deleteProduct(idToDelete);
      notifySuccess(`Product "${product.name}" deleted from database.`);
      await loadDashboardData();
      if (onCatalogUpdated) onCatalogUpdated();
    } catch (err) {
      notifyError(`Failed to delete product: ${err.message}`);
    }
  };

  // --------------------------------------------------------------------------
  // QUICK STOCK ADJUSTER (PUT /api/products/:id)
  // --------------------------------------------------------------------------
  const handleAdjustStock = async (product, delta) => {
    const idToUpdate = product._id || product.productId || product.id;
    const newStock = Math.max(0, (product.stock || 0) + delta);

    try {
      await updateProduct(idToUpdate, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === product._id || p.id === product.id)
            ? { ...p, stock: newStock }
            : p
        )
      );
      if (onCatalogUpdated) onCatalogUpdated();
    } catch (err) {
      notifyError(`Failed to adjust stock: ${err.message}`);
    }
  };

  // --------------------------------------------------------------------------
  // UPDATE ORDER STATUS (PUT /api/orders/:id/status)
  // --------------------------------------------------------------------------
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      notifySuccess(`Order #${orderId} status changed to "${newStatus}"!`);
      setOrders((prev) =>
        prev.map((o) =>
          (o._id === orderId || o.orderId === orderId) ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      notifyError(`Failed to update order status: ${err.message}`);
    }
  };

  // Summary Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  // Filtered Products for Table
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container py-5">
      {/* Dashboard Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <span className="badge bg-danger text-uppercase mb-1">
            <i className="bi bi-shield-shaded me-1"></i> Admin Portal
          </span>
          <h2 className="section-title mb-0">StyleHub Store Administration</h2>
          <p className="text-muted small mb-0">
            MERN Stack Backend & Database Management Panel (MongoDB + Express REST API + Axios)
          </p>
        </div>
        <div className="mt-3 mt-md-0 d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadDashboardData} disabled={loading}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh All Data
          </button>
        </div>
      </div>

      {/* Global Feedback Banner */}
      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
          <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2`}></i>
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body p-3">
              <span className="text-muted small text-uppercase fw-bold">Total Products</span>
              <div className="h3 fw-bold mb-0 text-primary mt-1">{products.length}</div>
              <small className="text-muted">In MongoDB database</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-danger border-4">
            <div className="card-body p-3">
              <span className="text-muted small text-uppercase fw-bold">Low Stock Alert</span>
              <div className="h3 fw-bold mb-0 text-danger mt-1">{lowStockCount}</div>
              <small className="text-muted">Items with stock &lt; 10</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4">
            <div className="card-body p-3">
              <span className="text-muted small text-uppercase fw-bold">Total Orders</span>
              <div className="h3 fw-bold mb-0 text-warning mt-1">{orders.length}</div>
              <small className="text-muted">Processed through API</small>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body p-3">
              <span className="text-muted small text-uppercase fw-bold">Total Revenue</span>
              <div className="h3 fw-bold mb-0 text-success mt-1">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <small className="text-muted">Recorded order earnings</small>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`btn ${activeTab === 'products' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="bi bi-box-seam me-1"></i> Manage Products ({products.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn ${activeTab === 'add' ? 'btn-accent' : 'btn-outline-accent'}`}
            onClick={() => setActiveTab('add')}
          >
            <i className="bi bi-plus-circle me-1"></i> Add New Product
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn ${activeTab === 'orders' ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="bi bi-truck me-1"></i> View Orders ({orders.length})
          </button>
        </li>
      </ul>

      {/* ==================================================================== */}
      {/* TAB 1: MANAGE PRODUCTS & STOCK TABLE */}
      {/* ==================================================================== */}
      {activeTab === 'products' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white d-flex flex-wrap justify-content-between align-items-center py-3">
            <h5 className="mb-0"><i className="bi bi-table me-2 text-warning"></i> Product Catalog & Stock Controls</h5>
            <span className="badge bg-secondary">Real-Time MongoDB Documents</span>
          </div>

          <div className="card-body p-4">
            {/* Search and Category Filter Bar */}
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-5">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Filter by product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div className="col-12 col-md-3 text-md-end">
                <button className="btn btn-sm btn-accent w-100" onClick={() => setActiveTab('add')}>
                  <i className="bi bi-plus me-1"></i> Add Product
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-accent" role="status"></div>
                <p className="mt-2 text-muted">Loading catalog from MongoDB...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                No products match the filter criteria.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Image</th>
                      <th>Product Info</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Quantity</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id || p.id}>
                        <td style={{ width: '60px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                        </td>
                        <td>
                          <div className="fw-bold">{p.name}</div>
                          <small className="text-muted">Sizes: {p.size || 'M'} | Color: {p.color}</small>
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">{p.category}</span>
                        </td>
                        <td className="fw-bold text-accent">₹{p.price.toLocaleString('en-IN')}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <button
                              className="btn btn-outline-secondary btn-sm py-0 px-2"
                              onClick={() => handleAdjustStock(p, -1)}
                              disabled={p.stock <= 0}
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className={`badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'} px-2 py-1`}>
                              {p.stock}
                            </span>
                            <button
                              className="btn btn-outline-secondary btn-sm py-0 px-2"
                              onClick={() => handleAdjustStock(p, +1)}
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-outline-primary btn-sm me-1"
                            onClick={() => setEditingProduct({ ...p })}
                            title="Edit product"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProduct(p)}
                            title="Delete product"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EDIT PRODUCT MODAL OVERLAY */}
      {/* ==================================================================== */}
      {editingProduct && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">
                  <i className="bi bi-pencil-square me-2 text-warning"></i>
                  Edit Product #{editingProduct.productId || editingProduct._id}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>
              <form onSubmit={handleUpdateProduct}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-8">
                      <label className="form-label fw-semibold">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        className="form-select"
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label fw-semibold">Color</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingProduct.color}
                        onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Sizes (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingProduct.size}
                        onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-accent">
                    <i className="bi bi-save me-1"></i> Save Changes to MongoDB
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: ADD NEW PRODUCT FORM (POST /api/products) */}
      {/* ==================================================================== */}
      {activeTab === 'add' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white py-3">
            <h5 className="mb-0"><i className="bi bi-plus-circle-fill me-2 text-warning"></i> Add New Product to MongoDB Catalog</h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleAddProduct}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Vintage Leather Biker Jacket"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Category *</label>
                  <select
                    className="form-select"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="2499"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Stock Quantity *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="25"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold">Color *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Navy Blue"
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Available Sizes (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="S, M, L, XL"
                    value={newProduct.size}
                    onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Product Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Product Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe the fabric quality, wash care instructions, fit..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  ></textarea>
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="featuredCheck"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="featuredCheck">
                      Show in Featured / Trending section on Home page
                    </label>
                  </div>
                </div>

                <div className="col-12 mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-accent px-4 py-2 fw-semibold">
                    <i className="bi bi-cloud-arrow-up-fill me-1"></i> Save to Database (POST /api/products)
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveTab('products')}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: VIEW & MANAGE ORDERS (GET /api/orders & PUT /api/orders/:id/status) */}
      {/* ==================================================================== */}
      {activeTab === 'orders' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0"><i className="bi bi-receipt-cutoff me-2 text-warning"></i> Customer Orders from MongoDB</h5>
            <span className="badge bg-secondary">{orders.length} Records</span>
          </div>

          <div className="card-body p-4">
            {orders.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-box2 fs-2 d-block mb-2"></i>
                No customer orders recorded in the system yet.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Email</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total Amount</th>
                      <th>Status (Live Update)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id || o.orderId}>
                        <td>
                          <span className="fw-bold">#{o.orderId || o._id}</span>
                        </td>
                        <td>
                          <div>{o.userId}</div>
                          <small className="text-muted">
                            {o.shippingAddress?.city ? `${o.shippingAddress.city}, ${o.shippingAddress.state}` : ''}
                          </small>
                        </td>
                        <td className="small text-muted">
                          {new Date(o.orderDate || o.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          <span className="badge bg-light text-dark border">
                            {o.products?.length || 1} product(s)
                          </span>
                        </td>
                        <td className="fw-bold text-accent">
                          ₹{(Number(o.totalAmount) || 0).toLocaleString('en-IN')}
                        </td>
                        <td>
                          <select
                            className={`form-select form-select-sm fw-semibold ${
                              o.status === 'Delivered'
                                ? 'text-success'
                                : o.status === 'Shipped'
                                ? 'text-primary'
                                : o.status === 'Cancelled'
                                ? 'text-danger'
                                : 'text-warning'
                            }`}
                            value={o.status || 'Processing'}
                            onChange={(e) => handleStatusChange(o._id || o.orderId, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
