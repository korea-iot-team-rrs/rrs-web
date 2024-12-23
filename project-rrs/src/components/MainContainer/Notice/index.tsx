import React from 'react'

export default function Notice() {
    return (
        <div className="box noticeAndPetsitter">
          <div className="notice">
            <ul>
              <h2>Notice</h2>
              {['03', '02', '01'].map((item) => (
                <li key={item}>
                  <span> 공지 {item}</span>
                  <span> 공지 {item} This is mockup contentes of notice</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="petsitter">
            <button>Petsitter 바로가기</button>
          </div>
        </div>
    )
}
