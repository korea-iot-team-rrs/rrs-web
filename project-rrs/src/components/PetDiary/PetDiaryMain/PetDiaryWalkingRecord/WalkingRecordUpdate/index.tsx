import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pet, WalkingRecord } from "../../../../../stores/petstore";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { IoMdSunny } from "react-icons/io";
import { IoCloudy, IoRainy } from "react-icons/io5";
import { TbSnowman } from "react-icons/tb";
import { FaFolder } from "react-icons/fa";
import { IconButton } from "@mui/material";
import Select, { components } from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";

interface WalkingRecordUpdateProps {
  selectedPet: Pet | null;
  walkingRecordId: number;
  goBack: () => void;
}

export default function WalkingRecordUpdate({
  selectedPet,
  walkingRecordId,
  goBack,
}: WalkingRecordUpdateProps) {
  const [walkingRecord, setWalkingRecord] = useState<any>(null);
  const [walkingRecordDistance, setWalkingRecordDistance] = useState<number>(0);
  const [walkingRecordWalkingTime, setWalkingRecordWalkingTime] =
    useState<number>(0);
  const [walkingRecordMemo, setWalkingRecordMemo] = useState<string>("");
  const [walkingRecordWeatherState, setWalkingRecordWeatherState] =
    useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [cookies] = useCookies(["token"]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const navigate = useNavigate();
  const petId = selectedPet?.petId;

  const weatherOptions = [
    { value: "SUNNY", label: <IoMdSunny style={{ fontSize: "24px" }} /> },
    { value: "CLOUDY", label: <IoCloudy style={{ fontSize: "24px" }} /> },
    { value: "RAINY", label: <IoRainy style={{ fontSize: "24px" }} /> },
    { value: "SNOWY", label: <TbSnowman style={{ fontSize: "24px" }} /> },
  ];

  const handleWeatherChange = (selectedOption: any) => {
    setWalkingRecord({
      ...walkingRecord,
      walkingRecordWeatherState: selectedOption.value,
    });
  };

  useEffect(() => {
    const fetchWalkingRecord = async () => {
      try {
        const token = cookies.token || localStorage.getItem("token");
        if (!token) {
          alert("로그인 정보가 없습니다.");
          navigate("/");
          return;
        }

        const response = await axios.get(
          `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data.data;
          setWalkingRecord(data);
          setWalkingRecordDistance(data.walkingRecordDistance);
          setWalkingRecordWalkingTime(data.walkingRecordWalkingTime);
          setWalkingRecordMemo(data.walkingRecordMemo);
          setWalkingRecordWeatherState(data.walkingRecordWeatherState);
        }
      } catch (error) {
        console.error("산책 기록을 불러오는 중 오류 발생:", error);
      }
    };

    fetchWalkingRecord();
  }, [walkingRecordId, cookies, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const walkingRecordWalkingTime = hours * 60 + minutes;

    const formData = new FormData();
    formData.append("petId", String(selectedPet?.petId));
    formData.append(
      "walkingRecordWeatherState",
      walkingRecord.walkingRecordWeatherState
    );
    formData.append(
      "walkingRecordDistance",
      String(walkingRecord.walkingRecordDistance)
    );
    formData.append(
      "walkingRecordWalkingTime",
      String(walkingRecordWalkingTime)
    );
    formData.append(
      "walkingRecordCreateAt",
      walkingRecord.walkingRecordCreateAt
    );
    formData.append("walkingRecordMemo", walkingRecord.walkingRecordMemo);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
    }
    
    try {
      const token = cookies.token || localStorage.getItem("token");
      const petId = selectedPet?.petId;
      console.log('token: ', token);

      const response = await axios.put(
        `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`, formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("산책기록이 수정되었습니다.");
        goBack();
      } else {
        alert("수정 실패");
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("반려동물 정보를 수정하는 중 오류가 발생했습니다.");
    }
  };

  if (!walkingRecord) {
    return <p>산책 기록을 불러오는 중...</p>;
  }

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
    setFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  };

  const CustomOption = (props: any) => {
      return (
        <components.Option {...props}>
          <span style={{ fontSize: "24px" }}>{props.data.label}</span>
        </components.Option>
      );
    };

  return (
    <div>
      <h3>산책 기록 수정</h3>

      {walkingRecord ? (
        <form onSubmit={handleSubmit}>
          <div className="petCircleBox">
            <img
              src={selectedPet?.petImageUrl}
              alt={`${selectedPet?.petName}의 사진`}
            />
          </div>

          <div>
            <label htmlFor="create-date">작성 날짜</label>
            <span id="create-date">
              {selectedDate && (
                <>
                  {selectedDate.split("-")[0]}년 &nbsp;
                  {selectedDate.split("-")[1]}월 &nbsp;
                  {selectedDate.split("-")[2]}일
                </>
              )}
            </span>
          </div>

          <div>
            <label htmlFor="weather">날씨</label>
            <Select
            id="weather"
            className="select-weather"
            value={weatherOptions.find(
              (option) =>
                option.value === walkingRecord.walkingRecordWeatherState
            )}
            onChange={handleWeatherChange}
            options={weatherOptions}
            components={{ Option: CustomOption }}
          />
        </div>

          <div>
            <label htmlFor="walking-time">산책 시간</label>
            <input
              type="number"
              id="walking-time"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              min="0"
            />{" "}
            시간
            <input
              type="number"
              id="walking-time"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              min="0"
            />{" "}
            분
          </div>

          <div>
            <label htmlFor="walking-distance">산책 거리</label>
              <input
              type="number"
              id="walking-distance"
              name="walkingRecordDistance"
              value={walkingRecordDistance}
              onChange={(e) => setWalkingRecordDistance(Number(e.target.value))}
              min="0"
            />{" "}
            m
          </div>

          <div>
            <label htmlFor="memo">메모</label>
            <textarea
              id="memo"
              value={walkingRecordMemo}
              onChange={(e) => setWalkingRecordMemo(e.target.value)}
            />
          </div>

          <div>
          <label htmlFor="files">사진</label>
          <input type="file" id="files" multiple onChange={handleFileChange} />

          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                <span><FaFolder /></span>
                <span className="file-name">{file.name}</span>

                <IconButton onClick={() => removeFile(index)} className="delete-btn">
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
        <p>산책 기록을 불러오는 중...</p>
      )}
    </div>
  );
}