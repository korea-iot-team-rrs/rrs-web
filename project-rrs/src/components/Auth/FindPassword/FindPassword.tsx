import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { User } from '../../../types';
import { fetchUserInfo } from '../../../apis/userInfo';

export default function FindPassword() {
  const location = useLocation();
  const { token } = location.state || {}; 
  const [user, setUser] = useState<User>();
  const [password , setPassword] = useState<string>("")

    useEffect(() => {
      if(token) {
        fetchUserInfo()
        .then((response) => setPassword(response.password))
        .catch((e) => console.error("fail to fetch user", e))
      }
    }, [token])

  if (!token) {
    return <div>인증 정보가 없습니다. 다시 시도해주세요.</div>;
  }

  return <>
  

  </>
}