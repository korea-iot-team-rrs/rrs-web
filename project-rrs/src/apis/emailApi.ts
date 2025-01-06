import axios from "axios";

export const sendEmailforPw = async (username: string, email: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/mail/send`);
  return response.data.data;
};

export const sendEmailforId = async (email: string) => {
  const response = await axios.post(`http://localhost:4040/api/v1/mail/send`);
  return response.data.data;
};
