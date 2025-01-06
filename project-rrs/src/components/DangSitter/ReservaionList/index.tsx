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
import ReservationItem from "../ReservationItem";
import { useRefreshStore } from "../../../stores/refreshStore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ReviewModal from "../ReviewModal";
import dayjs, { Dayjs } from "dayjs";

export default function ReservationList() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [reviewsStatus, setReviewsStatus] = useState<Record<number, string>>(
    {}
  );

  const [reviewModalData, setReviewModalData] = useState<{
    open: boolean;
    reservationId: number | null;
    isEditing: boolean;
  }>({ open: false, reservationId: null, isEditing: false });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const incrementRefreshKey = useRefreshStore(
    (state) => state.incrementRefreshKey
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [endMinDate, setEndMinDate] = useState<Dayjs | undefined>(undefined);

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
        const response = await fetchReservationList(token);
        setReservations(response);
        setFilteredReservations(response);

        const reviewStatuses = await Promise.all(
          response.map(async (reservation) => {
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

  useEffect(() => {
    if (startDate) {
      setEndMinDate(startDate.add(1, "day"));
    } else {
      setEndMinDate(undefined);
    }
  }, [startDate]);

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("조회 시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    const filtered = reservations.filter((reservation) => {
      const start = dayjs(reservation.reservationStartDate);
      return (
        (start.isAfter(startDate, "day") || start.isSame(startDate, "day")) &&
        (start.isBefore(endDate, "day") || start.isSame(endDate, "day"))
      );
    });

    setFilteredReservations(filtered);
    setCurrentPage(1);
  };


  const updateToCancelReservationBtnHandler = async (reservationId: number) => {
    const token = cookies.token;
    const confirmCancel = window.confirm("정말 취소하시겠습니까?");
    if (!confirmCancel) return;

    try {
      await updateReservaionStatus(
        {
          reservationId: reservationId,
          reservationStatus: ReservationStatus.CANCELLED,
        },
        token
      );
      incrementRefreshKey();
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Reservation List</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
          label="조회 시작 날짜"
          value={startDate}
          onChange={(newStartDate) => setStartDate(newStartDate)}
        />
        <DatePicker
          label="조회 종료 날짜"
          value={endDate}
          minDate={endMinDate}
          onChange={(newEndDate) => setEndDate(newEndDate)}
        />
      </LocalizationProvider>
      <Button variant="contained" color="primary" onClick={handleSearch}>
        조회
      </Button>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredReservations.length === 0 ? (
          <li>No reservations found.</li>
        ) : (
          currentReservations.map((reservation) => (
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
                    updateToCancelReservationBtnHandler(
                      reservation.reservationId
                    )
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
          ))
        )}
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
