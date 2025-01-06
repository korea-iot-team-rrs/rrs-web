import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pet, WalkingRecord } from "../../../../../stores/petstore";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

interface WalkingRecordUpdateProps {
  selectedPet: Pet | null;
  walkingRecordId: number;
  goBack: () => void;
}

const WalkingRecordUpdate: React.FC<WalkingRecordUpdateProps> = ({
  selectedPet,
  walkingRecordId,
  goBack,
}) => {
  const [walkingRecord, setWalkingRecord] = useState<WalkingRecord | null>(null);
  const [walkingRecordDistance, setWalkingRecordDistance] = useState<number>(0);
  const [walkingRecordWalkingTime, setWalkingRecordWalkingTime] = useState<number>(0);
  const [walkingRecordMemo, setWalkingRecordMemo] = useState<string>("");
  const [walkingRecordWeatherState, setWalkingRecordWeatherState] = useState<string>("맑음");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cookies] = useCookies(["token"]);

  const navigate = useNavigate();
  const petId = selectedPet?.petId;

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    console.log("token:", token);
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }
  }, [cookies, navigate]);

  

        const response = await axios.get(
          `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setWalkingRecord(response.data.data);
        setWalkingRecordDistance(response.data.data.walkingRecordDistance);
        setWalkingRecordWalkingTime(response.data.data.walkingRecordWalkingTime);
        setWalkingRecordMemo(response.data.data.walkingRecordMemo);
      } catch (error) {
        console.error("산책 기록을 불러오는 중 오류 발생:", error);
        alert("산책 기록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    if (walkingRecordId) {
      fetchWalkingRecord();
    }
  }, [walkingRecordId]);

  const handleSaveChanges = async () => {
    if (!selectedPet || !walkingRecord) {
      alert("수정할 산책 기록이 없습니다.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
        {
          walkingRecordDistance,
          walkingRecordWalkingTime,
          walkingRecordMemo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("산책 기록이 수정되었습니다.");
        goBack(); // 수정 후 돌아가기
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("산책 기록 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2>산책 기록 수정</h2>
      {walkingRecord ? (
        <div>
          <div>
            <label>거리:</label>
            <input
              type="number"
              value={walkingRecordDistance}
              onChange={(e) => setWalkingRecordDistance(Number(e.target.value))}
            />
          </div>
          <div>
            <label>시간:</label>
            <input
              type="number"
              value={walkingRecordWalkingTime}
              onChange={(e) => setWalkingRecordWalkingTime(Number(e.target.value))}
            />
          </div>
          <div>
            <label>메모:</label>
            <textarea
              value={walkingRecordMemo}
              onChange={(e) => setWalkingRecordMemo(e.target.value)}
            />
          </div>
          <button onClick={handleSaveChanges}>저장</button>
          <button onClick={goBack}>취소</button>
        </div>
      ) : (
        <p>산책 기록을 불러오는 중...</p>
      )}
    </div>
  );
};

export default WalkingRecordUpdate;
