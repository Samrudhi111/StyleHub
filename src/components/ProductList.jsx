import React from 'react';
import ProductCard from './ProductCard';

// ==========================================================================
// ProductList Component (Demonstrates Props passing to child components)
// Props received: products (Array of objects), onAddToCart (Callback function)
// ==========================================================================

const ProductList = ({ products, onAddToCart }) => {
  if (!products || products.length === 0) {
    return (
      <div className="col-12 text-center py-5">
        <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
        <h5 className="mt-3 text-muted">No matching products found</h5>
        <p className="text-muted small">Try searching for a different keyword or choose another category.</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {products.map((product) => (
        // Demonstrating props passed from ProductList down to ProductCard
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          size={product.size}
          image={product.image}
          stock={product.stock}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductList;
