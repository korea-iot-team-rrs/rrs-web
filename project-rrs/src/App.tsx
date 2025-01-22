import "./App.css";
import { CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useAuthCheck } from "./stores/useAuthCheck.store";
import Main from "./views/main";
import Header from "./layouts/header";
import Login from "./views/auth/login";
import ProtectedRoute from "./types/routerType";
import SnsSuccess from "./views/auth/login/SnsSuccess";
import SignUpMain from "./views/auth/sign-up/SignUpMain";
import RrsSignUp from "./views/auth/sign-up/RrsSignUp";
import AuthRedirectHandler from "./views/auth/sign-up/AuthRedirectHandler";
import FindId from "./views/auth/find-id";
import FindPassword from "./views/auth/find-password";
import FinduserInfo from "./views/auth/find-user-Info";
import MyPageView from "./views/my-page";
import AnnouncementListView from "./views/announcement-view/announcement-list-view";
import AnnouncementView from "./views/announcement-view";
import UsageGuideListView from "./views/announcement-view/usage-guide-list-view";
import UsageGuideDetailView from "./views/announcement-view/usage-guide-detail-view";
import EventListView from "./views/announcement-view/event-list-view";
import EventDetailView from "./views/announcement-view/event-detail-view";
import PetDiaryMain from "./views/pet-diary/pet-diary-main";
import CommunityListView from "./views/community-vIew/community-list-view";
import CommunityDetailView from "./views/community-vIew/community-detail-view";
import CommunityCreateView from "./views/community-vIew/community-create-view";
import CommunityEditView from "./views/community-vIew/community-edit-view";
import DangSitterMain from "./views/dangsitter/dangsitter-main";
import ReservationList from "./views/dangsitter/reservaion-list";
import ReservationForm from "./views/dangsitter/reservation-form";
import ReservationUserDetail from "./views/dangsitter/reservaion-user-detail";
import ProvisionListPage from "./views/dangsitter/provision-list-page";
import ProvisionDetail from "./views/dangsitter/provision-detail";
import ProviderUpdate from "./views/dangsitter/provider-update";
import CustomerSupportMain from "./views/customer-support/customer-support-main";
import CustomerSupportList from "./views/customer-support/customer-support-list";
import CustomerSupportDetail from "./views/customer-support/customer-support-detail";
import CustomerSupportWrite from "./views/customer-support/customer-support-write";
import CustomerSupportUpdate from "./views/customer-support/customer-support-update";
import PetRoad from "./views/pet-road";
import Footer from "./layouts/footer";

function App() {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <div className="app-container">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/main" element={<Main />} />
            {/* 인증 관련 라우트  */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/sns-success"
              element={
                <ProtectedRoute requireAuth={false}>
                  <SnsSuccess />
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
            <Route
              path="/signup/rrs"
              element={
                <ProtectedRoute requireAuth={false}>
                  <RrsSignUp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auth"
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthRedirectHandler />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-id/:token"
              element={
                <ProtectedRoute requireAuth={false}>
                  <FindId />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-password/:token"
              element={
                <ProtectedRoute requireAuth={false}>
                  <FindPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-user-info"
              element={
                <ProtectedRoute requireAuth={false}>
                  <FinduserInfo />
                </ProtectedRoute>
              }
            />

            {/* 유저 개인 페이지 관련 라우트 */}
            <Route
              path="/user/*"
              element={
                <ProtectedRoute>
                  <MyPageView />
                </ProtectedRoute>
              }
            />

            <Route path="/announcements" element={<AnnouncementListView />} />
            <Route path="/announcements/:id" element={<AnnouncementView />} />
            <Route path="/usage-guide" element={<UsageGuideListView />} />
            <Route path="/usage-guide/:id" element={<UsageGuideDetailView />} />
            <Route path="/events" element={<EventListView />} />
            <Route path="/events/:id" element={<EventDetailView />} />

            <Route path="/pet-diary" element={<PetDiaryMain />} />

            <Route path="/community" element={<CommunityListView />} />
            <Route path="/community/:id" element={<CommunityDetailView />} />
            <Route path="/community/write" element={<CommunityCreateView />} />
            <Route
              path="/community/edit/:communityId"
              element={<CommunityEditView />}
            />

            {/* 댕시터 관련 라우터 */}
            <Route path="/dang-sitter" element={<DangSitterMain />} />
            <Route
              path="/users/dang-sitter/reservations"
              element={<ReservationList />}
            />
            <Route
              path="/users/dang-sitter/reservations/write"
              element={<ReservationForm />}
            />
            <Route
              path="/users/dang-sitter/reservations/:id"
              element={
                <ProtectedRoute>
                  <ReservationUserDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dang-sitter/provider"
              element={
                <ProtectedRoute>
                  <ProviderUpdate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dang-sitter/reservations"
              element={<ProvisionListPage />}
            />

            <Route
              path="/dang-sitter/reservations/:reservationId"
              element={<ProvisionDetail />}
            />

            <Route
              path="/inquiry-and-report"
              element={<CustomerSupportMain />}
            />
            <Route
              path="/inquiry-and-report/list"
              element={<CustomerSupportList />}
            />
            <Route
              path="/inquiry-and-report/:id"
              element={
                <ProtectedRoute>
                  <CustomerSupportDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inquiry-and-report/write"
              element={
                <ProtectedRoute>
                  <CustomerSupportWrite />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inquiry-and-report/edit/:id"
              element={
                <ProtectedRoute>
                  <CustomerSupportUpdate />
                </ProtectedRoute>
              }
            />

            {/* 댕로드 관련 라우터 */}
            <Route path="/pet-road" element={<PetRoad />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;