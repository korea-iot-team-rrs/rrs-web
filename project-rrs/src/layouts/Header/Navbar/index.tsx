import React, { useState } from "react";
import "../../../styles/Header.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    "pet-diary",
    "dang-sitter",
    "community",
    "pet-road",
    "customer-supports",
  ];

  return (
    <>
      <div className="navBar">
        {links.map((link) => (
          <NavLink to={link} key={link} className="navButton">
            {link === "pet-diary"
              ? "댕수첩"
              : link === "dang-sitter"
              ? "댕시터"
              : link === "community"
              ? "댕소통"
              : link === "pet-road"
              ? "댕로드"
              : link === "customer-supports"
              ? "고객센터"
              : link}
          </NavLink>
        ))}
      </div>
    </>
  );
}
