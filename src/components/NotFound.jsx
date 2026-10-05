import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================================================
// NotFound Component (Catches 404 Unmatched Routes)
// Route: *
// ==========================================================================

const NotFound = () => {
  useEffect(() => {
    document.title = 'StyleHub | 404 - Page Not Found';
  }, []);

  return (
    <div className="container py-5 text-center my-auto">
      <div className="py-5">
        <h1 className="display-1 fw-bold text-accent">404</h1>
        <h3 className="fw-bold mb-3">Page Not Found</h3>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: '450px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-accent btn-lg px-4">
          <i className="bi bi-house-door me-2"></i> Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
