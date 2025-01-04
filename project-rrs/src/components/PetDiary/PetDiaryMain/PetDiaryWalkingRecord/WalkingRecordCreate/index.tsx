import { useEffect, useState } from 'react';
import { Pet } from '../../../../../types';
import { IoMdSunny } from "react-icons/io";
import { IoCloudy, IoRainy  } from "react-icons/io5";
import { TbSnowman } from "react-icons/tb";
import Select, { components } from 'react-select';
import '../../../../../styles/PetWalkingRecord.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface WalkingRecordCreateProps {
  selectedPet: Pet | null;
  selectedDate: string;
  goBack: () => void;
  addWalkingRecord: (record: { walkingRecordDistance: number; walkingRecordHours: number; walkingRecordMinutes: number }) => void;
}

const WalkingRecordCreate = ({ selectedPet, selectedDate, goBack, addWalkingRecord }: WalkingRecordCreateProps) => {
  const [distance, setDistance] = useState<number>(0);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const today = new Date();
  const selectedDateObj = new Date(selectedDate);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  const [walkingRecord, setWalkingRecord] = useState({
    walkingRecordWeatherState: 'SUNNY',
    walkingRecordDistance: '',
    walkingRecordWalkingTime: 0,
    walkingRecordCreateAt: selectedDate,
    walkingRecordMemo: '',
    files: null
  })

  useEffect(() => {
    if (walkingRecord.walkingRecordWalkingTime) {
      console.log('walkingRecordWalkingTime이 업데이트되었습니다:', walkingRecord.walkingRecordWalkingTime);
    }
  }, [walkingRecord.walkingRecordWalkingTime]); 

  console.log('walkigRecord: ', walkingRecord);

  const weatherOptions = [
    { value: 'SUNNY', label: <IoMdSunny style={{ fontSize: '24px' }} /> },
    { value: 'CLOUDY', label: <IoCloudy style={{ fontSize: '24px' }} /> },
    { value: 'RAINY', label: <IoRainy style={{ fontSize: '24px' }} /> },
    { value: 'SNOWY', label: <TbSnowman style={{ fontSize: '24px' }} /> },
  ];

  useEffect(() => {
      const token = cookies.token || localStorage.getItem("token");
      console.log('token:', token);
      if (!token) {
        alert('로그인 정보가 없습니다.');
        navigate('/');
        return;
      }
    }, [cookies, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalkingRecord({
      ...walkingRecord,
      [name]: value,
    });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!walkingRecord.walkingRecordWeatherState) {
      alert('날씨를 선택해 주세요.');
      return;
    }

    if (hours === 0 && minutes === 0) {
      alert('산책 시간을 입력해 주세요.');
      return;
    } else if (minutes >= 60) {
      alert('60분 미만으로 입력해 주세요.');
      return;
    }

    const walkingRecordWalkingTime = hours * 60 + minutes;

    setWalkingRecord({
    ...walkingRecord,
    walkingRecordWalkingTime: Number(walkingRecordWalkingTime), // 여기서 타입이 Integer로 전달
  });

  
    if (!walkingRecord.walkingRecordDistance) {
      alert('산책 거리를 입력해 주세요.');
      return;
    } else if (Number(walkingRecord.walkingRecordDistance) <= 0) {
      alert('산책 거리는 0보다 큰 값이어야 합니다.')
      return;
    }

    if (!walkingRecord.walkingRecordCreateAt) {
      alert('작성일을 선택해 주세요')
      return;
    }

    if (selectedDateObj > today) {
      alert('미래 날짜는 입력할 수 없습니다.')
      return;
    }
    
    
    
    const formData = new FormData();
      formData.append('petId', String(selectedPet?.petId));
      formData.append('walkingRecordWeatherState', walkingRecord.walkingRecordWeatherState);
      formData.append('walkingRecordDistance', String(walkingRecord.walkingRecordDistance));
      formData.append('walkingRecordWalkingTime', String(walkingRecordWalkingTime));
      formData.append('walkingRecordCreateAt', walkingRecord.walkingRecordCreateAt);
      formData.append('walkingRecordMemo', walkingRecord.walkingRecordMemo);
      

      
      
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }
    
    try {
      const token = cookies.token || localStorage.getItem("token");
      const petId = selectedPet?.petId;

      const response = await axios.post(`http://localhost:4040/api/v1/walking-record/petId/${petId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('산책기록 저장:', response.data.data);
      alert('산책기록이 저장되었습니다.');

      // const walkingRecorId = response.data.data.walkingRecordId;

      addWalkingRecord(response.data.data);
      goBack();
      
    } 
    catch (error) {
      console.error('산책기록 저장 실패:', error);
      alert('산책기록 저장 실패');
    }
  };

  const CustomOption = (props: any) => {
    return (
      <components.Option {...props}>
        <span style={{ fontSize: '24px' }}>
          {props.data.label}
        </span>
      </components.Option>
    );
  };

  return (
    <div>
      <img src={selectedPet?.petImageUrl} alt={`${selectedPet?.petName}의 사진`} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="create-date">작성 날짜</label>
          <span id='create-date'>
              {selectedDate && (
                <>
                  {selectedDate.split("-")[0]}년 &nbsp;
                  {selectedDate.split("-")[1]}월 &nbsp;
                  {selectedDate.split("-")[2]}일
                </>
              )}
            </span>
        </div>

        <div className='weather-container'>
          <label htmlFor="weather">날씨</label>
          <Select
            id="weather"
            className='select-weather'
            value={weatherOptions.find(option => option.value === walkingRecord.walkingRecordWeatherState)}
            onChange={handleWeatherChange}
            options={weatherOptions}
            components={{ Option: CustomOption }}
          />
        </div>

        <div>
          <label htmlFor="walking-time">산책 시간</label>
          <input 
            type="number" 
            id='walking-time'
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min="0"
          /> 시간
          <input 
            type="number" 
            id='walking-time'
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            min="0"
          /> 분
        </div>

        <div>
          <label htmlFor="walking-distance">산책 거리</label>
          <input 
            type="number" 
            id='walking-distance'
            name='walkingRecordDistance'
            value={walkingRecord.walkingRecordDistance}
            onChange={handleInputChange}
            min="0"
          /> m
        </div>

        <div>
          <label htmlFor="memo">메모</label>
          <input 
            type="text" 
            id='memo'
            name='walkingRecordMemo'
            value={walkingRecord.walkingRecordMemo}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="files">사진</label>
          <input
            type="file" 
            id='files'
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />
        </div>

        <button type="button" onClick={handleCancel}>취소</button>
        <button type="submit">확인</button>
      </form>
    </div>
  );
};

export default WalkingRecordCreate;
