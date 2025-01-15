import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MAIN_URL, PROVISION_PATH } from "../../../constants";
import {
  Pet,
  Provision,
  ReservationStatus,
  UserInfo,
} from "../../../types/provisionType";
import { useCookies } from "react-cookie";
// import { fetchProvision } from "../../../apis/provisionApi";
import ReservationUserInfo from "../../../components/DangSitter/ReservationUserInfo";
import { Button, Chip } from "@mui/material";
import "../../../styles/reservation/ReservationUserDetail.css";
import axios from "axios";

export default function ProvisionDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const PROVISION_API_URL = `${MAIN_URL}${PROVISION_PATH}`;
  const {reservationId} = useParams();
  const [provision, setProvision] = useState<Provision | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchProvision = async () => {
      try {
        const response = await axios.get(`${PROVISION_API_URL}/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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
    return <p>로딩 중...</p>; // 로딩 중 표시
  }
  
//   const { id } = useParams<{ id: string }>();
//   
//   const [reservationMemo, setReservationMemo] = useState<string>("");
//   const [provision, setProvision] = useState<Provision>({
//     reservationId: 0,
//     providerId: 0,
//     reservationStartDate: "",
//     reservationEndDate: "",
//     reservationStatus: ReservationStatus.PENDING,
//     reservationMemo: "",
//     userInfo: {
//       userId: 0,
//       nickname: "",
//       phone: "",
//       address: "",
//       profileImageUrl: "",
//     },
//     pets: [],
// });
  
//   const [user, setUser] = useState<UserInfo>({
//     userId: 0,
//     nickname: "",
//     phone: "",
//     address: "",
//     profileImageUrl: "",
//   });

//   const [pets, setPets] = useState<Pet[]>([]);

//   useEffect(() => {
//     const token = cookies.token;
//     if (!token) return console.error("Token not found");

//     fetchProvisionData(Number(id), token);
//   }, [cookies.token, id]);

//   const fetchProvisionData = async (reservationId: number, token: string) => {
//     try {
//       const response = await fetchProvision(reservationId, token);
//       console.log("ReservationData!: ", response);

//       setProvision(response);

//       console.log(response.userInfo);
//       setPets(response.pets);

//       setReservationMemo(response.reservationMemo || "");
//     } catch (e) {
//       console.error("Failed to fetch provision", e);
//     }
//   };

//   const formatStatus = (status: ReservationStatus) => {
//     const statusMessages: Record<ReservationStatus, string> = {
//       [ReservationStatus.PENDING]: "댕시터의 예약 수락을 기다리는 중입니다.",
//       [ReservationStatus.IN_PROGRESS]: "현재 예약이 진행중입니다.",
//       [ReservationStatus.REJECTED]: "예약이 성사되지 않았습니다.",
//       [ReservationStatus.CANCELLED]: "예약이 취소 되었습니다.",
//       [ReservationStatus.COMPLETED]: "예약이 완료 되었습니다.",
//     };
//     return statusMessages[status] || "알 수 없음";
//   };

  const goBack = () => {
    window.history.back();
  }

  return (
    <>
    <div>
      <div>
        <h1>사용자 정보</h1>
        {provision ? (
          <div>
<p>User nickName: {provision.nickname}</p>
          <p>User Phone: {provision.phone}</p>
          <p>User address: {provision.address}</p>
          <p>User img: {provision.profileImageUrl}</p>
          <p>User petname: {provision.petName}</p>
          </div>
          
        ) : (
          <p>provision 없음</p>
        )}
      </div>
    </div>
      {/* <div className="reservation-detail-wrapper">
        <div className="reservation-header">
          <div className="reservation-detail-title">
            <span>예약 날짜</span>
          </div>
          <div>
            <p>시작일</p>
            <Chip
              label={provision.reservationStartDate}
              color="primary"
              variant="outlined"
              sx={{ fontFamily: "Pretendard" }}
            ></Chip>
            <p>종료일</p>
            <Chip
              label={provision.reservationEndDate}
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
          <p>{formatStatus(ReservationStatus[provision.reservationStatus])}</p>
        </div>

        <div className="reservation-detail-title">
          <span>사용자 정보</span>
          <p>이름: {user.nickname}</p>
          <p>전화번호: {user.phone}</p>
          <p>주소: {user.address}</p>
          {user.profileImageUrl && (
            <img src={user.profileImageUrl} alt="Profile" />
          )}
        </div>

        <div className="reservation-detail-title">
          <span>반려동물 정보</span>
        </div>
        <div className="pet-info">
          {pets.map((pet) => (
            <div key={pet.petId} className="pet">
              <h3>{pet.petName}</h3>
              <p>성별: {pet.petGender}</p>
              <p>생일: {pet.petBirthDate}</p>
              <p>체중: {pet.petWeight} kg</p>
              <p>추가 정보: {pet.petAddInfo || "없음"}</p>
              {pet.petImageUrl && (
                <img src={pet.petImageUrl} alt={pet.petName} />
              )}
            </div>
          ))}
        </div>

        <div className="reservation-detail-bottom">
          <div className="reservation-detail-title">
            <span>댕시터에게 전하는 말</span>
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
          type="button" 
          onClick={goBack}>
            확인
        </Button>
      </div> */}
    </>
  );
}
