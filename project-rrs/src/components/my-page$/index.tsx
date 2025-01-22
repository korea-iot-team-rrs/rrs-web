<<<<<<< HEAD
import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import UserInfo from "./user-info$";
import PetList from "./pet-list$";
import UserDelete from "./user-delete$";
import "../../styles/myPage/MyPage.css";
import PetCreate from "./pet-list$/pet-create$";
import PetInfo from "./pet-list$/pet-info$";
import PetUpdate from "./pet-list$/pet-update$";
import UserInfoUpdate from "./user-info$/user-info-update$";
import PasswordUpdate from "./password-update$";

export default function MyPage() {
  return (
    <div className="myPage">
      <div className="navMyPage">
        <NavLink to="/user/info" className="nav-link">
          회원 정보
        </NavLink>
        <NavLink to="/user/password-update" className="nav-link">
          비밀번호 수정
        </NavLink>
        <NavLink to="/user/petList" className="nav-link">
          반려 동물
        </NavLink>
        <NavLink to="/user/delete" className="nav-link">
          회원 탈퇴
        </NavLink>
      </div>
      <div className="myPageContent">
        <Routes>
          <Route path="info" element={<UserInfo />} />
          <Route path="info-update" element={<UserInfoUpdate />} />
          <Route path="password-update" element={<PasswordUpdate />} />
          <Route path="petList" element={<PetList />} />
          <Route path="pet/:petId" element={<PetInfo />} />
          <Route path="pet-update/:petId" element={<PetUpdate />} />
          <Route path="pet-create" element={<PetCreate />} />
          <Route path="delete" element={<UserDelete />} />
        </Routes>
      </div>
    </div>
  );
=======
import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import UserInfo from './UserInfo'
import PetList from './PetList'
import UserDelete from './UserDelete'
import '../../styles/myPage/MyPage.css'
import PetCreate from './PetList/PetCreate'
import PetInfo from './PetList/PetInfo'
import PetUpdate from './PetList/PetUpdate'
import UserInfoUpdate from './UserInfo/UserInfoUpdate'
import PasswordUpdate from './passwordUpdate'

export default function MyPage() {
  return (
    <div className='myPage'>
      <div className='navMyPage'>
        <NavLink to='/user/info' className='nav-link'>회원 정보</NavLink>
        <NavLink to='/user/password-update' className='nav-link'>비밀번호 수정</NavLink>
        <NavLink to='/user/petList' className='nav-link'>반려 동물</NavLink>
        <NavLink to='/user/delete' className='nav-link'>회원 탈퇴</NavLink>
      </div>
      <div className='myPageContent'>
        <Routes>
          <Route path='info' element={<UserInfo />} />
          <Route path='info-update' element={<UserInfoUpdate />} />
          <Route path='password-update' element={<PasswordUpdate />} />
          <Route path='petList' element={<PetList />} />
          <Route path='pet/:petId' element={<PetInfo />} />
          <Route path='pet-update/:petId' element={<PetUpdate />} />
          <Route path='pet-create' element={<PetCreate />} />
          <Route path='delete' element={<UserDelete />} />
        </Routes>
      </div>
    </div>
  )
>>>>>>> develop
}
