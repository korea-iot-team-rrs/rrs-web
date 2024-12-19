import React from 'react'
import './Navbar.css'; 
import logo from '../../../assets/images/logo.png';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="navbar-links">
        <li>댕수첩</li>
        <li>댕시터</li>
        <li>댕소통</li>
        <li>고객센터</li>
      </ul>
      <ul>
        {/* 로그인 들어와야함 */}
      </ul>
    </nav>
  );
}