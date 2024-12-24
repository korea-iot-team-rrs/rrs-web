import React from 'react'
import '../../../styles/Header.css';
import { Link, NavLink } from 'react-router-dom';

export default function NavAuth() {
  const links = ['Login'];

  return (
    <>
      <div className='navAuth'>
        {links.map(link => (
          <NavLink
            to={link}
            key={link}
            className='authButton'
          >
            {link.charAt(0).toUpperCase() + link.slice(1)}
          </NavLink>
      ))}
      </div>
    </>
  )
}