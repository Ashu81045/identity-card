import React, { useState } from 'react';
import './Header.css'; // Import CSS file for styling
import { Link } from 'react-router-dom'; // Import Link component from React Router
import logoImage from '../assets/EC.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      {/* Use the imported logo image */}
      <div className='logo-container'>
        <img src={logoImage} alt="Logo" className="logo" height={40} width={40} />
        <div className="logo-text">Election Commission</div>
      </div>

      <div className="menu-icon" onClick={toggleMenu}>
        &#9776; {/* Hamburger icon for the menu */}
      </div>

      <nav className={`menu ${isMenuOpen ? 'open' : 'close'}`}>
        {/* Use Link component for navigation */}
        <Link to="/" className="menu-item">Home</Link>
        <Link to="/admin" className="menu-item">Admin</Link>
        <Link to="/track" className="menu-item">Track</Link>
        <Link to="/contact" className="menu-item">Contact Us</Link>
      </nav>
    </header>
  );
};

export default Header;
