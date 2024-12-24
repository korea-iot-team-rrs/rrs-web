import React, { useState } from 'react'
import logo from '../../../assets/images/logo.png'
import '../../../styles/Login.css'
import axios from 'axios';

export default function Login() {
  const [loginInput, setLoginInput] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState({
    username: "",
    password: "",
    general: ""
  }); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInput({
      ...loginInput,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    let newError = {
      username: "",
      password: "",
      general: ""
    };

    if (!loginInput.username) {
      newError.username = "아이디를 입력해주세요.";
    }
    if (!loginInput.password) {
      newError.password = "비밀번호를 입력해주세요.";
    }

    if (newError.username || newError.password) {
      setError(newError);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4040/api/v1/auth/login`, {
        username: loginInput.username,
        password: loginInput.password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        window.location.href = '/';
      }
    } catch (err: any) {
      if (err.response) {
        const message = err.response.data.messate || '아이디 또는 비밀번호가 잘못되었습니다.';
        setError({
          ...newError,
          general: message,
        });
      } else {
        setError ({
          ...newError,
          general: '서버 연결에 문제가 발생했습니다. 다시 시도해주세요.'
        });
      }
    }
};

  return (
    <div className='login'>
      <img src={logo} alt="MainLogo" />
      <h4>로그인 페이지에 오신것을 환영합니다.</h4>

      <form onSubmit={handleSubmit}>
        <div className='login-input-container'>
        <input 
          type="text" 
          id="username" 
          name="username" 
          placeholder="아이디를 입력해 주세요."
          value={loginInput.username}
          onChange={handleChange}
        />
        {error.username && <p className='error-message'>{error.username}</p>}
        </div>

        <div className='login-input-container'>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="비밀번호를 입력해 주세요." 
          value={loginInput.password}
          onChange={handleChange}
        />
        {error.password && <p className='error-message'> {error.password}</p>}
        </div>

        {error.general && <p className='error-message'>{error.general}</p>}
        
        <button type='submit'>로그인</button>
      </form>

      <div className='login-links'>
        <a href="/signup">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-password">비밀번호 찾기</a>
      </div>
    </div>
  )
}
