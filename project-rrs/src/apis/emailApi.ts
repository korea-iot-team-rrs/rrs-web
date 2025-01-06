import axios from "axios";
import { CertificateDto } from "../types/AuthType";

export const sendEmailForId = async (email: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/mail/send`, {
    email,
  });
  return response.data.data;
};

export const sendEmailForPw = async (email: string, username: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/mail/send`, {
    email,
    username,
  });
  return response.data.data;
};

