import axios from "axios";
import {
  CreateCS,
  FetchCS,
  FetchCSList,
  UpdateCS,
} from "../types/customerSupportType";
import {
  CUSTOMER_SUPPORT_CREATE_PATH,
  CUSTOMER_SUPPORT_DELETE_PATH,
  CUSTOMER_SUPPORT_GET_ALL_PATH,
  CUSTOMER_SUPPORT_GET_PATH,
  CUSTOMER_SUPPORT_PUT_PATH,
  MAIN_URL,
} from "../constants";

export const createCustomerSupport = async (data: CreateCS, token: string) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "files" && Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append("files", file);
      });
    } else {
      formData.append(key, value as string);
    }
  });

  const response = await axios.post(
    `${MAIN_URL}${CUSTOMER_SUPPORT_CREATE_PATH}`,
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

export const fetchCustomerSupportList = async (
  token: string
): Promise<FetchCSList[]> => {
  const response = await axios.get(
    `${MAIN_URL}${CUSTOMER_SUPPORT_GET_ALL_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

export const fetchOneCustomerSupport = async (
  customerSupportId: number,
  token: string
): Promise<FetchCS> => {
  const response = await axios.get(
    `${MAIN_URL}${CUSTOMER_SUPPORT_GET_PATH(customerSupportId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
};

export const updateCustomerSupport = async (
  customerSupportId: number,
  formData: FormData,
  token: string
) => {
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  if (!token) {
    console.error("Token is missing");
    throw new Error("Authentication token is required");
  }

  const response = await axios.put(
    `${MAIN_URL}${CUSTOMER_SUPPORT_PUT_PATH(customerSupportId)}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Update successful:", response.data);
  return response.data;
};

export const deleteCustomerSupport = async (
  customerSupportId: number,
  token: string
) => {
  const response = await axios.delete(
    `${MAIN_URL}${CUSTOMER_SUPPORT_DELETE_PATH(customerSupportId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const createFormData = (data: Partial<UpdateCS>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "files" && Array.isArray(value)) {
      value.forEach((file) => formData.append("files", file));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};
