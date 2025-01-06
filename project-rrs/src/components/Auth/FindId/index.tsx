import { OutlinedInput } from "@mui/material";
import { useLocation } from "react-router-dom";
import { fetchUserInfo } from "../../../apis/userInfo";
import { useEffect, useState } from "react";

export default function FindId() {
  const location = useLocation();
  const [username , setUsername] = useState<string>("");
  const { token } = location.state || {}; 

  useEffect(() => {
    if(token) {
      fetchUserInfo()
      .then((response) => setUsername(response.username))
      .catch((e) => console.error("fail to fetch user", e))
    }
  }, [token])

  if (!token) {
    return <div>인증 정보가 없습니다. 다시 시도해주세요.</div>;
  }

  return <>
    <div className="user-id-iem-wrapper">
      <p>{username.substring(0,5)}</p>
    </div>
  </>
}
