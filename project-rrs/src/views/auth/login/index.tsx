import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Button, Link } from "@mui/material";
import { LoginResponseDto } from "../../../types/authType";
import logo from "../../../assets/images/logo.png";
import naverLogo from "../../../assets/logo/naver-icon-file.png";
import kakaoLogo from "../../../assets/logo/kakaotalk_logo.png";
import "../../../styles/Login.css";
import useAuthStore from "../../../stores/useAuth.store";

interface Credentials {
  username: string;
  password: string;
}

interface ErrorMessage {
  username: string;
  password: string;
  general: string;
}

export default function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });

  const [error, setError] = useState<ErrorMessage>({
    username: "",
    password: "",
    general: "",
  });

  const { login, snsLogin } = useAuthStore();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  const loginlinks = [
    { id: "naver", name: "Naver", link: "/", logo: naverLogo },
    { id: "kakao", name: "Kakao", link: "/", logo: kakaoLogo },
  ];

  const onLoginButtonClickHandler = (id: string) => {
    window.location.href = `http://localhost:4040/api/v1/auth/sns-sign-in/${id}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 에러 메시지 초기화
    setError((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const setErrorMessage = (type: keyof ErrorMessage, message: string) => {
    setError((prev) => ({
      ...prev,
      [type]: message,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setErrorMessage("general", "아이디 또는 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const response = await axios.post<{ data: LoginResponseDto }>(
        "http://localhost:4040/api/v1/auth/login",
        credentials
      );

      console.log(response);
      if (response.status === 200) {
        const loginData = response.data.data;

        setCookie("token", loginData.token, { path: "/" });
        localStorage.setItem("token", loginData.token);

        login(loginData);

        navigate("/main");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      let errorMessage = "서버와 연결할 수 없습니다. 다시 시도해주세요.";

      if (err.response?.data?.message) {
        switch (err.response.data.message) {
          case "UserId does not match.":
            errorMessage = "존재하지 않는 ID입니다.";
            break;
          case "Password does not match.":
            errorMessage = "비밀번호가 일치하지 않습니다.";
            break;
        }
      }

      setCredentials((prev) => ({
        ...prev,
        password: "",
      }));
      setErrorMessage("general", errorMessage);
    }
  };

  const handleNavigateToFindId = () => {
    navigate("/find-user-info", { state: { isFindId: true } });
  };

  const handleNavigateToFindPassword = () => {
    navigate("/find-user-info", { state: { isFindId: false } });
  };

  return (
    <div className="login">
      <img src={logo} alt="MainLogo" />
      <h4>로그인 페이지에 오신 것을 환영합니다.</h4>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="아이디를 입력해 주세요."
          value={credentials.username}
          onChange={handleInputChange}
          autoComplete="username"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력해 주세요."
          value={credentials.password}
          onChange={handleInputChange}
          autoComplete="current-password"
        />

        {Object.entries(error).map(
          ([key, message]) =>
            message && (
              <p key={key} className="error-message">
                {message}
              </p>
            )
        )}

        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>

      <div className="login-links">
        <a href="/signup">회원가입</a>
        <Link onClick={handleNavigateToFindId}>아이디 찾기</Link>
        <Link onClick={handleNavigateToFindPassword}>비밀번호 찾기</Link>
      </div>

      <div className="sns-login-links">
        {loginlinks.map((link) => (
          <Button
            key={link.id}
            variant="outlined"
            className="sns-login-link"
            onClick={() => onLoginButtonClickHandler(link.id)}
            sx={{
              backgroundColor: "#fafafa",
              boxShadow: "none",
              border: "2px solid #f0f0f0",
              borderRadius: "20px",
              width: "300px",
              padding: "5px",
              transition: "background-color 0.3s ease, border-color 0.3s ease",
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
      </div>
    </div>
  );
}
