import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../types";
import { fetchUserInfoForCertification, updateUserPassword } from "../../../apis/userInfo";
import { OutlinedInput } from "@mui/material";
import { Button } from "rsuite";

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

  const passwordInputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {setPassword(e.target.value)};
  const passwordConfirmInputHandler = (e:React.ChangeEvent<HTMLInputElement>) => {setConfirmPassword(e.target.value)};

  const updatePasswordInClickHandler = () => {
    const data = {
      password: password,
      confirmPassword: confirmPassword
    }
    console.log(data)
    if(token && (password === confirmPassword)){
      updateUserPassword(data, token)
      .then(()=> {
        alert("비밀번호 변경에 성공하셨습니다.");
      })
      .catch((e) => console.error("fail to update password", e));
    }
    alert("실패")
  };

  return (
    <>
      <p>{user?.nickname}</p>
      <p>토큰{token}</p>
      <OutlinedInput
        name="password"
        placeholder="변경할 비밀번호를 입력해주세요."
        fullWidth
        onChange={passwordInputHandler}
        value={password}
      />
      <OutlinedInput
        name="passwordConfirm"
        placeholder="입력하신 비밀번호를 재입력해주세요."
        fullWidth
        onChange={passwordConfirmInputHandler}
        value={confirmPassword}
      />
      <Button onClick={updatePasswordInClickHandler}>비밀번호 재설정 하기</Button>
    </>
  );
}
