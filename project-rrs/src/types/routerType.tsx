<<<<<<< HEAD
import { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuth.store";
=======
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/useAuth.store';
>>>>>>> develop

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean; // true: 로그인 필요, false: 비로그인 필요
  allowedRoles?: string[]; // 특정 역할만 접근 가능
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  allowedRoles = [],
}) => {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  // 로그인이 필요한 페이지인데 비로그인 상태
  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 비로그인이 필요한 페이지인데 로그인 상태 (예: 로그인, 회원가입 페이지)
  if (!requireAuth && isLoggedIn) {
    return <Navigate to="/main" replace />;
  }

  // 특정 역할이 필요한 페이지 체크
  if (
    allowedRoles.length > 0 &&
    (!user || !allowedRoles.includes(user.roles))
  ) {
    return <Navigate to="/main" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
