import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { getHealthRecordById, updateHealthRecord } from "../../../../../apis/petHealthApi";
import {
  fetchAttachmentsByHealthRecordId,
  healthRecordAttachmentApi,
} from "../../../../../apis/healthRecordAttachment";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pet } from "../../../../../types";
import { HealthRecordResponse } from "../../../../../types/petHealthType";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 5;

const ErrorMessages = {
  FETCH_FAILED: "건강 기록 정보를 가져오는 데 실패했습니다.",
  FILE_TOO_LARGE: "파일 크기가 5MB 제한을 초과합니다.",
  TOO_MANY_FILES: `최대 ${MAX_FILE_COUNT}개의 파일만 업로드할 수 있습니다.`,
  UPDATE_FAILED: "건강 기록을 업데이트하는 중 오류가 발생했습니다.",
};

// UUID 제거 유틸리티 함수
const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, ""); // UUID 형식을 제거
};

interface HealthRecordUpdateProps {
  selectedPet: Pet | null;
  healthRecordId: number;
  goBack: () => void;
  refreshRecords: () => void;
}

const HealthRecordUpdate = ({
  selectedPet,
  healthRecordId,
  goBack,
  refreshRecords,
}: HealthRecordUpdateProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<string[]>([]);
  const [healthRecord, setHealthRecord] = useState<HealthRecordResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPet || !healthRecordId) {
      setError(ErrorMessages.FETCH_FAILED);
      return;
    }

    const fetchHealthRecord = async () => {
      try {
        const record = await getHealthRecordById(selectedPet.petId, healthRecordId);
        setHealthRecord(record);

        const serverAttachments = await fetchAttachmentsByHealthRecordId(healthRecordId);
        const filePaths = serverAttachments.map((attachment) => attachment.filePath);
        setExistingAttachments(filePaths);
      } catch (err) {
        console.error("건강 기록을 가져오는 중 오류:", err);
        setError(ErrorMessages.FETCH_FAILED);
      }
    };

    fetchHealthRecord();
  }, [selectedPet, healthRecordId]);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert(ErrorMessages.FILE_TOO_LARGE);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      const isValid = validateFile(file);
      const isDuplicate = attachments.some((existingFile) => existingFile.name === file.name);
      if (isDuplicate) {
        alert(`중복된 파일: ${file.name}`);
        return false;
      }
      return isValid;
    });

    if (attachments.length + validFiles.length > MAX_FILE_COUNT) {
      alert(ErrorMessages.TOO_MANY_FILES);
      return;
    }

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveExistingAttachment = async (index: number) => {
    const fileToRemove = existingAttachments[index];

    try {
      const serverAttachments = await fetchAttachmentsByHealthRecordId(healthRecordId);
      const matchingAttachment = serverAttachments.find(
        (attachment) => attachment.filePath === fileToRemove
      );

      if (!matchingAttachment) {
        alert("서버에서 해당 파일을 찾을 수 없습니다.");
        return;
      }

      await healthRecordAttachmentApi.deleteAttachmentById(matchingAttachment.attachmentId);
      setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("첨부파일 삭제에 실패했습니다:", error);
      alert("첨부파일 삭제에 실패했습니다.");
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHealthRecord((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedPet || !healthRecord) {
      setError(ErrorMessages.UPDATE_FAILED);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        weight: healthRecord.weight,
        petAge: healthRecord.petAge,
        abnormalSymptoms: healthRecord.abnormalSymptoms,
        memo: healthRecord.memo || "",
        attachments,
        existingAttachments,
      };

      await updateHealthRecord(selectedPet.petId, healthRecordId, data);

      alert("건강 기록이 성공적으로 업데이트되었습니다!");
      refreshRecords();
      goBack();
    } catch (err) {
      console.error("건강 기록 업데이트 중 오류:", err);
      setError(ErrorMessages.UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!healthRecord) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="health-record-update-container">
      <h1>건강 기록 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="weight">몸무게 (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={healthRecord.weight || ""}
            onChange={handleInputChange}
            placeholder="몸무게를 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="petAge">나이 (년)</label>
          <input
            type="number"
            id="petAge"
            name="petAge"
            value={healthRecord.petAge || ""}
            onChange={handleInputChange}
            placeholder="나이를 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="abnormalSymptoms">이상 증상</label>
          <textarea
            id="abnormalSymptoms"
            name="abnormalSymptoms"
            value={healthRecord.abnormalSymptoms || ""}
            onChange={handleInputChange}
            placeholder="이상 증상을 설명하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="attachments">기존 첨부 파일</label>
          <ul className="file-list">
            {existingAttachments.map((filePath, index) => (
              <li key={index}>
                <span>{removeUUIDFromFileName(filePath.split("/").pop() || "")}</span>
                <IconButton onClick={() => handleRemoveExistingAttachment(index)}>
                  <DeleteIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label htmlFor="attachments">새 첨부 파일</label>
          <input
            type="file"
            id="attachments"
            onChange={handleFileChange}
            multiple
          />
          {attachments.length > 0 && (
            <ul className="file-list">
              {attachments.map((file, index) => (
                <li key={index}>
                  <span>{file.name}</span>
                  <IconButton onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}>
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "수정하기"}
          </button>
          <button type="button" onClick={goBack} className="cancel-button">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthRecordUpdate;
