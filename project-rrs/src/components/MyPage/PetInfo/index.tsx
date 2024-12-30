import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PetInfo() {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인 상태 확인
    const token = localStorage.getItem('token'); // JWT 토큰을 로컬 스토리지에서 가져옴
    if (!token) {
      alert('로그인 정보가 없습니다.');
      navigate('/');
      return;
    }

    // 강아지 리스트를 받아오는 함수
    const fetchPets = async () => {
      try {
        const response = await fetch('https://api.example.com/pets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('강아지 리스트를 불러오지 못했습니다.');
        }

        const data = await response.json();
        console.log("이게몬데" + data);
        setPets(data); // 서버에서 받아온 강아지 리스트를 상태로 저장
      } catch (error) {
        console.error('에러 발생:', error);
        alert('강아지 리스트를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchPets();
  }, []);

  return (
    <div>
      {pets.length > 0 ? (
        <>
          {pets.map((pet) => (
            <div key={pet.id} className="petBox">
              <img src={pet.imageUrl} alt={`${pet.name}의 사진`} />
              <p>{pet.name}</p>
              <button className="toggle-btn">...</button>
            </div>
          ))}
          <button className="addPet">
            <div className="circle">
              <p>+</p>
            </div>
            <p>반려 동물 등록</p>
          </button>
        </>
      ) : (
        <button className="addPet">
          <div className="circle">
            <p>+</p>
          </div>
          <p>반려 동물 등록</p>
        </button>
      )}
    </div>
  );
}
