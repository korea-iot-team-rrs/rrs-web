import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "../../../styles/DangSitter.css";
import { Box, Button, Modal, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import dangSitterImg from "../../../assets/images/community.jpg";
import DangSitterModal from "../PetSitterModal";

const value = 3.5;
const providerIntroduction = "쪼꼬의 뒷바라지를 하던 실력으로 강아지를 사랑으로 돌보겠습니다.";

export default function DangSitter() {
  const [isSelected, setIsSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleSelected = () => {
    setIsSelected(!isSelected);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className={isSelected ? "selected" : ""} onClick={toggleSelected}>
        <div className="dangSitterContainer">
          <div className="leftContent">
            <div className="dangSitterImg">
              <img src={dangSitterImg} alt="댕시터 이미지" />
            </div>
            <div className="dangSitterInfo">
              <div className="dangSitterReviewStar">
                <Rating
                  name="reviewStar"
                  value={value}
                  precision={0.5}
                  readOnly
                  size="small"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </div>
              <div>
                <span className="name">쪼꼬의도비</span>
                <span className="id">qwer1234</span>
              </div>
              <Button
                className="gotoPetSitterProfile"
                onClick={handleModalOpen}
              >
                <span>
                  프로필 보러가기 &nbsp; 
                </span>
                <FaArrowCircleRight size={18} />
              </Button>
            </div>
          </div>
          <div className="rightContent">
            <span>
              {providerIntroduction}
            </span>
          </div>
        </div>
      </button>
      <DangSitterModal 
      open={modalOpen} 
      onClose={handleModalClose} 
      img = {dangSitterImg}
      introduction = {providerIntroduction}
      />
    </>
  );
}
