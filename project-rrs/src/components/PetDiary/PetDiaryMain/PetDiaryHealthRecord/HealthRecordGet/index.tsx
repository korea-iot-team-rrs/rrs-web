import React, { useEffect, useState } from "react";
import { getHealthRecordById } from "../../../../../apis/petHealthApi";
import { fetchAttachmentsByHealthRecordId } from "../../../../../apis/healthRecordAttachment";
import "../../../../../styles/pethealthRecord/pethealthRecordDetail.css";
import { HealthRecordResponse } from "../../../../../types/petHealthType";

const BASE_FILE_URL = "http://localhost:4040/"; // 파일 URL 기본 경로

interface HealthRecordGetProps {
  selectedPet: { petId: number; petName: string; petImageUrl?: string } | null;
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
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
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
        setHealthRecord(record);

        const serverAttachments = await fetchAttachmentsByHealthRecordId(
          healthRecordId
        );
        const filePaths = serverAttachments.map(
          (attachment) => attachment.filePath
        );
        setExistingAttachments(filePaths);
      } catch (err) {
        console.error("건강 기록을 가져오는 중 오류:", err);
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
      <div className="header">
        <h2>건강 기록 상세 정보</h2>
        <button onClick={goBack} className="goBackButton">
          뒤로 가기
        </button>
      </div>
      <div className="topSection">
        {selectedPet.petImageUrl && (
          <div className="petImageContainer">
            <img
              src={selectedPet.petImageUrl}
              alt={`${selectedPet.petName}의 사진`}
              className="petImage"
            />
          </div>
        )}
        <div className="basicInfo">
          <p>
            <strong>반려동물:</strong> {selectedPet.petName}
          </p>
          <p>
            <strong>날짜:</strong>{" "}
            {new Date(healthRecord?.createdAt || selectedDate).toLocaleDateString()}
          </p>
          <p>
            <strong>체중:</strong> {healthRecord?.weight || "-"} kg
          </p>
          <p>
            <strong>반려동물 나이:</strong> {healthRecord?.petAge || "-"} 세
          </p>
        </div>
      </div>
      <div className="bottomSection">
        <div className="belowImageDetails">
          <p>
            <strong>이상 증상:</strong> {healthRecord?.abnormalSymptoms || "-"}
          </p>
          {healthRecord?.memo && (
            <p>
              <strong>메모:</strong> {healthRecord.memo}
            </p>
          )}
        </div>
      </div>
      {existingAttachments.length > 0 && (
        <div className="attachmentSection">
          <strong>첨부 파일:</strong>
          <ul>
            {existingAttachments.map((filePath, index) => {
              const fileNameWithUuid = filePath.split("/").pop();
              const fileName = fileNameWithUuid
                ? fileNameWithUuid.replace(/^[0-9a-fA-F-]{36}_/, "")
                : "Unknown File";
              return (
                <li key={index}>
                  <a
                    href={`${BASE_FILE_URL}${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachmentLink"
                  >
                    {fileName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
