import axios from "axios";
import {
  HealthRecord,
  HealthRecordResponse,
  DeleteResponse,
} from "../types/healthType";
import { getToken } from "../utils/auth";

const BASE_URL = "http://localhost:4040/api/v1";
const HEALTH_RECORD_API_URL = `${BASE_URL}/health-records`;

// FormData 생성 함수
const createFormData = (
  data: Partial<HealthRecord> & { files?: File[] }
): FormData => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (key === "files" && Array.isArray(value)) {
      value.forEach((file) => {
        if (file instanceof File && file.size > 0) {
          formData.append("files", file);
        }
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, typeof value === "string" ? value : String(value));
    }
  }

  return formData;
};

const getAuthHeaders = () => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const createHealthRecord = async (
  petId: number,
  data: Partial<HealthRecord> & { files?: File[] }
): Promise<HealthRecordResponse> => {
  try {
    const formData = createFormData({ ...data, petId });
    const response = await axios.post<{ data: HealthRecordResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
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

export const updateHealthRecord = async (
  petId: number,
  healthRecordId: number,
  data: {
    weight: number;
    petAge: number;
    abnormalSymptoms: string;
    memo: string;
    attachments?: File[];
  }
): Promise<HealthRecordResponse> => {
  const token = getToken();

  const formData = new FormData();
  if (data.weight) {
    formData.append("weight", data.weight.toString());
  }
  if (data.petAge) {
    formData.append("petAge", data.petAge.toString());
  }
  if (data.abnormalSymptoms) {
    formData.append("abnormalSymptoms", data.abnormalSymptoms);
  }
  if (data.memo) {
    formData.append("memo", data.memo);
  }
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append("attachments", file);
    });
  }

  try {
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

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("건강 기록 수정 중 오류가 발생했습니다.");
  }
};

export const getHealthRecordById = async (
  petId: number,
  healthRecordId: number
): Promise<HealthRecordResponse> => {
  try {
    const response = await axios.get<{ data: HealthRecordResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}/${healthRecordId}`,
      {
        headers: getAuthHeaders(),
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

export const fetchAllHealthRecordsByUserId = async (
  token: string
): Promise<HealthRecordResponse[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/health-records/all-records`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.result) {
      console.log(response.data);
      return response.data.data;
    } else {
      console.error("Failed to fetch health records: ", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching health records: ", error);
    throw error;
  }
};

export const getAllHealthRecords = async (
  petId: number
): Promise<HealthRecordResponse[]> => {
  try {
    const response = await axios.get<{ data: HealthRecordResponse[] }>(
      `${HEALTH_RECORD_API_URL}/${petId}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("건강 기록 목록 조회 실패:", error);
    throw new Error(
      error.response?.data?.message ||
        "건강 기록 목록 조회 중 오류가 발생했습니다."
    );
  }
};

export const deleteHealthRecord = async (
  petId: number,
  healthRecordId: number
): Promise<DeleteResponse> => {
  try {
    const response = await axios.delete<{ data: DeleteResponse }>(
      `${HEALTH_RECORD_API_URL}/${petId}/${healthRecordId}`,
      {
        headers: getAuthHeaders(),
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
