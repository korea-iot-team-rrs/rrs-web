import React, { useEffect, useState } from "react";
import '../../../../styles/Pet.css'
import '../../../../styles/MyPage.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const currentYear = new Date().getFullYear();

export default function PetCreate() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
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

    const petBirthDate = `${petInfo.petBirthYear}-${petInfo.petBirthMonth.padStart(2, "0")}-01`;

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
      console.log(token);
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
      console.log("Response:", response.data.data);
      alert('반려 동물이 등록되었습니다.');
      navigate('/petList')
    } catch (error: unknown) {
      console.error("Error details:", error);  // error 객체를 로그로 출력하여 내용 확인
    
      if (axios.isAxiosError(error)) {
        // AxiosError일 경우 처리
        if (error.response) {
          // 서버 응답이 있을 경우
          console.error("Response error status:", error.response.status);
          console.error("Response error:", error.response.data.data);
          alert(`서버 오류: ${error.response.status}, ${error.response.data || '상세 오류 정보 없음'}`);
        } else if (error.request) {
          // 요청은 보내졌으나 응답이 없을 경우
          console.error("Request error:", error.request);
          alert("서버로부터 응답을 받지 못했습니다.");
        } else {
          // 그 외 오류
          console.error("Error during request:", error.message);
          alert(`오류 발생: ${error.message}`);
        }
      } else {
        // AxiosError가 아닐 경우
        console.error("An unknown error occurred:", error);
        alert("알 수 없는 오류가 발생했습니다.");
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
          <input type="radio" name="petGender" value="M" onChange={handleInputChange} /> 수컷
          <input type="radio" name="petGender" value="F" onChange={handleInputChange} /> 암컷
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
            <input type="radio" name="petNeutralityYn" value="Y" onChange={handleInputChange} /> 예
            <input type="radio" name="petNeutralityYn" value="N" onChange={handleInputChange} /> 아니오
        </div>

        <div className="element">
          <label>추가 정보</label>
          <input type="text" name="petAddInfo" value={petInfo.petAddInfo} onChange={handleInputChange}/>
        </div>

        <button type="submit">확인</button>
        <button type="button" onClick={goBack}>취소</button>
      </form>

    </div>
  );
}
