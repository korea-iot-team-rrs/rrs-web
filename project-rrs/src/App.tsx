import "./App.css";
import Footer from "./layouts/Footer";
import { Route, Routes } from "react-router-dom";
import Main from "./views/Main";
import LoginView from "./views/Authentication/LoginView";
import SignUpView from "./views/Authentication";
import Header from "./layouts/Header";

import PetDiaryView from "./views/PetDiaryView/PetDiaryView";
import AnnouncementListView from "./views/AnnouncementView/AnnouncementListView";
import AnnouncementView from "./views/AnnouncementView/AnnouncementDetailView";
import UsageGuideDetailView from "./views/AnnouncementView/UsageGuideDetailView";
import EventDetailView from "./views/AnnouncementView/EventDetailView";
import UsageGuideListView from "./views/AnnouncementView/UsageGuideListView";
import EventListView from "./views/AnnouncementView/EventListView";
import CommunityListView from "./views/CommunityVIew/CommunityListView";
import CommunityDetailView from "./views/CommunityVIew/CommunityDetailView";

import CommunityCreateView from "./views/CommunityVIew/CommunityCreateView";
import MyPageView from "./views/MyPage/User";
import DangSitter from "./components/DangSitter";
import CustomerSupport from "./views/CustomerSupport";
import CustomerSupportDetail from "./components/CustomerSupport/CustomerSupportDetail";
import CustomerSupportWrite from "./components/CustomerSupport/CustomerSupportWrite";

import ReservationList from "./components/DangSitter/ReservaionList";
import ReservationForm from "./components/DangSitter/ReservationForm";
import ReservationUserDetail from "./components/DangSitter/ReservaionUserDetail";

import CommunityEditView from "./views/CommunityVIew/CommunityEditView";
import FinduserInfo from "./components/Auth/FindUserInfo";
import FindPassword from "./components/Auth/FindPassword/FindPassword";
import FindId from "./components/Auth/FindId";
function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          {/* 인증 관련 라우트  */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignUpView />} />
          <Route path="/find-useInfo" element={<FinduserInfo />} />
          <Route path="/find-id/:token" element={<FindId />} />
          <Route path="/find-password/:token" element={<FindPassword />} />

          <Route path="/announcements" element={<AnnouncementListView />} />
          <Route path="/announcements/:id" element={<AnnouncementView />} />
          <Route path="/usage-guide" element={<UsageGuideListView />} />
          <Route path="/usage-guide/:id" element={<UsageGuideDetailView />} />
          <Route path="/events" element={<EventListView />} />
          <Route path="/events/:id" element={<EventDetailView />} />

          <Route path="/pet-diary" element={<PetDiaryView />} />
          <Route path="/community" element={<CommunityListView />} />
          <Route path="/community/:id" element={<CommunityDetailView/>} />
          <Route path="/community/write" element={<CommunityCreateView/>} />

          <Route path="/dang-sitter" element={<DangSitter />}/>
          <Route path="/dang-sitter/reservations" element={<ReservationList />} /> 
          <Route path="/dang-sitter/reservations/write" element={<ReservationForm />} />
          <Route path="/dang-sitter/reservations/:id" element={<ReservationUserDetail />} />

          <Route path="/customer-supports" element={<CustomerSupport />}/>
          <Route path="/customer-supports/:id" element={<CustomerSupportDetail />}/>
          <Route path="/customer-supports/write" element={<CustomerSupportWrite />}/>

          <Route path="/community/edit/:id" element={<CommunityEditView/>} />

          <Route path="/dang-sitter" element={<DangSitter />}/>
          <Route path="/dang-sitter/reservations" element={<ReservationList />} /> 
          <Route path="/dang-sitter/reservations/write" element={<ReservationForm />} />
          <Route path="/dang-sitter/reservations/:id" element={<ReservationUserDetail />} />

          <Route path="/customer-supports" element={<CustomerSupport />}/>

          <Route path="/user/*" element={<MyPageView />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;