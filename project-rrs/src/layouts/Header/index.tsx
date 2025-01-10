import React from 'react'
import Navbar from './Navbar'
import NavAuth from './NavAuth'
import '../../styles/Header.css';
import Logo from './Logo';

export default function Header() {
  return (
    <nav className="header">
      <Logo />
      <Navbar />
      {/* <NavAuth /> */}
    </nav>
  )
}