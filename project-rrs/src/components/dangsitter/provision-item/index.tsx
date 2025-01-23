import React from "react";
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

  const handleRejected = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = cookies.token;
    const confirmRejected = window.confirm("거절 하시겠습니까?");
    if (!confirmRejected) return;

    try {
      await updateReservationStatus(
        {
          reservationId: provision.reservationId,
          reservationStatus: ReservationStatus.REJECTED,
        },
        token
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("Failed to update provision status:", error);
    }
  };

  const handleAcceptance = async (e: React.MouseEvent) => {
    const token = cookies.token;
    const confirmAcceptance = window.confirm("수락 하시겠습니까?");
    if (!confirmAcceptance) return;

    try {
      await updateReservationStatus(
        {
          reservationId: provision.reservationId,
          reservationStatus: ReservationStatus.IN_PROGRESS,
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
                onClick={handleAcceptance}
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
                onClick={handleRejected}
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
