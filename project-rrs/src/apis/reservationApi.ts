import axios from "axios";
import { MAIN_URL, RESERVATION_PATH } from "../constants";
import {
  HasReviewResult,
  Reservation,
  ReservationStatus,
} from "../types/reservationType";

const RESERVATION_API_URL = `${MAIN_URL}${RESERVATION_PATH}`;

export const fetchprovidersByDate = async (
  data: { startDate: string; endDate: string },
  token: string
) => {
  const response = await axios.post(
    `${RESERVATION_API_URL}/get-provider`,
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

export const createReservation = async (
  data: {
    reservationStartDate: string;
    reservationEndDate: string;
    providerId: number;
    reservationMemo: string | null;
  },
  token: string
) => {
  const response = await axios.post(`${RESERVATION_API_URL}/write`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const fetchReservation = async (
  reservationId: number,
  token: string
): Promise<Reservation> => {
  const response = await axios.get(`${RESERVATION_API_URL}/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const fetchReservationList = async (
  token: string
): Promise<Reservation[]> => {
  const response = await axios.get(`${RESERVATION_API_URL}/mine/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const reservationHasReview = async (
  reservationId: number,
  token: string
): Promise<HasReviewResult> => {
  const response = await axios.get(
    `${RESERVATION_API_URL}/has-review/${reservationId}`,
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
    `${RESERVATION_API_URL}/${reservationId}`,
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

export const updateReservaionStatus = async (
  data: {
    reservationId: number;
    reservationStatus: ReservationStatus;
  },
  token: string
) => {
  const response = await axios.put(
    `http://localhost:4040/api/v1/reservations/update-reservation-status`,
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
