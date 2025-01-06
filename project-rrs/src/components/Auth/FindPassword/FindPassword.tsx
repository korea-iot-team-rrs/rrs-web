import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { User } from '../../../types';
import { fetchUserInfo } from '../../../apis/userInfo';

export default function FindPassword() {
  const { token } = useParams<{ token: string }>();
  const [username , setUsername] = useState<string>("");
  
  useEffect(() => {
    if(token) {
      fetchUserInfo()
      .then((response) => setUsername(response.username))
      .catch((e) => console.error("fail to fetch user", e))
    }
  }, [token])

  return <>
  <p>{username}님의 토큰{token}</p>
  </>
}