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
  selectedDate: string;
  walkingRecordId: number;
  goBack: () => void;
}

const WalkingRecordUpdate = ({
  selectedPet,
  selectedDate,
  walkingRecordId,
  goBack,
}: WalkingRecordUpdateProps) => {
  const [cookies] = useCookies(["token"]);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const navigate = useNavigate();
  const [files, setFiles] = useState<
    Array<{ name: string; url?: string; file?: File }>
  >([]);
  const [walkingRecord, setWalkingRecord] = useState({
    walkingRecordWeatherState: "",
    walkingRecordDistance: "",
    walkingRecordWalkingTime: "",
    walkingRecordCreateAt: selectedDate,
    walkingRecordMemo: "",
    files: [] as File[],
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setWalkingRecord({
      ...walkingRecord,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      // 기존 파일들과 새로운 파일들을 합쳐서 업데이트
      setFiles((prevFiles) => [...prevFiles, ...fileList]);
      setWalkingRecord((prevRecord) => ({
        ...prevRecord,
        files: [...prevRecord.files, ...fileList],  // 기존 파일에 새 파일 추가
      }));
    }
  };

  useEffect(() => {
    if (selectedPet) {
      const petId = selectedPet.petId;
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
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (response.status === 200) {
            console.log("response:", response.data);
            const data = response.data.data;
            const totalMinutes = data.walkingRecordWalkingTime;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            setHours(hours);
            setMinutes(minutes);

            const filesWithUrls = data.files
            ? data.files.map((file: any) => ({
                name: file.fileName,
                url: file.fileUrl,  // 서버에서 제공하는 파일 URL을 추가
              }))
            : [];

            setWalkingRecord((prevRecord) => ({
              ...prevRecord,
              walkingRecordWeatherState: data.walkingRecordWeatherState,
              walkingRecordDistance: data.walkingRecordDistance,
              walkingRecordWalkingTime: data.walkingRecordWalkingTime,
              walkingRecordCreateAt: data.walkingRecordCreateAt,
              walkingRecordMemo: data.walkingRecordMemo,
              files: filesWithUrls,  
            }));
          }
        } catch (error) {
          console.error("산책 기록을 불러오는 중 오류 발생:", error);
        }
      };

      fetchWalkingRecord();
    }
  }, [walkingRecordId, cookies, navigate, selectedPet]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 유효성 검사
    if (!walkingRecord.walkingRecordWeatherState) {
      alert("날씨를 선택해 주세요.");
      return;
    }

    if (hours === 0 && minutes === 0) {
      alert("산책 시간을 입력해 주세요.");
      return;
    } else if (minutes >= 60) {
      alert("60분 미만으로 입력해 주세요.");
      return;
    }

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
      String(walkingRecord.walkingRecordWalkingTime)
    );
    formData.append(
      "walkingRecordCreateAt",
      walkingRecord.walkingRecordCreateAt
    );
    formData.append("walkingRecordMemo", walkingRecord.walkingRecordMemo);

    if (files && files.length > 0) {
      files.forEach((fileObj) => {
        if (fileObj && fileObj.file) {
          formData.append("files", fileObj.file, fileObj.file.name);
        }
      });
    }

    try {
      const token = cookies.token || localStorage.getItem("token");
      const petId = selectedPet?.petId;
      console.log("token: ", token);

      const response = await axios.put(
        `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setWalkingRecord((prevRecord) => ({
      ...prevRecord,
      files: prevRecord.files.filter((_, i) => i !== index),
    }));
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
              value={walkingRecord.walkingRecordDistance}
              onChange={handleInputChange}
              min="0"
            />{" "}
            m
          </div>

          <div>
            <label htmlFor="memo">메모</label>
            <textarea
              id="memo"
              name="walkingRecordMemo"
              value={walkingRecord.walkingRecordMemo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="files">사진</label>

            <input
              type="file"
              id="files"
              multiple
              onChange={handleFileChange}
            />

            {walkingRecord.files.length > 0 ? (
              <ul className="file-list">
                {walkingRecord.files.map((file, index) => (
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
            ) : (
              <p>사진 없음</p>
            )}
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
};

export default WalkingRecordUpdate;
