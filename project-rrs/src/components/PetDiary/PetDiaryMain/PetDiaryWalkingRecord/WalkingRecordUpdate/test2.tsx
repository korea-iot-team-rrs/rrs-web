import React from 'react'

export default function test2() {
  return (
    <div>test2</div>
  )
}

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Pet, WalkingRecord } from "../../../../../stores/petstore";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { IoMdSunny } from "react-icons/io";
// import { IoCloudy, IoRainy } from "react-icons/io5";
// import { TbSnowman } from "react-icons/tb";
// import { FaFolder } from "react-icons/fa";
// import { IconButton } from "@mui/material";
// import Select, { components } from "react-select";
// import DeleteIcon from "@mui/icons-material/Delete";

// interface WalkingRecordUpdateProps {
//   selectedPet: Pet | null;
//   selectedDate: string;
//   walkingRecordId: number;
//   goBack: () => void;
// }

// const WalkingRecordUpdate = ({
//   selectedPet,
//   selectedDate,
//   walkingRecordId,
//   goBack,
// }: WalkingRecordUpdateProps) => {
//   const [cookies] = useCookies(["token"]);
//   const [hours, setHours] = useState<number>(0);
//   const [minutes, setMinutes] = useState<number>(0);
//   const navigate = useNavigate();
//   const [existingFiles, setExistingFiles] = useState<Array<{ name: string; url: string }>>([]);
//   const [newFiles, setNewFiles] = useState<Array<{ name: string; file: File }>>([]); 
//   const [walkingRecord, setWalkingRecord] = useState({
//     walkingRecordWeatherState: "",
//     walkingRecordDistance: "",
//     walkingRecordWalkingTime: "",
//     walkingRecordCreateAt: selectedDate,
//     walkingRecordMemo: "",
//   });

//   const weatherOptions = [
//     { value: "SUNNY", label: <IoMdSunny style={{ fontSize: "24px" }} /> },
//     { value: "CLOUDY", label: <IoCloudy style={{ fontSize: "24px" }} /> },
//     { value: "RAINY", label: <IoRainy style={{ fontSize: "24px" }} /> },
//     { value: "SNOWY", label: <TbSnowman style={{ fontSize: "24px" }} /> },
//   ];

