import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUserShield } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Hide public navbar on admin pages
  const isAdminPage = location.pathname.toLowerCase().startsWith("/admin");
  if (isAdminPage) return null;

  // Scrolled class for elevated nav shadow
  useEffect(() => {
    const handleScrollState = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScrollState, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  // Scrollspy
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["home", "pets", "about", "adoption", "contact"];
    const handleScroll = () => {
      const scrollY = window.scrollY + 130;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, targetId) => {
    setMobileOpen(false);
    if (location.pathname === "/") {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="site-navbar">
      <div className="navbar-inner">
        <a
          href="/#home"
          className="logo-link"
          onClick={(e) => handleNavClick(e, "home")}
          id="nav-brand-logo"
        >
          <img src={logo} alt="Paw Shelter logo" className="logo-image" />
          <span className="logo-text">PAW <span>SHELTER</span></span>
        </a>

        <button
          className="mobile-toggle"
          id="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`nav-list ${mobileOpen ? "open" : ""}`} id="nav-menu">
          {[
            { id: "home",     label: "Home" },
            { id: "pets",     label: "Adoptable Pets" },
            { id: "about",    label: "About" },
            { id: "adoption", label: "Adoption Process" },
            { id: "contact",  label: "Contact" },
          ].map(({ id, label }) => (
            <li key={id}>
              <a
                href={`/#${id}`}
                className={`nav-link ${activeSection === id ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, id)}
                id={`nav-link-${id}`}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <Link
              to="/admin"
              className="nav-admin-btn"
              onClick={() => setMobileOpen(false)}
              id="nav-link-admin"
            >
              <FaUserShield /> Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}