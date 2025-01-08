// DeleteModal.tsx
import React from "react";
import "../../styles/DeleteModal.css";

interface DeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <button onClick={onClose} className="closeButton" aria-label="닫기 버튼">
          &times;
        </button>

        <h2 className="modalTitle">정말 삭제하시겠습니까?</h2>

        <div className="buttonContainer">
          <button onClick={onConfirm} className="modalButton confirmButton">
            확인
          </button>
          <button onClick={onClose} className="modalButton cancelButton">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
