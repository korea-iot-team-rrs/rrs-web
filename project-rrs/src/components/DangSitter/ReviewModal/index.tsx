import { Box, Button, Modal, Rating } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import {
  createReview,
  fetchReviewByReservationId,
  updateReviewByReservationId,
} from "../../../apis/reviewAPi";
import { useRefreshStore } from "../../../stores/refreshStore";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  reservationId: number;
  isEditing: boolean;
}

export default function ReviewModal({
  open,
  onClose,
  reservationId,
  isEditing,
}: ReviewModalProps) {
  const [cookies] = useCookies(["token"]);
  const [reviewScore, setReviewScore] = useState<number | null>(0);
  const [reviewContent, setReviewContent] = useState<string>("");
  const incrementRefreshKey = useRefreshStore((state) => state.incrementRefreshKey);

  useEffect(() => {
    const loadReview = async () => {
      if (isEditing) {
        try {
          const token = cookies.token;
          const review = await fetchReviewByReservationId(reservationId, token);
          if (review) {
            setReviewScore(review.reviewScore || 0);
            setReviewContent(review.reviewContent || "");
          }
        } catch (e) {
          console.error("Failed to fetch review:", e);
        }
      } else {
        setReviewScore(0);
        setReviewContent("");
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
      alert("리뷰가 생성 되었습니다.")
      incrementRefreshKey();
    } catch (e) {
      console.error("Failed to submit review:", e);
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
      alert("리뷰가 수정 되었습니다.")
    } catch (e) {
      console.error("Failed to submit review:", e);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        {isEditing ? (
          <>
            <h2>리뷰 수정</h2>
            <Rating
              name="simple-controlled"
              value={reviewScore}
              precision={0.5}
              size="large"
              onChange={(event, newReviewScore) => {
                setReviewScore(newReviewScore);
              }}
            />
            <textarea
              className="review-contents"
              value={reviewContent}
              onChange={reviewContentChangeHandler}
              rows={4}
              cols={50}
            />
            <Button onClick={handleUpdateReview} sx={{ marginTop: 2 }}>
              확인
            </Button>
          </>
        ) : (
          <>
            <h2>리뷰 작성</h2>
            <Rating
              name="simple-controlled"
              value={reviewScore}
              precision={0.5}
              size="large"
              onChange={(event, newReviewScore) => {
                setReviewScore(newReviewScore);
              }}
            />
            <textarea
              className="review-contents"
              placeholder="리뷰 내용을 적어주세요!"
              value={reviewContent}
              onChange={reviewContentChangeHandler}
              rows={4}
              cols={50}
            />
            <Button onClick={handleCreateReview} sx={{ marginTop: 2 , fontFamily: "Pretendard" ,fontWeight: "ExtraThin"}}>
              확인
            </Button>
          </>
        )}
        <Button onClick={onClose} sx={{ marginTop: 2, marginLeft: 1 }}>
          취소
        </Button>
      </Box>
    </Modal>
  );
}
