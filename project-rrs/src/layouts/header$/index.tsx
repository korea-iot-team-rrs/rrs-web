import React from "react";
import Navbar from "./navbar$";
import NavAuth from "./nav-auth$";
import "../../styles/Header.css";
import Logo from "./logo$";

export default function Header() {
  return (
    <nav className="header">
      <Logo />
      <Navbar />
      <NavAuth />
    </nav>
  );
}
