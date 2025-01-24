import axios from "axios";
import { DangSitter } from "../types/reservationType";

export const fetchOneProviderInfo = async (
  providerId: number,
  token: string
): Promise<DangSitter> => {
  const response = await axios.get(
    `http://localhost:4040/api/v1/providers/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
