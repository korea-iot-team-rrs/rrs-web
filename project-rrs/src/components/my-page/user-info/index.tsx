import React, { useEffect, useState } from "react";
import { User } from "../../../types/entityType";
import { fetchUserInfo } from "../../../apis/userInfoApi";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "../../../constants";
import userDefaultImage from "../../../assets/images/dogIllust02.jpeg";
import "../../../styles/my-page/userInfo.css";

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [hasAlerted, setHasAlerted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await fetchUserInfo();

        if (user) {
          setUserInfo(user);
        } else {
          if (!hasAlerted) {
            setHasAlerted(true);
            alert("로그인 후 이용 가능합니다.");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (!hasAlerted) {
          setHasAlerted(true);
          alert("로그인 후 이용 가능합니다.");
          navigate("/");
        }
      }
    };

    getUserInfo();
  }, [hasAlerted, navigate]);

  const handleEditClick = () => {
    navigate("/user/info-update");
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="userContent">
      <h2>회원 정보</h2>
      <div className="userInfoContent">
        <div className="userInfoElement">
          <label>개인 프로필 사진</label>
          <img
            className="userInfoText"
            src={
              userInfo.profileImageUrl
                ? `${FILE_URL}${userInfo.profileImageUrl}`
                : userDefaultImage
            }
            alt={`${userInfo.profileImageUrl}의 사진`}
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = userDefaultImage;
            }}
          />
        </div>

        <div className="userInfoElement">
          <label>아이디</label>
          <p>{userInfo.username}</p>
        </div>

        <div className="userInfoElement">
          <label>이름</label>
          <p>{userInfo.name}</p>
        </div>

        <div className="userInfoElement">
          <label>닉네임</label>
          <p>{userInfo.nickname}</p>
        </div>

        <div className="userInfoElement">
          <label>주소</label>
          <p>{userInfo.address}</p>
        </div>

        <div className="userInfoElement">
          <label>상세 주소</label>
          <p>{userInfo.addressDetail}</p>
        </div>

        <div className="userInfoElement">
          <label>이메일</label>
          <p>{userInfo.email}</p>
        </div>

        <div className="userInfoElement">
          <label>연락처</label>
          <p>{userInfo.phone}</p>
        </div>

        <button onClick={handleEditClick}>수정</button>
      </div>
    </div>
  );
}
