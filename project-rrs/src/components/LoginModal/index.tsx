import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LoginModal.css";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/main");
    onClose();
  };

  return (
    <div className="loginModalOverlay">
      <div className="loginModalContainer">
        <button
          onClick={handleCancel}
          className="closeButton"
          aria-label="닫기 버튼"
        >
          &times;
        </button>

        <h2 className="loginModalTitle">로그인이 필요한 서비스입니다.</h2>

        <div className="buttonContainer">
          <button
            onClick={handleConfirm}
            className="loginModalButton confirmButton"
          >
            확인
          </button>
          <button
            onClick={handleCancel}
            className="loginModalButton cancelButton"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
