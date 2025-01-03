import React, { useState } from "react";
import { Reservation } from "../../../../types/reservationType";
import { Button } from "@mui/material";

export default function ReservationItem({
  reservation,
  onClick,
}: {
  reservation: Reservation;
  onClick: (id: number) => void;
}) {
  return (
    <>
      <div
        onClick={() => onClick(reservation.reservationId)}
        style={{
          cursor: "pointer",
          padding: "10px",
          border: "1px solid #ccc",
          marginBottom: "10px",
          borderRadius: "5px",
        }}
      >
        <p>
          <strong>Memo:</strong> {reservation.reservationMemo}
        </p>
        <p>
          <strong>Start Date:</strong> {reservation.reservationStartDate}
        </p>
        <p>
          <strong>End Date:</strong> {reservation.reservationEndDate}
        </p>
      </div>
    </>
  );
}
