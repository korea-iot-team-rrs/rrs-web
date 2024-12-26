import React, { useState } from 'react';
import logo from '../../../assets/images/logo.png'; // 로고 경로 설정
import '../../../styles/Login.css'; // CSS 파일 경로 설정
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate
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

  const navigate = useNavigate();

  // 입력 값 변경 시 상태 업데이트
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    let newError: ErrorMessage = {
      username: '',
      password: '',
      general: ''
    };

    if (!credentials.username || !credentials.password) {
      newError.general = '아이디 또는 비밀번호를 입력해 주세요.';
    }
  
    if (newError.general) {
      setError(newError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4040/api/v1/auth/login', credentials);

      if (response.status === 200) {
        const { token, user } = response.data.data;
        const { login } = useAuthStore.getState();       
        login(token, user);

        navigate('/');
      }
    } catch (err: any) {
      let errorMessage = '';

      if (err.response) {
        const { message } = err.response.data;

        if (message === 'UserId does not match.') {
          errorMessage = '존재하지않는 ID입니다.';

        } else if (message === 'Password does not match.') {
          errorMessage = '비밀번호가 일치하지않습니다.';
          
        } else {
          errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
        }
      } else {
        errorMessage = '서버와 연결할 수 없습니다. 다시 시도해주세요.';
      }

      setCredentials({
        ...credentials,
        password: ''
      });

      newError.general = errorMessage;
      setError(newError); // 오류 메시지 설정
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

        <button type="submit">로그인</button>
      </form>

      <div className="login-links">
        <a href="/signup">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-password">비밀번호 찾기</a>
      </div>
    </div>
  );
}
