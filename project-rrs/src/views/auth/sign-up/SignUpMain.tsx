import React from "react";
import "../../../styles/auth/signUp.css";
import { Button, Link } from "@mui/material";
import rrsLogo from "../../../assets/rrs-main-assets/rrs_logo_sq_01.png";
import naverLogo from "../../../assets/logo/naver-icon-file.png";
import kakaoLogo from "../../../assets/logo/kakaotalk_logo.png";
import logo from "../../../assets/rrs-main-assets/rrs_logo_sq_01.png";
import "../../../styles/auth/signUpList.css";
import { useNavigate } from "react-router-dom";

interface LinksType {
  id: "rrs" | "naver" | "kakao";
  name: string;
  link: string;
  logo: string;
}
const signUplinks: LinksType[] = [
  { id: "rrs", name: "RRS", link: "/signup/rrs", logo: rrsLogo },
  { id: "naver", name: "Naver", link: "/naver", logo: naverLogo },
  { id: "kakao", name: "Kakao", link: "/kakao", logo: kakaoLogo },
];

export default function SignUpMain() {
  const navigation = useNavigate();

  const onButtonClickHandler = (link: LinksType) => {
    if (link.id === "rrs") {
      navigation(link.link);
    } else {
      window.location.href = `http://localhost:4040/api/v1/auth/sns-sign-in/${link.id}`;
    }
  };

  return (
    <>
      <div className="sns-sign-up-wrapper">
        <img src={logo} alt="MainLogo" />
        <h4>회원가입 페이지입니다.</h4>
        <div className="sns-sign-up-links">
          {signUplinks.map((link) => (
            <Button
              variant="outlined"
              className="sns-sign-up-link"
              onClick={() => onButtonClickHandler(link)}
              sx={{
                backgroundColor: "#fafafa",
                boxShadow: "none",
                border: "2px solid #f0f0f0",
                borderRadius: "20px",
                width: "300px",
                padding: "5px",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease",
                ":hover": {
                  backgroundColor: "#e6f3ff",
                  borderColor: "#b2cdff",
                },
              }}
            >
              <img
                className="sns-login-logo"
                src={link.logo}
                alt={`${link.name} logo`}
              />
              {link.name}
            </Button>
          ))}
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
