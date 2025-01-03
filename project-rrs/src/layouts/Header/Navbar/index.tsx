import React, { useState } from "react";
import "../../../styles/Header.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    "petDiary",
    "dang-sitter",
    "community",
    "petRoad",
    "CustomerSupports",
  ];

  return (
    <>
      <div className="navBar">
        {links.map((link) => (
          <NavLink to={link} key={link} className="navButton">
            {link === "petDiary"
              ? "댕수첩"
              : link === "dang-sitter"
              ? "댕시터"
              : link === "community"
              ? "댕소통"
              : link === "petRoad"
              ? "댕로드"
              : link === "CustomerSupports"
              ? "고객센터"
              : link}
          </NavLink>
        ))}
      </div>
    </>
  );
}
