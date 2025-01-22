import React, { useState, useEffect } from "react";
import { Box, Button, Modal, Rating, TextField } from "@mui/material";
import { useCookies } from "react-cookie";
import {
  createReview,
  deleteReview,
  fetchReviewByReservationId,
  updateReviewByReservationId,
} from "../../../apis/reviewAPi";
import { useRefreshStore } from "../../../stores/refreshStore";
import "../../../styles/review/reviewDetailModal.css";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  reservationId: number;
  isEditing: boolean;
  providerNickname: string;
}

export default function ReviewModal({
  open,
  onClose,
  reservationId,
  isEditing,
  providerNickname,
}: ReviewModalProps) {
  const [cookies] = useCookies(["token"]);
  const [reviewScore, setReviewScore] = useState<number | null>(0);
  const [reviewContent, setReviewContent] = useState<string>("");
  const [reviewId, setReviewId] = useState<number | null>(null); // 리뷰 ID 저장
  const incrementRefreshKey = useRefreshStore(
    (state) => state.incrementRefreshKey
  );

  useEffect(() => {
    const loadReview = async () => {
      if (isEditing) {
        try {
          const token = cookies.token;
          const review = await fetchReviewByReservationId(reservationId, token);
          if (review) {
            setReviewScore(review.reviewScore || 0);
            setReviewContent(review.reviewContent || "");
            setReviewId(review.reviewId); // 리뷰 ID 저장
          }
        } catch (e) {
          console.error("Failed to fetch review:", e);
        }
      } else {
        setReviewScore(0);
        setReviewContent("");
        setReviewId(null);
      }
    };

    if (open) {
      loadReview();
    }
  }, [open, reservationId, isEditing, cookies.token]);

  const reviewContentChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReviewContent(e.target.value);
  };

  const handleCreateReview = async () => {
    const token = cookies.token;
    const data = {
      reservationId,
      reviewScore: reviewScore || 0,
      reviewContent,
    };

    try {
      await createReview(data, token);
      onClose();
      alert("리뷰가 생성되었습니다.");
      incrementRefreshKey();
    } catch (e) {
      console.error("Failed to submit review:", e);
    }
  };

  const deleteReviewHandler = async () => {
    console.log(reviewId);
    const token = cookies.token;
    if (!reviewId) {
      alert("리뷰 ID가 존재하지 않습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteReview(reviewId, token);
      alert("리뷰가 삭제되었습니다.");
      onClose();
      incrementRefreshKey();
    } catch (e) {
      console.error("Failed to delete review:", e);
      alert("리뷰 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleUpdateReview = async () => {
    const token = cookies.token;
    const data = {
      reviewScore: reviewScore || 0,
      reviewContent,
    };

    try {
      await updateReviewByReservationId(reservationId, data, token);
      onClose();
      alert("리뷰가 수정되었습니다.");
    } catch (e) {
      console.error("Failed to submit review:", e);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <div className="review-wrapper">
          {isEditing ? (
            <>
              <div className="review-title">
                <h2>리뷰 수정</h2>
                <div>
                  <span>
                    <strong>{providerNickname}</strong>님 에게 리뷰를
                    남겨주세요.
                  </span>
                </div>
                <Rating
                  name="simple-controlled"
                  value={reviewScore}
                  precision={0.5}
                  size="large"
                  onChange={(event, newReviewScore) => {
                    setReviewScore(newReviewScore);
                  }}
                />
              </div>
              <TextField
                className="review-textfield"
                label="리뷰 내용을 적어주세요!"
                maxRows={6}
                multiline
                variant="standard"
                value={reviewContent}
                onChange={reviewContentChangeHandler}
              />
              <div className="review-buttons">
                <Button
                  onClick={handleUpdateReview}
                  variant="outlined"
                  size="small"
                  className="review-button"
                  color="primary"
                >
                  확인
                </Button>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  size="small"
                  className="cancel-button"
                  color="error"
                >
                  취소
                </Button>
                <Button
                  onClick={deleteReviewHandler}
                  variant="outlined"
                  size="small"
                  className="delete-button"
                  color="error"
                >
                  리뷰 삭제
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="review-title">
                <h2>리뷰 작성</h2>
                <span>
                  <strong>{providerNickname}</strong>님 에게 리뷰를 남겨주세요.
                </span>
                <Rating
                  name="review-modal-star"
                  value={reviewScore}
                  precision={0.5}
                  size="large"
                  onChange={(event, newReviewScore) => {
                    setReviewScore(newReviewScore);
                  }}
                />
              </div>
              <TextField
                className="review-textfield"
                label="리뷰 내용을 적어주세요!"
                multiline
                maxRows={6}
                variant="standard"
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
              />
              <div className="review-buttons">
                <Button
                  onClick={handleCreateReview}
                  variant="outlined"
                  size="small"
                  className="review-button"
                  color="primary"
                >
                  확인
                </Button>
                <Button
                  onClick={onClose}
                  variant="outlined"
                  size="small"
                  className="cancel-button"
                  color="warning"
                >
                  취소
                </Button>
              </div>
            </>
          )}
        </div>
      </Box>
    </Modal>
  );
}
