import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Pet } from "../../../../../types";
import axios from "axios";
import { useCookies } from "react-cookie";
import { IoMdSunny } from "react-icons/io";
import { IoCloudy, IoRainy } from "react-icons/io5";
import { TbSnowman } from "react-icons/tb";

interface WalkingRecorGetProps {
  selectedPet: Pet | null;
  selectedDate: string;
  walkingRecordId: number;
  goBack: () => void;
}

const WalkingRecordGet = ({
  selectedPet,
  selectedDate,
  walkingRecordId,
  goBack,
}: WalkingRecorGetProps) => {
  const [walkingRecord, setWalkingRecord] = useState<any | null>(null);
  const [cookies] = useCookies(["token"]);

  const weatherOptions = [
    { value: "SUNNY", label: <IoMdSunny style={{ fontSize: "24px" }} /> },
    { value: "CLOUDY", label: <IoCloudy style={{ fontSize: "24px" }} /> },
    { value: "RAINY", label: <IoRainy style={{ fontSize: "24px" }} /> },
    { value: "SNOWY", label: <TbSnowman style={{ fontSize: "24px" }} /> },
  ];

  const getWeatherIcon = (weatherState: string) => {
    const weather = weatherOptions.find(
      (option) => option.value === weatherState
    );
    return weather?.label;
  };

  useEffect(() => {
    console.log("walkingRecordId: ", walkingRecordId);

    if (selectedPet && selectedDate) {
      const fetchWalkingRecord = async () => {
        const petId = selectedPet.petId;
        const token = cookies.token || localStorage.getItem("token");

        try {
          const response = await axios.get(
            `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          setWalkingRecord(response.data.data);
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
      <img
        src={selectedPet?.petImageUrl}
        alt={`${selectedPet?.petName}의 사진`}
      />
      <div>
        <label htmlFor="fetch-date">작성 날짜</label>
        <span id="fetch-date">
          {selectedDate && (
            <>
              {selectedDate.split("-")[0]}년 &nbsp;
              {selectedDate.split("-")[1]}월 &nbsp;
              {selectedDate.split("-")[2]}일
            </>
          )}
        </span>
      </div>

      <div className="weather-container">
        <label>날씨</label>
        <p>{getWeatherIcon(walkingRecord.walkingRecordWeatherState)}</p>
      </div>

      <div>
        <label htmlFor="walking-time">산책 시간</label>
        <p>
          {Math.floor(walkingRecord.walkingRecordWalkingTime / 60)}시간{" "}
          {walkingRecord.walkingRecordWalkingTime % 60}분
        </p>
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
        {walkingRecord.fileName?.length > 0 ? (
          <div className="image-list">
            {walkingRecord.fileName.map((url: string, index: number) => (
              <img
                key={index}
                src={`http://localhost:4040/${url}`}
                alt={`산책 기록 사진 ${index + 1}`}
              />
            ))}
          </div>
        ) : (
          <p>없음</p>
        )}
      </div>

      <button onClick={goBack}>뒤로 가기</button>
    </div>
  );
};

export default WalkingRecordGet;