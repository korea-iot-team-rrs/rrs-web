import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/find-user-info/loginModal.css";

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/login");
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="loginModalOverlay">
      <div className="loginModalContainer">
        <button
          onClick={handleCancel}
          className="loginCloseButton"
          aria-label="닫기 버튼"
        >
          &times;
        </button>

        <h2 className="loginModalTitle">로그인이 필요한 서비스입니다.</h2>

        <div className="loginButtonContainer">
          <button
            onClick={handleConfirm}
            className="loginModalButton loginConfirmButton"
          >
            확인
          </button>
          <button
            onClick={handleCancel}
            className="loginModalButton loginCancelButton"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
