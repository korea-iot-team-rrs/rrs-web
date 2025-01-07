import axios from "axios";
import { CertificateDto } from "../types/AuthType";

export const sendEmailForId = async (email: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/auth/send-email`, {
    email,
  });
  return response.data.data;
};

export const sendEmailForPw = async (email: string, username: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/auth/send-email`, {
    email,
    username,
  });
  return response.data.data;
};


export const FetchIdByToken = async(token:string) => {
  const response = await axios.get(`http://localhost:4040/api/v1/auth/find-id/${token}`)
  return response.data.data;
}