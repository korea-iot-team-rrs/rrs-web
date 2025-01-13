// import React, { useEffect, useState } from "react";
// import "../../../../styles/MyPage.css";
// import useAuthStore from "../../../../stores/auth.store";
// import { useNavigate } from "react-router-dom";
// import { updateUserInfo } from "../../../../apis/userInfo";
// import axios from "axios";
// import { useCookies } from "react-cookie";

// export default function UserInfoUpdate() {
//   const { user, updateUser } = useAuthStore();
//   const navigate = useNavigate();
//   const [cookies] = useCookies(["token"]);

//   const [userInfo, setUserInfo] = useState({
//     username: "",
//     name: "",
//     nickname: "",
//     address: "",
//     addressDetail: "",
//     email: "",
//     phone: "",
//     profileImageUrl: "",
//   });

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setUserInfo((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setUserInfo((prevData) => ({
//         ...prevData,
//         profileImageUrl: file.name,
//       }));
//     }
//   };

//   const goBack = () => {
//     window.history.back();
//   };

//   useEffect(() => {
//     try {
//       const token = cookies.token || localStorage.getItem("token");
//       if (!token) {
//         alert('로그인 정보가 없습니다.');
//         navigate("/");
//         return;
//       }

//       const response = await axios.get (
//         `http://localhost:4040/api/v1/users`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         setUserInfo((prev) => {
//           ...prev,
          
//         })
//       }
//     }
//   })

//   const validateUserInfo = (): boolean => {
//     const nameRegex = /^[가-힣]+$/;
//     const phoneRegex = /^[0-9]{11}$/;
//     const profileImageUrlRegex = /.*\.(jpg|png|jpeg)$/;

//     if (!userInfo.name) {
//       alert("이름을 입력해 주세요.");
//       return false;
//     } else if (!nameRegex.test(userInfo.name)) {
//       alert("이름은 한글만 사용할 수 있습니다.");
//       return false;
//     }

//     if (!userInfo.address) {
//       alert("주소를 입력해 주세요.");
//       return false;
//     }

//     if (!userInfo.addressDetail) {
//       alert("상세 주소를 입력해 주세요.");
//       return false;
//     }

//     if (!userInfo.phone) {
//       alert("연락처를 입력해 주세요.");
//       return false;
//     } else if (!phoneRegex.test(userInfo.phone)) {
//       alert("연락처는 11자리 숫자로 입력해 주세요.");
//       return false;
//     }

//     if (!profileImageUrlRegex.test(userInfo.profileImageUrl)) {
//       alert("프로필 사진은 jpg, jpeg, png 형식만 지원됩니다.");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const token = cookies.token || localStorage.getItem("token");

//     if (!validateUserInfo()) {
//       return;
//     }

//     console.log("Submitting user info:", userInfo);

//     try {
//       const formData = new FormData();
//       formData.append("name", userInfo.name);
//       formData.append("address", userInfo.address);
//       formData.append("addressDetail", userInfo.addressDetail);
//       formData.append("phone", userInfo.phone);

//       if (selectedFile) {
//         formData.append("profileImageUrl", selectedFile);
//       }

//       const response = await axios.put(
//         "http://localhost:4040/api/v1/users",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log("Response:", response);
//       console.log("Response Data:", response.data);

//       console.log("Response:", response.data);
//       if (response.data.message === "Phone already exists.") {
//         alert("이미 등록된 전화번호입니다.");
//       } else if (
//         response.data.message === "No changes detected in the provided values."
//       ) {
//         alert("변경된 내용이 없습니다.");
//       } else {
//         alert("회원 정보가 수정되었습니다.");
//         navigate("/user/info");
//       }
//     } catch (error) {
//       console.error("Error updating user info", error);
//       alert("다시 시도해주세요.");
//     }
//   };

//   return (
//     <div>
//       <h2>MyPage</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="element">
//           <label>개인 프로필 사진</label>
//           <input
//             type="file"
//             name="profileImageUrl"
//             accept=".jpg,.png"
//             onChange={handleFileChange}
//           />
//         </div>

//         <div className="element">
//           <label>아이디</label>
//           <input
//             type="text"
//             name="username"
//             value={userInfo.username}
//             disabled
//           />
//         </div>

//         <div className="element">
//           <label>이름</label>
//           <input
//             type="text"
//             name="name"
//             value={userInfo.name}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="element">
//           <label>닉네임</label>
//           <input
//             type="text"
//             name="nickname"
//             value={userInfo.nickname}
//             disabled
//           />
//         </div>

//         <div className="element">
//           <label>주소</label>
//           <input
//             type="text"
//             name="address"
//             value={userInfo.address}
//             onChange={handleInputChange}
//           />
//           <button>주소 검색</button>
//         </div>

//         <div className="element">
//           <label>상세 주소</label>
//           <input
//             type="text"
//             name="addressDetail"
//             value={userInfo.addressDetail}
//             onChange={handleInputChange}
//           />
//         </div>

//         <div className="element">
//           <label>이메일</label>
//           <input type="email" name="email" value={userInfo.email} disabled />
//         </div>

//         <div className="element">
//           <label>연락처</label>
//           <input
//             type="text"
//             name="phone"
//             value={userInfo.phone}
//             onChange={handleInputChange}
//           />
//         </div>

//         <button className="ok-button" type="submit">
//           완료
//         </button>
//         <button className="back-button" type="button" onClick={goBack}>
//           취소
//         </button>
//       </form>
//     </div>
//   );
// }
import React from 'react'

export default function index() {
  return (
    <div>index</div>
  )
}