import React, { useEffect, useState } from "react";
import { User } from "../../../types/entityType";
import { fetchUserInfo } from "../../../apis/userInfoApi";
import { useNavigate } from "react-router-dom";
import { FILE_URL } from "../../../constants";
import userDefaultImage from "../../../assets/images/dogIllust02.jpeg";
import "../../../styles/my-page/userInfo.css";
import axios from "axios";

export default function UserInfo() {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [hasAlerted, setHasAlerted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        console.error("에러 발생:", error);
        alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPets();
  }, [navigate, petId]);
  
  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     try {
  //       const user = await fetchUserInfo();

  //       if (user) {
  //         setUserInfo(user);
  //       } else {
  //         if (!hasAlerted) {
  //           setHasAlerted(true);
  //           navigate("/login", { replace: true });
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch user info:", error);
  //       if (!hasAlerted) {
  //         setHasAlerted(true);
  //         navigate("/login", { replace: true });
  //       }
  //     }
  //   };

  //   getUserInfo();
  // }, [hasAlerted, navigate]);

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