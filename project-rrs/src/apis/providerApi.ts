import axios from "axios";
import { PetSitter } from "../types/reservationType";

export const fetchOneProviderInfo = async (
  providerId: number,
  token: string
): Promise<PetSitter> => {
  const response = await axios.get(
    `http://localhost:4040/api/v1/provider/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
