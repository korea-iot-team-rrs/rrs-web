import React from 'react'
import img from '../../../assets/images/community.jpg'

export default function Community() {
    return (
        <div className="box community">
          <h2>Community</h2>
          <div>
            <img src={img} style={{
              width: "150px",
              height: "150px",
              borderRadius: "10px"
            }} alt="Community Post Img" />
          </div>
          <div>
            <h3>오늘의 화제글</h3>
            <p>
              <strong>[개소리 칼럼]</strong>
            </p>
            <p className="communityContent">
              개를 키우시는 분들은 주인이 뭐라고 말했을 때 개의 반응에서 금방 기분이 어떤지 파악할 수 있을 겁니다 ...
            </p>
          </div>
        </div>
    )
}
