import React from 'react'
import useAuthStore from '../../../stores/auth.store';

export default function UserInfo() {
  const { user } = useAuthStore();

  return (
    <div>
      <h2>MyPage</h2>
      <div>
        <label>개인 프로필 사진</label>
          <img src={user?.profileImageUrl} alt="프로필 이미지" />
      </div>

      <div>
        <label>아이디</label>
        <p>{user?.username}</p>
      </div>

      <div>
        <label>이름</label>
        <p>{user?.name}</p>
      </div>

      <div>
        <label>닉네임</label>
        <p>{user?.nickname}</p>
      </div>

      <div>
        <label>주소</label>
        <p>{user?.address}</p>
      </div>

      <div>
        <label>상세 주소</label>
        <p>{user?.addressDetail}</p>
      </div>

      <div>
        <label>이메일</label>
        <p>{user?.email}</p>
      </div>

      <div>
        <label>연락처</label>
        <p>{user?.phone}</p>
      </div>

      <button>수정</button>
    </div>
  )
}
