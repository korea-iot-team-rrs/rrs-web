import React from "react";

import Logo from "./logo";
import NavAuth from "./nav-auth";
import Navbar from "./navbar";

export default function Header() {
  return (
    <nav className="header">
      <Logo />
      <Navbar />
      <NavAuth />
    </nav>
  );
}
