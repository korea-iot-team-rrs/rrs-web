import React from "react";
import "../../styles/SignUpModal.css";

interface SignUpCompleteModalProps {
  onClose: () => void;
}

const SignUpCompleteModal: React.FC<SignUpCompleteModalProps> = ({
  onClose,
}) => {
  return (
    <div className="signUpCompleteModalOverlay">
      <div className="signUpCompleteModalContainer">
        <h2 className="signUpCompleteModalTitle">회원가입 완료</h2>

        <div className="signUpCompleteButtonContainer">
          <button
            onClick={onClose}
            className="signUpCompleteModalButton signUpConfirmButton"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpCompleteModal;
