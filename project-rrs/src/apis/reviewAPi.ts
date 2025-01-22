import axios from "axios";
import { Review } from "../types/reviewType";
import {
  MAIN_URL,
  REVIEW_DELETE_PATH,
  REVIEW_GET_BY_PROVIDER_PATH,
  REVIEW_GET_BY_RESERVATION_PATH,
  REVIEW_GET_LATEST_REVIEW,
  REVIEW_POST_PATH,
  REVIEW_PUT_PATH,
} from "../constants";

export const createReview = async (
  data: {
    reservationId: number;
    reviewScore: number | null;
    reviewContent: string;
  },
  token: string
) => {
  const response = await axios.post(`${MAIN_URL}${REVIEW_POST_PATH}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const fetchReview = async (
  providerId: number,
  token: string
): Promise<Review[]> => {
  const response = await axios.get<{ data: Review[] }>(
    `${MAIN_URL}${REVIEW_GET_BY_PROVIDER_PATH(providerId)}`,
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
    `${MAIN_URL}${REVIEW_GET_BY_RESERVATION_PATH(reservationId)}`,
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
    `${MAIN_URL}${REVIEW_PUT_PATH(reservationId)}`,
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
    `${MAIN_URL}${REVIEW_DELETE_PATH(reviewId)}`,
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
    `${MAIN_URL}${REVIEW_GET_LATEST_REVIEW(providerId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
