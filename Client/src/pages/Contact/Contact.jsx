import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../Home/Footer";
import {
  GeoAltFill,
  TelephoneFill,
  EnvelopeFill,
  ClockFill,
  ArrowRight,
} from "react-bootstrap-icons";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate contact submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        email: "",
        category: "",
        subject: "",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="contact-page-wrapper">
      <Header />

      {/* Hero Header */}
      <section className="contact-hero-section">
        <div className="contact-hero-bg-shapes">
          <div className="shape-circle shape-1" />
          <div className="shape-circle shape-2" />
        </div>
        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-8 py-5">
              <div className="contact-breadcrumb mb-2">
                <Link to="/" className="breadcrumb-link">
                  Home
                </Link>{" "}
                <span className="breadcrumb-separator">&gt;</span>{" "}
                <span className="breadcrumb-current">Contact Us</span>
              </div>
              <h1 className="contact-hero-title my-3">
                We'd Love to <span className="font-italic-accent">Hear</span> from You
              </h1>
              <p className="contact-hero-description mb-0">
                Got a technical question, need help with an order, or just want to say hi? We respond to every message within one business day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="contact-main-section py-5">
        <div className="container py-lg-4">
          <div className="row g-4">
            {/* Left Column: Contact Info & Quick Help */}
            <div className="col-lg-4 col-md-5">
              {/* Contact Info Card */}
              <div className="contact-card info-card mb-4">
                <h3 className="card-heading mb-4">
                  Contact <span className="font-italic-accent">Info</span>
                </h3>

                <div className="contact-info-list">
                  {/* Address */}
                  <div className="contact-info-item d-flex align-items-start gap-3 mb-4">
                    <div className="contact-icon-box">
                      <GeoAltFill className="contact-icon" />
                    </div>
                    <div>
                      <div className="info-label text-uppercase">ADDRESS</div>
                      <div className="info-text">
                        <strong>Softpro House</strong>
                        <br />
                        3/213, Sec-J, Jankipuram, Kursi Road
                        <br />
                        Near Gudamba Police Station
                        <br />
                        Lucknow - 226021,
                        <br />
                        Uttar Pradesh, India
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="contact-info-item d-flex align-items-start gap-3 mb-4">
                    <div className="contact-icon-box">
                      <TelephoneFill className="contact-icon" />
                    </div>
                    <div>
                      <div className="info-label text-uppercase">PHONE</div>
                      <div className="info-text">
                        <a href="tel:+916391276203" className="info-link">
                          +91 63912 76203
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="contact-info-item d-flex align-items-start gap-3 mb-4">
                    <div className="contact-icon-box">
                      <EnvelopeFill className="contact-icon" />
                    </div>
                    <div>
                      <div className="info-label text-uppercase">EMAIL</div>
                      <div className="info-text">
                        <a href="mailto:info@softproinnovation.com" className="info-link">
                          info@softproinnovation.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="contact-info-item d-flex align-items-start gap-3">
                    <div className="contact-icon-box">
                      <ClockFill className="contact-icon" />
                    </div>
                    <div>
                      <div className="info-label text-uppercase">BUSINESS HOURS</div>
                      <div className="info-text">
                        <strong>Mon – Sat: 9:00 AM – 7:00 PM</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="contact-card quick-help-card">
                <h4 className="card-heading mb-3">Quick Help</h4>
                <div className="quick-help-list">
                  <Link to="/products" className="quick-help-item d-flex justify-content-between align-items-center">
                    <span className="d-flex align-items-center gap-2">
                      <span className="quick-help-emoji">📦</span>
                      <span className="quick-help-title">Track your order</span>
                    </span>
                    <span className="quick-help-arrow">⇄</span>
                  </Link>

                  <Link to="/about" className="quick-help-item d-flex justify-content-between align-items-center">
                    <span className="d-flex align-items-center gap-2">
                      <span className="quick-help-emoji">🔄</span>
                      <span className="quick-help-title">Return &amp; refund policy</span>
                    </span>
                    <span className="quick-help-arrow">⇄</span>
                  </Link>

                  <a href="mailto:support@softproinnovation.com" className="quick-help-item d-flex justify-content-between align-items-center">
                    <span className="d-flex align-items-center gap-2">
                      <span className="quick-help-emoji">🔧</span>
                      <span className="quick-help-title">Technical support</span>
                    </span>
                    <span className="quick-help-arrow">⇄</span>
                  </a>

                  <a href="mailto:b2b@softproinnovation.com" className="quick-help-item d-flex justify-content-between align-items-center">
                    <span className="d-flex align-items-center gap-2">
                      <span className="quick-help-emoji">💼</span>
                      <span className="quick-help-title">Bulk / B2B orders</span>
                    </span>
                    <span className="quick-help-arrow">⇄</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Send Us a Message Form */}
            <div className="col-lg-8 col-md-7">
              <div className="contact-card form-card">
                <h3 className="card-heading mb-1">
                  Send Us a <span className="font-italic-accent">Message</span>
                </h3>
                <p className="card-subheading mb-4">
                  Fill in the form and our team will get back to you within 24 hours.
                </p>

                {submitted && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
                    <span>✅</span>
                    <div>Thank you! Your message has been sent successfully. We will get back to you soon.</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label contact-form-label">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="form-control contact-input"
                        placeholder="Arjun Sharma"
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6">
                      <label className="form-label contact-form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control contact-input"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label contact-form-label">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-select contact-input"
                      >
                        <option value="">Select a topic...</option>
                        <option value="Order Tracking & Delivery">Order Tracking &amp; Delivery</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Bulk / B2B Inquiry">Bulk / B2B Inquiry</option>
                        <option value="Returns & Refunds">Returns &amp; Refunds</option>
                        <option value="General Question">General Question</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div className="col-md-6">
                      <label className="form-label contact-form-label">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-control contact-input"
                        placeholder="Brief summary"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label className="form-label contact-form-label">Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        className="form-control contact-input"
                        placeholder="Tell us how we can help..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-contact-submit">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
