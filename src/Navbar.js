// Copyright (c) 2024 The File Vault Authors. All rights reserved.
// Use of this source code is governed by a MIT license that can be found in the LICENSE file.

import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';
import logo from './file-vault-center.png';

const Navbar = ({ isDarkMode, toggleDarkMode, onGenerateToken }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-header">
      <div className="navbar-brand">
        <img src={logo} alt="File Vault Logo" className="navbar-logo" />
        <h1 className="navbar-title">File Vault</h1>
      </div>

      <button
        type="button"
        className="hamburger-menu"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      <div className={`navbar-collapse ${menuOpen ? 'open' : ''}`}>
        <div className="navbar-links">
          <NavLink to="/" end onClick={closeMenu}>Upload</NavLink>
          <NavLink to="/download" onClick={closeMenu}>Download</NavLink>
          <NavLink to="/upload-metadata" onClick={closeMenu}>Upload Metadata</NavLink>
          <NavLink to="/upload-document" onClick={closeMenu}>Upload Document</NavLink>
          <NavLink to="/soft-delete" onClick={closeMenu}>Soft Delete</NavLink>
          <NavLink to="/version-rollback" onClick={closeMenu}>Version Rollback</NavLink>
        </div>

        <div className="navbar-controls">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            className="token-btn"
            onClick={onGenerateToken}
            title="Generate a new session token"
          >
            Generate Token
          </button>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
  onGenerateToken: PropTypes.func.isRequired,
};

export default Navbar;
