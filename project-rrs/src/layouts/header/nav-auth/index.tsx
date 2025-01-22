import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LoginResponseDto } from "../../../types/authType";
import { FILE_URL } from "../../../constants";
import "../../../styles/layout/header.css";
import useAuthStore from "../../../stores/useAuth.store";
import DefaultImage from "../../../assets/images/dogIllust02.jpeg";

export default function NavAuth() {
  const { isLoggedIn, login, logout, user } = useAuthStore();
  const [cookies, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const loginData: LoginResponseDto = {
          ...parsedUser,
          token,
          exprTime: parsedUser.exprTime,
        };
        const currentTime = Date.now();

        if (currentTime >= loginData.exprTime) {
          console.warn("토큰이 만료되었습니다.");
          handleLogout();
          return;
        }

        const timeLeft = loginData.exprTime - currentTime;
        setTimeout(() => {
          console.warn("토큰이 만료되어 로그아웃됩니다.");
          handleLogout();
        }, timeLeft);

        login(loginData);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        handleLogout();
      }
    }
  }, [cookies.token, login, removeCookie, logout, navigate]);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/main");
  };

  return (
    <div className="navAuth">
      {isLoggedIn && user ? (
        <div className="authLogout">
          <img
            src={`${FILE_URL}${user.profileImageUrl}`}
            alt="프로필 이미지"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = DefaultImage;
            }}
          />
          <span>
            <span className="nickname">{user.nickname}</span>님
          </span>
          <div className="divider" />
          <NavLink to="/user/info" className="myPage">
            MyPage
          </NavLink>
          <div className="divider" />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <NavLink to="/login" className="authLoginButton">
          Login
        </NavLink>
      )}
    </div>
  );
}
