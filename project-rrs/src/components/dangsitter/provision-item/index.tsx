import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { ReservationStatus } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { updateReservationStatus } from "../../../apis/reservationApi";
import { useRefreshStore } from "../../../stores/refresh.store";
import "../../../styles/reservation/reservationItem.css";
import { ProvisionSummary } from "../../../types/provisionType";
import "../../../styles/reservation/reservationItem.css";

interface ProvisionItemProps {
  provision: ProvisionSummary;
  onClick: (id: number) => void;
  index: number;
}

export default function ProvisionItem({
  provision,
  onClick,
  index,
}: ProvisionItemProps) {
  const [cookies] = useCookies(["token"]);
  const incrementRefreshKey = useRefreshStore(
    (state) => state.incrementRefreshKey
  );

  const formatStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "수락 대기";
      case "IN_PROGRESS":
        return "예약 진행중";
      case "REJECTED":
        return "예약 거절";
      case "CANCELLED":
        return "예약 취소";
      case "COMPLETED":
        return "예약 완료";
      default:
        return "알 수 없음";
    }
  };

  const handleStatusChange = async (status: ReservationStatus) => {
    const token = cookies.token;
    let confirmationMessage = "";
    let newStatus: ReservationStatus = ReservationStatus.PENDING; // 초기값을 PENDING으로 설정
  
    if (status === ReservationStatus.IN_PROGRESS) {
      confirmationMessage = "수락 하시겠습니까?";
      newStatus = ReservationStatus.IN_PROGRESS;
    } else if (status === ReservationStatus.REJECTED) {
      confirmationMessage = "거절 하시겠습니까?";
      newStatus = ReservationStatus.REJECTED;
    }
  
    const isConfirmed = window.confirm(confirmationMessage);
    if (!isConfirmed) return;
  
    console.log("Changing status to:", newStatus); 
    
    try {
      await updateReservationStatus(
        {
          reservationId: provision.reservationId,
          reservationStatus: newStatus, // newStatus가 PENDING에서 올바르게 변경됨
        },
        token
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("Failed to update provision status:", error);
    }
  };

  return (
    <>
      <div className="reservation-item">
        <div
          className="reservation-info"
          onClick={() => onClick(provision.reservationId)}
        >
          <div>{index}</div>
          <div>{provision.reservationStartDate}</div>
          <div>{provision.reservationEndDate}</div>
          <div>{provision.nickname}</div>
          <div>{formatStatus(provision.reservationStatus)}</div>
        </div>

        <div className="reservation-actions">
          {provision.reservationStatus === "PENDING" && (
            <>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleStatusChange(ReservationStatus.IN_PROGRESS)} 
                size="medium"
                sx={{
                  fontFamily: "Pretendard",
                  borderRadius: "15px",
                }}
              >
                수락
              </Button>

              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleStatusChange(ReservationStatus.REJECTED)} 
                size="medium"
                sx={{
                  fontFamily: "Pretendard",
                  borderRadius: "15px",
                  marginLeft: "10px",
                }}
              >
                거절
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
