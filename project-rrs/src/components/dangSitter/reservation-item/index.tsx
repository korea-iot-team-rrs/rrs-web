import React, { useState } from "react";
import { Button } from "@mui/material";
import { Reservation, ReservationStatus } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { updateReservaionStatus } from "../../../apis/reservationApi";
import { useRefreshStore } from "../../../stores/refresh.store";
import ReviewModal from "../review-modal";
import "../../../styles/reservation/reservationItem.css";

interface ReservationItemProps {
  reservation: Reservation;
  onClick: (id: number) => void;
  reviewStatus: string; // "Y" or "N"
  index: number;
}

export default function ReservationItem({
  reservation,
  onClick,
  reviewStatus,
  index,
}: ReservationItemProps) {
  const [cookies] = useCookies(["token"]);
  const incrementRefreshKey = useRefreshStore(
    (state) => state.incrementRefreshKey
  );
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleCancel = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = cookies.token;
    const confirmCancel = window.confirm("정말 취소하시겠습니까?");
    if (!confirmCancel) return;

    try {
      await updateReservaionStatus(
        {
          reservationId: reservation.reservationId,
          reservationStatus: ReservationStatus.CANCELLED,
        },
        token
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const handleReviewButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(reviewStatus === "Y");
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
  };

  return (
    <>
      <div className="reservation-item">
        <div
          className="reservation-info"
          onClick={() => onClick(reservation.reservationId)}
        >
          <div>{index}</div>
          <div>{reservation.reservationStartDate}</div>
          <div>{reservation.reservationEndDate}</div>
          <div>{reservation.providerInfo.providerNickname}</div>
          <div>{formatStatus(reservation.reservationStatus)}</div>
          <div className="reservation-actions">
            {reservation.reservationStatus === "PENDING" && (
              <Button
                variant="outlined"
                color="warning"
                onClick={handleCancel}
                size="medium"
                sx={{
                  fontFamily: "Pretendard",
                  borderRadius: "15px",
                }}
              >
                예약 취소
              </Button>
            )}
            {reservation.reservationStatus === "COMPLETED" && (
              <Button
                variant="outlined"
                color={reviewStatus === "Y" ? "primary" : "success"}
                onClick={handleReviewButtonClick}
                size="medium"
                sx={{
                  fontFamily: "Pretendard",
                  borderRadius: "15px",
                }}
              >
                {reviewStatus === "Y" ? "리뷰 수정" : "리뷰 쓰기"}
              </Button>
            )}
          </div>
        </div>
      </div>
      {reviewModalOpen && (
        <ReviewModal
          open={reviewModalOpen}
          onClose={closeReviewModal}
          reservationId={reservation.reservationId}
          isEditing={isEditing}
          providerNickname={reservation.providerInfo.providerNickname}
        />
      )}
    </>
  );
}
