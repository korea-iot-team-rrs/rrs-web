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
            <div className="dangSitterImg">
              <img src={img} alt="댕시터 이미지" />
            </div>

            <div>
              <span className="name">쪼꼬의도비</span>
              <br />
              <span className="id">qwer1234</span>
            </div>

            <div className="dangSitterInfo">
              <div className="avgReview">
                <Rating
                  name="providerAvgReview"
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
          <div>
                <Rating
                  name="providerAvgReview"
                  value={value}
                  precision={0.5}
                  readOnly
                  size="small"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
          </div>
          <div>
            <IconButton aria-label="delete" size="small">
              <MoreVertIcon />
            </IconButton>
          </div>
        </Box>
      </Modal>
    </>
  );
}
