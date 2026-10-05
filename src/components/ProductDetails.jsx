import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';

// ==============================================================================
// ProductDetails Component (MERN Integration)
// Flow: React useParams(:id) -> Axios GET /api/products/:id -> Express -> MongoDB
// ==============================================================================

const ProductDetails = ({ products = [], onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      // Check if product is already cached in memory
      const cached = products.find(
        (p) => String(p.id) === String(id) || String(p.productId) === String(id) || String(p._id) === String(id)
      );

      if (cached) {
        if (isMounted) {
          setProduct(cached);
          const firstSize = Array.isArray(cached.sizesArray) && cached.sizesArray.length
            ? cached.sizesArray[0]
            : typeof cached.size === 'string'
            ? cached.size.split(',')[0].trim()
            : 'M';
          setSelectedSize(firstSize);
          document.title = `StyleHub | ${cached.name}`;
          setLoading(false);
        }
        return;
      }

      // If not in cache, fetch directly from MongoDB through Express REST API
      try {
        const fetched = await fetchProductById(id);
        if (isMounted) {
          setProduct(fetched);
          const firstSize = Array.isArray(fetched.sizesArray) && fetched.sizesArray.length
            ? fetched.sizesArray[0]
            : typeof fetched.size === 'string'
            ? fetched.size.split(',')[0].trim()
            : 'M';
          setSelectedSize(firstSize);
          document.title = `StyleHub | ${fetched.name}`;
        }
      } catch (err) {
        console.error('[Product Details Error]', err);
        if (isMounted) {
          setError(err.message || 'Product not found in MongoDB catalog.');
          document.title = 'StyleHub | Product Not Found';
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, products]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-accent my-5" role="status">
          <span className="visually-hidden">Loading product details...</span>
        </div>
        <p className="text-muted">Fetching product document from MongoDB...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <i className="bi bi-exclamation-diamond text-warning" style={{ fontSize: '4rem' }}></i>
          <h3 className="fw-bold mt-3">Product Not Found</h3>
          <p className="text-muted">{error || `No product with identifier "${id}" exists in the database.`}</p>
          <button onClick={() => navigate('/products')} className="btn btn-accent mt-2">
            &larr; Back to Products Catalog
          </button>
        </div>
      </div>
    );
  }

  // Derive sizes array
  const availableSizes = Array.isArray(product.sizesArray) && product.sizesArray.length
    ? product.sizesArray
    : typeof product.size === 'string'
    ? product.size.split(',').map((s) => s.trim()).filter(Boolean)
    : ['S', 'M', 'L', 'XL'];

  const handleAddToCartClick = () => {
    onAddToCart({
      ...product,
      id: product.id || product.productId || product._id,
      size: selectedSize,
      quantity: quantity
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  return (
    <div className="py-5">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none text-muted">Products</Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        {addedAlert && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Added <strong>{quantity}x {product.name} ({selectedSize})</strong> to your shopping cart!
            <button
              onClick={() => navigate('/cart')}
              className="btn btn-sm btn-outline-success ms-3"
            >
              Go to Cart &rarr;
            </button>
          </div>
        )}

        <div className="row g-5 align-items-center">
          {/* Product Image */}
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm overflow-hidden rounded-4">
              <img
                src={product.image}
                alt={product.name}
                className="img-fluid w-100"
                style={{ maxHeight: '480px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-dark text-uppercase">{product.category}</span>
              <span className={`badge ${product.stock < 10 ? 'bg-danger' : 'bg-success'}`}>
                {product.stock < 10 ? `Low Stock: Only ${product.stock} left` : `In Stock (${product.stock} units)`}
              </span>
              <span className="badge bg-light text-muted border">MongoDB Document</span>
            </div>

            <h1 className="h2 fw-bold mb-2">{product.name}</h1>
            <h3 className="text-accent fw-bold mb-3">₹{Number(product.price).toLocaleString('en-IN')}</h3>

            <p className="text-muted mb-4">{product.description}</p>

            <hr />

            {/* Size Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-block">Available Sizes:</label>
              <div className="d-flex flex-wrap gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`btn btn-sm px-3 py-2 ${
                      selectedSize === s ? 'btn-dark' : 'btn-outline-secondary'
                    }`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold d-block">Quantity:</label>
              <div className="d-flex align-items-center gap-2" style={{ maxWidth: '160px' }}>
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="form-control text-center fw-bold">{quantity}</span>
                <button
                  className="btn btn-outline-secondary btn-sm px-3"
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={quantity >= (product.stock || 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-wrap gap-3">
              <button
                className="btn btn-accent btn-lg px-4 flex-grow-1"
                onClick={handleAddToCartClick}
                disabled={product.stock <= 0}
              >
                <i className="bi bi-cart-plus me-2"></i> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                className="btn btn-outline-dark btn-lg px-4"
                onClick={() => navigate('/cart')}
              >
                <i className="bi bi-bag-check me-2"></i> View Cart
              </button>
            </div>

            <div className="mt-4 pt-3 border-top d-flex gap-4 text-muted small">
              <div><i className="bi bi-truck text-accent me-1"></i> Fast Delivery</div>
              <div><i className="bi bi-arrow-repeat text-accent me-1"></i> 7-Day Returns</div>
              <div><i className="bi bi-shield-check text-accent me-1"></i> 100% Genuine</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
