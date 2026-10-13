import React from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaHeart } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  // Hide footer on admin pages
  if (location.pathname.toLowerCase().startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <h3>PAW <span>SHELTER</span></h3>
            <p>
              Dedicated to rescuing, rehabilitating, and rehoming stray dogs and cats across the Philippines. Every pet deserves a warm home and a gentle touch.
            </p>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4>Get In Touch</h4>
            <ul>
              <li>📞 +63 900 000 0000</li>
              <li>📞 +63 900 000 0001</li>
              <li>✉️ pawshelter@gmail.com</li>
              <li>⏰ Daily: 9:00 AM – 5:00 PM</li>
            </ul>
          </div>

          {/* Shelter Facility */}
          <div className="footer-col">
            <h4>Our Facility</h4>
            <p>
              Aurora Boulevard cor. Katipunan Avenue, Loyola Heights, Quezon City, Metro Manila, Philippines 1108
            </p>
          </div>

          {/* Developers & Advocacy */}
          <div className="footer-col">
            <h4>Connect With Us</h4>
            <p style={{ marginBottom: "12px" }}>Follow our rescue missions and community adoption drives:</p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X Twitter">
                <FaXTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Paw Shelter. Made with <FaHeart style={{ color: "#ef4444", verticalAlign: "middle" }} /> for our rescue animals.
          </p>
          <Link to="/admin" className="footer-admin-link" id="footer-admin-login-link">
            Admin Staff Access
          </Link>
        </div>
      </div>
    </footer>
  );
}
