import React, { useEffect, useState } from 'react'
import { Pet } from '../../../../../types';
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface WalkingRecordCreateProps {
  selectedPet: Pet | null;
  selectedDate: string;
  walkingRecordId: number;
  goBack: () => void;
}

const WalkingRecordGet = ({ selectedPet, selectedDate, walkingRecordId, goBack }: WalkingRecordCreateProps) => {
  const [walkingRecord, setWalkingRecord] = useState<any | null>(null);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    console.log('walkingRecordId: ', walkingRecordId);

    if (selectedPet && selectedDate) {
      const fetchWalkingRecord = async () => {
        const petId = selectedPet.petId;
        const token = cookies.token || localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              }
            }
          );
          setWalkingRecord(response.data.data);  // 데이터를 받아와서 상태에 저장
        } catch (error) {
          console.error("산책 기록 조회 오류:", error);
          alert("산책 기록을 불러오는 중 오류가 발생했습니다.");
        }
      };
      fetchWalkingRecord();
    }
  }, [selectedPet, selectedDate]);

  if (!walkingRecord) {
    return <p>산책 기록을 불러오는 중...</p>;
  }


  return (
    <div>
      <img src={selectedPet?.petImageUrl} alt={`${selectedPet?.petName}의 사진`} />
      <div>
        <label htmlFor="fetch-date">작성 날짜</label>
        <span id='fetch-date'>
            {selectedDate && (
              <>
                {selectedDate.split("-")[0]}년 &nbsp;
                {selectedDate.split("-")[1]}월 &nbsp;
                {selectedDate.split("-")[2]}일
              </>
            )}
          </span>
        </div>

        <div className='weather-container'>
          <label>날씨</label>
          <p>{walkingRecord.walkingRecordWeatherState || '정보 없음'}</p>
        </div>

        <div>
          <label htmlFor="walking-time">산책 시간</label>
          <p>{Math.floor(walkingRecord.walkingRecordWalkingTime / 60)}시간 {walkingRecord.walkingRecordWalkingTime % 60}분</p>
        </div>

        <div>
          <label htmlFor="walking-distance">산책 거리</label>
          <p>{walkingRecord.walkingRecordDistance} m</p>
        </div>

        <div>
          <label htmlFor="memo">메모</label>
          <p>{walkingRecord.walkingRecordMemo}</p>
        </div>

        <div>
          <label htmlFor="files">사진</label>
          {walkingRecord.fileName?.length > 0 ? (  // fileName 필드로 수정
            walkingRecord.fileName.map((url: string, index: number) => (
              <img key={index} src={url} alt={`산책 기록 사진 ${index + 1}`} />
            ))
          ) : (
            <p>사진 없음</p>
          )}
      </div>

        <button onClick={goBack}>뒤로 가기</button>
    </div>
  )
}

export default WalkingRecordGet;