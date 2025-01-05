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
import { Button } from "@mui/material";
import CreateReviewModal from "../ReviewModal";

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

  const memoInputChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReservationMemo(e.target.value);
  };

  const reservationModifyBtnHandler = async(
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const token = cookies.token;
    setReservationMemo(reservationMemo);
    try {
      await updateMemo(reservation.reservationId, { reservationMemo }, token);
      alert("수정이 완료되었습니다.")
      navigate('/dang-sitter/reservations');
    } catch (e) {
      console.error("Failed to update reservation memo", e);
      alert("예약 대기중일때만 메모 수정이 가능합니다.")
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
      <p>{reservation.reservationStartDate}</p>
      <p>{reservation.reservationEndDate}</p>
      <DangSitterBox providerId={reservation.providerId} />
      <ReservationUserInfo pets={pets} user={user} />
      <div>
        <label htmlFor="reservationMemo">메모</label>
        <textarea
          id="reservationMemo"
          className="reservation-userInfo-reservationMemo"
          value={reservationMemo}
          onChange={(e) => memoInputChangeHandler(e)}
          rows={4}
          cols={50}
        />
        <Button onClick={reservationModifyBtnHandler}>저장</Button>
      </div>
      <p>
        Reservation Status: {ReservationStatus[reservation.reservationStatus]}
      </p>
    </>
  );
}
