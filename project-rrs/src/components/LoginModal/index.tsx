import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate('/login');
  };

  const handleCancel = () => {
    navigate('/');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', zIndex: 1000, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
      <h2>로그인이 필요한 서비스입니다.</h2>
      <button onClick={handleConfirm}>확인</button>
      <button onClick={handleCancel} style={{ marginLeft: '10px' }}>취소</button>
    </div>
  );
};

export default LoginModal;
