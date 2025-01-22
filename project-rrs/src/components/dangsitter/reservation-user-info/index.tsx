import React from "react";
import { Pet, User } from "../../../types/reservationType";
import "../../../styles/dangsitter/dangsitterUserInfo.css";

interface ReservationUserInfoProps {
  pets: Pet[];
  user: User;
}
const formatPhoneNumber = (phone: string) => {
  if (!phone) return "";
  const cleanPhone = phone.replace(/[^0-9]/g, ""); // 숫자만 추출
  if (cleanPhone.length <= 3) return cleanPhone;
  if (cleanPhone.length <= 7) {
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3)}`;
  }
  return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(
    3,
    7
  )}-${cleanPhone.slice(7)}`;
};

export default function ReservationUserInfo({
  pets,
  user,
}: ReservationUserInfoProps) {
  return (
    <>
      <div className="reservation-user-detail">
        <div className="reservation-userInfo-title">
          <span>사용자 정보</span>
        </div>
        <div className="reservation-userInfo-body">
          <div>
            <div className="info-about-my-dog">
              <span>내 강아지</span>
              <span>
                사용자의 정보가 알맞은지 확인해주세요! 올바르지 않다면
                마이페이지에서 수정 할 수 있습니다.
              </span>
              <div className="pet-info-container">
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <div key={pet.petId} className="pet-info">
                      <img
                        src={`http://localhost:4040/${
                          pet.petImageUrl || "file/default-profile.jpg"
                        }`}
                        alt="프로필 이미지"
                      />
                      <p>{pet.petName}</p>
                    </div>
                  ))
                ) : (
                  <div className="cant-not-find-dog">
                    <p>이용가능한 강아지가 없습니다. 강아지를 등록해 주세요.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="info-about-me">
              <span>핸드폰 번호</span>
              <span>{formatPhoneNumber(user.phone)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
