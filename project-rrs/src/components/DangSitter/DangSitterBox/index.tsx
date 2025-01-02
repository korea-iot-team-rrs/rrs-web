import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "../../../styles/DangSitter.css";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import DangSitterModal from "../DangSitterModal";
import { DangSitter } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { fetchOneProviderInfo } from "../../../apis/providerApi";

interface DangSitterProps {
  providerId: number;
}

export default function DangSitterBox({ providerId }: DangSitterProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [cookies] = useCookies(["token"]);
  const [petSitter, setPetSitter] = useState<DangSitter>({
    providerId: 0,
    profileImageUrl: "",
    providerNickname: "",
    providerUsername: "",
    providerIntroduction: "",
    avgReviewScore: 0,
  });

  const toggleSelected = () => {
    setIsSelected(!isSelected);
  };

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const token = cookies.token;
    if (token && providerId) {
      fetchOneProviderInfo(providerId, token)
        .then((petSitter) => setPetSitter(petSitter))
        .catch((err) => console.error("Failed to fetch PetSitter", err));
    }
  }, [providerId, cookies]);

  return (
    <>
      <div
        className={`dangSitterWrapper ${isSelected ? "selected" : ""}`}
        onClick={toggleSelected}
      >
        <div className="dangSitterContainer">
          <div className="leftContent">
            <div className="dangSitterImg">
              <img src={petSitter.profileImageUrl} alt="댕시터 이미지" />
            </div>
            <div className="dangSitterInfo">
              <div className="dangSitterReviewStar">
                <Rating
                  name="reviewStar"
                  value={petSitter.avgReviewScore}
                  precision={0.5}
                  readOnly
                  size="small"
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </div>
              <div>
                <span className="name">{petSitter.providerNickname}</span>
                <span className="id">{petSitter.providerUsername}</span>
              </div>
              <span
                className="gotoPetSitterProfile"
                onClick={handleModalOpen}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#1976d2",
                }}
              >
                <span>프로필 보러가기 &nbsp;</span>
                <FaArrowCircleRight size={18} />
              </span>
            </div>
          </div>
          <div className="rightContent">
            <span>{petSitter.providerIntroduction}</span>
          </div>
        </div>
      </div>
      <DangSitterModal
        open={modalOpen}
        onClose={handleModalClose}
        petSitterProps={petSitter}
      />
    </>
  );
}
