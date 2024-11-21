import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

import bulblogo from './bulblogo.png';
import { TbMenuOrder } from "react-icons/tb";

const Header = ({ isAuth }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); 
  };

  return (
    <div className="container-fluid p-3">
      <div className="row align-items-center">
        {/* Logo Section */}
        <div onClick={handleHomeClick} className="col-lg-3 col-md-3 col-sm-12 logo">
          <img src={bulblogo} className="logo-img" alt="logo" />
          <h1>Lear</h1><h1>Novara</h1>
        </div>

        {/* Navigation Section */}
        <div className="col-lg-7 col-md-7 col-sm-12">
          <nav className="navbar navbar-expand-lg navbar-expand-md navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <TbMenuOrder />
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to={"/"}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/about"}>About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/courses"}>Courses</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Authentication Buttons */}
        <div className="col-lg-2 col-md-2 col-sm-12 text-lg-right text-center">
          {isAuth ? (
            <Link to="/account">
              <button className="btn btn-outline-primary mx-1">Account</button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="btn btn-outline-primary mx-1">Login</button>
            </Link>
          )}
          {!isAuth ? (
            <Link to="/register">
              <button className="btn btn-primary mx-1">Register</button>
            </Link>
          ) : (
            <img src="https://avatar.iran.liara.run/public/13" height="45px" alt="ProfilePic" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
