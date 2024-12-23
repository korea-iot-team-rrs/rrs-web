import React from 'react'


export default function SignUp() {


  return <>
        <div>
            <div>
                <h1>회원가입</h1>

                <div>
                    <img src="https://via.placeholder.com/100" alt="Profile" />
                </div>

                <form>
                    <label htmlFor="id">아이디</label>
                    <input type="text" id="id" name="id" placeholder="영문, 숫자 5 ~ 20자 이내 작성" />
                    <br />
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" name="password" />
                    <br />
                    <label htmlFor="password-confirm">비밀번호 확인</label>
                    <input type="password" id="password-confirm" name="password-confirm" />
                    <br />
                    <label htmlFor="name">이름</label>
                    <input type="text" id="name" name="name" placeholder="홍길동" />
                    <br />
                    <label htmlFor="nickname">닉네임 (2 ~ 10자)</label>
                    <input type="text" id="nickname" name="nickname" placeholder="닉네임을 입력해주세요" />
                    <br />
                    <label htmlFor="address">주소</label>
                    <input type="text" id="address" name="address" placeholder="주소 입력" />
                    <br />
                    <label htmlFor="email">이메일</label>
                    <input type="email" id="email" name="email" placeholder="example@domain.com" />
                    <br />
                    <button type="submit">완료</button>
                </form>
            </div>
        </div>
  </>
} 
