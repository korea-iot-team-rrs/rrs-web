import axios from "axios";
import { FIND_ID_BY_TOKEN, MAIN_URL, SEND_EMAIL } from "../constants";

export const sendEmailForId = async (email: string) => {
  const response = await axios.post(
    `${MAIN_URL}${SEND_EMAIL}`,
    {
      email,
    }
  );
  return response.data.data;
};

export const sendEmailForPw = async (email: string, username: string) => {
  const response = await axios.post(
    `${MAIN_URL}${SEND_EMAIL}`,
    {
      email,
      username,
    }
  );
  return response.data.data;
};

export const FetchIdByToken = async (token: string) => {
  const response = await axios.get(
    `${MAIN_URL}${FIND_ID_BY_TOKEN(token)}`
  );
  return response.data.data;
};
