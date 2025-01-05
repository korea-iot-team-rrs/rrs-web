import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePetStore, { Pet } from "../../../stores/petstore";
import '../../../styles/Pet.css'
import axios from "axios";

export default function PetList() {
  const [pets, setPets] = useState<any[]>([]);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:4040/api/v1/users/pet", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.data) {
          setPets(response.data.data as Pet[]); 
        }
      } catch (error) {
        console.error("에러 발생:", error);
        alert("반려 동물 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPets();
  }, [navigate, setPets]);

  const handleAddPetClick = () => {
    navigate("/user/pet-create");
  };

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleViewPet = (petId: any) => {
    navigate(`/user/pet/${petId}`);
  };

  const handleUpdatePet = (petId: any) => {
    navigate(`/user/pet-update/${petId}`);
  };

  // 반려동물 정보 삭제
  const handleDeletePet = async (petId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }
  
    const confirmDelete = window.confirm("정말 이 반려동물을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:4040/api/v1/users/pet/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 204) {
          // prevPets의 타입을 명시적으로 지정
          setPets((prevPets: Pet[]) => prevPets.filter((pet) => pet.petId !== petId));
          alert("반려 동물이 삭제되었습니다.");
        } else {
          alert("반려 동물 삭제 실패");
        }
      } catch (error) {
        console.error("삭제 에러:", error);
        alert("반려 동물을 삭제하는 중 오류가 발생했습니다.");
      }
    }
  };
  
  return (
    <div className="petListContent">
      {pets.length > 0 &&
        pets.map((pet, index) => (
          <div key={index} className="petListBox">
            <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
            <p>{pet.petName}</p>
            <button className="toggle-btn" onClick={() => handleToggle(index)}>...</button>

            {activeIndex === index && (
              <div className="dropdown-menu">
                <button onClick={() => handleViewPet(pet.petId)}>조회</button>
                <button onClick={() => handleUpdatePet(pet.petId)}>수정</button>
                <button onClick={() => handleDeletePet(pet.petId)}>삭제</button>
              </div>
            )}
          </div>
        ))}
      
      <button className="addPet" onClick={handleAddPetClick}>
        <div className="circle">
          <p>+</p>
        </div>
        <p>반려 동물 등록</p>
      </button>
    </div>
  );
}
