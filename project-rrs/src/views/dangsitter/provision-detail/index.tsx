import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_URL, PROVISION_PATH, FILE_URL } from "../../../constants";
import { Provision, ReservationStatus } from "../../../types/provisionType";
import { Button, Chip } from "@mui/material";
import "../../../styles/reservation/reservationUserDetail.css";
import userDefaultImage from "../../../assets/images/dogIllust02.jpeg";
import petDefaultImage from "../../../assets/images/pet-default-profile.jpg";

export default function ProvisionDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const PROVISION_API_URL = `${MAIN_URL}${PROVISION_PATH}`;
  const { reservationId } = useParams();
  const [provision, setProvision] = useState<Provision | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const formatBirthDate = (petBirthDate: string) => {
    const year = petBirthDate.substring(0, 4);
    const month = petBirthDate.substring(4, 6);

    return `${year}년 ${month}월`;
  };

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchProvision = async () => {
      try {
        const response = await axios.get(
          `${PROVISION_API_URL}/${reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Provision: ", response.data.data);

        setProvision(response.data.data);
      } catch (error) {
        console.error("에러 발생:", error);
        alert("제공 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProvision();
  }, [cookies, navigate, reservationId]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

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

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <div></div>
      <div className="reservation-detail-wrapper">
        <div className="reservation-header">
          <div className="reservation-detail-title">
            <span>예약 날짜</span>
          </div>
          <div>
            <p>시작일</p>
            <Chip
              label={provision?.reservationStartDate}
              color="primary"
              variant="outlined"
              sx={{ fontFamily: "Pretendard" }}
            ></Chip>
            <p>종료일</p>
            <Chip
              label={provision?.reservationEndDate}
              color="primary"
              variant="outlined"
              sx={{ fontFamily: "Pretendard" }}
            ></Chip>
          </div>
        </div>

        {provision && (
          <>
            <div className="reservation-detail-title">
              <span>예약 현황</span>
            </div>
            <div className="reservation-detail-status">
              <p>
                {formatStatus(ReservationStatus[provision.reservationStatus])}
              </p>
            </div>
          </>
        )}

        {provision && provision.pets && provision.pets.length > 0 ? (
          <>
            <div className="reservation-detail-title">
              <span>사용자 정보</span>
              <img
                src={
                  provision.profileImageUrl
                    ? `${FILE_URL}${provision.profileImageUrl}`
                    : userDefaultImage
                }
                alt="프로필 이미지"
                onError={(e) => {
                  const imgElement = e.target as HTMLImageElement;
                  imgElement.src = userDefaultImage;
                }}
              />
              <p>닉네임: {provision.nickname}</p>
              <p>연락처: {provision.phone}</p>
              <p>주소: {provision.address}</p>
            </div>

            <div className="reservation-detail-title">
              <span>반려동물 정보</span>
            </div>

            <div className="pet-info">
              {provision.pets.map((pet, index) => (
                <div key={index} className="pet">
                  <img
                    src={
                      pet.petImageUrl
                        ? `${FILE_URL}${pet.petImageUrl}`
                        : petDefaultImage
                    }
                    alt="프로필 이미지"
                    onError={(e) => {
                      const imgElement = e.target as HTMLImageElement;
                      imgElement.src = petDefaultImage;
                    }}
                  />
                  <p>강아지 이름: {pet.petName}</p>
                  <p>성별: {Number(pet.petGender) === 0 ? "수컷" : "암컷"}</p>
                  <p>생년월일일: {formatBirthDate(pet.petBirthDate)}</p>
                  <p>몸무게: {pet.petWeight}</p>
                  <p>
                    중성화 여부: {Number(pet.petWeight) === 0 ? "아니오" : "예"}
                  </p>
                  <p>
                    추가 정보:{" "}
                    {pet.petAddInfo === null || " " ? "없음" : pet.petAddInfo}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>반려동물 정보가 없습니다.</p>
        )}

        {provision && (
          <>
            <div className="reservation-detail-bottom">
              <div className="reservation-detail-title">
                <span>댕시터에게 전하는 말</span>
              </div>
              <div className="memo">
                <p>{provision.reservationMemo}</p>
              </div>
            </div>
          </>
        )}

        <Button
          className="reservation-modify-btn"
          type="button"
          onClick={goBack}
        >
          확인
        </Button>
      </div>
    </>
  );
}
