import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import UserInfo from './UserInfo'
import PetInfo from './PetInfo'
import UserDelete from './UserDelete'
import '../../styles/MyPage.css'
import UserInfoUpdate from './UserInfo/UserInfoUpdate'

export default function User() {
  return (
    <div className='myPage'>
      <div className='navMyPage'>
        <NavLink to='/user/info' className='nav-link'>회원 정보</NavLink>
        <NavLink to='/user/pet' className='nav-link'>반려 동물 정보</NavLink>
        <NavLink to='/user/delete' className='nav-link'>회원 탈퇴</NavLink>
      </div>
      <div className='myPageContent'>
        <Routes>
          <Route path='info' element={<UserInfo />} />
          <Route path='info-update' element={<UserInfoUpdate />} />
          <Route path='pet' element={<PetInfo />} />
          <Route path='delete' element={<UserDelete />} />
        </Routes>
      </div>
    </div>
  )
}
