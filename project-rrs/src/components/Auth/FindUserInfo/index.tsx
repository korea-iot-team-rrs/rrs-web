import { Breadcrumbs, Button, OutlinedInput, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CertificateDto } from "../../../types/AuthType";
import { sendEmailForId, sendEmailForPw } from "../../../apis/emailApi";
import { useLocation } from "react-router-dom";
import "../../../styles/findUserInfo/FinduserInfo.css";
import idImg from "../../../assets/images/findIdImg.jpg";
import pwImg from "../../../assets/images/findPwImg.jpg";

export default function FinduserInfo() {
  const location = useLocation();
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
      alert(
        "메일 전송에 실패했습니다. 아이디 혹은 이메일을 다시 확인하여 주세요."
      );
    }
  };

  useEffect(() => {
    setFindId(location.state?.isFindId ?? true);
  }, [location.state]);

  return (
    <div className="find-user-info-wrapper">
      <div className="find-user-info-left">
        <div className="breadcrumbs">
          <Breadcrumbs
            sx={{
              fontFamily: "Pretendard",
            }}
          >
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
            <li>
              <div className="left-title">
                <span>아이디 찾기</span>
              </div>
            </li>

            <li>이메일 인증으로 아이디 찾기</li>

            <li className="find-container">
              <div className="find-inputs">
                <div>
                  <p>이메일</p>
                  <OutlinedInput
                    name="email"
                    placeholder="이메일을 입력해주세요."
                    fullWidth
                    onChange={findIdChangeHandler}
                    value={findIdDto.email}
                    sx={{
                      borderRadius: "25px",
                      height: "35px",
                    }}
                  />
                </div>
              </div>

              <div>
                <Button className="find-submit-btn" onClick={sendEmailHandler}>
                  이메일 발송
                </Button>
              </div>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <div className="left-title">
                <span>비밀번호 찾기</span>
              </div>
            </li>

            <li>이메일 인증으로 비밀번호 찾기</li>

            <li className="find-container">
              <div className="find-inputs">
                <div>
                  <p>이메일</p>
                  <OutlinedInput
                    name="email"
                    placeholder="이메일을 입력해주세요."
                    fullWidth
                    onChange={findPasswordChangeHandler}
                    value={findPasswordDto.email}
                    sx={{
                      borderRadius: "25px",
                      height: "35px",
                    }}
                  />
                </div>
                <div>
                  <p>아이디</p>
                  <OutlinedInput
                    name="username"
                    placeholder="아이디를 입력해주세요."
                    fullWidth
                    onChange={findPasswordChangeHandler}
                    value={findPasswordDto.username || ""}
                    sx={{
                      borderRadius: "25px",
                      height: "35px",
                    }}
                  />
                </div>
              </div>

              <div>
                <Button className="find-submit-btn" onClick={sendEmailHandler}>
                  이메일 발송
                </Button>
              </div>
            </li>
          </ul>
        )}
      </div>
      <div className="find-user-info-right">
        <img src={findId ? idImg : pwImg} alt="IdPw찾기 이미지" />
      </div>
    </div>
  );
}
