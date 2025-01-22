import axios from "axios";

const API_BASE_URL = "http://localhost:4040/api/v1/auth";

const ENDPOINTS = {
  DUPLICATE_USERNAME: "/duplicate-username",
  DUPLICATE_NICKNAME: "/duplicate-nickname",
  DUPLICATE_PHONE: "/duplicate-phone",
  DUPLICATE_EMAIL: "/duplicate-email",
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

interface DuplicateCheckResponse {
  result: boolean;
  data: {
    isDuplicate: boolean;
  };
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message;
  }
  return String(error);
};

export const checkUsernameDuplicate = async (
  username: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_USERNAME,
      {
        params: { username },
      }
    );
    console.log("Username Duplicate Check:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking username duplicate:", handleError(error));
    throw error;
  }
};

export const checkNicknameDuplicate = async (
  nickname: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_NICKNAME,
      {
        params: { nickname },
      }
    );
    console.log("Nickname Duplicate Check:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking nickname duplicate:", handleError(error));
    throw error;
  }
};

export const checkPhoneDuplicate = async (
  phone: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_PHONE,
      {
        params: { phone },
      }
    );
    console.log("Phone Duplicate Check:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking phone duplicate:", handleError(error));
    throw error;
  }
};

export const checkEmailDuplicate = async (
  email: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_EMAIL,
      {
        params: { email },
      }
    );
    console.log("Email Duplicate Check:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking email duplicate:", handleError(error));
    throw error;
  }
};