//   const handleWeatherChange = (selectedOption: any) => {
//     setWalkingRecord({
//       ...walkingRecord,
//       walkingRecordWeatherState: selectedOption.value,
//     });
//   };

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setWalkingRecord({
//       ...walkingRecord,
//       [name]: value,
//     });
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const fileList = Array.from(e.target.files);
//       setNewFiles((prevFiles) => [...prevFiles, ...fileList.map((file) => ({ name: file.name, file }))]);
//     }
//   };

//   useEffect(() => {
//     if (selectedPet) {
//       const petId = selectedPet.petId;
//       const fetchWalkingRecord = async () => {
//         try {
//           const token = cookies.token || localStorage.getItem("token");
//           if (!token) {
//             alert("로그인 정보가 없습니다.");
//             navigate("/");
//             return;
//           }

//           const response = await axios.get(
//             `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );

//           if (response.status === 200) {
//             console.log("response:", response.data);
//             const data = response.data.data;
//             const totalMinutes = data.walkingRecordWalkingTime;
//             const hours = Math.floor(totalMinutes / 60);
//             const minutes = totalMinutes % 60;
//             setHours(hours);
//             setMinutes(minutes);

//             const filesWithUrls = data.files
//             ? data.files.map((file: any) => ({
//                 name: file.fileName,
//                 url: file.fileUrl,
//               }))
//             : [];

//             setExistingFiles(filesWithUrls);
//             setWalkingRecord((prevRecord) => ({
//               ...prevRecord,
//               walkingRecordWeatherState: data.walkingRecordWeatherState,
//               walkingRecordDistance: data.walkingRecordDistance,
//               walkingRecordWalkingTime: data.walkingRecordWalkingTime,
//               walkingRecordCreateAt: data.walkingRecordCreateAt,
//               walkingRecordMemo: data.walkingRecordMemo,
//             }));
//           }
//         } catch (error) {
//           console.error("산책 기록을 불러오는 중 오류 발생:", error);
//         }
//       };

//       fetchWalkingRecord();
//     }
//   }, [walkingRecordId, cookies, navigate, selectedPet]);
  
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();

//     // 유효성 검사
//     if (!walkingRecord.walkingRecordWeatherState) {
//       alert("날씨를 선택해 주세요.");
//       return;
//     }

//     if (hours === 0 && minutes === 0) {
//       alert("산책 시간을 입력해 주세요.");
//       return;
//     } else if (minutes >= 60) {
//       alert("60분 미만으로 입력해 주세요.");
//       return;
//     }

//     const currentDate = new Date();
//     const selectedDate = new Date(walkingRecord.walkingRecordCreateAt);

//     if (selectedDate > currentDate) {
//       alert("미래 날짜는 입력할 수 없습니다.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("petId", String(selectedPet?.petId));
//     formData.append(
//       "walkingRecordWeatherState",
//       walkingRecord.walkingRecordWeatherState
//     );
//     formData.append(
//       "walkingRecordDistance",
//       String(walkingRecord.walkingRecordDistance)
//     );
//     formData.append(
//       "walkingRecordWalkingTime",
//       String(walkingRecord.walkingRecordWalkingTime)
//     );
//     formData.append(
//       "walkingRecordCreateAt",
//       walkingRecord.walkingRecordCreateAt
//     );
//     formData.append("walkingRecordMemo", walkingRecord.walkingRecordMemo);

//     const allFiles = [
//       ...existingFiles.map((file) => ({ ...file, file: null })), // existingFiles는 url만 있으므로, file 속성을 null로 설정
//       ...newFiles, // newFiles는 실제 File 객체가 있으므로 그대로 사용
//     ];

//     console.log("All files to upload:", allFiles);
    
//     allFiles.forEach((fileObj) => {
//       // file이 null이 아닌지 확인
//       if (fileObj.file) {
//         console.log("Appending file:", fileObj.name); // 어떤 파일이 추가되는지 확인
//         formData.append("files", fileObj.file, fileObj.name);
//       } else {
//         console.log("Skipping file, fileObj.file is null or undefined:", fileObj.name);
//       }
//     });

//     try {
//       const token = cookies.token || localStorage.getItem("token");
//       const petId = selectedPet?.petId;
//       console.log("token: ", token);

//       const response = await axios.put(
//         `http://localhost:4040/api/v1/walking-record/petId/${petId}/walkingRecordId/${walkingRecordId}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("산책 기록이 수정되었습니다.");
//         goBack();
//       } else {
//         alert("수정에 실패했습니다.");
//       }
//     } catch (error) {
//       console.error("수정 중 오류 발생:", error);
//       alert("산책 기록 수정 중 오류가 발생했습니다.");
//     }
//   };

//   if (!walkingRecord) {
//     return <p>산책 기록을 불러오는 중...</p>;
//   }

//   const removeFile = (index: number, isNewFile: boolean) => {
//     if (isNewFile) {
//       setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     } else {
//       setExistingFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
//     }
//   };

//   const CustomOption = (props: any) => {
//     return (
//       <components.Option {...props}>
//         <span style={{ fontSize: "24px" }}>{props.data.label}</span>
//       </components.Option>
//     );
//   };
  
//   return (
//     <div>
//       <h2>산책 기록 수정</h2>
//       {walkingRecord ? (
//         <form onSubmit={handleSubmit}>
//           <div className="petCircleBox">
//             <img
//               src={selectedPet?.petImageUrl}
//               alt={`${selectedPet?.petName}의 사진`}
//             />
//           </div>

//           <div>
//             <label htmlFor="create-date">작성 날짜</label>
//             <span id="create-date">
//               {selectedDate && (
//                 <>
//                   {selectedDate.split("-")[0]}년 &nbsp;
//                   {selectedDate.split("-")[1]}월 &nbsp;
//                   {selectedDate.split("-")[2]}일
//                 </>
//               )}
//             </span>
//           </div>

//           <div>
//             <label htmlFor="weather">날씨</label>
//             <Select
//               id="weather"
//               className="select-weather"
//               value={weatherOptions.find(
//                 (option) =>
//                   option.value === walkingRecord.walkingRecordWeatherState
//               )}
//               onChange={handleWeatherChange}
//               options={weatherOptions}
//               components={{ Option: CustomOption }}
//             />
//           </div>

//           <div>
//             <label htmlFor="walking-time">산책 시간</label>
//             <input
//               type="number"
//               id="walking-time"
//               value={hours}
//               onChange={(e) => setHours(Number(e.target.value))}
//               min="0"
//             />{" "}
//             시간
//             <input
//               type="number"
//               id="walking-time"
//               value={minutes}
//               onChange={(e) => setMinutes(Number(e.target.value))}
//               min="0"
//             />{" "}
//             분
//           </div>

//           <div>
//             <label htmlFor="walking-distance">산책 거리</label>
//             <input
//               type="number"
//               id="walking-distance"
//               name="walkingRecordDistance"
//               value={walkingRecord.walkingRecordDistance}
//               onChange={handleInputChange}
//               min="0"
//             />{" "}
//             m
//           </div>

//           <div>
//             <label htmlFor="memo">메모</label>
//             <textarea
//               id="memo"
//               name="walkingRecordMemo"
//               value={walkingRecord.walkingRecordMemo}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div>
//           <h3>기존 파일</h3>
//           <ul>
//             {existingFiles.map((file, index) => (
//               <li key={index}>
//                 <a href={file.url} target="_blank" rel="noopener noreferrer">
//                   {file.name}
//                 </a>
//                 <IconButton onClick={() => removeFile(index, false)}>
//                   <DeleteIcon />
//                 </IconButton>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div>
//           <h3>새 파일</h3>
//           <input
//               type="file"
//               id="files"
//               multiple
//               onChange={handleFileChange}
//             />
//           <ul>
//             {newFiles.map((file, index) => (
//               <li key={index}>
//                 {file.name}
//                 <IconButton onClick={() => removeFile(index, true)}>
//                   <DeleteIcon />
//                 </IconButton>
//               </li>
//             ))}
//           </ul>
//         </div>

//           {/* <div>
//             <label htmlFor="files">사진</label>

//             <input
//               type="file"
//               id="files"
//               multiple
//               onChange={handleFileChange}
//             />

//             {walkingRecord.files.length > 0 ? (
//               <ul className="file-list">
//                 {walkingRecord.files.map((file, index) => (
//                   <li key={index} className="file-item">
//                     <span>
//                       <FaFolder />
//                     </span>
//                     <span className="file-name">{file.name}</span>
//                     <IconButton
//                       onClick={() => removeFile(index)}
//                       className="delete-btn"
//                     >
//                       <DeleteIcon color="primary" />
//                     </IconButton>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>사진 없음</p>
//             )}
//           </div> */}

//           <button type="submit">저장</button>
//           <button type="button" onClick={goBack}>
//             취소
//           </button>
//         </form>
//       ) : (
//         <p>산책 기록을 불러오는 중...</p>
//       )}
//     </div>
//   );
// }

// export default WalkingRecordUpdate;
