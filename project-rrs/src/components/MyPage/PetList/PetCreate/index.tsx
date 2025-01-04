import React, { useEffect, useState } from "react";
import '../../../../styles/Pet.css'
import '../../../../styles/MyPage.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const currentYear = new Date().getFullYear();

export default function PetCreate() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [months, setMonths] = useState<number[]>([]);
  const [petInfo, setPetInfo] = useState({
  petName: '',
  petImageUrl: '',
  petGender: '',
  petBirthYear: '',
  petBirthMonth: '',
  petWeight: '',
  petAddInfo: '',
  petNeutralityYn: ''
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // 첫 번째 파일 선택
    if (file) {
      setSelectedFile(file);
      setPetInfo((prevData) => ({
        ...prevData,
        profileImageUrl: file.name, // 파일 이름으로 업데이트 (필요시 서버로 파일 전송 후 URL 업데이트)
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetInfo((prevData) => ({
      ...prevData,
      [name]: name === 'petWeight' ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const nameRegex = /^[가-힣]+$/;

    if (!petInfo.petName) {
      alert('이름을 입력해 주세요.')
      return;
    } else if (!nameRegex.test(petInfo.petName)) {
      alert('이름은 한글만 사용할 수 있습니다.')
      return;
    }

    if (!petInfo.petGender) {
      alert('성별을 선택해 주세요.')
      return;
    }

    if (!petInfo.petBirthYear || !petInfo.petBirthMonth) {
      alert('생년월일을 선택해 주세요.')
      return;
    }

    if (!petInfo.petWeight) {
      alert('몸무게를 입력해 주세요.')
      return;
    } else if (isNaN(Number(petInfo.petWeight)) || Number(petInfo.petWeight) <= 0) {
      alert('몸무게는 양수여야 합니다.')
      return;
    }

    if (!petInfo.petNeutralityYn) {
      alert('중성화 여부를 선택해 주세요.')
      return;
    }

    const petBirthDate = `${petInfo.petBirthYear}-${petInfo.petBirthMonth}`;

    const dataToSend = {
      ...petInfo,
      petBirthDate: petBirthDate,
      petBirthYear: undefined,
      petBirthMonth: undefined
    };

    console.log("dataToSend", dataToSend);
  

    const formData = new FormData();
    formData.append("petName", petInfo.petName);
    formData.append("petGender", petInfo.petGender);
    formData.append("petBirthDate", petBirthDate);
    formData.append("petWeight", petInfo.petWeight.toString());
    formData.append("petAddInfo", petInfo.petAddInfo);
    formData.append("petNeutralityYn", petInfo.petNeutralityYn);
  

    if (selectedFile) {
      formData.append("petImageUrl", selectedFile); 
    }

    try {
      const token = cookies.token || localStorage.getItem("token");
      if (!token) {
        alert('로그인 정보가 없습니다.');
        navigate('/');
        return;
      }

      const response = await axios.post("http://localhost:4040/api/v1/users/pet", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('2');
      console.log("Response:", response.data.data);
      alert('반려 동물이 등록되었습니다.');
      navigate('/petList')
    } catch (error: any) {
      console.log("Error:", error);
      if (error.response) {
        console.error("Response Error:", error.response.data.data);
        alert(`서버오류: ${error.response.data.data}`);
      } else {
      alert('네트워크 오류 ')
    }
  }
}

  useEffect(() => {
    // 연도 리스트 생성
    const yearsList = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearsList.push(year);
    }
    setYears(yearsList);

    // 월 리스트 생성
    const monthsList = [];
    for (let month = 1; month <= 12; month++) {
      monthsList.push(month);
    }
    setMonths(monthsList);
  }, []);

  
  const goBack = () => {
    window.history.back();
  }

  return (
    <div>
      <h2>반려 동물 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="element">
          <label>강아지 프로필 사진</label>
          <input type="file" name="petImageUrl" onChange={handleFileChange} />
        </div>

        <div className="element">
          <label>강아지 이름</label>
          <input type="text" name="petName" value={petInfo.petName} onChange={handleInputChange} />
        </div>

        <div className="element">
          <label>성별</label>
          <input type="radio" name="petGender" value="0" onChange={handleInputChange} /> 수컷
          <input type="radio" name="petGender" value="1" onChange={handleInputChange} /> 암컷
        </div>

        <div className="element">
          <label>생년월일</label>
          <select name="petBirthYear" value={petInfo.petBirthYear} onChange={handleInputChange} >
            <option>년도</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select name="petBirthMonth" value={petInfo.petBirthMonth} onChange={handleInputChange}>
            <option>월</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
          </select>
        </div>

        <div className="element">
          <label>몸무게</label>
          <input type="number" name="petWeight" value={petInfo.petWeight} onChange={handleInputChange} min="0" /> Kg
        </div>

        <div className="element">
          <label>중성화 여부</label>
            <input type="radio" name="petNeutralityYn" value="0" onChange={handleInputChange} /> 아니오
            <input type="radio" name="petNeutralityYn" value="1" onChange={handleInputChange} /> 예
        </div>

        <div className="element">
          <label>추가 정보</label>
          <input type="text" name="petAddInfo" value={petInfo.petAddInfo} onChange={handleInputChange}/>
        </div>

        <button type="button" onClick={goBack}>취소</button>
        <button type="submit">확인</button>
      </form>

    </div>
  );
}
