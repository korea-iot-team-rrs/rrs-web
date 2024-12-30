import axios from "axios";
import { Review } from "../types/review";

export const fetchReview = async (providerId: number, token: string): Promise<Review[]> => {
  const response = await axios.get<{data: Review[]}>(
    `http://localhost:4040/api/v1/reviews/provider/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data;
};