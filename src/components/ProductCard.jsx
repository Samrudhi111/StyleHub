import React from 'react';
import { Link } from 'react-router-dom';

// ==========================================================================
// ProductCard Component (Demonstrates Props & React Router Link)
// Props: id, name, price, category, size, image, stock, onAddToCart
// ==========================================================================

const ProductCard = ({ id, name, price, category, size, image, stock, onAddToCart }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div className="card product-card h-100 shadow-sm">
        {/* Clickable Product Image navigating to /products/:id */}
        <Link to={`/products/${id}`} className="product-img-wrapper d-block text-decoration-none">
          <img src={image} alt={name} className="product-img" loading="lazy" />
          <span className="product-badge-category">{category}</span>
          <span className={`product-badge-stock ${stock < 10 ? 'bg-danger text-white' : 'bg-success text-white'}`}>
            {stock < 10 ? `Only ${stock} left` : 'In Stock'}
          </span>
        </Link>

        {/* Product Information */}
        <div className="card-body d-flex flex-column p-3">
          <h6 className="card-title fw-bold text-truncate mb-1">
            <Link to={`/products/${id}`} className="text-dark text-decoration-none" title={name}>
              {name}
            </Link>
          </h6>
          
          <div className="mb-2">
            <small className="text-muted">Sizes: </small>
            <span className="product-size-badge">{size}</span>
          </div>

          <div className="mt-auto pt-2 d-flex align-items-center justify-content-between">
            <span className="product-price">₹{price.toLocaleString('en-IN')}</span>
            
            <div className="btn-group">
              <Link
                to={`/products/${id}`}
                className="btn btn-sm btn-outline-secondary"
                title="View Product Details"
              >
                <i className="bi bi-eye"></i>
              </Link>
              <button
                className="btn btn-sm btn-accent"
                onClick={() => onAddToCart({ id, name, price, size, image, stock })}
                title="Add to Shopping Cart"
              >
                <i className="bi bi-cart-plus me-1"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
