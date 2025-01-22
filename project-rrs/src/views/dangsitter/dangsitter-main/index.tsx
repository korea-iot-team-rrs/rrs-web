import React, { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { AntSwitch } from "../../../styles/dangsitter/dangsitterCommon";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/dangSitter/DangSitterMain.css";
import { TfiArrowTopRight } from "react-icons/tfi";
import LoginModal from "../../../components/login-modal";
import useAuthStore from "../../../stores/useAuth.store";
export default function DangSitterMain() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [toggleChecked, setToggleChecked] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
  const toggleHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleChecked(event.target.checked);
  };
  return (
    <>
      {showLoginModal && <LoginModal onClose={handleCloseModal} />}
      <div className="dang-sitter-main-wrapper">
        <div className="dang-sitter-title">
          <Typography fontSize={30} fontFamily={"Pretendard"} fontWeight={700}>
            댕시터
          </Typography>
        </div>
        <div className="dang-sitter-toggle">
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography fontFamily={"Pretendard"} fontWeight={700}>
              이용자
            </Typography>
            <AntSwitch
              inputProps={{ "aria-label": "ant design" }}
              checked={toggleChecked}
              onChange={toggleHandleChange}
            />
            <Typography fontFamily={"Pretendard"} fontWeight={700}>
              댕시터
            </Typography>
          </Stack>
        </div>

        <div
          className={
            toggleChecked
              ? "dang-sitter-container01 provider"
              : "dang-sitter-container01 user"
          }
          onClick={() =>
            isLoggedIn
              ? navigate(
                  toggleChecked
                    ? `/dang-sitter/provider`
                    : "/users/dang-sitter/reservations/write"
                )
              : setShowLoginModal(true)
          }
        >
          <h2 className="reservation-title">
            {toggleChecked ? "등록 및 수정하기" : "예약 하기"}
          </h2>
          <TfiArrowTopRight size={40} />
        </div>
        <div
          className={
            toggleChecked
              ? "dang-sitter-container02 provider"
              : "dang-sitter-container02 user"
          }
          onClick={() =>
            isLoggedIn
              ? navigate(
                  toggleChecked
                    ? "/dang-sitter/reservations"
                    : "/users/dang-sitter/reservations"
                )
              : setShowLoginModal(true)
          }
        >
          <h2 className="reservation-title">
            {toggleChecked ? "제공 목록" : "예약 목록"}
          </h2>
          <TfiArrowTopRight size={40} />
        </div>
        <div
          className={
            toggleChecked
              ? "dang-sitter-container03 provider"
              : "dang-sitter-container03 user"
          }
          onClick={() => navigate(toggleChecked ? "/" : "/")}
        >
          <h2 className="reservation-title">
            {toggleChecked ? "댕시터란?" : "댕시터란?"}
          </h2>
        </div>
        <div
          className={
            toggleChecked
              ? "dang-sitter-container04 provider"
              : "dang-sitter-container04 user"
          }
          onClick={() => navigate(toggleChecked ? "/" : "/usage-guide")}
        >
          <h2 className="reservation-title">
            {toggleChecked ? "댕시터 제공자 가이드" : "댕시터 이용자 가이드"}
          </h2>
        </div>
      </div>
    </>
  );
}
