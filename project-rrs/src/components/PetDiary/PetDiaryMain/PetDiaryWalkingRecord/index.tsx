import React, { useEffect, useState } from "react";
import usePetStore, { WalkingRecord } from "../../../../stores/petstore";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../../../styles/PetWalkingRecord.css";
import { PetDiaryTodoProps } from "../../../../types/petDiaryType";
import { FaPlusCircle } from "react-icons/fa";
import WalkingRecordCreate from "./WalkingRecordCreate";
import { Pet } from "../../../../types";
import axios from "axios";
import WalkingRecordGet from "./WalkingRecordGet";

export default function PetDiaryWalkingRecord({
  selectedDate: initialSelectedDate,
}: PetDiaryTodoProps) {
  const { pets, setPets } = usePetStore();
  const [cookies] = useCookies(["token"]);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkingRecords, setWalkingRecords] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [walkingRecordId, setWalkingRecordId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate || '');

  const handleAddPetClick = () => {
    navigate("/user/pet-create");
  };

  const handleAddWalkingRecordClick = () => {
    if (!selectedPet) {
      alert("반려 동물을 선택해 주세요.");
      return;
    }
    setIsCreating(true);
  };

  const goBack = () => {
    setIsCreating(false);
    setIsFetching(false);
  };

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:4040/api/v1/users/pet", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("반려 동물 정보를 불러오지 못했습니다.");
        }

        const data = await response.json();
        setPets(data.data || []);
      } catch (error) {
        console.error("에러 발생:", error);
        alert("반려 동물 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPets();
  }, [cookies, navigate, setPets]);

  useEffect(() => {
    if (selectedPet && selectedDate) {
      const fetchWalkingRecords = async () => {
        try {
          const token = cookies.token || localStorage.getItem("token");
          const petId = selectedPet?.petId;
          const walkingRecordCreateAt = selectedDate;

          const response = await fetch(
            `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordCreateAt/${walkingRecordCreateAt}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("산책 기록을 불러오지 못했습니다.");
          }

          const data = await response.json();
          setWalkingRecords(data.data || []);
        } catch (error) {
          console.log("에러:", error);
          alert("산책 기록을 불러오는 중 오류 발생");
        }
      };

      fetchWalkingRecords();
    }
  }, [selectedPet, selectedDate, cookies.token]);

  const addWalkingRecord = (newRecord: any) => {
    setWalkingRecords((prevRecords) => [newRecord, ...prevRecords]);
  };

  // 산책기록 조회
  const handleRecordClick = (record: WalkingRecord) => {
    setWalkingRecordId(record.walkingRecordId);
    setSelectedDate(record.walkingRecordCreateAt);  // 선택된 기록의 날짜 설정
    setIsFetching(true);  // 로딩 시작
  };

  // 산책기록 삭제
  const deleteWalkingRecord = async (walkingRecordId: number) => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    if (!selectedPet) {
      alert("반려동물을 선택해 주세요.");
      return;
    }

    const petId = selectedPet.petId;

    try {
      const response = await axios.delete(
        `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 204) {
        setWalkingRecords((prevRecords) =>
          prevRecords.filter((record) => record.walkingRecordId !== walkingRecordId)
        );
        alert("산책 기록이 삭제되었습니다.");
      } else {
        alert("산책 기록 삭제 실패");
      }
    } catch (error) {
      console.error("삭제 에러:", error);
      alert("산책 기록을 삭제하는 중 오류가 발생했습니다.");
    }
  };
  
  return (
    <div>
      {isCreating ? (
        <WalkingRecordCreate 
          selectedPet={selectedPet} 
          selectedDate={selectedDate} 
          goBack={goBack} 
          addWalkingRecord={addWalkingRecord}
        />
      ) : isFetching ? (
        <div>
          <WalkingRecordGet
            selectedPet={selectedPet} 
            selectedDate={selectedDate}
            walkingRecordId={walkingRecordId}
            goBack={goBack}
          />
        </div>
      ) : (
        <>
          <div className="selectPetContainer">
            {pets.length > 0 ? (
              pets.map((pet, index) => (
                <button
                  key={index}
                  className={`petBox ${
                    selectedPet?.petId === pet.petId ? "selected" : ""
                  }`}
                  onClick={() => {
                    console.log("selected pet:", pet);
                    setSelectedPet(pet);
                  }}
                >
                  <div className="petCircleBox">
                    <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
                  </div>
                  <p>{pet.petName}</p>
                </button>
              ))
            ) : (
              <div>
                <p>등록된 반려 동물이 없습니다.</p>
                <button onClick={handleAddPetClick}>반려 동물 등록</button>
              </div>
            )}
          </div>

          <div className="midElement">
            <span>
              {selectedDate && (
                <>
                  {selectedDate.split("-")[0]}년 &nbsp;
                  {selectedDate.split("-")[1]}월 &nbsp;
                  {selectedDate.split("-")[2]}일
                </>
              )}
            </span>

            <button onClick={handleAddWalkingRecordClick}>
              추가하기
              <FaPlusCircle size={"1.3em"} />
            </button>
          </div>

          <div className="walkingRecordList">
            {selectedPet ? (
              walkingRecords.length > 0 ? (
                walkingRecords.map((record, index) => (
                  <button 
                    key={index}
                    onClick={() => handleRecordClick(record)}
                  >
                    <img
                      src={selectedPet.petImageUrl}
                      alt={`${selectedPet.petName}의 사진`}
                    />
                    
                    <div>
                      <button>수정</button>
                      <button onClick={() => deleteWalkingRecord(record.walkingRecordId)}>삭제</button>
                    </div>
                    
                    <p>{record.walkingRecordDistance} m</p>
                    <p>{Math.floor(record.walkingRecordWalkingTime / 60)}시간 {record.walkingRecordWalkingTime % 60}분</p>
                  </button>
                ))

              ) : (
                <div className="noContent">
                  <p>작성한 내용이 없습니다.</p>
                </div>
              )
            ) : (
              <div className="choicePet">
                <p>반려 동물을 선택해 주세요.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
