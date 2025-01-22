import "./App.css";
import { CircularProgress } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { useAuthCheck } from "./stores/useAuthCheck.store";

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

            {/* 고객센터 관련 라우터 */}
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
