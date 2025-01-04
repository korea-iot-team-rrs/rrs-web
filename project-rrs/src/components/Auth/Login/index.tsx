import React, { useState } from 'react';
import logo from '../../../assets/images/logo.png';
import '../../../styles/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import useAuthStore from '../../../stores/auth.store';

interface Credentials {
  username: string;
  password: string;
}

interface ErrorMessage {
  username: string;
  password: string;
  general: string;
}

export default function Login() {
  const [credentials, setCredentials] = useState<Credentials>({
    username: '',
    password: ''
  });

  const [error, setError] = useState<ErrorMessage>({
    username: '',
    password: '',
    general: ''
  });

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['token']);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const setErrorMessage = (type: keyof ErrorMessage, message: string) => {
    setError((prevError) => ({
      ...prevError,
      [type]: message
    }));
  };

  const handleSuccessfulLogin = (token: string, user: any) => {
    setCookie('token', token, { path: '/' });
    console.log(token)
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    login(token, user);
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      setErrorMessage('general', '아이디 또는 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4040/api/v1/auth/login', credentials);

      if (response.status === 200) {
        const { token, user } = response.data.data;
        console.log(token)
        setCookie('token', token, { path: '/' });
        localStorage.setItem('token', token); 
        login(token, user);
        navigate('/');

      }
    } catch (err: any) {
      let errorMessage = '서버와 연결할 수 없습니다. 다시 시도해주세요.';
      if (err.response) {
        const { message } = err.response.data;
        if (message === 'UserId does not match.') {
          errorMessage = '존재하지 않는 ID입니다.';
        } else if (message === 'Password does not match.') {
          errorMessage = '비밀번호가 일치하지 않습니다.';
        }
      }
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        password: ''
      }));
      setErrorMessage('general', errorMessage);
    }
  };

  return (
    <div className="login">
      <img src={logo} alt="MainLogo" />
      <h4>로그인 페이지에 오신 것을 환영합니다.</h4>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="아이디를 입력해 주세요."
          value={credentials.username}
          onChange={handleInputChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력해 주세요."
          value={credentials.password}
          onChange={handleInputChange}
        />

        {error.username && <p className="error-message">{error.username}</p>}
        {error.password && <p className="error-message">{error.password}</p>}
        {error.general && <p className="error-message">{error.general}</p>}

        <button onClick={handleLogin}>로그인</button>
      </form>

      <div className="login-links">
        <a href="/signup">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-password">비밀번호 찾기</a>
      </div>
    </div>
  );
}
