import axios from "axios";
import {
  CreateCS,
  FetchCS,
  FetchCSList,
  UpdateCS,
} from "../types/customerSupport";

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

export const fetchCustomerSupportList = async (
  token: string
): Promise<FetchCSList[]> => {
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

export const fetchOneCustomerSupport = async (
  customerSupportId: number,
  token: string
): Promise<FetchCS> => {
  const response = await axios.get(
    `http://localhost:4040/api/v1/customer-supports/${customerSupportId}`,
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
  data: UpdateCS,
  token: string
) => {
  const formData = createFormData(data);

  const response = await axios.put(
    `http://localhost:4040/api/v1/customer-supports/${customerSupportId}`,
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

export const deleteCustomerSupport = async (
  customerSupportId: number,
  token: string
) => {
  const response = await axios.delete(
    `http://localhost:4040/api/v1/customer-supports/${customerSupportId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data;
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
