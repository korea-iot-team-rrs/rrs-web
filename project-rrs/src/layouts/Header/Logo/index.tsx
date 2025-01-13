import React from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../../../assets/images/logo.png'

export default function Logo() {
  return (
    <div className='mainLogo'>
      <NavLink to="/main" className="logo-link">
        <img src={logo} alt="MainLogo" />
      </NavLink>
    </div>
  )
}