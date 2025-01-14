import axios from "axios";
import { MAIN_URL, PROVISION_PATH } from "../constants";
import {
  Provision,
  ReservationStatus,
} from "../types/provisionType";

const RESERVATION_API_URL = `${MAIN_URL}${PROVISION_PATH}`;

export const fetchProvision = async (
  reservationId: number,
  token: string
): Promise<Provision> => {
  const response = await axios.get(`${RESERVATION_API_URL}/${reservationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data.data;
};

export const fetchProvisionList = async (
  token: string
): Promise<Provision[]> => {
  const response = await axios.get(`${RESERVATION_API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
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
