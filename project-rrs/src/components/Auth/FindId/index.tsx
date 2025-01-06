import {
  Breadcrumbs,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";
import { findId } from "../../../types/AuthType";

export default function FinduserInfo() {
  const [findId, setFindId] = useState<boolean>(true);
  const [ findIdDto, setFindIdDto ] = useState<findId>({
    
  })
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
                  <OutlinedInput placeholder="이메일을 입력해주세요" fullWidth/>
              </li>
              <li>
                <p>인증번호</p>
              </li>
            </ul>
          ) : (
            <ul>
              <div>비밀번호 찾기</div>
              <li>이메일 인증으로 비밀번호 찾기</li>
              <li>
                <p>이메일</p>
              </li>
              <li>
                <p>아이디</p>
              </li>
              <li>
                <p>인증번호</p>
              </li>
            </ul>
          )}
        </div>
        <div className="find-user-info-right"></div>
      </div>
    </>
  );
}
