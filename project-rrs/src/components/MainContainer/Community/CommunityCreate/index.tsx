import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../../stores/auth.store';

export default function CommunityCreate() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 로그인 상태가 아닐 경우 바로 로그인 페이지로 리다이렉트
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 로그인 상태에서만 컨텐츠를 렌더링
  return (
    <div>
      <h1>커뮤니티 글쓰기</h1>
      {/* 글쓰기 폼 구현 필요 */}
    </div>
  );
}
