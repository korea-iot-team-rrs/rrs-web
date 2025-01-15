import axios from "axios";
import { Pet } from "../types";

export const fetchPets = async (token: string): Promise<Pet[]> => {
  const response = await axios.get(`http://localhost:4040/api/v1/users/pet`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};