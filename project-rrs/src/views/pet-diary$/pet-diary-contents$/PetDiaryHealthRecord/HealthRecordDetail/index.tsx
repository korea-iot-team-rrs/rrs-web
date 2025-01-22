import React, { useEffect, useState } from "react";
import { getHealthRecordById } from "../../../../../apis/petHealthApi";
import { fetchAttachmentsByHealthRecordId } from "../../../../../apis/healthRecordAttachment";
import "../../../../../styles/pethealthRecord/pethealthRecordDetail.css";
import { HealthRecordResponse } from "../../../../../types/petHealthType";
import { useRefreshStore } from "../../../../../stores/refreshStore"; // zustand 상태 관리 추가

const BASE_FILE_URL = "http://localhost:4040/";

interface HealthDetailProps {
  selectedPet: { petId: number; petName: string; petImageUrl?: string } | null;
  healthRecordId: number;
  goBack: () => void;
  selectedDate: string;
}

export default function HealthDetail({
  selectedPet,
  healthRecordId,
  goBack,
  selectedDate,
}: HealthDetailProps) {
  const [healthRecord, setHealthRecord] = useState<HealthRecordResponse | null>(null);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { incrementRefreshKey } = useRefreshStore(); // 상태 갱신 함수 가져오기

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

        incrementRefreshKey(); // 상태 갱신 트리거 추가
      } catch (err) {
        console.error("건강 기록을 가져오는 중 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHealthRecord();
  }, [selectedPet, healthRecordId, incrementRefreshKey]); // 상태 갱신 함수도 의존성 배열에 포함

  if (!selectedPet) {
    return (
      <div className="healthDetailContainer">
        <p>반려 동물이 선택되지 않았습니다.</p>
        <button onClick={goBack} className="healthDetailBackButton">
          뒤로 가기
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="healthDetailContainer">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="healthDetailContainer">
      <div className="healthDetailHeader">
        <h2>건강 기록 상세 정보</h2>
        <button onClick={goBack} className="healthDetailBackButton">
          뒤로 가기
        </button>
      </div>
      <div className="healthDetailTopSection">
        {selectedPet.petImageUrl && (
          <div className="healthDetailPetImageContainer">
            <img
              src={selectedPet.petImageUrl}
              alt={`${selectedPet.petName}의 사진`}
              className="healthDetailPetImage"
            />
          </div>
        )}
        <div className="healthDetailBasicInfo">
          <p>
            <strong>반려동물:</strong> {selectedPet.petName}
          </p>
          <p>
            <strong>날짜:</strong>{" "}
            {new Date(
              healthRecord?.createdAt || selectedDate
            ).toLocaleDateString()}
          </p>
          <p>
            <strong>체중:</strong> {healthRecord?.weight || "-"} kg
          </p>
          <p>
            <strong>반려동물 나이:</strong> {healthRecord?.petAge || "-"} 세
          </p>
        </div>
      </div>
      <div className="healthDetailBottomSection">
        <div className="healthDetailBelowDetails">
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
        <div className="healthDetailAttachmentSection">
          <strong>첨부 파일:</strong>
          <div className="attachmentListBox">
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
                      className="healthDetailAttachmentLink"
                    >
                      {fileName}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
