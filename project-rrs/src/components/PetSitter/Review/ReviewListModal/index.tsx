import { Box, Button, colors, Modal } from "@mui/material";
import "../../../../styles/ReviewListModal.css";
import { IoCloseCircle } from "react-icons/io5";
import { Review } from "../../../../types/review";
import { useState } from "react";
interface ReviewListModalProps {
  open: boolean;
  onClose: () => void;
  dangSitterName: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  pt: 10,
  px: 4,
  pb: 10,
};

export default function ReviewListModal({
  open,
  onClose,
  dangSitterName,
}: ReviewListModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={{ ...style }}>
          <div className="reviewListModalheader">
            <button>
              <IoCloseCircle size={30} onClick={onClose} />
            </button>
            <h2 id="reviewListTitle">
              댕시터<span style={{color: "#0085ff"}}>{dangSitterName}</span>에게 남겨진 리뷰 입니다.
            </h2>
          </div>
          <div className="reviewListModalbody">
            <ul className="reviews">
              {reviews.map((review, index) => (
                <li key={index}>
                  <div className="review">
                    <span>{review.reviewContent}</span>
                    <span>{review.reviewCreatedAt.toDateString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Box>
      </Modal>
    </>
  );
}
