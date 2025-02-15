import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import petDefaultImage from "../../../../assets/images/pet-default-profile.jpg";
import "../../../../styles/my-page/petUpdate.css";
import "../../../../styles/my-page/profileModal.css";

export default function PetUpdate() {
  const { petId } = useParams();
  const [pet, setPet] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [originalPetInfo, setOriginalPetInfo] = useState(pet);
  const [imagePreview, setImagePreview] = useState(petDefaultImage);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const fetchPet = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/pets/${petId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.data) {
          const petData = response.data.data;
          setPet(petData);
          setOriginalPetInfo(petData);

          if (petData.petImageUrl && petData.petImageUrl !== petDefaultImage) {
            if (petData.petImageUrl instanceof File) {
              const fileUrl = URL.createObjectURL(petData.petImageUrl);
              setImagePreview(fileUrl);
            } else {
              const imageUrl = `http://localhost:4040/${petData.petImageUrl}`;
              setImagePreview(imageUrl);
            }
          } else {
            setImagePreview(petDefaultImage);
          }
        }
      } catch (error) {
        console.error("에러 발생:", error);
        alert("반려 동물 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchPet();
  }, [petId, navigate]);

  const handleImageClick = () => {
    setShowOptions(true);
  };

  const handleOptionSelect = (option: string) => {
    if (option === "default") {
      setImagePreview(petDefaultImage);
    }
    setShowOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file); 

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
    const isImageChanged = !!selectedFile || !!petDefaultImage; 

    const isInfoChanged =
      pet.petName !== originalPetInfo.petName ||
      pet.petGender !== originalPetInfo.petGender ||
      pet.petBirthDate !== originalPetInfo.petBirthDate ||
      pet.petWeight !== originalPetInfo.petWeight ||
      pet.petNeutralityYn !== originalPetInfo.petNeutralityYn ||
      pet.petAddInfo !== originalPetInfo.petAddInfo;
    
    if (!isInfoChanged && !isImageChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    const nameRegex = /^[가-힣]+$/;
    const petImageUrlRegex = /.*\.(jpg|png|jpeg)$/;

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
    }

    if (!pet.petWeight) {
      alert("반려 동물 몸무게를 입력해 주세요.");
      return;
    } else if (pet.petWeight <= 0) {
      alert("몸무게는 0보다 커야합니다.");
      return;
    }

    if (!pet.petImageUrl) {
      pet.petImageUrl = "default-image.jpg";
    }

    if (pet.petImageUrl !== originalPetInfo.petImageUrl) {
      if (!pet.petImageUrl) {
        pet.petImageUrl = "pet-default-image.jpg";
      }
    }

    if (selectedFile && !petImageUrlRegex.test(selectedFile.name)) {
      alert("프로필 사진은 jpg, jpeg, png 형식만 지원됩니다.");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const formData = new FormData();
    formData.append("petName", pet.petName);
    formData.append("petGender", pet.petGender);
    formData.append("petBirthDate", pet.petBirthDate);
    formData.append("petWeight", pet.petWeight);
    formData.append("petNeutralityYn", pet.petNeutralityYn);
    formData.append("petAddInfo", pet.petAddInfo);

    if (selectedFile) {
      formData.append("petImageUrl", selectedFile);
    }

    formData.append("defaultUrl", petDefaultImage);

    try {
      const response = await axios.put(
        `http://localhost:4040/api/v1/pets/${petId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("반려동물 정보가 수정되었습니다.");
        goBack();
      } else {
        alert("반려동물 정보를 수정하는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("수정 에러:", error);
      alert("반려동물 정보를 수정하는 중 오류가 발생했습니다.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPet((prevPet: any) => ({
      ...prevPet,
      [name]: value,
    }));
  };

  return (
    <div className="petContent">
        <h2>반려동물 정보 수정</h2>
        <div className="petUpdateContent">
        <form onSubmit={handleSubmit} className="pet-form">
          <div className="petUpdateElement">
            <label htmlFor="petImageUrl">강아지 프로필 사진</label>
            <div onClick={handleImageClick} style={{ cursor: "pointer" }}>
              <img src={imagePreview} alt="강아지 사진" />
            </div>
            <input
              type="file"
              id="petImageUrl"
              accept=".jpg,.png,.jpeg"
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

          <div className="petUpdateElement">
            <label>강아지 이름</label>
            <input
              type="text"
              className="text-input"
              name="petName"
              value={pet?.petName}
              onChange={handleInputChange}
            />
          </div>

          <div className="petUpdateElement">
            <label htmlFor="petGender">성별</label>
            <input
              type="radio"
              className="radio-input"
              id="petGender"
              name="petGender"
              value="0"
              checked={pet?.petGender === "0"}
              onChange={handleInputChange}
            />
            <span className="radio-span">남</span>
            <input
              type="radio"
              className="radio-input"
              id="petGender"
              name="petGender"
              value="1"
              checked={pet?.petGender === "1"}
              onChange={handleInputChange}
            />
            <span className="radio-span">여</span>
          </div>

          <div className="petUpdateElement">
            <label>생년월일</label>
            <input
              type="text"
              className="text-input"
              name="petBirthDate"
              value={pet?.petBirthDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="petUpdateElement">
            <label>몸무게</label>
            <input
              type="number"
              className="text-input"
              name="petWeight"
              value={pet?.petWeight}
              onChange={handleInputChange}
            />
          </div>

          <div className="petUpdateElement">
            <label htmlFor="petNeutralityYn">중성화 여부</label>
            <input
              type="radio"
              className="radio-input"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="0"
              checked={pet?.petNeutralityYn === "0"}
              onChange={handleInputChange}
            />
            <span className="radio-span">아니오</span>
            <input
              type="radio"
              className="radio-input"
              id="petNeutralityYn"
              name="petNeutralityYn"
              value="1"
              checked={pet?.petNeutralityYn === "1"}
              onChange={handleInputChange}
            />
            <span className="radio-span">예</span>
          </div>

          <div className="petUpdateElement">
            <label htmlFor="petAddInfo">추가 정보</label>
            <input
              type="text"
              className="text-input"
              id="petAddInfo"
              name="petAddInfo"
              value={pet?.petAddInfo}
              onChange={handleInputChange}
            />
          </div>

          <div className="button-group">
            <button type="submit" className="ok-button">확인</button>
            <button type="button" onClick={goBack} className="cancle-button">
              취소
            </button>
          </div>
        </form>
        </div>
      </div>
  );
}
