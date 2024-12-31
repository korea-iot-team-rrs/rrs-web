import axios from "axios";
import { Review } from "../types/reviewType";

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

export const fetchLatestReview = async (providerId: number, token: string): Promise<Review> => {
  const response = await axios.get<{data: Review}>(
    `http://localhost:4040/api/v1/reviews/latest-review/${providerId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};