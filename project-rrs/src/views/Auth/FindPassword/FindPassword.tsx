import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../types";
import {
  fetchUserInfoForCertification,
  updateUserPassword,
} from "../../../apis/userInfo";
import { Button, OutlinedInput } from "@mui/material";
import "../../../styles/findUserInfo/FindPassword.css";

export default function FindPassword() {
  const { token } = useParams<{ token: string }>();
  const [user, setUser] = useState<User>();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchUserInfoForCertification(token)
        .then((response) => setUser(response))
        .catch((e) => console.error("fail to fetch user", e));
    }
  }, [token]);

  const passwordInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const passwordConfirmInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };
  console.log(token);

  const updatePasswordInClickHandler = () => {
    const data = {
      password: password,
      confirmPassword: confirmPassword,
    };

    if (data.password !== data.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (token) {
      updateUserPassword(data, token)
        .then(() => {
          alert("비밀번호 변경에 성공하셨습니다.");
          navigate("/main");
        })
        .catch((e) => console.error("fail to update password", e));
    } else {
      alert("잘못된 인증 경로 입니다.");
      return;
    }
  };

  return (
    <>
      <div className="find-pw-wrapper">
        <div>
          <div className="find-pw-header">
            <h2>비밀번호 재설정</h2>
          </div>
          <div className="find-pw-body">
            <div>
              {" "}
              <div>
                <p>재설정 할 비밀번호</p>
                <OutlinedInput
                  name="password"
                  placeholder="변경할 비밀번호를 입력해주세요."
                  onChange={passwordInputHandler}
                  value={password}
                  size="small"
                />
              </div>
              <div>
                <p>설정한 비밀번호 재확인</p>
                <OutlinedInput
                  name="passwordConfirm"
                  placeholder="입력하신 비밀번호를 재입력해주세요."
                  onChange={passwordConfirmInputHandler}
                  value={confirmPassword}
                  size="small"
                />
              </div>
            </div>

            <Button
              variant="contained"
              onClick={updatePasswordInClickHandler}
              sx={{
                fontFamily: "Pretendard",
                height: "100%",
                backgroundColor: " #0085ff",
                color: "#fffff",
                borderRadius: "18px",
              }}
            >
              비밀번호 재설정 하기
            </Button>
          </div>

          <div className="find-pw-dog">
            <div className="speech-bubble">
              <p>{user?.nickname}님 재 설정할 비밀번호를 입력해 주세요!</p>
            </div>
            <p className="dog-imo">🐶</p>
          </div>
        </div>
      </div>
    </>
  );
}
