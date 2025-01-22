import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./layouts/Header";
import MainContainer from "./views/Main";
import Login from "./views/Auth/Login";
import SignUpMain from "./views/Auth/SignUp/SignUpMain";
import CommunityCreateView from "./views/CommunityVIew/community-create-view";
import DangSitterMain from "./views/DangSitter/DangSitterMain";
import Footer from "./layouts/Footer";
import ProtectedRoute from "./types/routerType";
import { useAuthCheck } from "./stores/useAuthCheck";

function App() {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>; // 또는 로딩 스피너 컴포넌트
  }

  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Routes>
          {/* Public Routes */}
          <Route path="/main" element={<MainContainer />} />

          {/* Auth Routes (비로그인 상태에서만 접근 가능) */}
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute requireAuth={false}>
                <SignUpMain />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes (로그인 필요) */}
          <Route
            path="/community/write"
            element={
              <ProtectedRoute>
                <CommunityCreateView />
              </ProtectedRoute>
            }
          />

          {/* Role-based Protected Routes */}
          <Route
            path="/users/dang-sitter/*"
            element={
              <ProtectedRoute allowedRoles={["ROLE_PROVIDER"]}>
                <DangSitterMain />
              </ProtectedRoute>
            }
          />

          {/* 나머지 라우트들... */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
