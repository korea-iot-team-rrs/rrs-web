import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchProvisionList,
} from "../../../apis/provisionApi";
import { Reservation } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { Button, Pagination } from "@mui/material";
import ReservationItem from "../../../components/DangSitter/ReservationItem";
import { useRefreshStore } from "../../../stores/refreshStore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "../../../styles/reservation/ReservationList.css";
import { Provision } from "../../../types/provisionType";

export default function ProviderList() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [provisions, setProvisions] = useState<Provision[]>([]);
  const [filteredProvisions, setFilteredProvisions] = useState<
    Provision[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const totalPages = Math.ceil(filteredProvisions.length / itemsPerPage);

  const currentReservations = filteredProvisions.slice(
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

    const loadProvisions = async () => {
      try {
        const response = await fetchProvisionList(token);
        const sortedProvisions = response.sort(
          (a, b) =>
            new Date(b.reservationStartDate).getTime() -
            new Date(a.reservationStartDate).getTime()
        );
        setProvisions(sortedProvisions);
        setFilteredProvisions(sortedProvisions);
      } catch {
        alert("Failed to load provisions.");
      } finally {
        setLoading(false);
      }
    };

    loadProvisions();
  }, [cookies.token, refreshKey]);

  // 필터링
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("조회 시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    const filtered = provisions.filter((provisions) => {
      const start = dayjs(provisions.reservationStartDate);
      return (
        (start.isAfter(startDate, "day") || start.isSame(startDate, "day")) &&
        (start.isBefore(endDate, "day") || start.isSame(endDate, "day"))
      );
    });

    setFilteredProvisions(filtered);
    setCurrentPage(1);
  };

  // 페이지네이션
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
        <h2>나의 제공 목록</h2>
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
        <div>시작일</div>
        <div>종료일</div>
        <div>이용자</div>
        <div>예약 상태</div>
      </div>
      <ul className="reservation-list-items">
        {filteredProvisions.length === 0 ? (
          <li className="no-reservations">No provisions found.</li>
        ) : (
          currentReservations.map((reservation, index) => {
            const descendingIndex =
            filteredProvisions.length -
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
