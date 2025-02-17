import { useEffect, useState } from "react";
import { Pet } from "../../../../../types/entityType";
import { IoMdSunny } from "react-icons/io";
import { IoCloudy, IoRainy } from "react-icons/io5";
import { TbSnowman } from "react-icons/tb";
import Select, { components } from "react-select";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFolder } from "react-icons/fa";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRefreshStore } from "../../../../../stores/refresh.store";
import "../../../../../styles/pet-diary/health-record/healthRecordCreate.css";
import "../../../../../styles/pet-diary/walking-record/walkingRecordCreate.css";

interface WalkingRecordCreateProps {
  selectedPet: Pet | null;
  selectedDate: string;
  goBack: () => void;
  addWalkingRecord: (record: {
    walkingRecordDistance: number;
    walkingRecordHours: number;
    walkingRecordMinutes: number;
  }) => void;
}

const WalkingRecordCreate = ({
  selectedPet,
  selectedDate,
  goBack,
  addWalkingRecord,
}: WalkingRecordCreateProps) => {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const today = new Date();
  const selectedDateObj = new Date(selectedDate);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const { incrementRefreshKey } = useRefreshStore();
  const [walkingRecord, setWalkingRecord] = useState({
    walkingRecordWeatherState: "SUNNY",
    walkingRecordDistance: "",
    walkingRecordWalkingTime: "",
    walkingRecordCreateAt: selectedDate,
    walkingRecordMemo: "",
    files: [],
  });

  const weatherOptions = [
    { value: "SUNNY", label: <IoMdSunny style={{ fontSize: "24px" }} /> },
    { value: "CLOUDY", label: <IoCloudy style={{ fontSize: "24px" }} /> },
    { value: "RAINY", label: <IoRainy style={{ fontSize: "24px" }} /> },
    { value: "SNOWY", label: <TbSnowman style={{ fontSize: "24px" }} /> },
  ];

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    console.log("token:", token);
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }
  }, [cookies, navigate]);

  useEffect(() => {
    setWalkingRecord((prevRecord) => ({
      ...prevRecord,
      walkingRecordCreateAt: selectedDate,
    }));
  }, [selectedDate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (walkingRecord) {
      setWalkingRecord((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleWeatherChange = (selectedOption: any) => {
    setWalkingRecord({
      ...walkingRecord,
      walkingRecordWeatherState: selectedOption.value,
    });
  };

  const handleCancel = () => {
    goBack();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (!walkingRecord.walkingRecordDistance) {
      alert("산책 거리를 입력해 주세요.");
      return;
    } else if (Number(walkingRecord.walkingRecordDistance) <= 0) {
      alert("산책 거리는 0보다 큰 값이어야 합니다.");
      return;
    }

    if (!walkingRecord.walkingRecordCreateAt) {
      alert("작성일을 선택해 주세요");
      return;
    }

    if (selectedDateObj > today) {
      alert("미래 날짜는 입력할 수 없습니다.");
      return;
    }

    if (files.length > 0) {
      for (const file of files) {
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

      const response = await axios.post(
        `http://localhost:4040/api/v1/walking-records/${petId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("산책기록이 저장되었습니다.");
      addWalkingRecord(response.data.data);
      incrementRefreshKey();
      goBack();
    } catch (error) {
      console.error("산책기록 저장 실패:", error);
      alert("산책기록 저장 실패");
    }
  };

  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <span style={{ fontSize: "24px" }}>{props.data.label}</span>
      </components.Option>
    );
  };

  return (
    <div className="healthCreateContainer">
      <h3 className="walkingRecord-title">산책기록 작성</h3>
      <img
        src={selectedPet?.petImageUrl}
        alt={`${selectedPet?.petName}의 사진`}
        className="healthCreatePetImage"
      />
      <form onSubmit={handleSubmit} className="healthCreateForm">
        <div className="healthCreateDateSection">
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

        <div className="weather-container">
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

        <div className="healthCreateInputSection">
          <label htmlFor="walking-time">산책 시간</label>
          <div className="walking-time-inputs">
            <input
              type="number"
              id="walking-time"
              value={hours}
              className="healthCreateInput"
              onChange={(e) => setHours(Number(e.target.value))}
              min="0"
            />{" "}
            <p>시간</p>
            <input
              type="number"
              id="walking-time"
              value={minutes}
              className="healthCreateInput"
              onChange={(e) => setMinutes(Number(e.target.value))}
              min="0"
            />{" "}
            <p>분</p>
          </div>
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="walking-distance">산책 거리 (m)</label>
          <input
            type="number"
            className="healthCreateInput"
            id="walking-distance"
            name="walkingRecordDistance"
            value={walkingRecord.walkingRecordDistance}
            onChange={handleInputChange}
            min="0"
          />{" "}
        </div>

        <div className="healthCreateInputSection">
          <label htmlFor="memo">메모</label>
          <textarea
            id="memo"
            name="walkingRecordMemo"
            className="healthCreateTextarea"
            value={walkingRecord ? walkingRecord.walkingRecordMemo : ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="healthCreateFileSection">
          <label htmlFor="files">사진</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="healthCreateFileInput"
          />

          <ul className="healthCreateFileList">
            {files.map((file, index) => (
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
            onClick={handleCancel}
            className="healthCreateCancelButton"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default WalkingRecordCreate;