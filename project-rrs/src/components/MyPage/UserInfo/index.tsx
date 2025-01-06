import React, { useEffect, useState } from "react";
import { User } from "../../../types";
import { fetchUserInfo, updateUserInfo } from "../../../apis/userInfo";
import { useNavigate } from "react-router-dom";

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
            alert('로그인 후 이용 가능합니다.');
            navigate('/'); 
          }
          
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        if (!hasAlerted) {
          setHasAlerted(true); 
          alert('로그인 후 이용 가능합니다.');
          navigate('/');
        }
      }
    };

    getUserInfo();
  }, [hasAlerted, navigate]);

  const handleEditClick = () => {
    navigate('/user/info-update');
  };

  if (!userInfo) {
    return null; 
  }

  return (
    <div>
      <h2>MyPage</h2>
      <div>
        <div className='element'>
          <label>개인 프로필 사진</label>
          <img src={`http://localhost:4040/${userInfo.profileImageUrl || "file/default-profile.jpg"}`} alt="프로필 이미지" />
        </div>

        <div className='element'>
          <label>아이디</label>
          <p>{userInfo.username}</p>
        </div>

        <div className='element'>
          <label>이름</label>
          <p>{userInfo.name}</p>
        </div>

        <div className='element'>
          <label>닉네임</label>
          <p>{userInfo.nickname}</p>
        </div>

        <div className='element'>
          <label>주소</label>
          <p>{userInfo.address}</p>
        </div>

        <div className='element'>
          <label>상세 주소</label>
          <p>{userInfo.addressDetail}</p>
        </div>

        <div className='element'>
          <label>이메일</label>
          <p>{userInfo.email}</p>
        </div>

        <div className='element'>
          <label>연락처</label>
          <p>{userInfo.phone}</p>
        </div>
      </div>
      
      <button 
        className='edit-button'
        onClick={handleEditClick}>수정</button>
    </div>
  );
}
