import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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
  updateWalkingRecord: (record: {
    walkingRecordDistance: number;
    walkingRecordHours: number;
    walkingRecordMinutes: number;
  }) => void;
}

const WalkingRecordUpdate = ({
  selectedPet,
  selectedDate,
  walkingRecordId,
  updateWalkingRecord,
  goBack,
}: WalkingRecordUpdateProps) => {
  const [cookies] = useCookies(["token"]);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const navigate = useNavigate();
  const [existingFiles, setExistingFiles] = useState<
    Array<{ name: string; url: string }>
  >([]);
  const [newFiles, setNewFiles] = useState<Array<{ name: string; file: File }>>(
    []
  );
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);
  const [walkingRecord, setWalkingRecord] = useState({
    walkingRecordWeatherState: "",
    walkingRecordDistance: "",
    walkingRecordWalkingTime: "",
    walkingRecordCreateAt: selectedDate,
    walkingRecordMemo: "",
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
      setNewFiles((prevFiles) => [
        ...prevFiles,
        ...fileList.map((file) => ({ name: file.name, file })),
      ]);
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
            const data = response.data.data;
            const totalMinutes = data.walkingRecordWalkingTime;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            setHours(hours);
            setMinutes(minutes);

            const fetchedFiles = data.fileName || [];
            const filesWithNamesAndUrls = fetchedFiles.map((filePath: any) => {
              const fileName = filePath.split("/").pop();
              const fileUrl = `http://localhost:4040/${filePath}`;

              return {
                name: fileName,
                url: fileUrl,
              };
            });

            setExistingFiles(filesWithNamesAndUrls);

            setWalkingRecord((prevRecord) => ({
              ...prevRecord,
              walkingRecordWeatherState: data.walkingRecordWeatherState,
              walkingRecordDistance: data.walkingRecordDistance,
              walkingRecordWalkingTime: data.walkingRecordWalkingTime,
              walkingRecordCreateAt: data.walkingRecordCreateAt,
              walkingRecordMemo: data.walkingRecordMemo,
            }));
          }
        } catch (error) {
          console.error("산책 기록을 불러오는 중 오류 발생:", error);
        }
      };

      fetchWalkingRecord();
    }
  }, [walkingRecordId, cookies, navigate, selectedPet]);

  const removeFile = (index: number, isNewFile: boolean) => {
    const fileName = isNewFile ? newFiles[index].name : existingFiles[index].name;
  
  if (isNewFile) {
    setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  } else {
    setExistingFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setRemovedFiles((prevRemovedFiles) => [...prevRemovedFiles, fileName]);
  }
};

const allFiles = [
  ...existingFiles.filter((file) => !removedFiles.includes(file.name)),
  ...newFiles,
];

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

    const currentDate = new Date();
    const selectedDate = new Date(walkingRecord.walkingRecordCreateAt);

    if (selectedDate > currentDate) {
      alert("미래 날짜는 입력할 수 없습니다.");
      return;
    }

    const totalWalkingTime = hours * 60 + minutes;

    if (newFiles.length > 0) {
      for (const file of newFiles) {
        const isValidType = /\.(jpg|jpeg|png)$/i.test(file.name);
        if (!isValidType) {
          alert("파일 형식은 JPG, JPEG, PNG만 가능합니다.");
          return;
        }
      }
    }

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
      String(totalWalkingTime)
    );
    formData.append(
      "walkingRecordCreateAt",
      walkingRecord.walkingRecordCreateAt
    );
    formData.append("walkingRecordMemo", walkingRecord.walkingRecordMemo);

    formData.append("removedFiles", JSON.stringify(removedFiles));
  
  newFiles.forEach(fileObj => {
    formData.append('files', fileObj.file, fileObj.name);
  });

  // URL로 존재하는 파일을 File 객체로 변환 후 FormData에 추가
  const addExistingFilesToFormData = async () => {
    const fetchPromises = existingFiles
      .filter((fileObj) => !removedFiles.includes(fileObj.name)) // 삭제된 파일 제외
      .map((fileObj) => {
        if (!("file" in fileObj)) {
          // 파일이 URL로만 존재하는 경우
          return fetch(fileObj.url)
            .then((response) => response.blob())
            .then((blob) => {
              const file = new File([blob], fileObj.name); 
              formData.append("files", file, fileObj.name);
            })
            .catch((error) => {
              console.error("파일 다운로드 실패:", error);
            });
        } else {
          formData.append("files", (fileObj as any).file, fileObj.name);
          return Promise.resolve();
        }
      });

    await Promise.all(fetchPromises);
  };

    try {
      const token = cookies.token || localStorage.getItem("token");
      const petId = selectedPet?.petId;
      
      await addExistingFilesToFormData();

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
        alert("산책 기록이 수정되었습니다.");
        updateWalkingRecord(response.data.data);
        goBack();
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 중 오류 발생:", error);
      alert("산책 기록 수정 중 오류가 발생했습니다.");
    }
  };

  if (!walkingRecord) {
    return <p>산책 기록을 불러오는 중...</p>;
  }

  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <span style={{ fontSize: "24px" }}>{props.data.label}</span>
      </components.Option>
    );
  };

  return (
    <div>
      <h2>산책 기록 수정</h2>
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
            {existingFiles.length > 0 ? (
              <ul className="file-list">
                {existingFiles.map((file, index) => {
                  return (
                    <li key={index}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {file.name}
                      </a>
                      <IconButton onClick={() => removeFile(index, false)}>
                        <DeleteIcon />
                      </IconButton>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p></p>
            )}
            <ul>
              {newFiles.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <IconButton onClick={() => removeFile(index, true)}>
                    <DeleteIcon />
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
};

export default WalkingRecordUpdate;