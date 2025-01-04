import React, { useEffect } from 'react'
import '../../../styles/Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/auth.store';
import { useCookies } from "react-cookie";

export default function NavAuth() {
  const { isLoggedIn, login, logout, user, setIsLoggedIn } = useAuthStore();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const navigate = useNavigate();

  useEffect(() => {
    const token = cookies.token || localStorage.getItem('token');
    const saveUser = localStorage.getItem('user');

    if (token && saveUser) {
      const parsedUser = JSON.parse(saveUser);
      setIsLoggedIn(true);
      login(token, parsedUser);
    } else {
      setIsLoggedIn(false);
    }
  }, [cookies.token, setIsLoggedIn, login]);

  useEffect(() => {
    console.log('User object:', user); // user 객체 출력
    console.log('Profile Image URL:', user?.profileImageUrl); // 이미지 URL 출력
  }, [user]);

  const handleLogout = () => {
    removeCookie('token', {path: '/'});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
    navigate('/');
  };
  
  return (
    <div className='navAuth'>
      {isLoggedIn ? (
        <div className='authLogout'>
          <img src={`http://localhost:4040/${user?.profileImageUrl || "file/default-profile.jpg"}`} alt="프로필 이미지" />
          <span>
            <span className='nickname'>{user?.nickname}</span>님
          </span>
          <div className="divider" />
          <NavLink to='/user/info' className='myPage' >
            MyPage
          </NavLink>
          <div className="divider" />
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <NavLink to='/login' className='authLoginButton'>
          Login
        </NavLink>
      )}
    </div>
  );
}
