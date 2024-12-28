import React from "react";
import { Box, Button, Icon, IconButton, Modal, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import "../../../styles/PetSitterModal.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface DangSitterModalProps {
  open: boolean;
  onClose: () => void;
  img: string;
  introduction: string;
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

const value = 3.5;

export default function DangSitterModal({
  open,
  onClose,
  img,
  introduction,
}: DangSitterModalProps) {
  const viewMoreReviewButtonHandler = () => {};

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="header">
            <div>
              <span className="name">쪼꼬의도비</span>
              <br />
              <span className="id">qwer1234</span>
            </div>

            <div className="dangSitterInfo">
              <div className="providerDetailAvgReview">
                <Rating
                  value={value}
                  precision={0.5}
                  readOnly
                  size="small"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </div>
            </div>
          </div>

          <div>
            <span>{introduction}</span>
          </div>

          <div className="latestReview">
            <div className="dangSitterImg">
              <img src={img} alt="댕시터 이미지" />
            </div>

            <div className="userInfo">
              <span className="userName">거북목예약자</span>
              <br />
              <span className="userId">kdh241113</span>
            </div>

            <Rating
              name="providerLatestReview"
              value={value}
              precision={0.5}
              readOnly
              size="small"
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
            <span>
              처음 서비스를 이용했는데 너무 만족스러웠어요! 돌봄 매니저님이 우리
              강아지 성격까지 잘 이해해 주시고, 산책도 꼼꼼히 챙겨주셨어요.
              중간중간 사진과 영상도 보내주셔서 안심했답니다. 또 이용할게요!
            </span>
            <div className="moreBtn">
              <IconButton aria-label="delete" size="small">
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}
