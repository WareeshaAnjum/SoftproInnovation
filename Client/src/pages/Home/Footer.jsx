import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import {
  GeoAltFill,
  TelephoneFill,
  EnvelopeFill,
  ClockFill,
} from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="footer-section pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">
          {/* Column 1: Brand & Socials */}
          <div className="col-lg-3 col-md-6">
            <h3 className="fw-bold mb-3 brand-heading">
              <span className="text-white">Softpro</span>
              <span className="brand-accent">Innovation</span>
            </h3>
            <p className="footer-description pe-lg-3">
              Your trusted source for microcontrollers, single-board computers,
              and electronics components in India.
            </p>
            <div className="d-flex gap-2 mt-4">
              <a href="#" className="social-icon-btn">
                <FaFacebookF />
              </a>
              <a href="#" className="social-icon-btn">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon-btn">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon-btn">
                <FaYoutube />
              </a>
              <a href="#" className="social-icon-btn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-column-heading mb-3">Quick Links</h6>
            <ul className="list-unstyled footer-links mb-0">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Products</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-column-heading mb-3">Categories</h6>
            <ul className="list-unstyled footer-links mb-0">
              <li>
                <a href="#">Raspberry Pi</a>
              </li>
              <li>
                <a href="#">Arduino</a>
              </li>
              <li>
                <a href="#">ESP32 / ESP8266</a>
              </li>
              <li>
                <a href="#">Sensors</a>
              </li>
              <li>
                <a href="#">Displays</a>
              </li>
              <li>
                <a href="#">Power Modules</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="col-lg-2 col-md-6">
            <h6 className="footer-column-heading mb-3">Support</h6>
            <ul className="list-unstyled footer-links mb-0">
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Return Policy</a>
              </li>
              <li>
                <a href="#">Shipping Info</a>
              </li>
              <li>
                <a href="#">FAQs</a>
              </li>
              <li>
                <a href="#">Track Order</a>
              </li>
            </ul>
          </div>

          {/* Column 5: Get In Touch */}
          <div className="col-lg-3 col-md-6">
            <h6 className="footer-column-heading mb-3">Get In Touch</h6>
            <div className="d-flex flex-column gap-3 contact-info">
              <div className="d-flex align-items-start gap-2">
                <GeoAltFill className="contact-icon mt-1 flex-shrink-0" />
                <div className="contact-text">
                  <strong className="text-white">Softpro House</strong>
                  <br />
                  3/213, Sec-J, Jankipuram, Kursi Road
                  <br />
                  Near Gudamba Police Station
                  <br />
                  Lucknow - 226021
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <TelephoneFill className="contact-icon flex-shrink-0" />
                <a href="tel:+917830198385" className="contact-link">
                  +91 78301 98385
                </a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <EnvelopeFill className="contact-icon flex-shrink-0" />
                <a
                  href="mailto:pushkar.sofptro@gmail.com"
                  className="contact-link"
                >
                  pushkar.sofptro@gmail.com
                </a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <ClockFill className="contact-icon flex-shrink-0" />
                <span className="contact-text">
                  Mon – Sat: 10:00 AM – 7:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <hr className="footer-divider mt-5 mb-3" />

      {/* Footer Bottom */}
      <div className="container">
        <div className="row align-items-center footer-bottom-text">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            © 2026 SoftproInnovation. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            Designed & Developed by Softpro India Computer Technology Pvt. Ltd
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
