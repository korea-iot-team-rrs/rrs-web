import React from "react";
<<<<<<< HEAD
import Navbar from "./navbar";
import NavAuth from "./nav-auth";
import "../../styles/Header.css";
import Logo from "./logo";
=======
import Logo from "./logo";
import NavAuth from "./nav-auth";
import Navbar from "./navbar";
>>>>>>> develop

export default function Header() {
  return (
    <nav className="header">
      <Logo />
      <Navbar />
      <NavAuth />
    </nav>
  );
}
