import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchReservationList,
  reservationHasReview,
  updateReservaionStatus,
} from "../../../apis/reservationApi";
import { Reservation, ReservationStatus } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { Button } from "@mui/material";
import ReservationItem from "./ReservationItem";
import { useRefreshStore } from "../../../stores/refreshStore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReviewModal from "../Review/ReviewModal";

export default function ReservationList() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviewsStatus, setReviewsStatus] = useState<Record<number, string>>(
    {}
  );

  const [reviewModalData, setReviewModalData] = useState<{
    open: boolean;
    reservationId: number | null;
    isEditing: boolean;
  }>({ open: false, reservationId: null, isEditing: false });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 5; // 페이지당 항목 수

  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const incrementRefreshKey = useRefreshStore(
    (state) => state.incrementRefreshKey
  );

  const totalPages = Math.ceil(reservations.length / itemsPerPage); // 총 페이지 수
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = reservations.slice(startIndex, endIndex); // 현재 페이지의 데이터

  const openReviewModal = (reservationId: number, isEditing: boolean) => {
    setReviewModalData({ open: true, reservationId, isEditing });
  };

  const closeReviewModal = () => {
    setReviewModalData({ open: false, reservationId: null, isEditing: false });
  };

  const handleReviewButtonClick = (reservationId: number) => {
    const isEditing = reviewsStatus[reservationId] === "Y";
    openReviewModal(reservationId, isEditing);
  };

  useEffect(() => {
    const token = cookies.token;

    if (!token) {
      alert("Please log in.");
      setLoading(false);
      return;
    }

    const loadReservations = async () => {
      try {
        const data = await fetchReservationList(token);
        setReservations(data);

        const reviewStatuses = await Promise.all(
          data.map(async (reservation) => {
            const hasReview = await reservationHasReview(
              reservation.reservationId,
              token
            );
            return {
              id: reservation.reservationId,
              status: hasReview.reviewStatus,
            };
          })
        );

        const statusMap = reviewStatuses.reduce(
          (map, { id, status }) => ({ ...map, [id]: status }),
          {}
        );
        setReviewsStatus(statusMap);
      } catch {
        alert("Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [cookies.token, refreshKey]);

  const updateToCancelReservationBtnHandler = async (reservationId: number) => {
    const token = cookies.token;
    const data = {
      reservationId: reservationId,
      reservationStatus: ReservationStatus.CANCELLED,
    };

    const confirmCancel = window.confirm("정말 취소하시겠습니까?");
    if (!confirmCancel) return;

    if (token) {
      try {
        await updateReservaionStatus(data, token);

        incrementRefreshKey();
      } catch (error) {
        console.error("fail update reservaion status", error);
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading...</p>;
  if (reservations.length === 0) return <p>No reservations found.</p>;

  return (
    <>
      <h1>Reservation List</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {currentReservations.map((reservation) => (
          <li key={reservation.reservationId}>
            <div>
              <ReservationItem
                onClick={(id) => navigate(`/dang-sitter/reservations/${id}`)}
                reservation={reservation}
              />
            </div>

            {(reservation.reservationStatus === "PENDING" ||
              reservation.reservationStatus === "IN_PROGRESS") && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  updateToCancelReservationBtnHandler(reservation.reservationId)
                }
              >
                예약 취소
              </Button>
            )}

            {reservation.reservationStatus === "COMPLETED" && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  handleReviewButtonClick(reservation.reservationId)
                }
              >
                {reviewsStatus[reservation.reservationId] === "Y"
                  ? "리뷰 수정"
                  : "리뷰 쓰기"}
              </Button>
            )}
          </li>
        ))}
      </ul>

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Button
          variant="outlined"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
        >
          이전
        </Button>
        <span style={{ margin: "0 10px", lineHeight: "36px" }}>
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outlined"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
        >
          다음
        </Button>
      </div>
      {reviewModalData.open && (
        <ReviewModal
          open={reviewModalData.open}
          onClose={closeReviewModal}
          reservationId={reviewModalData.reservationId!}
          isEditing={reviewModalData.isEditing}
        />
      )}
    </>
  );
}
