import React from 'react'
import Logo from './logo';
import Navbar from './navbar';
import NavAuth from './nav-auth';
import "../../styles/layout/header.css";

export default function Header() {
  return (
    <nav className="header">
      <Logo />
      <Navbar />
      <NavAuth />
    </nav>
  )
}
