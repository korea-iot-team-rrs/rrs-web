import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../../../../styles/myPage/PetCreate.css";
import petDefaultImage from "../../../../assets/images/pet-default-profile.jpg";

export default function PetCreate() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    petName: "",
    petGender: "",
    petBirthDate: "",
    petWeight: null as number | null,
    petImageUrl: "" as string | File,
    petAddInfo: "",
    petNeutralityYn: "",
  });
  const [imagePreview, setImagePreview] = useState(petDefaultImage);

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    console.log("token:", token);
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }
  }, [cookies, navigate]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // 선택한 파일의 URL을 생성
      setImagePreview(previewUrl); // 미리보기 이미지를 설정
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPet({
      ...pet,
      [name]:
        name === "petWeight" ? (value === "" ? null : Number(value)) : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPet({
        ...pet,
        petImageUrl: file,
      });

      // 미리보기 이미지를 변경하는 함수 호출
      const previewUrl = URL.createObjectURL(file); // 파일을 URL로 변환
      setImagePreview(previewUrl); // 미리보기 이미지 상태 업데이트
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const nameRegex = /^[가-힣]+$/;
    const petImageUrlRegex = /.*\.(jpg|png|jpeg)$/i;
    const birthDateRegex = /^\d+$/;

    if (!pet.petName) {
      alert("반려 동물 이름을 입력해 주세요.");
      return;
    } else if (!nameRegex.test(pet.petName)) {
      alert("이름은 한글만 사용할 수 있습니다.");
      return false;
    }

    if (
      pet.petGender === "" ||
      (pet.petGender !== "0" && pet.petGender !== "1")
    ) {
      alert("반려 동물 성별을 선택해 주세요.");
      return;
    }

    if (!pet.petBirthDate) {
      alert("반려 동물 생년월일을 입력해 주세요.");
      return;
    } else if (pet.petBirthDate.length !== 6) {
      alert("생년월일은 MMMMYY 6자리로 작성해 주세요.");
      return;
    } else if (!birthDateRegex.test(pet.petBirthDate)) {
      alert("생년월일은 숫자로만 입력해 주세요.");
      return;
    }

    if (!pet.petWeight) {
      alert("반려 동물 몸무게를 입력해 주세요.");
      return;
    } else if (pet.petWeight <= 0) {
      alert("몸무게는 0보다 커야합니다.");
      return;
    }

    if (!pet.petImageUrl) {
      pet.petImageUrl = "/images/pet-default-profile.jpg";
    }

    if (
      pet.petImageUrl &&
      pet.petImageUrl instanceof File &&
      !petImageUrlRegex.test(pet.petImageUrl.name)
    ) {
      alert("프로필 사진은 jpg, jpeg, png 형식만 지원됩니다.");
      return false;
    }

    const formData = new FormData();
    formData.append("petName", pet.petName);
    formData.append("petGender", pet.petGender);
    formData.append("petBirthDate", pet.petBirthDate);
    formData.append("petWeight", pet.petWeight.toString());
    formData.append("petAddInfo", pet.petAddInfo);
    formData.append("petNeutralityYn", pet.petNeutralityYn);
    if (pet.petImageUrl && pet.petImageUrl instanceof File) {
      formData.append("petImageUrl", pet.petImageUrl);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const token = cookies.token || localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:4040/api/v1/users/pet`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("성공:", response.data.data);
      alert(`${pet.petName}이 등록되었습니다.`);
      navigate("/user/petList");
    } catch (error) {
      console.error("실패:", error);
      alert("등록 실패");
    }
  };

  return (
    <div className="petContent">
      <h2>반려 동물 등록</h2>
      <div className="petCreateContent">
        <form onSubmit={handleSubmit}>
          <div className="petCreateElement">
            <label htmlFor="petImageUrl">강아지 프로필 사진</label>
            <img src={imagePreview} alt="강아지 사진" />
            <input
              type="file"
              id="petImageUrl"
              onChange={handleFileChange}
              width="150"
              height="150"
            />
          </div>

          <div className="petCreateElement">
            <label htmlFor="petName">강아지 이름</label>
            <input
              type="text"
              id="petName"
              name="petName"
              value={pet.petName}
              onChange={handleInputChange}
            />
          </div>

          <div className="petCreateElement">
            <label htmlFor="petGender">성별</label>
            <input
              type="radio"
              id="petGender"
              name="petGender"
              value="0"
              checked={pet.petGender === "0"}
              onChange={handleInputChange}
            />
            남
            <input
              type="radio"
              id="petGender"
              name="petGender"
              value="1"
              checked={pet.petGender === "1"}
              onChange={handleInputChange}
            />
            여
          </div>

          <div className="petCreateElement">
            <label htmlFor="petBirthDate">생년월일</label>
            <input
              type="text"
              id="petBirthDate"
              name="petBirthDate"
              value={pet.petBirthDate}
              onChange={handleInputChange}
              placeholder="YYYYMM 입력"
            />
          </div>

          <div className="petCreateElement">
            <label htmlFor="petWeight">몸무게</label>
            <input
              type="number"
              id="petWeight"
              name="petWeight"
              value={pet.petWeight ?? ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="petCreateElement">
            <label htmlFor="petNeutralityYn">중성화 여부</label>
            <input
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="0"
              checked={pet.petNeutralityYn === "0"}
              onChange={handleInputChange}
            />{" "}
            아니오
            <input
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="1"
              checked={pet.petNeutralityYn === "1"}
              onChange={handleInputChange}
            />{" "}
            예
          </div>

          <div className="petCreateElement">
            <label htmlFor="petAddInfo">추가 정보</label>
            <input
              type="text"
              id="petAddInfo"
              name="petAddInfo"
              value={pet.petAddInfo}
              onChange={handleInputChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="ok-button">
              확인
            </button>
            <button type="button" onClick={goBack} className="cancle-button">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
