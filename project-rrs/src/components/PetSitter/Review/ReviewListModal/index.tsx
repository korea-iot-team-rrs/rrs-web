import { Box, Modal, Rating } from "@mui/material";
import "../../../../styles/ReviewListModal.css";
import { IoCloseCircle } from "react-icons/io5";
import { Review } from "../../../../types/review";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { fetchReview } from "../../../../apis/review";
import { useCookies } from "react-cookie";
import Grid from "@mui/material/Grid2";
import { FaShieldDog } from "react-icons/fa6";

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
  const reviewList = [1, 2, 3, 4];

  useEffect(() => {
    const token = cookies.token;
    if (token && providerId) {
      fetchReview(providerId, token)
        .then((review) => setReviews(review))
        .catch((err) => console.error("Failed to fetch reviews", err));
    }
  }, [cookies.token, providerId]);

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
            댕시터 <span><FaShieldDog size={30} color="#0085ff"/> {dangSitterName}</span>에 대한 리뷰
            </p>
          </div>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={6}>
              <div className="review-item">
                <div className="review-item-header">
                  <div>
                    <Rating
                      name="review-star"
                      value={4.5}
                      precision={0.5}
                      readOnly
                      size="large"
                      emptyIcon={<StarIcon fontSize="inherit" />}
                    />
                    <div>
                      <span className="review-user-nickname">회피핑</span>
                      <span className="review-user-id">shy241113</span>
                    </div>
                  </div>

                  <div>
                    <span className="review-date">2024-12-30 12:30</span>
                  </div>
                </div>
                <div>
                  <hr />
                  <p className="review-content">
                    처음 서비스를 이용했는데 너무 만족스러웠어요! 돌봄
                    매니저님이 우리 강아지 성격까지 잘 이해해 주시고, 산책도
                    꼼꼼히 챙겨주셨어요. 중간중간 사진과 영상도 보내주셔서
                    안심했답니다. 또 이용할게요!
                  </p>
                </div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Modal>

      {/* <div className="review-item">
          <span className="review-user-id">
          shy241113
            {review.userId}
            </span>
          <p className="review-content">
            {review.reviewContent}
            </p>
          <span className="review-date">
            {new Date(review.reviewCreatedAt).toLocaleDateString()}
          </span>
          <Rating
            name="review-star"
            value={review.reviewScore}
            precision={0.5}
            readOnly
            size="small"
            emptyIcon={<StarIcon fontSize="inherit" />}
          />
        </div> */}
    </>
  );
}
