import React, { useEffect, useState } from "react";
import usePetStore, { Pet } from "../../../../stores/petstore";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../../../../styles/PetHealthRecord.css";
import { PetDiaryTodoProps } from "../../../../types/petDiaryType";
import { FaPlusCircle } from "react-icons/fa";

export default function PetDiaryHealthRecord({
  selectedDate: initialSelectedDate,
}: PetDiaryTodoProps) {
  const { pets, setPets } = usePetStore();
  const [cookies] = useCookies(["token"]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    initialSelectedDate || ""
  );

  const handleAddPetClick = () => {
    navigate("/user/pet-create");
  };

  const handleAddHealthRecordClick = () => {
    if (!selectedPet) {
      alert("반려 동물을 선택해 주세요.");
      return;
    }
    setIsCreating(true);
  };

  const goBack = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleEditHealthRecordClick = () => {
    setIsEditing(true);
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

  return (
    <div>
      {isCreating ? (
        <div>
          {/* HealthRecordCreate 컴포넌트 자리 */}
          <button onClick={goBack}>뒤로 가기</button>
        </div>
      ) : isEditing ? (
        <div>
          {/* HealthRecordUpdate 컴포넌트 자리 */}
          <button onClick={goBack}>뒤로 가기</button>
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
                  onClick={() => setSelectedPet(pet)}
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

            <button onClick={handleAddHealthRecordClick}>
              추가하기
              <FaPlusCircle size={"1.3em"} />
            </button>
          </div>

          <div className="healthRecordList">
            {selectedPet ? (
              <div className="noContent">
                <p>작성한 내용이 없습니다.</p>
              </div>
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
