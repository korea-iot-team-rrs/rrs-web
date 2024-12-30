import React, { useState } from "react";
import { Box, Button, IconButton, Modal, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "../../../styles/PetSitterModal.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import userImg from "../../../assets/images/userDog.jpg";
import ReviewListModal from "../Review/ReviewListModal";
import { IoCloseCircle } from "react-icons/io5";

interface DangSitterModalProps {
  open: boolean;
  onClose: () => void;
  img: string;
  introduction: string;
  avgSocre: number;
}

interface UserOfLatestReview {
  userNickname: string;
  userId: string;
  userImg: string;
  reviewScore: number;
  reviewContent: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  pt: 2,
  px: 4,
  pb: 3,
};

export default function DangSitterModal({
  open,
  onClose,
  img,
  introduction,
  avgSocre,
}: DangSitterModalProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const viewMoreReviewButtonHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setReviewModalOpen(false);
  };
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...style }}>
          <div className="DangSitterModalheader">
            <button onClick={onClose}>
              <IoCloseCircle size={30}/>
            </button>
            <div className="dangSitterInfo">
              <span className="name">쪼꼬의도비</span>
              <br />
              <span className="id">qwer1234</span>
            </div>

            <div className="dangSitterImg">
              <img src={img} alt="댕시터 이미지" />
            </div>

            <div className="providerDetailAvgReview">
              <Rating
                value={avgSocre}
                precision={0.5}
                readOnly
                size="medium"
                emptyIcon={<StarIcon fontSize="inherit" />}
                sx={{
                  color: "#0099ff",
                }}
              />
            </div>

            <div className="providerIntroduction">
              <span>{introduction}</span>
            </div>
          </div>

          <div className="latestReview">
            <div className="userInfo">
              <div>
                <div className="userImg">
                  <img src={userImg} alt="댕시터 이미지" />
                </div>
                <div>
                  <span className="userName">회피핑</span>
                  <br />
                  <span className="userId">shy241113</span>
                </div>
              </div>

              <div>
                <Rating
                  name="providerLatestReview"
                  value={5}
                  precision={0.5}
                  readOnly
                  size="large"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{
                    color: "#ffa200",
                  }}
                />
                <div className="userReviewContent">
                  <span>
                    처음 서비스를 이용했는데 너무 만족스러웠어요! 돌봄
                    매니저님이 우리 강아지 성격까지 잘 이해해 주시고, 산책도
                    꼼꼼히 챙겨주셨어요. 중간중간 사진과 영상도 보내주셔서
                    안심했답니다. 또 이용할게요!
                  </span>
                </div>
              </div>
            </div>

            <div className="moreBtn">
              <IconButton
                aria-label="delete"
                size="small"
                sx={{ borderRadius: "10px" }}
                onClick={(e) => {
                  viewMoreReviewButtonHandler(e);
                  console.log("Button clicked!");
                }}
              >
                <span>리뷰 더보기</span>
                <MoreVertIcon />
              </IconButton>
              <ReviewListModal
                open={reviewModalOpen}
                onClose={handleReviewModalClose}
                dangSitterName= {"쪼꼬의 도비"}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
