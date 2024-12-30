import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "../../../styles/DangSitter.css";
import { Button, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import dangSitterImg from "../../../assets/images/community.jpg";
import DangSitterModal from "../DangSitterModal";

const value = 3.5;
const providerIntroduction =
  "쪼꼬를 돌보며 쌓아온 정성과 사랑을 바탕으로, 소중한 강아지를 책임감 있게, 그리고 진심 어린 마음으로 정성을 다해 보살피겠습니다.";

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
                <span>프로필 보러가기 &nbsp;</span>
                <FaArrowCircleRight size={18} />
              </Button>
            </div>
          </div>
          <div className="rightContent">
            <span>{providerIntroduction}</span>
          </div>
        </div>
      </button>
      <DangSitterModal
        open={modalOpen}
        onClose={handleModalClose}
        img={dangSitterImg}
        introduction={providerIntroduction}
        avgSocre={value}
      />
    </>
  );
}
