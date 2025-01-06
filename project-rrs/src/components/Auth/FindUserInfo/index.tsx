import { Breadcrumbs, Button, FormControl, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import { findId, findPassword } from "../../../types/AuthType";
import { useNavigate } from "react-router-dom";
import { sendEmailforId, sendEmailforPw } from "../../../apis/emailApi";
export default function FinduserInfo() {
  const navigate = useNavigate();
  const [findId, setFindId] = useState<boolean>(true);
  const [findIdDto, setFindIdDto] = useState<findId>({
    email: "",
  });

  const [findPasswordDto, setFindPasswordDto] = useState<findPassword>({
    email: "",
    username: "",
  });

  const findIdHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFindIdDto({ email: value });
  };

  const findPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFindPasswordDto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendEmailForIdHandler = async(e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await sendEmailforId(
        findPasswordDto.username
      );
      navigate("/find-id", { state: { token: response } });
    } catch (error) {
      console.error("Failed to send email", error);
    }
  };

  const sendEmailForPasswordHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    try {
      const response = await sendEmailforPw(
        findPasswordDto.username,
        findPasswordDto.email
      );
      navigate("/find-password", { state: { token: response } });
    } catch (error) {
      console.error("Failed to send email", error);
    }
  };

  return (
    <>
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
                  placeholder="이메일을 입력해주세요."
                  fullWidth
                  onChange={findIdHandler}
                />
                <Button onClick={sendEmailForIdHandler}>이메일 발송</Button>
              </li>
            </ul>
          ) : (
            <ul>
              <div>비밀번호 찾기</div>
              <li>이메일 인증으로 비밀번호 찾기</li>
              <li>
                <p>아이디</p>
              </li>
              <li>
                <p>이메일</p>
                <OutlinedInput
                  placeholder="이메일을 입력해주세요."
                  fullWidth
                  onChange={findPasswordHandler}
                />
                <Button onClick={sendEmailForPasswordHandler}>
                  이메일 발송
                </Button>
              </li>
            </ul>
          )}
        </div>
        <div className="find-user-info-right"></div>
      </div>
    </>
  );
}
