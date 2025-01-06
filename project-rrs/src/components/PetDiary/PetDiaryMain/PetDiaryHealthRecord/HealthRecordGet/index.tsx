import React, { useEffect, useState } from "react";
import { getHealthRecordById } from "../../../../../apis/petHealthApi";
import "../../../../styles/PetHealthRecord.css";
import { HealthRecordResponse } from "../../../../../types/petHealthType";

interface HealthRecordGetProps {
  selectedPet: { petId: number; petName: string } | null;
  selectedDate: string;
  healthRecordId: number;
  goBack: () => void;
}

export default function HealthRecordGet({
  selectedPet,
  selectedDate,
  healthRecordId,
  goBack,
}: HealthRecordGetProps) {
  const [healthRecord, setHealthRecord] = useState<HealthRecordResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedPet || !healthRecordId) return;

    const fetchHealthRecord = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const record = await getHealthRecordById(
          selectedPet.petId,
          healthRecordId
        );
        setHealthRecord(record);
      } catch (err) {
        console.error("Error fetching health record:", err);
        setError("건강 기록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthRecord();
  }, [selectedPet, healthRecordId]);

  if (!selectedPet) {
    return (
      <div className="healthRecordGetContainer">
        <p>반려 동물이 선택되지 않았습니다.</p>
        <button onClick={goBack}>뒤로 가기</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="healthRecordGetContainer">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="healthRecordGetContainer">
        <p className="errorMessage">{error}</p>
        <button onClick={goBack}>뒤로 가기</button>
      </div>
    );
  }

  return (
    <div className="healthRecordGetContainer">
      <h2>건강 기록 상세 정보</h2>
      {healthRecord ? (
        <>
          <p><strong>반려 동물:</strong> {selectedPet.petName}</p>
          <p><strong>날짜:</strong> {selectedDate}</p>
          <p><strong>설명:</strong> {healthRecord.description}</p>
          {healthRecord.attachmentUrl && (
            <div>
              <strong>첨부 파일:</strong>
              <a
                href={healthRecord.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                첨부 파일 보기
              </a>
            </div>
          )}
        </>
      ) : (
        <p>건강 기록을 찾을 수 없습니다.</p>
      )}
      <button onClick={goBack} className="goBackButton">
        뒤로 가기
      </button>
    </div>
  );
}
