import { Breadcrumbs, Button, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import { CertificateDto } from "../../../types/AuthType";
import { sendEmailForId, sendEmailForPw } from "../../../apis/emailApi";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function FinduserInfo() {
  const [findId, setFindId] = useState<boolean>(true);

  const [findIdDto, setFindIdDto] = useState<{ email: string }>({ email: "" });
  const [findPasswordDto, setFindPasswordDto] = useState<CertificateDto>({
    username: null,
    email: "",
  });

  const findIdChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFindIdDto((prev) => ({ ...prev, [name]: value }));
  };

  const findPasswordChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFindPasswordDto((prev) => ({ ...prev, [name]: value }));
  };

  const sendEmailHandler = async () => {
    try {
      if (findId) {
        if (!findIdDto.email.trim()) {
          alert("이메일을 입력해주세요.");
          return;
        }
        await sendEmailForId(findIdDto.email);
        alert("아이디 찾기 인증메일을 송부했습니다.");
      } else {
        if (!findPasswordDto.username?.trim()) {
          alert("아이디를 입력해주세요.");
          return;
        }
        if (!findPasswordDto.email.trim()) {
          alert("이메일을 입력해주세요.");
          return;
        }
        await sendEmailForPw(findPasswordDto.email, findPasswordDto.username);
        alert("비밀번호 찾기 인증메일을 송부했습니다.");
      }
    } catch (error) {
      console.error("fail to send email:", error);
      alert("메일 전송에 실패했습니다. 아이디 혹은 이메일을 다시 확인하여 주세요.");
    }
  };

  return (
    <div className="find-user-info-wrapper">
      <div className="find-user-info-left">
        <div className="breadcrumbs">
          <Breadcrumbs>
            <div
              onClick={() => setFindId(true)}
              style={{
                color: findId ? "#0085ff" : "#797979",
                fontWeight: findId ? "bold" : "normal",
              }}
            >
              아이디
            </div>
            <div
              onClick={() => setFindId(false)}
              style={{
                color: findId ? "#797979" : "#0085ff",
                fontWeight: findId ? "normal" : "bold",
              }}
            >
              비밀번호 찾기
            </div>
          </Breadcrumbs>
        </div>

        {findId ? (
          <ul>
            <div>아이디 찾기</div>
            <li>이메일 인증으로 아이디 찾기</li>
            <li>
              <p>이메일</p>
              <OutlinedInput
                name="email"
                placeholder="이메일을 입력해주세요."
                fullWidth
                onChange={findIdChangeHandler}
                value={findIdDto.email}
              />
              <Button onClick={sendEmailHandler}>이메일 발송</Button>
            </li>
          </ul>
        ) : (
          <ul>
            <div>비밀번호 찾기</div>
            <li>이메일 인증으로 비밀번호 찾기</li>
            <li>
              <p>이메일</p>
              <OutlinedInput
                name="email"
                placeholder="이메일을 입력해주세요."
                fullWidth
                onChange={findPasswordChangeHandler}
                value={findPasswordDto.email}
              />
            </li>
            <li>
              <p>아이디</p>
              <OutlinedInput
                name="username"
                placeholder="아이디를 입력해주세요."
                fullWidth
                onChange={findPasswordChangeHandler}
                value={findPasswordDto.username || ""}
              />
            </li>
            <Button onClick={sendEmailHandler}>이메일 발송</Button>
          </ul>
        )}
      </div>
      <div className="find-user-info-right"></div>
    </div>
  );
}
