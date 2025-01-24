import axios from "axios";
import { User } from "../types/entityType";
import { getToken } from "../utils/auth";
import { MAIN_URL, UPDATE_PASSWORD } from "../constants";

export const fetchUserInfo = async (): Promise<User> => {
  const token = getToken();

  if (!token) {
    throw new Error("사용자 정보 조회 실패: 로그인되지 않음");
  }

  try {
    const response = await axios.get<{ data: User }>(
      "http://localhost:4040/api/v1/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.log("Failed to fetch user info:", error);
    throw new Error("사용자 정보 조회 실패");
  }
};

interface UpdateUserResponse {
  message: string;
  data: User;
}

export const updateUserInfo = async (
  userData: Partial<User>
): Promise<UpdateUserResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.put<UpdateUserResponse>(
      "http://localhost:4040/api/v1/users/me",
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateUserInfo:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error response:", error.response);
    }
    throw error;
  }
};

export const deleteUserInfo = async (password: string): Promise<void> => {
  const token = getToken();
  if (!token) {
    throw new Error("No token found");
  }

  try {
    const response = await axios.delete("http://localhost:4040/api/v1/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { password },
    });
    console.log("User deleted successfully");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Request failed");
    } else {
      console.error("Unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  }
};

export const fetchUserInfoForCertification = async (
  token: string
): Promise<User> => {
  try {
    const response = await axios.get<{ data: User }>(
      "http://localhost:4040/api/v1/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Failed to fetch user info:", error);
    throw new Error("Failed to fetch user information.");
  }
};

export const updateUserPassword = async (
  data: {
    password: string;
    confirmPassword: string;
  },
  token: string
) => {
  const response = await axios.put(
    `${MAIN_URL}${UPDATE_PASSWORD}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};