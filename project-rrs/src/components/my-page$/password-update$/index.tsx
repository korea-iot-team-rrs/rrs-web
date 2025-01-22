import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../../../styles/myPage/PasswordUpdate.css";

export default function PasswordUpdate() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    console.log("token:", token);
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/main");
      return;
    }
  }, [cookies, navigate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    const passwordRegex =
      /(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,15}$/;

    if (newPassword !== confirmPassword) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (!newPassword) {
      alert("새 비밀번호를 입력해 주세요.");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      alert("비밀번호는 숫자와 특수문자를 포함한 8-15자로 설정해야 합니다.");
      return;
    }

    try {
      const token = cookies.token || localStorage.getItem("token");
      console.log(currentPassword);
      console.log(newPassword);
      console.log(confirmPassword);
      const response = await axios.post(
        "http://localhost:4040/api/v1/users/update-password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("비밀번호가 변경되었습니다.");
        goBack();
      } else {
        alert("비밀번호 수정 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="userContent">
      <h2>비밀번호 수정</h2>
      <form onSubmit={handleSubmit} className="passwordUpdateContent">
        <div className="passwordElement">
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
        </div>

        <div className="passwordElement">
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>

        <div className="button-group">
          <button type="submit" className="ok-button">
            확인
          </button>
          <button type="button" onClick={goBack} className="cancle-button">
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
