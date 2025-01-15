import React, { useState, useEffect } from "react";
import { Pet } from "../../../../../types";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder } from "react-icons/fa";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../../../../styles/pethealthRecord/pethealthRecordCreate.css";

interface HealthCreateProps {
  selectedPet: Pet | null;
  selectedDate: string;
  goBack: () => void;
  addHealthRecord: (record: {
    weight: number;
    petAge: number;
    abnormalSymptoms: string;
    memo: string;
  }) => void;
}

const HealthCreate = ({
  selectedPet,
  selectedDate,
  goBack,
  addHealthRecord,
}: HealthCreateProps) => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<File[]>([]);
  const today = new Date();
  const selectedDateObj = new Date(selectedDate);
  const [healthRecord, setHealthRecord] = useState({
    weight: "",
    petAge: "",
    abnormalSymptoms: "",
    memo: "",
    createdAt: selectedDate,
  });

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }
  }, [cookies, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setHealthRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(
        (file) => file.size <= 5 * 1024 * 1024
      ); // 5MB 제한

      if (validFiles.length !== newFiles.length) {
        alert("일부 파일이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
      }

      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateInputs = (): boolean => {
    if (!healthRecord.weight || Number(healthRecord.weight) <= 0) {
      alert("체중은 0보다 큰 값이어야 합니다.");
      return false;
    }
    if (!healthRecord.petAge || Number(healthRecord.petAge) <= 0) {
      alert("나이는 0보다 큰 값이어야 합니다.");
      return false;
    }
    if (!healthRecord.abnormalSymptoms.trim()) {
      alert("이상 증상을 입력해 주세요.");
      return false;
    }
    if (selectedDateObj > today) {
      alert("미래 날짜는 선택할 수 없습니다.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("petId", String(selectedPet?.petId));
    formData.append("weight", healthRecord.weight);
    formData.append("petAge", healthRecord.petAge);
    formData.append("abnormalSymptoms", healthRecord.abnormalSymptoms);
    formData.append("memo", healthRecord.memo);
    formData.append("createdAt", healthRecord.createdAt);

    // 첨부 파일 추가
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      const token = cookies.token || localStorage.getItem("token");
      const petId = selectedPet?.petId;

      const response = await axios.post(
        `http://localhost:4040/api/v1/users/pet/petHealth/${petId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("건강 기록이 성공적으로 저장되었습니다.");
      addHealthRecord(response.data.data);
      goBack();
    } catch (error) {
      console.error("건강 기록 저장 실패:", error);
      alert("건강 기록 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="healthCreateContainer">
      <h3>건강 기록 작성</h3>
      <img
        src={selectedPet?.petImageUrl}
        alt={`${selectedPet?.petName}의 사진`}
        className="healthCreatePetImage"
      />
      <form onSubmit={handleSubmit} className="healthCreateForm">
        <div className="healthCreateDateSection">
          <label htmlFor="createdAt">작성 날짜</label>
          <span id="createdAt">
            {selectedDate && (
              <>
                {selectedDate.split("-")[0]}년 &nbsp;
                {selectedDate.split("-")[1]}월 &nbsp;
                {selectedDate.split("-")[2]}일
              </>
            )}
          </span>
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="weight">체중 (kg)</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={healthRecord.weight}
            onChange={handleInputChange}
            min="0"
            className="healthCreateInput"
          />
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="petAge">나이 (년)</label>
          <input
            type="number"
            id="petAge"
            name="petAge"
            value={healthRecord.petAge}
            onChange={handleInputChange}
            min="0"
            className="healthCreateInput"
          />
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="abnormalSymptoms">이상 증상</label>
          <textarea
            id="abnormalSymptoms"
            name="abnormalSymptoms"
            value={healthRecord.abnormalSymptoms}
            onChange={handleInputChange}
            className="healthCreateTextarea"
          />
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="memo">메모</label>
          <textarea
            id="memo"
            name="memo"
            value={healthRecord.memo}
            onChange={handleInputChange}
            className="healthCreateTextarea"
          />
        </div>

        <div className="healthCreateFileSection">
          <label htmlFor="attachments">첨부 파일</label>
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileChange}
            className="healthCreateFileInput"
          />
          <ul className="healthCreateFileList">
            {attachments.map((file, index) => (
              <li key={index} className="healthCreateFileItem">
                <span>
                  <FaFolder />
                </span>
                <span className="healthCreateFileName">{file.name}</span>
                <IconButton
                  onClick={() => removeFile(index)}
                  className="healthCreateDeleteButton"
                >
                  <DeleteIcon color="primary" />
                </IconButton>
              </li>
            ))}
          </ul>
        </div>

        <div className="healthCreateButtonSection">
          <button type="submit" className="healthCreateSubmitButton">
            확인
          </button>
          <button
            type="button"
            onClick={goBack}
            className="healthCreateCancelButton"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthCreate;
