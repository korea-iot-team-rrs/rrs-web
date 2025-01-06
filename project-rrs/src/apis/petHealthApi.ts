import axios from "axios";
import { getToken } from "../utils/auth";
import {
  HealthRecordCreateRequest,
  HealthRecordUpdateRequest,
  HealthRecordResponse,
  HealthRecordListResponse,
  DeleteResponse,
} from "../types/petHealthType";

const BASE_URL = "http://localhost:4040/api/v1/users/pet";

// Health Record 생성
export const createHealthRecord = async (
  petId: number,
  data: HealthRecordCreateRequest
): Promise<HealthRecordResponse> => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value); // 파일 추가
    } else {
      formData.append(key, value as string);
    }
  });

  const response = await axios.post(`${BASE_URL}/${petId}/create`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

// Health Record 수정
export const updateHealthRecord = async (
  petId: number,
  healthRecordId: number,
  data: HealthRecordUpdateRequest
): Promise<HealthRecordResponse> => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value); // 파일 추가
    } else {
      formData.append(key, value as string);
    }
  });

  const response = await axios.put(
    `${BASE_URL}/${petId}/${healthRecordId}/update`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.data;
};

// 특정 Health Record 조회
export const getHealthRecordById = async (
  petId: number,
  healthRecordId: number
): Promise<HealthRecordResponse> => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await axios.get(`${BASE_URL}/${petId}/${healthRecordId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

// Health Record 전체 목록 조회
export const getAllHealthRecords = async (
  petId: number
): Promise<HealthRecordListResponse> => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

// Health Record 삭제
export const deleteHealthRecord = async (
  petId: number,
  healthRecordId: number
): Promise<DeleteResponse> => {
  const token = getToken();
  if (!token) throw new Error("인증 토큰이 없습니다.");

  const response = await axios.delete(
    `${BASE_URL}/${petId}/${healthRecordId}/delete`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
