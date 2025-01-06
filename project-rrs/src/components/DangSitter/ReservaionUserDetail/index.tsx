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
    providerId: 0,
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

  const memoInputChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReservationMemo(e.target.value);
  };

  const reservationModifyBtnHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const token = cookies.token;
    setReservationMemo(reservationMemo);
    try {
      await updateMemo(reservation.reservationId, { reservationMemo }, token);
      alert("수정이 완료되었습니다.");
      navigate("/dang-sitter/reservations");
    } catch (e) {
      console.error("Failed to update reservation memo", e);
      alert("예약 대기중일때만 메모 수정이 가능합니다.");
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "PENDING":
        return "댕시터의 예약 수락을 기다리는 중입니다.";
      case "IN_PROGRESS":
        return "현재 예약이 진행중입니다.";
      case "REJECTED":
        return "예약이 성사되지 않았습니다.";
      case "CANCELLED":
        return "예약이 취소 되었습니다.";
      case "COMPLETED":
        return "예약이 완료 되었습니다.";
      default:
        return "알 수 없음";
    }
  };

  useEffect(() => {
    const fetchReservationData = async () => {
      const token = cookies.token;
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const fetchedReservation = await fetchReservation(Number(id), token);
        setReservation(fetchedReservation);
        setReservationMemo(fetchedReservation.reservationMemo || "");
      } catch (e) {
        console.error("Failed to fetch reservation", e);
      }
    };

    fetchReservationData();
  }, [cookies.token, id]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = cookies.token;
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const userData = await fetchUserInfo();
        setUser(userData);
      } catch (e) {
        console.error("Failed to fetch user info", e);
      }
    };

    fetchUser();
  }, [cookies.token]);

  useEffect(() => {
    const fetchUserPets = async () => {
      const token = cookies.token;
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const petsData = await fetchPets(token);
        setPets(petsData);
      } catch (e) {
        console.error("Failed to fetch pets", e);
      }
    };

    fetchUserPets();
  }, [cookies.token]);

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
        <DangSitterBox providerId={reservation.providerId} />
        <ReservationUserInfo pets={pets} user={user} />
        <div className="reservation-detail-bottom">
          <div className="reservation-detail-title">
            <span>댕시터에게 전하고 싶은 말</span>
          </div>
          <textarea
            id="reservation-memo"
            className="memo"
            value={reservationMemo}
            onChange={(e) => memoInputChangeHandler(e)}
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
