import axios from "axios";
import { getToken } from "../../utils/auth";
import { MAIN_URL, USER_PATH } from "../../constants";

const UPLOAD_USER_FILE_API_URL = `${MAIN_URL}${USER_PATH}/upload/`; // 파일 업로드 API URL

/**
 * 파일 업로드 함수
 * @param file 업로드할 파일
 * @param path 저장할 경로
 * @returns 업로드된 파일의 서버 경로
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  if (!file) {
    throw new Error("업로드할 파일이 제공되지 않았습니다.");
  }

  if (!path || typeof path !== "string" || path.trim() === "") {
    throw new Error("유효한 파일 경로를 제공해주세요.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);

  try {
    const response = await axios.post<{ data: string }>(
      UPLOAD_USER_FILE_API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000, // 타임아웃 설정 (10초)
      }
    );

    if (!response.data || !response.data.data) {
      throw new Error("서버에서 유효하지 않은 응답을 받았습니다.");
    }

    return response.data.data;
  } catch (error: any) {
    console.error("파일 업로드 실패:", error.response?.data || error.message);

    // 네트워크 오류 처리
    if (error.code === "ECONNABORTED") {
      throw new Error("파일 업로드 요청이 시간 초과되었습니다.");
    }

    throw new Error(
      error.response?.data?.message || "파일 업로드 중 오류가 발생했습니다."
    );
  }
};
