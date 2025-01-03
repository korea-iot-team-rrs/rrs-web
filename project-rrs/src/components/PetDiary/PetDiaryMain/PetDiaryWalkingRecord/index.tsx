import React, { useEffect, useState } from "react";
import usePetStore from "../../../../stores/pet.store";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../../../styles/PetWalkingRecord.css";
import { PetDiaryTodoProps } from "../../../../types/petDiaryType";
import { FaPlusCircle } from "react-icons/fa";
import { Pet } from "../../../../types/PetType";

export default function PetDiaryWalkingRecord({
  selectedDate,
}: PetDiaryTodoProps) {
  const { pets, setPets } = usePetStore();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [walkingRecords, setWalkingRecords] = useState<any[]>([]);

  const handleAddPetClick = () => {
    navigate("/user/pet-create");
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
        setPets(data.data);
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
                "Content-Type": "applicateion/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("산책 기록을 불러오지 못했습니다.");
          }

          const data = await response.json();

          if (data && data.data) {
            data.data.forEach((pet: Pet) => {
              console.log(pet.petId);
            });
          }
          setPets(data.data);

          setWalkingRecords(data.data || []);
        } catch (error) {
          console.log("에러:", error);
          alert("산책 기록을 불러오는 중 오류 발생");
        }
      };

      fetchWalkingRecords();
    }
  }, [selectedPet, selectedDate, cookies.token]);

  return (
    <div>
      <div className="selectPetContainer">
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <button
              key={index}
              className="petBox"
              onClick={() => {
                setSelectedPet(pet);
              }}
            >
              <div className="petCircleBox">
                <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
                <p>{pet.petName}</p>
              </div>
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

        <button>
          추가하기
          <FaPlusCircle size={"1.3em"} />
        </button>
      </div>

      <div className="walkingRecordList">
        {selectedPet ? (
          walkingRecords.length > 0 ? (
            walkingRecords.map((record, index) => (
              <div key={index}>
                <img
                  src={selectedPet.petImageUrl}
                  alt={`${selectedPet.petName}의 사진`}
                />
                <button>수정</button>
                <button>삭제</button>
                <p>산책 거리</p>
                <p>산책 시간</p>
              </div>
            ))
          ) : (
            <div>
              <p>작성한 내용이 없습니다.</p>
            </div>
          )
        ) : (
          <div>
            <p>반려 동물을 선택해주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}