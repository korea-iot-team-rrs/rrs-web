import React, { useState } from 'react'
import { Reservation, ReservationStatus } from '../../../../types/reservationType';
import { Button } from '@mui/material';

export default function ReservationItem({ reservation, onClick }: { reservation: Reservation; onClick: (id: number) => void }) {
    const [isCompleted, setIsCompleted] = useState<ReservationStatus>(ReservationStatus.PENDING);
    return <>
        <li
          key={reservation.reservationId}
          onClick={() => onClick(reservation.reservationId)}
          style={{
            cursor: "pointer",
            padding: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
          }}
        >
          <p><strong>ID:</strong> {reservation.reservationId}</p>
          <p><strong>DangSitterNickName:</strong> {reservation.providerInfo.providerNickname}</p>
          <p><strong>Start Date:</strong> {reservation.reservationStartDate}</p>
          <p><strong>End Date:</strong> {reservation.reservationEndDate}</p>
          <p><strong>Status:</strong> {reservation.reservationStatus}</p>
          <Button className={
            switch 
          }>
            
          </Button>
        </li>
        </>
}