import React, { useEffect, useState } from 'react'
import '../../../styles/Header.css';
import { Link, NavLink } from 'react-router-dom';
import useAuthStore from '../../../stores/auth.store';

export default function NavAuth() {
  const { isLoggedIn, logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  
  return (
    <div className='navAuth'>
      {isLoggedIn ? (
        <div className='authLogout'>
          <img src={user?.profileImageUrl} alt="프로필 이미지" />
          <span>
            <span className='nickname'>{user?.nickname}</span>님
          </span>
          <div className="divider" />
          <NavLink to='/user' className='myPage' >
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
