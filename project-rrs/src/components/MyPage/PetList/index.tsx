import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePetStore from "../../../stores/petstore";
import '../../../styles/Pet.css'

export default function PetList() {
  const { pets, setPets } = usePetStore();
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
  }, [navigate, setPets]);

  const handleAddPetClick = () => {
    navigate("/user/pet-create");
  }

  return (
    <div>
    {pets.length > 0 && 
      pets.map((pet, index) => (
        <div key={index} className="petBox">
          <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
          <p>{pet.petName}</p>
          <button className="toggle-btn">...</button>
        </div>
      ))
    }
    
    {/* 항상 출력되도록 addPet 버튼을 조건과 상관없이 여기에 추가 */}
    <button className="addPet" onClick={handleAddPetClick}>
      <div className="circle">
        <p>+</p>
      </div>
      <p>반려 동물 등록</p>
    </button>
  </div>
  );
}
