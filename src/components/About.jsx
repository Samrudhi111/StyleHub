import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ==========================================================================
// About Component
// Route: /about
// ==========================================================================

const About = () => {
  useEffect(() => {
    document.title = 'StyleHub | About Us';
  }, []);

  return (
    <div className="py-5">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="section-title">About StyleHub</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            A contemporary online clothing brand delivering quality fashion, honest prices, and seamless shopping.
          </p>
        </div>

        {/* Story & Highlights */}
        <div className="row g-4 align-items-center mb-5">
          <div className="col-12 col-lg-6">
            <h3 className="fw-bold mb-3">Redefining Everyday Fashion</h3>
            <p className="text-muted">
              StyleHub was founded to bring accessible, trendsetting, and durable clothing directly to fashion enthusiasts across the country. From classic oxford shirts and timeless denim to elegant ethnic kurtis and playful kids wear, we craft collections for every occasion.
            </p>
            <p className="text-muted">
              Our platform offers instantaneous browsing, responsive client-side filtering, fast checkout, and dependable customer support around the clock.
            </p>
            <Link to="/products" className="btn btn-accent px-4 mt-2">
              Browse Our Catalog &rarr;
            </Link>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm p-4 bg-light rounded-4">
              <h5 className="fw-bold mb-3 text-dark">
                <i className="bi bi-patch-check-fill text-accent me-2"></i> Why Choose StyleHub?
              </h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Premium Quality Fabrics:</strong> Rigorously tested for comfort and longevity.
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Transparent Sizing:</strong> Standard fittings for Men, Women, and Kids.
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Instant Search &amp; Filter:</strong> Find your favorite outfits within seconds.
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Safe &amp; Encrypted Checkout:</strong> Verified payments with reliable order tracking.
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Hassle-Free Returns:</strong> 7-day easy exchange and return policy.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
