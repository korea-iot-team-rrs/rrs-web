import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Reservation, ReservationStatus } from "../../../../types/reservationType";
import { fetchReservation } from "../../../../apis/reservationApi";
import { useLocation } from "react-router-dom";

export default function ReservationUserDetail() {
  const [cookies] = useCookies(["token"]);
  const location = useLocation();
  const [reservation, setReservation] = useState<Reservation>({
    reservationId: 0,
    userId: 0,
    providerId: 0,
    reservationStartDate: "",
    reservationEndDate: "",
    reservationStatus: ReservationStatus.PENDING,
  });

  const { reservationId } = location.state || {};

  useEffect(() => {
    const fetchReservationData = async () => {
      const token = cookies.token;
      if (!token) {
        console.error("Token not found");
        return;
      }

      if (!reservationId) {
        console.error("Reservation ID not found in location.state");
        return;
      }

      try {
        const fetchedReservation = await fetchReservation(reservationId, token);
        setReservation(fetchedReservation);
      } catch (e) {
        console.error("Failed to fetch reservation", e);
      }
    };

    fetchReservationData();
  }, [cookies.token, reservationId]);

  return (
    <>
      <p>Reservation ID: {reservation.reservationId}</p>
      <p>
        Reservation Status: {ReservationStatus[reservation.reservationStatus]}
      </p>
    </>
  );
}
