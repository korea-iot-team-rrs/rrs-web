import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchReservationList,
  reservationHasReview,
} from "../../../apis/reservationApi";
import { Reservation } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import ReservationItem from "../../../components/dangsitter/reservation-item";
import { Button, Pagination } from "@mui/material";
import { useRefreshStore } from "../../../stores/refresh.store";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "../../../styles/reservation/reservationList.css";

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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        const sortedReservations = response.sort(
          (a, b) =>
            new Date(b.reservationStartDate).getTime() -
            new Date(a.reservationStartDate).getTime()
        );
        setReservations(sortedReservations);
        setFilteredReservations(sortedReservations);

        const reviewStatuses = await Promise.all(
          sortedReservations.map(async (reservation) => {
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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="reservation-list-container">
      <div className="reservation-list-title">
        <h2>나의 예약 목록</h2>
        <div className="reservation-date-picker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="date-picker-detail">
              <span>시작일</span>
              <DatePicker
                value={startDate}
                onChange={(newStartDate) => setStartDate(newStartDate)}
                sx={{
                  all: "unset",
                }}
              />
            </div>
            <div className="date-picker-detail">
              <span>종료일</span>
              <DatePicker
                value={endDate}
                minDate={startDate?.add(1, "day")}
                onChange={(newEndDate) => setEndDate(newEndDate)}
                sx={{
                  all: "unset",
                }}
              />
            </div>
          </LocalizationProvider>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleSearch}
            sx={{
              borderRadius: "10px",
              fontFamily: "Pretendard",
              height: "100%"
            }}
          >
            조회
          </Button>
        </div>
      </div>
      <div className="reservation-list-header">
        <div>목차</div>
        <div>시작 시간</div>
        <div>종료 시간</div>
        <div>댕시터</div>
        <div>예약 상태</div>
      </div>
      <ul className="reservation-list-items">
        {filteredReservations.length === 0 ? (
          <li className="no-reservations">No reservations found.</li>
        ) : (
          currentReservations.map((reservation, index) => {
            const descendingIndex =
              filteredReservations.length -
              (currentPage - 1) * itemsPerPage -
              index;

            return (
              <li key={reservation.reservationId} className="reservation-item">
                <ReservationItem
                  reservation={reservation}
                  reviewStatus={reviewsStatus[reservation.reservationId] || "N"}
                  onClick={(id) =>
                    navigate(`/users/dang-sitter/reservations/${id}`)
                  }
                  index={descendingIndex}
                />
              </li>
            );
          })
        )}
      </ul>
      <div className="pagination-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
