import axios from "axios";
import {
  HealthRecord,
  HealthRecordResponse,
  DeleteResponse,
} from "../types/petHealthType";
import { getToken } from "../utils/auth";

const HEALTH_RECORD_API_URL = "http://localhost:4040/api/v1/users/pet/petHealth";

// Health Record 생성
export const createHealthRecord = async (
  petId: number,
  data: Partial<HealthRecord> & { files?: File[] }
): Promise<HealthRecordResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const formData = new FormData();
    
    formData.append("petId", String(petId));
    Object.entries(data).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((file) => formData.append("files", file));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const response = await axios.post<{ data: HealthRecordResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 생성 실패:", error);
    throw new Error(
      error.response?.data?.message || "건강 기록 생성 중 오류가 발생했습니다."
    );
  }
};

// Health Record 수정
export const updateHealthRecord = async (
  petId: number,
  healthRecordId: number,
  data: Partial<HealthRecord> & { files?: File[] }
): Promise<HealthRecordResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((file) => formData.append("files", file));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    });

    const response = await axios.put<{ data: HealthRecordResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}/${healthRecordId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 수정 실패:", error);
    throw new Error(
      error.response?.data?.message || "건강 기록 수정 중 오류가 발생했습니다."
    );
  }
};

// 특정 Health Record 조회
export const getHealthRecordById = async (
  petId: number,
  healthRecordId: number
): Promise<HealthRecordResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const response = await axios.get<{ data: HealthRecordResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}/${healthRecordId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 조회 실패:", error);
    throw new Error(
      error.response?.data?.message || "건강 기록 조회 중 오류가 발생했습니다."
    );
  }
};

// Health Record 전체 목록 조회
export const getAllHealthRecords = async (
  petId: number
): Promise<HealthRecordResponse[]> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const response = await axios.get<{ data: HealthRecordResponse[] }>(
      `${HEALTH_RECORD_API_URL}/${petId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 목록 조회 실패:", error);
    throw new Error(
      error.response?.data?.message || "건강 기록 목록 조회 중 오류가 발생했습니다."
    );
  }
};

// Health Record 삭제
export const deleteHealthRecord = async (
  petId: number,
  healthRecordId: number
): Promise<DeleteResponse> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const response = await axios.delete<{ data: DeleteResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}/${healthRecordId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 삭제 실패:", error);
    throw new Error(
      error.response?.data?.message || "건강 기록 삭제 중 오류가 발생했습니다."
    );
  }
};
