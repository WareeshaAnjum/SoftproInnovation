import React from "react";
import logo from "../assets/logo.png";
import { IoCartOutline } from "react-icons/io5";
import { CiDark } from "react-icons/ci";
const Header = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 p-0">
            <nav className="navbar navbar-expand-lg bg-body-white nav-bg nabar">
              <div className="container-fluid d-flex justify-center align-items-center">
                <a className="navbar-brand" href="#">
                  <img
                    src={logo}
                    alt=""
                    className="image-fluid  logos"
                    width="30px"
                    border
                    border-2
                  />
                </a>
                <p className="pt-3 fw-bold fs-3 ">
                  SoftPro<span className="in">Innovation</span>
                </p>
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
                      <a
                        className="nav-link active"
                        aria-current="page"
                        href="/"
                      >
                        Home
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/about">
                        About
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/product">
                        Product
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/contact">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                  <div className="d-flex ">
                    <div className="btn btn-outline-orangered mx-1 d-flex align-items-center">
                      <CiDark className="icondrk" />
                      <a href="" className="text-decoration-none">
                        Dark
                      </a>
                    </div>
                    <div className="btn btn-outline-orangered mx-1 d-flex align-items-center">
                      <IoCartOutline className="icondrk" />
                      <a href="">Cart</a>
                    </div>
                    <div className="btn btn-outline-orangered">
                      <a href="/login">Login</a>
                    </div>
                    <div className="mx-1 btn btn-orangered">
                      <a href="/register" className="">
                        Register
                      </a>
                    </div>
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
