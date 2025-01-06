import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function PetUpdate() {
  const { petId } = useParams();
  const [pet, setPet] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchPet = async () => {
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

    fetchPet();
  }, [petId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const nameRegex = /^[가-힣]+$/;

    if (!pet.petName) {
      alert('반려 동물 이름을 입력해 주세요.')
      return;
    } else if (!nameRegex.test(pet.petName)) {
      alert('이름은 한글만 사용할 수 있습니다.');
      return false;
    }

    if (pet.petGender === '' || (pet.petGender !== '0' && pet.petGender !== '1')) {
      alert('반려 동물 성별을 선택해 주세요.');
      return;
    }

    if (!pet.petBirthDate) {
      alert('반려 동물 생년월일을 입력해 주세요.')
      return;
    }

    if (!pet.petWeight) {
      alert('반려 동물 몸무게를 입력해 주세요.')
      return;
    } else if (pet.petWeight <= 0) {
      alert('몸무게는 0보다 커야합니다.')
      return;
    }

    if (!pet.petImageUrl) {
      pet.petImageUrl = 'default-image.jpg';
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("petName", pet.petName);
    formData.append("petGender", pet.petGender);
    formData.append("petBirthDate", pet.petBirthDate);
    formData.append("petWeight", pet.petWeight);
    formData.append("petNeutralityYn", pet.petNeutralityYn);

    if (image) {
      formData.append("petImageUrl", image);
    }

    try {
      const response = await axios.put(
        `http://localhost:4040/api/v1/users/pet/${petId}`,
        pet,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("반려동물 정보가 성공적으로 수정되었습니다.");
        navigate(`/user/pet/${petId}`);
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("반려동물 정보를 수정하는 중 오류가 발생했습니다.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPet((prevPet: any) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div>
      <h2>반려동물 정보 수정</h2>
      {pet && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="petImageUrl">강아지 프로필 사진</label>
            <input type="file" id="petImageUrl" onChange={handleImageChange} />
          </div>

          <div>
            <label>강아지 이름</label>
            <input
              type="text"
              name="petName"
              value={pet.petName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="petGender">성별</label>
            <input
              type="radio"
              id="petGender"
              name="petGender"
              value="0"
              checked={pet.petGender === "0"}
              onChange={handleInputChange}
            />{" "}
            남
            <input
              type="radio"
              id="petGender"
              name="petGender"
              value="1"
              checked={pet.petGender === "1"}
              onChange={handleInputChange}
            />{" "}
            여
          </div>

          <div>
            <label>생년월일</label>
            <input
              type="text"
              name="petBirthDate"
              value={pet.petBirthDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label>몸무게</label>
            <input
              type="number"
              name="petWeight"
              value={pet.petWeight}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label htmlFor="petNeutralityYn">중성화 여부</label>
            <input
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="0"
              checked={pet.petNeutralityYn === "0"}
              onChange={handleInputChange}
            />
            아니오

            <input
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="1"
              checked={pet.petNeutralityYn === "1"}
              onChange={handleInputChange}
            />
            예
          </div>

          <div>
          <label htmlFor="petAddInfo">추가 정보</label>
          <input 
            type="text" 
            id='petAddInfo'
            name='petAddInfo'
            value={pet.petAddInfo}
            onChange={handleInputChange}
          />
        </div>

          <button type="submit">확인</button>
        </form>
      )}
    </div>
  );
}
