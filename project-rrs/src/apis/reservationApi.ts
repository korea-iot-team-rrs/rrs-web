import axios from "axios";

export const fetchprovidersByDate = async (
  data: { startDate: string; endDate: string },
  token: string
) => {
  const response = await axios.post(
    `http://localhost:4040/api/v1/reservations/get-provider`,
    {
      startDate: data.startDate,
      endDate: data.endDate,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
