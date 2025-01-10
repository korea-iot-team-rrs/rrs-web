import React from "react";
import "../../../styles/Login.css";
import { Link } from "@mui/material";
import rrsLogo from "../../../assets/rrs_main_assets/rrs_logo_sq_01.png";
import naverLogo from "../../../assets/logo/naver-icon-file.png";
import kakaoLogo from "../../../assets/logo/kakaotalk_logo.png";
import "../../../styles/auth/SignUpList.css";
import logo from "../../../assets/rrs_main_assets/rrs_main_logo.png";
import { useNavigate } from "react-router-dom";

const signUplinks = [
  { id: "rrs", name: "RRS", link: "/signup/rrs", logo: rrsLogo },
  { id: "naver", name: "Naver", link: "/", logo: naverLogo },
  { id: "kakao", name: "Kakao", link: "/", logo: kakaoLogo },
];

export default function SignUpMain() {
  const navigation = useNavigate();

  const onButtonClickHandler = (id: string) => {
    if (id === 'rrs') {
      navigation(id);
    }
    window.location.href = `http://localhost:8081/api/v1/auth/sns-sign-in/${id}`;
};

  return (
    <>
      <div className="sns-signup-wrapper">
        <img src={logo} alt="MainLogo" />
        <h4>회원가입 페이지입니다.</h4>
        <div className="sns-signup-links">
          <ul>
            {signUplinks.map((link) => (
              <li key={link.id}>
                <img
                  className="sns-signup-logo"
                  src={link.logo}
                  alt={`${link.name} logo`}
                />
                <div className="sns-signup-link" onClick={() => onButtonClickHandler('id')}>
                  {link.name}
                </div>
              </li>
            ))}
          </ul>
          <div className="go-back-to-login">
            <Link
              href="/login"
              sx={{
                fontSize: "12px",
                color: "#727272",
                textDecoration: "none",
                ":hover": { textDecoration: "none" },
              }}
            >
              로그인페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
