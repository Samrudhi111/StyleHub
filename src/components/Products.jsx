import React, { useState, useEffect } from 'react';
import ProductList from './ProductList';

// ==============================================================================
// Products Component (MERN Product Listing & Search/Filter)
// MongoDB -> Express GET /api/products -> Axios -> React State -> UI Rendering
// ==============================================================================

const Products = ({
  products = [],
  loading = false,
  error = null,
  onRefresh,
  selectedCategory: initialCategory = 'All',
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const categories = ['All', 'Men', 'Women', 'Kids', 'Accessories'];

  useEffect(() => {
    document.title = `StyleHub | Clothing Products (${selectedCategory})`;
  }, [selectedCategory]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Frontend search and category filtering on retrieved MongoDB product dataset
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (product.category || '').toLowerCase() === selectedCategory.toLowerCase();

    const query = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (product.name || '').toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query) ||
      (product.color || '').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const categoryInventoryWorth = filteredProducts.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.stock) || 1),
    0
  );

  return (
    <section className="py-5">
      <div className="container">
        {/* Section Title */}
        <div className="text-center mb-4">
          <span className="badge bg-dark text-accent text-uppercase mb-2">Live Store Catalog</span>
          <h2 className="section-title">Clothing Collection</h2>
          <p className="text-muted">
            Directly retrieved from MongoDB via Express REST API. Filter by category or search in real time.
          </p>
        </div>

        {/* Error Handling Alert */}
        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center mb-4" role="alert">
            <div>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>API Error:</strong> {error}
            </div>
            {onRefresh && (
              <button className="btn btn-outline-danger btn-sm" onClick={onRefresh}>
                <i className="bi bi-arrow-clockwise me-1"></i> Retry
              </button>
            )}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="filter-wrapper mb-4">
          <div className="row g-3 align-items-center justify-content-between">
            {/* Search Input */}
            <div className="col-12 col-md-5">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products by title, color, style..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    title="Clear search"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Buttons */}
            <div className="col-12 col-md-7">
              <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`btn btn-outline-accent ${
                      selectedCategory === cat ? 'active' : ''
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Status Indicator Bar */}
        <div className="alert alert-secondary d-flex flex-wrap justify-content-between align-items-center py-2 px-3 mb-4 rounded-3">
          <div>
            <i className="bi bi-tags-fill text-accent me-1"></i>
            <span>
              Showing <strong>{filteredProducts.length} product(s)</strong> in{' '}
              <em>{selectedCategory}</em>
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
            {onRefresh && (
              <button
                className="btn btn-sm btn-link text-decoration-none text-muted py-0"
                onClick={onRefresh}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-1"></i> Refresh Catalog
              </button>
            )}
            <span className="badge bg-dark fs-6">
              ₹{categoryInventoryWorth.toLocaleString('en-IN')} Stock Value
            </span>
          </div>
        </div>

        {/* Loading State Indicator */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-accent" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading products from MongoDB...</span>
            </div>
            <p className="mt-3 text-muted">Retrieving catalog from Express REST API...</p>
          </div>
        ) : (
          /* Product Grid */
          <ProductList products={filteredProducts} onAddToCart={onAddToCart} />
        )}
      </div>
    </section>
  );
};

export default Products;
