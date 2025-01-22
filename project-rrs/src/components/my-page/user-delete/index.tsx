import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import useAuthStore from "../../../stores/useAuth.store";
import "../../../styles/my-page/deleteUser.css";

export default function UserDelete() {
  const [password, setPassword] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
    }
  }, [cookies, navigate]);

  const handleUserDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      alert("비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const token = cookies.token || localStorage.getItem("token");

      const response = await axios.delete(
        "http://localhost:4040/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { password },
        }
      );

      if (response.status === 204) {
        alert("탈퇴 되었습니다.");
        removeCookie("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        logout();
      }
    } catch (err: any) {
      let errorMessage = "서버와 연결할 수 없습니다. 다시 시도해주세요.";
      if (err.response) {
        const { message } = err.response.data;
        if (message === "Password does not match.") {
          errorMessage = "비밀번호가 일치하지 않습니다.";
        } else {
          errorMessage = `서버오류: ${message}`;
        }
      }
      setPassword("");
      alert(errorMessage);
    }
  };

  return (
    <div className="userContent">
      <h2>회원 탈퇴</h2>
      <form className="deleteUser" onSubmit={handleUserDelete}>
        <div className="delete-container">
          <span>
            <span className="warningText"> 탈퇴 시 복구가 불가 </span>
            <p>합니다.</p>
          </span>
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">확인</button>
      </form>
    </div>
  );
}
