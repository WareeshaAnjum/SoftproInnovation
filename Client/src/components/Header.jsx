import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { CiDark, CiLight } from "react-icons/ci";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = (e) => {
    e.preventDefault();
    toggleTheme();
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 p-0">
            <nav className="navbar navbar-expand-lg bg-body-white nav-bg nabar">
              <div className="container-fluid d-flex justify-center align-items-center">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                  <img
                    src={logo}
                    alt="SoftPro Innovation Logo"
                    className="image-fluid logos"
                    width="32px"
                  />
                </Link>
                <Link to="/" className="text-decoration-none text-dark pt-1 fw-bold fs-3 mb-0 me-3">
                  Softpro<span style={{ color: "#c2410c" }}>Innovation</span>
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon" />
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                        to="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                        to="/about"
                      >
                        About
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/products" ? "active-products-link" : ""}`}
                        to="/products"
                      >
                        Products
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className={`nav-link ${location.pathname === "/contact" ? "active" : ""}`}
                        to="/contact"
                      >
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="btn btn-outline-orangered mx-1 d-flex align-items-center gap-1"
                      style={{ fontSize: "14px", padding: "6px 12px" }}
                      aria-label="Toggle light and dark theme"
                    >
                      {isDark ? <CiLight className="icondrk" /> : <CiDark className="icondrk" />}
                      <span>{isDark ? "Light" : "Dark"}</span>
                    </button>
                    <Link
                      to="/profile"
                      className="btn mx-1 d-flex align-items-center gap-1"
                      style={{
                        backgroundColor: "#c2410c",
                        color: "#ffffff",
                        fontSize: "14px",
                        padding: "6px 14px",
                        textDecoration: "none",
                        fontWeight: "500",
                        borderRadius: "6px",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>👤</span>
                      <span>Dashboard</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
