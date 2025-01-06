import React, { useState, useEffect } from "react";
import { fetchPets } from "../../../../../apis/petApi";
import { getAllHealthRecords } from "../../../../../apis/petHealthApi";
import { HealthRecordResponse } from "../../../../../types/petHealthType";
import { getToken } from "../../../../../utils/auth";
import { Pet } from "../../../../../types/index";
import "../../../../../styles/PetHealthRecord.css";

const PetHealthRecordList = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecordResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 반려동물 리스트 가져오기
  useEffect(() => {
    const loadPets = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          setError("인증 토큰이 없습니다. 로그인 해주세요.");
          return;
        }

        const petsData = await fetchPets(token);
        setPets(petsData);
        setError(null);
      } catch (err) {
        console.error("반려동물 정보 가져오기 실패:", err);
        setError("반려동물 정보를 가져오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPets();
  }, []);

  // 특정 반려동물의 건강기록 가져오기
  const loadHealthRecords = async (petId: number) => {
    try {
      setIsLoading(true);
      const records = await getAllHealthRecords(petId);
      setHealthRecords(records.healthRecords);
      setError(null);
    } catch (err) {
      console.error("건강기록 조회 실패:", err);
      setError("건강기록을 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 반려동물 선택 시 처리
  const handlePetSelection = (petId: number) => {
    setSelectedPetId(petId);
    loadHealthRecords(petId);
  };

  return (
    <div>
      {/* 반려동물 선택 화면 */}
      <div className="petHealthSelectContainer">
        {Array.isArray(pets) && pets.length > 0 ? (
          pets.map((pet, index) => (
            <button
              key={index}
              className="petHealthBox"
              onClick={() => handlePetSelection(pet.petId)}
            >
              <div className="petHealthCircleBox">
                <img src={pet.petImageUrl} alt={`${pet.petName}의 사진`} />
                <p>{pet.petName}</p>
              </div>
            </button>
          ))
        ) : (
          <div>
            <p>등록된 반려 동물이 없습니다.</p>
            <button>반려 동물 등록</button>
          </div>
        )}
      </div>

      {/* 건강기록 리스트 */}
      <div className="petHealthRecordList">
        {selectedPetId ? (
          Array.isArray(healthRecords) && healthRecords.length > 0 ? (
            healthRecords.map((record, index) => (
              <div key={index} className="petHealthRecordItem">
                <p>기록 날짜: {record.recordDate}</p>
                <p>설명: {record.description}</p>
                {record.attachmentUrl && (
                  <a
                    href={record.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    첨부파일 보기
                  </a>
                )}
              </div>
            ))
          ) : (
            <div>
              <p>작성한 건강기록이 없습니다.</p>
            </div>
          )
        ) : (
          <div>
            <p>반려 동물을 선택해주세요.</p>
          </div>
        )}
      </div>

      {/* 로딩 상태 */}
      {isLoading && <p className="petHealthLoadingMessage">로딩 중...</p>}

      {/* 에러 메시지 */}
      {error && <p className="petHealthErrorMessage">{error}</p>}
    </div>
  );
};

export default PetHealthRecordList;
