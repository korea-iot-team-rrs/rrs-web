import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/useAuthStore";
import LoginModal from "../../../components/LoginModal";
import "../../../styles/customerSupport/CustomerSupportMain.css";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import CallIcon from "@mui/icons-material/Call";
import csBottomImg from '../../../assets/images/cs-bottom-img.jpg';

export default function CustomerSupportMain() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handleCloseModal = () => {
    setShowLoginModal(false);
  };
  const GoMyCSBtnHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      navigate("/inquiry_and_report/list");
    }
  };
  return (
    <>
      {showLoginModal && <LoginModal onClose={handleCloseModal} />}
      <div className="cs-main-wrapper">
        <div className="cs-main-for-bgc">
          <h2>고객 상담</h2>
          <div className="cs-main-container">
            <div className="cs-main-item-01">
              <div className="cs-main-contact">
                <h3>전화 상담</h3>
                <div className="call-icon">
                  <CallIcon />
                  &nbsp;070-1234-1234
                </div>
              </div>
              <p>
                평일 |&nbsp; 11:00 ~ 18:00 <br />
                점심시간 | &nbsp;13:00 ~ 14:00 <br />
                (주말/공휴일 휴무)
              </p>
              <p>
                고객문의:&nbsp;
                <a href="mailto:rrsmain@gmail.com ">rrsmain@gmail.com</a>
              </p>
            </div>
            <div className="cs-main-item-02">
              <h3>1대 1 문의하기</h3>
              <p>궁금하신 점을 남겨주시면 상담원이 답변을 도와드려요.</p>
              <Button
                variant="contained"
                onClick={GoMyCSBtnHandler}
                sx={{
                  height: "100px",
                  fontFamily: "Pretendard",
                  fontSize: "28px",
                  backgroundColor: "#3da1ff",
                  borderRadius: "15px",
                }}
              >
                나의 고객센터 바로가기&nbsp;
                <ArrowCircleRightIcon fontSize="large" />
              </Button>
            </div>
          </div>
          <div className="cs-bottom-img">
            <img src={csBottomImg} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
