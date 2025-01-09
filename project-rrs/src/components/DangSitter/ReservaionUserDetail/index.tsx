import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Pet,
  Reservation,
  ReservationStatus,
  User,
} from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { fetchReservation, updateMemo } from "../../../apis/reservationApi";
import DangSitterBox from "../DangSitterBox";
import ReservationUserInfo from "../ReservationUserInfo";
import { fetchUserInfo } from "../../../apis/userInfo";
import { fetchPets } from "../../../apis/petApi";
import { Button, Chip } from "@mui/material";

import "../../../styles/reservation/ReservationUserDetail.css";

export default function ReservationUserDetail() {
  const { id } = useParams<{ id: string }>();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [reservationMemo, setReservationMemo] = useState<string>("");
  const [reservation, setReservation] = useState<Reservation>({
    reservationId: 0,
    userId: 0,
    reservationStartDate: "",
    reservationEndDate: "",
    reservationStatus: ReservationStatus.PENDING,
    reservationMemo: "",
    providerInfo: {
      providerId: 0,
      profileImageUrl: "",
      providerNickname: "",
      providerUsername: "",
      providerIntroduction: "",
      avgReviewScore: 0,
    },
  });

  const [user, setUser] = useState<User>({
    username: "",
    nickname: "",
    phone: "",
    address: "",
  });

  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const token = cookies.token;
    if (!token) return console.error("Token not found");
    
    fetchReservationData(Number(id), token);
    fetchUserData(token);
    fetchPetsData(token);
  }, [cookies.token, id]);

  const fetchReservationData = async (reservationId: number, token: string) => {
    try {
      const response = await fetchReservation(reservationId, token);
      setReservation(response);
      setReservationMemo(response.reservationMemo || "");
      console.log("reservation.providerId", response);
    } catch (e) {
      console.error("Failed to fetch reservation", e);
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userData = await fetchUserInfo();
      setUser(userData);
    } catch (e) {
      console.error("Failed to fetch user info", e);
    }
  };

  const fetchPetsData = async (token: string) => {
    try {
      const petsData = await fetchPets(token);
      setPets(petsData);
    } catch (e) {
      console.error("Failed to fetch pets", e);
    }
  };

  const reservationModifyBtnHandler = async () => {
    const token = cookies.token;
    try {
      await updateMemo(reservation.reservationId, { reservationMemo }, token);
      alert("수정이 완료되었습니다.");
      navigate("/dang-sitter/reservations");
    } catch (e) {
      console.error("Failed to update reservation memo", e);
      alert("예약 대기중일때만 메모 수정이 가능합니다.");
    }
  };

  const formatStatus = (status: ReservationStatus) => {
    const statusMessages: Record<ReservationStatus, string> = {
      [ReservationStatus.PENDING]: "댕시터의 예약 수락을 기다리는 중입니다.",
      [ReservationStatus.IN_PROGRESS]: "현재 예약이 진행중입니다.",
      [ReservationStatus.REJECTED]: "예약이 성사되지 않았습니다.",
      [ReservationStatus.CANCELLED]: "예약이 취소 되었습니다.",
      [ReservationStatus.COMPLETED]: "예약이 완료 되었습니다.",
    };
    return statusMessages[status] || "알 수 없음";
  };

  return (
    <>
      <div className="reservation-detail-wrapper">
        <div className="reservation-header">
          <div className="reservation-detail-title">
            <span>예약 날짜</span>
          </div>
          <div>
            <p>시작일</p>
            <Chip
              label={reservation.reservationStartDate}
              color="primary"
              variant="outlined"
              sx={{ fontFamily: "Pretendard" }}
            ></Chip>
            <p>종료일</p>
            <Chip
              label={reservation.reservationEndDate}
              color="primary"
              variant="outlined"
              sx={{ fontFamily: "Pretendard" }}
            ></Chip>
          </div>
        </div>

        <div className="reservation-detail-title">
          <span>예약 현황</span>
        </div>
        <div className="reservation-detail-status">
          <p>
            {formatStatus(ReservationStatus[reservation.reservationStatus])}
          </p>
        </div>

        <div className="reservation-detail-title">
          <span>예약한 댕시터</span>
        </div>
        <DangSitterBox providerId={reservation.providerInfo.providerId} />
        <ReservationUserInfo pets={pets} user={user} />
        <div className="reservation-detail-bottom">
          <div className="reservation-detail-title">
            <span>댕시터에게 전하고 싶은 말</span>
          </div>
          <textarea
            id="reservation-memo"
            className="memo"
            value={reservationMemo}
            onChange={(e) => setReservationMemo(e.target.value)}
            rows={4}
            cols={50}
          />
        </div>
        <Button
          className="reservation-modify-btn"
          onClick={reservationModifyBtnHandler}
        >
          저장
        </Button>
      </div>
    </>
  );
}
