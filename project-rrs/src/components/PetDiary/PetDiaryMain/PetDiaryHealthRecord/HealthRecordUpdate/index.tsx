import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { getHealthRecordById, updateHealthRecord } from "../../../../../apis/petHealthApi";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Pet } from "../../../../../types";
import { HealthRecordResponse } from "../../../../../types/petHealthType";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_COUNT = 5; // 최대 첨부 파일 개수
const ErrorMessages = {
  FETCH_FAILED: "건강 기록 정보를 가져오는 데 실패했습니다.",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.",
  TOO_MANY_FILES: `첨부 파일은 최대 ${MAX_FILE_COUNT}개까지만 업로드할 수 있습니다.`,
  UPDATE_FAILED: "건강 기록 수정 중 오류가 발생했습니다.",
};

interface HealthRecordUpdateProps {
  selectedPet: Pet | null;
  healthRecordId: number;
  goBack: () => void;
  refreshRecords: () => void; // 리스트를 재랜더링하기 위한 함수
}

const HealthRecordUpdate = ({
  selectedPet,
  healthRecordId,
  goBack,
  refreshRecords,
}: HealthRecordUpdateProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
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
        console.log(record)
        setHealthRecord(record);
      } catch (err) {
        console.error("Health record fetch error:", err);
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
        alert(`중복된 파일입니다: ${file.name}`);
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

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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
        ...healthRecord,
        files: attachments,
      };

      await updateHealthRecord(selectedPet.petId, healthRecordId, data);

      alert("건강 기록이 성공적으로 수정되었습니다!");

      // 리스트 갱신을 요청
      refreshRecords();

      // 뒤로가기
      goBack();
    } catch (error) {
      console.error("Error updating health record:", error);
      setError(ErrorMessages.UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!healthRecord && !error) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="health-record-update-container">
      <h1 className="health-record-update-title">건강 기록 수정</h1>
      <form onSubmit={handleSubmit} className="health-record-update-form">
        <div className="form-group">
          <label htmlFor="weight">몸무게 (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={healthRecord?.weight || ""}
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
            value={healthRecord?.petAge || ""}
            onChange={handleInputChange}
            placeholder="나이를 입력하세요"
          />
        </div>
        <div className="form-group">
          <label htmlFor="abnormalSymptoms">이상 증상</label>
          <textarea
            id="abnormalSymptoms"
            name="abnormalSymptoms"
            value={healthRecord?.abnormalSymptoms || ""}
            onChange={handleInputChange}
            placeholder="이상 증상을 입력하세요"
            rows={5}
          />
        </div>
        <div className="form-group">
          <label htmlFor="memo">메모</label>
          <textarea
            id="memo"
            name="memo"
            value={healthRecord?.memo || ""}
            onChange={handleInputChange}
            placeholder="메모를 입력하세요"
            rows={5}
          />
        </div>
        <div className="form-group">
          <label htmlFor="attachments">첨부 파일</label>
          <input
            type="file"
            id="attachments"
            onChange={handleFileChange}
            multiple
          />
          {attachments.length > 0 && (
            <ul className="file-list">
              {attachments.map((file, index) => (
                <li key={index} className="file-item">
                  <span>{file.name}</span>
                  <IconButton onClick={() => removeFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "수정"}
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
