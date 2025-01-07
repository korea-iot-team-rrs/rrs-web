import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useParams } from "react-router-dom";
import { FetchIdByToken } from "../../../apis/emailApi";
import { fetchUserInfoForCertification } from "../../../apis/userInfo";

export default function FindId() {
  const { token } = useParams<{ token: string }>(); 
  const [username, setUsername] = useState<string>("");


  useEffect(() => {
    if(token) {
      fetchUserInfoForCertification(token)
      .then((response) => setUsername(response.name))
      .catch((e) => console.error("fail to fetch username", e));
    }

  }, [token])

  if (!token) {
    return <div>인증 정보가 없습니다. 다시 시도해주세요.</div>;
  }

  return (
    <div className="find-id-wrapper">
      <p>{username}</p>
    </div>
  );
}
