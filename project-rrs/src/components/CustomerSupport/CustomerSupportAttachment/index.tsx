import React, { useState } from "react";
import axios from "axios";

interface ReqData {
  title: string;
  files: File[]; // 파일 배열로 변경
}

export default function CustomerSupportAttachment() {
  const [reqData, setReqData] = useState<ReqData>({
    title: "",
    files: [], // 초기값은 빈 배열
  });

  // 파일 및 제목 변경 핸들러
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "files" && files) {
      const fileArray = Array.from(files); // 파일 배열로 변환
      setReqData((prev) => ({
        ...prev,
        files: fileArray,
      }));
    } else {
      setReqData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOnSubmit = async () => {
    const formData = new FormData();

    // 제목 추가
    formData.append("title", reqData.title);

    // 파일 배열 추가
    reqData.files.forEach((file) => {
      formData.append("files", file); // 'files'라는 키로 여러 파일 추가
    });

    try {
      // 파일 업로드 요청
      const uploadResponse = await axios.post(
        "http://localhost:4040/api/upload/file/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (error) {
      console.error("업로드 또는 회원 정보 요청 중 오류 발생:", error);
    }
  };

  return (
    <div className="App">
      <div>
        <label>이름:</label>
        <input
          type="text"
          name="title"
          onChange={handleOnChange}
          value={reqData.title}
        />
      </div>
      <div>
        <label>파일 업로드:</label>
        <input type="file" name="files" onChange={handleOnChange} multiple />
      </div>
      <button onClick={handleOnSubmit}>전송</button>
    </div>
  );
}
