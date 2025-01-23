import axios from "axios";
import {
  MAIN_URL,
  RESERVATION_ALL_GET_BY_USER_PATH,
  RESERVATION_GET_AVAILABLE_PROVIDER,
  RESERVATION_GET_PATH,
  RESERVATION_HAS_REVIEW_PATH,
  RESERVATION_POST_PATH,
  RESERVATION_PUT_PATH,
  RESERVATION_PUT_STATUS_PATH,
} from "../constants";
import {
  HasReviewResult,
  Reservation,
  ReservationStatus,
} from "../types/reservationType";

export const createReservation = async (
  data: {
    reservationStartDate: string;
    reservationEndDate: string;
    providerId: number;
    reservationMemo: string | null;
  },
  token: string
) => {
  const response = await axios.post(
    `${MAIN_URL}${RESERVATION_POST_PATH}`,
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

export const fetchReservationList = async (
  token: string
): Promise<Reservation[]> => {
  const response = await axios.get(
    `${MAIN_URL}${RESERVATION_ALL_GET_BY_USER_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const fetchReservation = async (
  reservationId: number,
  token: string
): Promise<Reservation> => {
  const response = await axios.get(
    `${MAIN_URL}${RESERVATION_GET_PATH(reservationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const fetchprovidersByDate = async (
  data: { startDate: string; endDate: string },
  token: string
) => {
  const response = await axios.post(
    `${MAIN_URL}${RESERVATION_GET_AVAILABLE_PROVIDER}`,
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

export const updateMemo = async (
  reservationId: number,
  data: { reservationMemo: string },
  token: string
): Promise<void> => {
  const response = await axios.put(
    `${MAIN_URL}${RESERVATION_PUT_PATH(reservationId)}`,
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

export const updateReservationStatus = async (
  data: {
    reservationId: number,
    reservationStatus: ReservationStatus;
  },
  token: string
) => {
  const response = await axios.put(
    `${MAIN_URL}${RESERVATION_PUT_STATUS_PATH}`,
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
export const reservationHasReview = async (
  reservationId: number,
  token: string
): Promise<HasReviewResult> => {
  const response = await axios.get(
    `${MAIN_URL}${RESERVATION_HAS_REVIEW_PATH(reservationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
