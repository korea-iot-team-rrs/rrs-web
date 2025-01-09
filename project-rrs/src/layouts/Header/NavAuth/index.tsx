import React, { useEffect } from "react";
import "../../../styles/Header.css";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import { useCookies } from "react-cookie";
import { FILE_URL } from "../../../constants";

export default function NavAuth() {
  const { isLoggedIn, login, logout, user, setIsLoggedIn } = useAuthStore();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    const saveUser = localStorage.getItem("user");

    if (token && saveUser) {
      const parsedUser = JSON.parse(saveUser);
      setIsLoggedIn(true);
      login(token, parsedUser);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies.token, setIsLoggedIn, login]);

  useEffect(() => {}, [user]);

  const handleLogout = () => {
    removeCookie("token", { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logout();
    navigate("/");
  };

  return (
    <div className="navAuth">
      {isLoggedIn ? (
        <div className="authLogout">
          <img
            src={`${FILE_URL}${user?.profileImageUrl}`}
            alt="프로필 이미지"
          />
          <span>
            <span className="nickname">{user?.nickname}</span>님
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
