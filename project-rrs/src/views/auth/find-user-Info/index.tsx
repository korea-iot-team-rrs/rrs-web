import { Breadcrumbs, Button, OutlinedInput } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CertificateDto } from "../../../types/authType";
import { sendEmailForId, sendEmailForPw } from "../../../apis/emailApi.js";
import { useLocation } from "react-router-dom";
import "../../../styles/findUserInfo/FinduserInfo.css";
import idImg from "../../../assets/images/findIdImg.jpg";
import pwImg from "../../../assets/images/findPwImg.jpg";

export default function FinduserInfo() {
  const location = useLocation();
  const [findId, setFindId] = useState<boolean>(false);
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
    const state = location.state as { isFindId?: boolean };
    setFindId(state?.isFindId ?? false);
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
                    size="small"
                  />
                </div>
              </div>

              <div className="find-submit-btn-box">
                <Button
                  variant="contained"
                  onClick={sendEmailHandler}
                  sx={{
                    fontFamily: "Pretendard",
                    height: "100%",
                    backgroundColor: " #0085ff",
                    color: "#fffff",
                    borderRadius: "18px",
                  }}
                >
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
                    size="small"
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
                    size="small"
                  />
                </div>
              </div>

              <div className="find-submit-btn-box">
                <Button
                  variant="contained"
                  onClick={sendEmailHandler}
                  sx={{
                    fontFamily: "Pretendard",
                    height: "100%",
                    backgroundColor: " #0085ff",
                    color: "#fffff",
                    borderRadius: "18px",
                  }}
                >
                  이메일 발송
                </Button>
              </div>
            </li>
          </ul>
        )}
      </div>
      <div className="find-user-info-right">
        <div className="img-copyright">
          {findId ? (
            <div>
              <strong className="img-copyright-title">
                아이디를 잊어버리셨나요 ?<br />
                <br />
              </strong>
              <span>
                등록한 이메일로 <br />
                찾을 수 있답니다.
              </span>
            </div>
          ) : (
            <div>
              <strong className="img-copyright-title">
                비밀번호를 잊어버리셨나요 ?<br />
              </strong>
              <br />
              <span>
                등록한 이메일과 아이디로 <br />
                찾을 수 있답니다.
              </span>
            </div>
          )}
        </div>
        <img src={findId ? idImg : pwImg} alt="IdPw찾기 이미지" />
      </div>
    </div>
  );
}
