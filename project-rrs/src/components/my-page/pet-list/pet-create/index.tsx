import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import petDefaultImage from "../../../../assets/images/pet-default-profile.jpg";
import "../../../../styles/my-page/petCreate.css";
import "../../../../styles/my-page/profileModal.css";

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
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    console.log("token:", token);
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }
  }, [cookies, navigate]);

  const handleImageClick = () => {
    setShowOptions(true);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "default") {
      setImagePreview(petDefaultImage);
    }
    setShowOptions(false);
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

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setShowOptions(false);
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
        `http://localhost:4040/api/v1/pets`,
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
        <form onSubmit={handleSubmit} className="pet-form">
          <div className="petCreateElement">
            <label htmlFor="petImageUrl">강아지 프로필 사진</label>
            <div onClick={handleImageClick} style={{ cursor: "pointer" }}>
              <img src={imagePreview} alt="강아지 사진" />
            </div>
            <input
              type="file"
              id="petImageUrl"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {showOptions && (
            <div className="profile-modal">
              <div className="profile-modal-content">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("petImageUrl")?.click()
                  }
                >
                  앨범에서 사진 선택
                </button>
                <button onClick={() => handleOptionSelect("default")}>
                  기본 사진 선택
                </button>
                <button onClick={() => setShowOptions(false)}>취소</button>
              </div>
            </div>
          )}

          <div className="petCreateElement">
            <label htmlFor="petName">강아지 이름</label>
            <input
              className="text-input"
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
              className="radio-input"
              type="radio"
              id="petGender"
              name="petGender"
              value="0"
              checked={pet.petGender === "0"}
              onChange={handleInputChange}
            />
            <span className="radio-span">남</span>
            <input
              className="radio-input"
              type="radio"
              id="petGender"
              name="petGender"
              value="1"
              checked={pet.petGender === "1"}
              onChange={handleInputChange}
            />
            <span>여</span>
          </div>

          <div className="petCreateElement">
            <label htmlFor="petBirthDate">생년월일</label>
            <input
              className="text-input"
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
              className="text-input"
              type="number"
              id="petWeight"
              name="petWeight"
              value={pet.petWeight ?? ""}
              onChange={handleInputChange}
            />
            <p>Kg</p>
          </div>

          <div className="petCreateElement">
            <label htmlFor="petNeutralityYn">중성화 여부</label>
            <div>
              
            </div>
            <input
              className="radio-input"
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="0"
              checked={pet.petNeutralityYn === "0"}
              onChange={handleInputChange}
            />{" "}
            <span className="radio-span">아니오</span>
            <input
              className="radio-input"
              type="radio"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="1"
              checked={pet.petNeutralityYn === "1"}
              onChange={handleInputChange}
            />{" "}
            <span>예</span>
          </div>

          <div className="petCreateElement">
            <label htmlFor="petAddInfo">추가 정보</label>
            <input
              className="text-input"
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
