import React, { useState, useEffect } from 'react';

// ==========================================================================
// Contact Component (Demonstrates useEffect for Title & Lifecycle)
// Route: /contact
// ==========================================================================

const Contact = () => {
  useEffect(() => {
    document.title = 'StyleHub | Contact Us';
    console.log('[Lifecycle] Contact Component Mounted');

    return () => {
      console.log('[Lifecycle] Contact Component Unmounted');
    };
  }, []);

  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactData.name && contactData.email && contactData.message) {
      setSubmitted(true);
      setContactData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Get in Touch</h2>
          <p className="text-muted">Have a query or feedback? Our support team is here to assist you 24/7</p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm p-4 h-100 bg-dark text-white rounded-4">
              <h4 className="fw-bold mb-4 text-accent">Contact Information</h4>

              <div className="d-flex align-items-start mb-4">
                <i className="bi bi-geo-alt-fill text-accent fs-4 me-3"></i>
                <div>
                  <h6 className="fw-bold mb-1">Store Address</h6>
                  <p className="text-white-50 mb-0 small">
                    StyleHub Fashion Towers, MG Road, Pune, Maharashtra 411001
                  </p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <i className="bi bi-envelope-fill text-accent fs-4 me-3"></i>
                <div>
                  <h6 className="fw-bold mb-1">Email Support</h6>
                  <p className="text-white-50 mb-0 small">support@stylehub.example</p>
                </div>
              </div>

              <div className="d-flex align-items-start mb-4">
                <i className="bi bi-telephone-fill text-accent fs-4 me-3"></i>
                <div>
                  <h6 className="fw-bold mb-1">Phone Number</h6>
                  <p className="text-white-50 mb-0 small">+91 98765 43210 (Toll Free)</p>
                </div>
              </div>

              <div className="d-flex align-items-start">
                <i className="bi bi-clock-fill text-accent fs-4 me-3"></i>
                <div>
                  <h6 className="fw-bold mb-1">Operating Hours</h6>
                  <p className="text-white-50 mb-0 small">Monday – Sunday: 9:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm p-4 p-md-5 rounded-4">
              <h4 className="fw-bold mb-3">Send Us a Message</h4>

              {submitted && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Thank you! Your message has been received. We will respond shortly.
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="e.g. Rahul Sharma"
                      value={contactData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={contactData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control"
                      placeholder="Order Inquiry, Sizing, or Feedback"
                      value={contactData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control"
                      placeholder="Write your message here..."
                      value={contactData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="col-12 d-grid mt-3">
                    <button type="submit" className="btn btn-accent btn-lg">
                      <i className="bi bi-send-fill me-2"></i> Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
