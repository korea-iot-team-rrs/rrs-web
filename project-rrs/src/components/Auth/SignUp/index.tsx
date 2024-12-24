import React, { useState } from 'react'
import { UserSignUp } from '../../../types/AuthType'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MAIN_URL, SIGN_UP } from '../../../constants';

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string; // 전체 폼 오류 메시지 (EX: 서버 오류 등)
}

const API_URL = process.env.REACT_APP_API_URL;

export default function SignUp() {
  const navigate = useNavigate();

  const [errors, setErrors] = useState<Errors>({});

  const [ userInfo , setUserInfo ] = useState<UserSignUp>({
    profileImageUrl: "",
    username: "",
    password:"",
    comfirmPassword: "",
    name: "",
    nickname: "",
    address: "",
    addressDetail: "",
    email: "",
    phone: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const element = e.target;

    setUserInfo({
      ...userInfo,
      [element.name]: element.value
    })
  };

  const handleSignUp = async() => {
    const isValidation = validateForm();

    if (isValidation) {
      try {
        // 서버에 회원가입 요청 (POST 메서드)
        const response = await axios.post(MAIN_URL + SIGN_UP, userInfo);

        if (response.data) {
          navigate('/');
        } else {
          setErrors(prev => ({
            ...prev,
            form: '회원가입에 실패했습니다.'
          }));
        }

      } catch {
        setErrors(prev => ({
          ...prev,
          form: '서버 에러가 발생하였습니다.'
        }));
      }
    }
  }

    // 폼 유효성 검사 함수 //
    const validateForm = () => {
      // 임시 오류 객체 생성
      let tempErrors: Errors = {};

      tempErrors.email = userInfo.email ? '' : '이메일을 입력하세요.';
      tempErrors.password = userInfo.password.length >= 8 
        ? ''
        : '비밀번호는 8자 이상이어야 합니다.';
      tempErrors.confirmPassword 
        = userInfo.comfirmPassword === userInfo.password
          ? ''
          : '비밀번호가 일치하지 않습니다.';

      setErrors(tempErrors);

      return Object.values(tempErrors).every(x => x === '');
  }

  return <>
        <div>
            <div>
                <h1>회원가입</h1>

                <div>
                    <label htmlFor="">개인 프로필 사진</label>
                    <img src="https://via.placeholder.com/100" alt="profileImageUrl" />
                    <button type='button'>+</button>
                </div>

                <form>
                    <label htmlFor="id">아이디</label>
                    <input type="text" id="username" name="username" placeholder="영문, 숫자 5 ~ 20자 이내 작성" />
                    <button>중복확인</button>
                    <br />
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" name="password" />
                    <br />
                    <label htmlFor="comfirmPassword">비밀번호 확인</label>
                    <input type="password" id="comfirmPassword" name="comfirmPassword" />
                    <br />
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" name="name" placeholder="홍길동" />
                    <br />
                    <label htmlFor="nickname">닉네임</label>
                    <input type="text" id="nickname" name="nickname" placeholder="닉네임을 입력해주세요 (2 ~ 10자)" />
                    <br />
                    <label htmlFor="address">주소</label>
                    <input type="text" id="address" name="address" placeholder="주소 입력" />
                    <button>주소검색</button>
                    <br />
                    <label htmlFor="addressDetail">상세주소</label>
                    <input type="text" id="addressDetail" name="addressDetail" placeholder="상세 주소 입력" />
                    <br />
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" />
                    <br />
                    <label htmlFor="certifyNum">인증번호</label>
                    <input type="number" id="certifyNum" name="certifyNum" placeholder="인증번호를 입력해주세요." />
                    <br />
                    <label htmlFor="phone">연락처</label>
                    <input type="number" id="phone" name="phone" placeholder="010-1111-1111" />
                    <br />
                    <button type="submit">완료</button>
                </form>
            </div>
        </div>
  </>
} 
