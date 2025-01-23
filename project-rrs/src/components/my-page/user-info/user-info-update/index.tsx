import React, { useEffect, useState } from "react";
import "../../../../styles/my-page/myPage.css";
import "../../../../styles/my-page/userUpdate.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import userDefaultImage from "../../../../assets/images/dogIllust02.jpeg";
import "../../../../styles/my-page/profileModal.css";
import { useRefreshStore } from "../../../../stores/refresh.store";

export default function UserInfoUpdate() {
  const navigate = useNavigate();
  const {incrementRefreshKey} = useRefreshStore();
  const [cookies] = useCookies(["token"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState(userDefaultImage);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    username: "",
    name: "",
    nickname: "",
    address: "",
    addressDetail: "",
    email: "",
    phone: "",
    profileImageUrl: "",
  });

  const [originalUserInfo, setOriginalUserInfo] = useState(userInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfilePreview(URL.createObjectURL(file));
      setShowModal(false);
    }
  };

  const handleDefaultImage = () => {
    setProfilePreview(userDefaultImage);
    setSelectedFile(null);
    setUserInfo((prevData) => ({
      ...prevData,
      profileImageUrl: "http://localhost:4040/assets/images/dogIllust02.jpeg",
    }));
    setShowModal(false);
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = cookies.token || localStorage.getItem("token");
        if (!token) {
          alert("로그인 정보가 없습니다.");
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:4040/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.data) {
          const userData = response.data.data;
          setUserInfo(userData);
          setOriginalUserInfo(userData);

          if (
            userData.profileImageUrl &&
            userData.profileImageUrl !== userDefaultImage
          ) {
            if (userData.profileImageUrl instanceof File) {
              const fileUrl = URL.createObjectURL(userData.profileImageUrl);
              setProfilePreview(fileUrl);
            } else {
            setProfilePreview(userDefaultImage);
          }
        }
          setLoading(false); 
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        alert("회원 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false); 
      }
    };

    fetchData();
  }, [cookies.token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const defaultImageUrl =
      "http://localhost:4040/assets/images/dogIllust02.jpeg";
    const profileImageUrl = selectedFile ? selectedFile : null;
    const profileUrl = userInfo.profileImageUrl || defaultImageUrl;

    const isImageChanged =
      userInfo.profileImageUrl !== originalUserInfo.profileImageUrl ||
      (userInfo.profileImageUrl === defaultImageUrl &&
        originalUserInfo.profileImageUrl !== defaultImageUrl) ||
      (userInfo.profileImageUrl !== defaultImageUrl &&
        originalUserInfo.profileImageUrl === defaultImageUrl);

    const isInfoUnchanged =
      userInfo.name === originalUserInfo.name &&
      userInfo.address === originalUserInfo.address &&
      userInfo.addressDetail === originalUserInfo.addressDetail &&
      userInfo.phone === originalUserInfo.phone;

    if (!isInfoUnchanged && !selectedFile && !isImageChanged) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    const nameRegex = /^[가-힣]+$/;
    const phoneRegex = /^[0-9]{11}$/;
    const profileImageUrlRegex = /.*\.(jpg|png|jpeg)$/;

    if (userInfo.name !== originalUserInfo.name) {
      if (!userInfo.name) {
        alert("이름을 입력해 주세요.");
        return false;
      } else if (!nameRegex.test(userInfo.name)) {
        alert("이름은 한글만 사용할 수 있습니다.");
        return false;
      }
    }

    if (userInfo.address !== originalUserInfo.address) {
      if (!userInfo.address) {
        alert("주소를 입력해 주세요.");
        return false;
      }
    }

    if (userInfo.addressDetail !== originalUserInfo.addressDetail) {
      if (!userInfo.addressDetail) {
        alert("상세 주소를 입력해 주세요.");
        return false;
      }
    }

    if (userInfo.phone !== originalUserInfo.phone) {
      if (!userInfo.phone) {
        alert("연락처를 입력해 주세요.");
        return false;
      } else if (!phoneRegex.test(userInfo.phone)) {
        alert("연락처는 11자리 숫자로 입력해 주세요.");
        return false;
      }
    }

    if (selectedFile && !profileImageUrlRegex.test(selectedFile.name)) {
      alert("프로필 사진은 jpg, jpeg, png 형식만 지원됩니다.");
      return false;
    }

    const formData = new FormData();
    if (userInfo.name && userInfo.name !== originalUserInfo.name) {
      formData.append("name", userInfo.name);
    }

    if (userInfo.address && userInfo.address !== originalUserInfo.address) {
      formData.append("address", userInfo.address);
    }

    if (
      userInfo.addressDetail &&
      userInfo.addressDetail !== originalUserInfo.addressDetail
    ) {
      formData.append("addressDetail", userInfo.addressDetail);
    }

    if (userInfo.phone && userInfo.phone !== originalUserInfo.phone) {
      formData.append("phone", userInfo.phone);
    }

    if (profileImageUrl) {
      formData.append("profileImageUrl", profileImageUrl);
    }

    formData.append("profileUrl", profileUrl);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const token = cookies.token || localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:4040/api/v1/users/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        alert("유저 정보가 수정되었습니다.");
        const updateData = response.data.data;
        setUserInfo(updateData);
        setProfilePreview(updateData.profileImageUrl);
        incrementRefreshKey();
        goBack();
      } else if (response.data.message === "Phone already exists.") {
        alert("이미 등록된 전화번호입니다.");
        console.log("ResponseMessage: ", response.data.message);
      }
    } catch (error) {
      console.error("Error updating user info", error);
      alert("다시 시도해주세요.");
    }
  };

  return (
    <div className="userContent">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>회원 정보 수정</h2>
          <form onSubmit={handleSubmit} className="userUpdateContent">
            <div className="userUpdateElement">
              <label htmlFor="profileImageUrl">개인 프로필 사진</label>
              <div onClick={handleImageClick} style={{ cursor: "pointer" }}>
                <img
                  src={profilePreview}
                  alt="프로필 사진"
                  onError={(e) => {
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = userDefaultImage;
                  }}
                />
              </div>

              {showModal && (
                <div className="profile-modal">
                  <div className="profile-modal-content">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("profileInput")?.click()
                      }
                    >
                      앨범에서 사진 선택
                    </button>
                    <button type="button" onClick={handleDefaultImage}>
                      기본 사진 선택
                    </button>
                    <button onClick={closeModal}>닫기</button>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="profileInput"
                name="profileImageUrl"
                accept=".jpg,.png,.jpeg"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="userUpdateElement">
              <label>아이디</label>
              <input
                type="text"
                name="username"
                value={userInfo.username}
                disabled
              />
            </div>

            <div className="userUpdateElement">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="userUpdateElement">
              <label>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={userInfo.nickname}
                disabled
              />
            </div>

            <div className="userUpdateElement">
              <label>주소</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                className="address"
              />
            </div>

            <div className="userUpdateElement">
              <label>상세 주소</label>
              <input
                type="text"
                name="addressDetail"
                value={userInfo.addressDetail}
                onChange={handleInputChange}
              />
            </div>

            <div className="userUpdateElement">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                disabled
              />
            </div>

            <div className="userUpdateElement">
              <label>연락처</label>
              <input
                type="text"
                name="phone"
                value={userInfo.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="button-group">
              <button className="ok-button" type="submit">
                완료
              </button>
              <button className="cancle-button" type="button" onClick={goBack}>
                취소
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}