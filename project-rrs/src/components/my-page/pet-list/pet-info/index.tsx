import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pet } from "../../../../stores/usePet.store";
import petDefaultImage from "../../../../assets/images/pet-default-profile.jpg";
import "../../../../styles/myPage/Pet.css";

export default function PetInfo() {
  const { petId } = useParams();
  const [pet, setPet] = useState<Pet>({} as Pet);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/users/pet/${petId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data && response.data.data) {
          setPet(response.data.data);
        }
      } catch (error) {
        console.error("에러 발생:", error);
        alert("반려 동물 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPets();
  }, [navigate, petId]);

  const getGender = (gender: string) => {
    return gender === "0" ? "남" : "여";
  };

  const getNeutralityYn = (neutralityYn: string) => {
    return neutralityYn === "0" ? "아니오" : "예";
  };

  const formatBirthDate = (birthDate: string) => {
    if (birthDate && birthDate.length === 6) {
      const year = birthDate.substring(0, 4);
      const month = birthDate.substring(4, 6);
      return `${year}년 ${month}월`;
    }
    return birthDate || "";
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="petContent">
      <div className="petInfoContent">
        <h2>{pet.petName} 정보 </h2>
        <div className="petInfoElement">
          <label>강아지 프로필 사진</label>
          <img
            src={
              pet.petImageUrl
                ? `http://localhost:4040/${pet.petImageUrl}`
                : petDefaultImage
            }
            alt={`${pet.petName}의 사진`}
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = petDefaultImage;
            }}
          />
        </div>

        <div className="petInfoElement">
          <label>강아지 이름</label>
          <p>{pet.petName}</p>
        </div>

        <div className="petInfoElement">
          <label>성별</label>
          <p>{getGender(pet.petGender)}</p>
        </div>

        <div className="petInfoElement">
          <label>생년월일</label>
          <p>{formatBirthDate(pet.petBirthDate)}</p>
        </div>

        <div className="petInfoElement">
          <label>몸무게</label>
          <p>{pet.petWeight} Kg</p>
        </div>

        <div className="petInfoElement">
          <label>중성화 여부</label>
          <p>{getNeutralityYn(pet.petNeutralityYn)}</p>
        </div>

        <div className="petInfoElement">
          <label>추가 정보</label>
          <p>{pet.petName}</p>
        </div>

        <button type="button" onClick={goBack}>
          확인
        </button>
      </div>
    </div>
  );
}
