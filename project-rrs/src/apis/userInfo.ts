import axios from "axios";
import { MAIN_URL } from "../constants";
import { User } from "../types";
import { getToken } from "../utils/auth";

export const USER_API_URL = `${MAIN_URL}/users`;

// 사용자 정보 조회
export const fetchUserInfo = async (): Promise<User> => {
  const token = getToken();
  
  if (!token) {
    throw new Error("사용자 정보 조회 실패: 로그인되지 않음");
  }

  try{
    const response = await axios.get<{ data: User }>('http://localhost:4040/api/v1/users', {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    console.log("Failed to fetch user info:", error);
    throw new Error("사용자 정보 조회 실패");
  }
}

interface UpdateUserResponse {
  message: string;
  data: User; // data는 실제 사용자 데이터
}

// 사용자 정보 수정
export const updateUserInfo = async (
  userData: Partial<User>
): Promise<UpdateUserResponse> => {
  const token = getToken(); // getToken 함수 사용

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.put<UpdateUserResponse>(
      'http://localhost:4040/api/v1/users',
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response Data:", response.data); // 응답 데이터 확인
    return response.data;
  } catch (error) {
    console.error("Error in updateUserInfo:", error); // 에러 로그 추가
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response); // axios 오류 응답 로그
    }
    throw error; // 에러를 다시 던져서 handleOk에서 처리되도록 합니다
  }
};
