import axios from "axios";
import { Review } from "../types/reviewType";

export const fetchReview = async (
  providerId: number,
  token: string
): Promise<Review[]> => {
  const response = await axios.get<{ data: Review[] }>(
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

export const fetchLatestReview = async (
  providerId: number,
  token: string
): Promise<Review> => {
  const response = await axios.get<{ data: Review }>(
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

export const createReview = async (
  data: {
    reservationId: number;
    reviewScore: number | null;
    reviewContent: string;
  },
  token: string
) => {
  const response = await axios.post(
    `http://localhost:4040/api/v1/reviews/write`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const fetchReviewByReservationId = async (
  reservationId: number,
  token: string
) => {
  const response = await axios.get(
    `http://localhost:4040/api/v1/reviews/reservation/${reservationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const updateReviewByReservationId = async (
  reservationId: number,
  data: {
    reviewScore: number | null;
    reviewContent: string;
  },

  token: string
) => {
  const response = await axios.put(
    `http://localhost:4040/api/v1/reviews/reservation/${reservationId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const deleteReview = async (reviewId: number, token: string) => {
  const response = await axios.delete(
    `http://localhost:4040/api/v1/reviews/${reviewId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
