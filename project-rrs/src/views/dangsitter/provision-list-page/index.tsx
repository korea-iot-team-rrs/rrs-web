import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Button, Pagination } from "@mui/material";
import { useRefreshStore } from "../../../stores/refresh.store";
import { MAIN_URL, PROVISION_PATH } from "../../../constants";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "../../../styles/reservation/reservationList.css";
import { ProvisionList, ProvisionSummary } from "../../../types/provisionType";
import axios from "axios";
import ProvisionItem from "../../../components/dangsitter/provision-item";

export default function ProvisionListPage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [provisions] = useState<ProvisionList>({
    provisionList: [],
  });
  const [filteredProvisions, setFilteredProvisions] = useState<
    ProvisionSummary[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const refreshKey = useRefreshStore((state) => state.refreshKey);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const PROVISIONLIST_API_URL = `${MAIN_URL}${PROVISION_PATH}`;
  const totalPages = Math.ceil(filteredProvisions.length / itemsPerPage);

  const currentReservations = filteredProvisions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchProvisionList = async () => {
      setLoading(true);

      try {
        const response = await axios.get(`${PROVISIONLIST_API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const provisionsData = response.data.data;

        const sortedProvisions = provisionsData.sort(
          (a: ProvisionSummary, b: ProvisionSummary) =>
            new Date(b.reservationStartDate).getTime() -
            new Date(a.reservationStartDate).getTime()
        );

        console.log("Provision: ", response.data.data);

        setFilteredProvisions(sortedProvisions);
      } catch (error) {
        console.error("에러 발생:", error);
        alert("제공 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvisionList();
  }, [cookies, navigate, refreshKey]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 필터링
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("조회 시작 날짜와 종료 날짜를 모두 선택해주세요.");
      return;
    }

    const filtered = provisions.provisionList.filter((provisions) => {
      const start = dayjs(provisions.reservationStartDate);
      return (
        (start.isAfter(startDate, "day") || start.isSame(startDate, "day")) &&
        (start.isBefore(endDate, "day") || start.isSame(endDate, "day"))
      );
    });

    setFilteredProvisions(filtered);
    setCurrentPage(1);
  };

  if (loading) return <p>Loading...</p>;

  // 페이지네이션
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

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
              height: "100%",
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
          currentReservations.map((provision, index) => {
            const descendingIndex =
              filteredProvisions.length -
              (currentPage - 1) * itemsPerPage -
              index;

            return (
              <li key={provision.reservationId} className="reservation-item">
                <ProvisionItem
                  provision={provision}
                  onClick={(id) => navigate(`/dang-sitter/reservations/${id}`)}
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
