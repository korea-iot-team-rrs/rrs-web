import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchIdByToken } from "../../../apis/emailApi";
import { Button, Link } from "@mui/material";
import "../../../styles/auth/find-user-info/findId.css";

export default function FindId() {
  const { token } = useParams<{ token: string }>();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    console.log(token);
    if (token) {
      FetchIdByToken(token)
        .then((response) => setUsername(response))
        .catch((e) => console.error("fail to fetch username", e));
    }

    console.log(username);
  }, [token]);

  if (!token) {
    return <div>인증 정보가 없습니다. 다시 시도해주세요.</div>;
  }

  const handleNavigateToFindPassword = () => {};

  return (
    <div className="find-id-wrapper">
      <div>아이디 목록</div>
      <div>
        <p>{username}</p>
      </div>
      <div>
        <Link href="/find-user-info">
          <Button
            variant="contained"
            sx={{
              fontFamily: "Pretendard",
              height: "100%",
              backgroundColor: "#0085ff",
              color: "#fff",
              borderRadius: "18px",
            }}
          >
            비밀번호 찾기
          </Button>
        </Link>
      </div>
    </div>
  );
}
