import { Box, Modal, Rating } from "@mui/material";
import "../../../../styles/ReviewListModal.css";
import { IoCloseCircle } from "react-icons/io5";
import { Review } from "../../../../types/reviewType";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { fetchReview } from "../../../../apis/reviewAPi";
import { useCookies } from "react-cookie";
import Grid from "@mui/material/Grid2";
import { FaShieldDog } from "react-icons/fa6";
import { useDateStore } from "../../../../stores/daytransfer";

interface ReviewListModalProps {
  open: boolean;
  onClose: () => void;
  dangSitterName: string;
  providerId: number;
}

export default function ReviewListModal({
  open,
  onClose,
  dangSitterName,
  providerId,
}: ReviewListModalProps) {
  const [cookies] = useCookies(["token"]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const formatDate = useDateStore((state) => state.formatDateToKR);

  useEffect(() => {
    const token = cookies.token;
    if (token && providerId) {
      fetchReview(providerId, token)
        .then((review) => setReviews(review))
        .catch((err) => console.error("Failed to fetch reviews", err));
    }
  }, [providerId, cookies]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            bgcolor: "background.paper",
            borderRadius: "20px",
            border: "2px solid #000",
            boxShadow: 24,
            pt: 5,
            px: 10,
            pb: 15,
          }}
        >
          <div className="review-list-modal-header">
            <button onClick={onClose} className="close-button">
              <IoCloseCircle size={30} />
            </button>

            <p id="review-list-title">
              댕시터
              <span>
                <FaShieldDog size={30} color="#0085ff" /> {dangSitterName}
              </span>
              에 대한 리뷰
            </p>
          </div>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            className="review-list-container"
          >
            {reviews.map((review, index) => (
              <Grid size={6} key={index} sx={{border: "1px solid #e6e6e6", borderRadius: "15px", padding:"10px"}}>
                
                <div className="review-item">
                  <div className="review-item-header">
                    <div>
                      <Rating
                        name="review-star"
                        value={review.reviewScore}
                        precision={0.5}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon fontSize="inherit" />}
                        sx={{
                          color: "#ffa200",
                        }}
                      />
                      <div>
                        <span className="review-user-nickname">
                          {review.userNickname}
                        </span>
                        <span className="review-user-id">
                          {review.username}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="review-date">
                        {formatDate(review.reviewCreatedAt.toString())}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="review-content">{review.reviewContent}</p>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
    </>
  );
}
