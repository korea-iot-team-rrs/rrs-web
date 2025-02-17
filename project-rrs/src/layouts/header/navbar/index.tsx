import React from "react";
import { NavLink } from "react-router-dom";
import "../../../styles/layout/header.css";

export default function Navbar() {
  const links = [
    "pet-diary",
    "dang-sitter",
    "community",
    "pet-road",
    "announcements",
    "customer-support",
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
              : link === "customer-support"
              ? "고객센터"
              : link
              ? "공지사항"
              : link === "announcements"}
          </NavLink>
        ))}
      </div>
    </>
  );
}
