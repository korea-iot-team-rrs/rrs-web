import axios from "axios";
import { CreateCS } from "../types/customerSupport";

export const createCustomerSupport = async (data: CreateCS, token: string) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "files" && Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append("files", file); // 파일 배열 추가
      });
    } else {
      formData.append(key, value as string);
    }
  });

  const response = await axios.post(
    `http://localhost:4040/api/v1/customer-supports`,
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

export const fetchCustomerSupportList = async (token: string) => {
  const response = await axios.get(
    `http://localhost:4040/api/v1/customer-supports`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};
