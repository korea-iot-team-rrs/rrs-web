import React from "react";
import "../../styles/DeleteModal.css";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="deleteModalOverlay">
      <div className="deleteModalContainer">
        <button
          onClick={onClose}
          className="deleteCloseButton"
          aria-label="닫기 버튼"
        >
          &times;
        </button>

        <h2 className="deleteModalTitle">정말 삭제하시겠습니까?</h2>

        <div className="deleteButtonContainer">
          <button
            onClick={onConfirm}
            className="deleteModalButton deleteConfirmButton"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="deleteModalButton deleteCancelButton"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
