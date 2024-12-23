import React, { useState } from "react";
import "../../styles/Navbar.css";
import logo from "../../assets/images/logo.png";
import { MAIN_URL } from "../../constants";
import NavAuthLayout from "../NavAuth";

export default function Navbar() {
  const [activeLink, setActiveLink] = useState(""); // 활성 링크 상태 관리

  const handleLogoClick = () => {
    window.location.href = MAIN_URL;
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link); // 활성 링크 업데이트
  };

  return (
    <nav className="navbar">
      <ul>
        <div className="navbar-logo">
          <img
            src={logo}
            alt="Logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      </ul>
      <ul className="navbar-links">
        <li
          className={activeLink === "댕수첩" ? "active" : ""}
          onClick={() => handleLinkClick("댕수첩")}
        >
          댕수첩
        </li>
        <li
          className={activeLink === "댕시터" ? "active" : ""}
          onClick={() => handleLinkClick("댕시터")}
        >
          댕시터
        </li>
        <li
          className={activeLink === "댕소통" ? "active" : ""}
          onClick={() => handleLinkClick("댕소통")}
        >
          댕소통
        </li>
        <li
          className={activeLink === "댕로드" ? "active" : ""}
          onClick={() => handleLinkClick("댕로드")}
        >
          댕로드
        </li>
        <li
          className={activeLink === "고객센터" ? "active" : ""}
          onClick={() => handleLinkClick("고객센터")}
        >
          고객센터
        </li>
      </ul>
      <ul>
        <NavAuthLayout />
      </ul>
    </nav>
  );
}
