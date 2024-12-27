import React from 'react'
import petprofileImg from '../../../assets/images/community.jpg'

export default function HealthRecord() {
  return (
    <div className="box healthRecord">
      <div className="health content">
        <h2>오늘의 건강기록</h2>
        <div className="petList">
          <ul>
            {['Pet List 1', 'Pet List 2'].map((pet, index) => (
              <li key={index}>
                <button type="button">{pet}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="petInfo">
          <div className="petprofileImg">
            <img src={petprofileImg} style={{
              borderRadius: "50%",
              width: "75px",
              height: "75px"
            }} alt="doggy" />
          </div>
          <div>
            <ul>
              <li>
                <span>펫의 실제 이름</span>
              </li>
              <li>
                <span>나이</span>
                <span>Pet_age</span>
              </li>
              <li>
                <span>몸무게</span>
                <span>Pet_weight</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="petHealthDetail">
          <ul>
            <li>
              <span>이상증상</span>
              <span>이상증상 내용</span>
            </li>
            <li>
              <span>메모</span>
              <span>메모 내용</span>
            </li>
          </ul>
          <button type="button" className='gotoPetDetail'>(+)</button>
        </div>
      </div>
    </div>
  )
}
