import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import bulblogo from './bulblogo.png';
import { TbMenuOrder } from "react-icons/tb";

const Header = ({ isAuth }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid p-3 lnav">
      <div className="row align-items-center">
        {/* Logo Section */}
        <div onClick={handleHomeClick} className="col-lg-2 col-md-2 col-sm-12 logo">
          <img src={bulblogo} className="logo-img" alt="logo" />
          <h6>Lear</h6>
          <h6>Novara</h6>
        </div>

        {/* Navigation Section */}
        <div className="col-lg-8 col-md-8 col-sm-12 nav-cont">
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
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/courses" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Courses
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/tutors" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Tutors
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/notes" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Notes
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/liveclass" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Live
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    to="/about" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    About
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
            <img
              className="acc-pic"
              src="https://avatar.iran.liara.run/public/13"
              height="45px"
              alt="ProfilePic"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
