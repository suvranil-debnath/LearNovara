import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import Chat from "../Chat/Chat";

import bulblogo from './bulblogo.png';
import { TbMenuOrder } from "react-icons/tb";

const Header = ({ isAuth }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid p-3 lnav">
      <Chat />
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
                  <NavLink className="nav-link" to="/" activeClassName="active">
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about" activeClassName="active">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/courses" activeClassName="active">
                    Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#tutor-section">
                    Tutors
                  </a>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/notes" activeClassName="active">
                    Notes
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Authentication Buttons */}
        <div className="col-lg-2 col-md-2 col-sm-12 text-lg-right text-center">
          {isAuth ? (
            <NavLink to="/account">
              <button className="btn btn-outline-primary mx-1">Account</button>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button className="btn btn-outline-primary mx-1">Login</button>
            </NavLink>
          )}
          {!isAuth ? (
            <NavLink to="/register">
              <button className="btn btn-primary mx-1">Register</button>
            </NavLink>
          ) : (
            <img className="acc-pic" src="https://avatar.iran.liara.run/public/13" height="45px" alt="ProfilePic" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
