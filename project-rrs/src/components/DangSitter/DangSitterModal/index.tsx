import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "../../../styles/PetSitterModal.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import userImg from "../../../assets/images/userDog.jpg";
import ReviewListModal from "../Review/ReviewListModal";
import { IoCloseCircle } from "react-icons/io5";
import { boxStyle } from "../../../styles/DangSitterCommon";
import { DangSitter } from "../../../types/reservationType";
import { Review } from "../../../types/reviewType";
import { fetchLatestReview } from "../../../apis/review";
import { useCookies } from "react-cookie";

interface DangSitterModalProps {
  open: boolean;
  onClose: () => void;
  petSitterProps: DangSitter;
}

export default function DangSitterModal({
  open,
  onClose,
  petSitterProps,
}: DangSitterModalProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [latesetReview, setLatesetReview] = useState<Review>({
    reviewId: 0,
    userId: 0,
    reservationId: 0,
    profileImageUrl: "example.jpg",
    username: "알 수 없음",
    userNickname: "알 수 없음",
    reviewCreatedAt: new Date(),
    reviewScore: 0,
    reviewContent: "리뷰 내용이 없습니다.",
  });

  const viewMoreReviewButtonHandler = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setReviewModalOpen(false);
  };

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      fetchLatestReview(petSitterProps.providerId, token)
        .then((response) => {
          if (response) {
            setLatesetReview(response);
          }
        })
        .catch((err) => console.error("Failed to fetch reviews", err));
    }
  }, [petSitterProps.providerId]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...boxStyle }}>
          <div className="DangSitterModalheader">
            <button onClick={onClose}>
              <IoCloseCircle size={30} />
            </button>
            <div className="dangSitterInfo">
              <span className="name">{petSitterProps.providerNickname}</span>
              <br />
              <span className="id">{petSitterProps.providerUsername}</span>
            </div>

            <div className="dangSitterImg">
              <img src={petSitterProps.profileImageUrl} alt="댕시터 이미지" />
            </div>

            <div className="providerDetailAvgReview">
              <Rating
                value={petSitterProps.avgReviewScore || 0}
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
              <span>{petSitterProps.providerIntroduction}</span>
            </div>
          </div>

          <div className="latestReview">
            <div className="userInfo">
              <div>
                <div className="userImg">
                  <img
                    src={latesetReview.profileImageUrl}
                    alt="댕시터 이미지"
                  />
                </div>
                <div>
                  <span className="userName">{latesetReview.userNickname}</span>
                  <br />
                  <span className="userId">{latesetReview.username}</span>
                </div>
              </div>

              <div>
                <Rating
                  precision={0.5}
                  name="providerLatestReview"
                  value={latesetReview.reviewScore || 0}
                  readOnly
                  size="large"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                  sx={{
                    color: "#ffa200",
                  }}
                />
                <div className="userReviewContent">
                  <span>
                    {latesetReview.reviewContent || "소개정보가 없습니다."}
                  </span>
                </div>
              </div>
            </div>

            <div className="moreBtn">
              <div style={{ display: "flex", alignItems: "center" }}>
                <span>리뷰 더보기</span>
                <IconButton
                  aria-label="view more reviews"
                  size="small"
                  sx={{ borderRadius: "10px", marginLeft: "8px" }}
                  onClick={viewMoreReviewButtonHandler}
                  className="viewMoreBtn"
                >
                  <MoreVertIcon />
                </IconButton>
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <ReviewListModal
        open={reviewModalOpen}
        onClose={handleReviewModalClose}
        dangSitterName={petSitterProps.providerNickname}
        providerId={petSitterProps.providerId}
      />
    </>
  );
}
