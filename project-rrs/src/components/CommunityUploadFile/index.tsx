import axios from "axios";
import { getToken } from "../../utils/auth";
import { MAIN_URL, USER_PATH } from "../../constants";

const UPLOAD_FILE_API_URL = `${MAIN_URL}${USER_PATH}/upload/file`; // 파일 업로드 API URL

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  if (!file) {
    throw new Error("업로드할 파일이 제공되지 않았습니다.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  try {
    const response = await axios.post<{ data: string }>(
      UPLOAD_FILE_API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error("서버에서 유효하지 않은 응답을 받았습니다.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("파일 업로드 실패:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "파일 업로드 중 오류가 발생했습니다."
    );
  }
};
