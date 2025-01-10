import React, { useEffect, useState } from "react";
import { getHealthRecordById } from "../../../../../apis/petHealthApi";
import "../../../../../styles/PetHealthRecord.css";
import { HealthRecordResponse } from "../../../../../types/petHealthType";

const BASE_FILE_URL = "http://localhost:4040/"; // 파일 URL 기본 경로

interface HealthRecordGetProps {
  selectedPet: { petId: number; petName: string } | null;
  healthRecordId: number;
  goBack: () => void;
  selectedDate: string;
}

export default function HealthRecordGet({
  selectedPet,
  healthRecordId,
  goBack,
  selectedDate,
}: HealthRecordGetProps) {
  const [healthRecord, setHealthRecord] = useState<HealthRecordResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedPet || !healthRecordId) return;

    const fetchHealthRecord = async () => {
      setIsLoading(true);

      try {
        const record = await getHealthRecordById(
          selectedPet.petId,
          healthRecordId
        );
        console.log(record);
        setHealthRecord(record);
      } catch {
        console.log("건강 기록이 없습니다.");
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
        <button onClick={goBack} className="goBackButton">
          뒤로 가기
        </button>
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

  return (
    <div className="healthRecordGetContainer">
      <h2>건강 기록 상세 정보</h2>
      {healthRecord ? (
        <>
          <p>
            <strong>반려 동물:</strong> {selectedPet.petName}
          </p>
          <p>
            <strong>날짜:</strong>{" "}
            {new Date(healthRecord.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>이상 증상:</strong> {healthRecord.abnormalSymptoms}
          </p>
          <p>
            <strong>체중:</strong> {healthRecord.weight} kg
          </p>
          <p>
            <strong>반려동물 나이:</strong> {healthRecord.petAge} 세
          </p>
          {healthRecord.memo && (
            <p>
              <strong>메모:</strong> {healthRecord.memo}
            </p>
          )}
          {healthRecord.attachments && healthRecord.attachments.length > 0 && (
            <div>
              <strong>첨부 파일:</strong>
              <ul>
                {healthRecord.attachments.map((filePath, index) => (
                  <li key={index}>
                    <a
                      href={`${BASE_FILE_URL}${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      첨부 파일 {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
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
