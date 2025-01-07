import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pet } from "../../../../../stores/petstore";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { FaFolder } from "react-icons/fa";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface HealthRecordUpdateProps {
  selectedPet: Pet | null;
  healthRecordId: number;
  goBack: () => void;
}

export default function HealthRecordUpdate({
  selectedPet,
  healthRecordId,
  goBack,
}: HealthRecordUpdateProps) {
  const [healthRecord, setHealthRecord] = useState<any>(null);
  const [weight, setWeight] = useState<number>(0);
  const [petAge, setPetAge] = useState<number>(0);
  const [abnormalSymptoms, setAbnormalSymptoms] = useState<string>("");
  const [memo, setMemo] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [cookies] = useCookies(["token"]);

  const navigate = useNavigate();

  const petId = selectedPet?.petId;

  useEffect(() => {
    const fetchHealthRecord = async () => {
      try {
        const token = cookies.token || localStorage.getItem("token");
        if (!token) {
          alert("로그인 정보가 없습니다.");
          navigate("/");
          return;
        }

        const response = await axios.get(
          `http://localhost:4040/api/v1/health-record/petId/${petId}/healthRecordId/${healthRecordId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data;
          setHealthRecord(data);
          setWeight(data.weight);
          setPetAge(data.petAge);
          setAbnormalSymptoms(data.abnormalSymptoms);
          setMemo(data.memo);
        }
      } catch (error) {
        console.error("건강 기록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchHealthRecord();
  }, [healthRecordId, cookies, navigate, petId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("weight", String(weight));
    formData.append("petAge", String(petAge));
    formData.append("abnormalSymptoms", abnormalSymptoms);
    formData.append("memo", memo);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }

    try {
      const token = cookies.token || localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:4040/api/v1/health-record/petId/${petId}/healthRecordId/${healthRecordId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("건강 기록이 수정되었습니다.");
        goBack();
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("건강 기록을 수정하는 중 오류가 발생했습니다.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;

    if (newFiles) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...Array.from(newFiles).filter(
          (newFile) =>
            !prevFiles.some(
              (existingFile) => existingFile.name === newFile.name
            )
        ),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  if (!healthRecord) {
    return <p>건강 기록을 불러오는 중...</p>;
  }

  return (
    <div>
      <h3>건강 기록 수정</h3>

      {healthRecord ? (
        <form onSubmit={handleSubmit}>
          <div className="petCircleBox">
            <img
              src={selectedPet?.petImageUrl}
              alt={`${selectedPet?.petName}의 사진`}
            />
          </div>

          <div>
            <label htmlFor="weight">체중 (kg)</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="pet-age">나이 (개월)</label>
            <input
              type="number"
              id="pet-age"
              value={petAge}
              onChange={(e) => setPetAge(Number(e.target.value))}
              min="0"
            />
          </div>

          <div>
            <label htmlFor="abnormal-symptoms">이상 증상</label>
            <textarea
              id="abnormal-symptoms"
              value={abnormalSymptoms}
              onChange={(e) => setAbnormalSymptoms(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="memo">메모</label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="files">첨부 파일</label>
            <input type="file" id="files" multiple onChange={handleFileChange} />

            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <span>
                    <FaFolder />
                  </span>
                  <span className="file-name">{file.name}</span>

                  <IconButton
                    onClick={() => removeFile(index)}
                    className="delete-btn"
                  >
                    <DeleteIcon color="primary" />
                  </IconButton>
                </li>
              ))}
            </ul>
          </div>

          <button type="submit">저장</button>
          <button type="button" onClick={goBack}>
            취소
          </button>
        </form>
      ) : (
        <p>건강 기록을 불러오는 중...</p>
      )}
    </div>
  );
}
