import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.scss';

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-globe-americas"></i> Travel Blog
        </Link>
        
        <button
          className={`navbar-toggler ${!isNavCollapsed ? 'active' : ''}`}
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${!isNavCollapsed ? 'show' : ''}`}>
          {token ? (
            <>
              <Link to="/" className="nav-link">
                <i className="bi bi-house"></i> Home
              </Link>
              <Link to="/create" className="nav-link">
                <i className="bi bi-plus-circle"></i> Create Blog
              </Link>
              <button className="nav-link sign-out" onClick={handleSignOut}>
                <i className="bi bi-box-arrow-right"></i> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <i className="bi bi-box-arrow-in-right"></i> Login
              </Link>
              <Link to="/signup" className="nav-link sign-up">
                <i className="bi bi-person-plus"></i> Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;