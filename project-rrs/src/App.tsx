import "./App.css";
import Footer from "./layouts/Footer";
import { Route, Routes } from "react-router-dom";
import Main from "./views/Main";
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

import ReservationList from "./views/DangSitter/ReservaionList";
import ReservationForm from "./views/DangSitter/ReservationForm";
import ReservationUserDetail from "./views/DangSitter/ReservaionUserDetail";

import CommunityEditView from "./views/CommunityVIew/CommunityEditView";
import SignUpMain from "./views/Auth/SignUp/SignUpMain";
import SignUp from "./views/Auth/SignUp/RrsSignUp";
import FindId from "./views/Auth/FindId";
import FindPassword from "./views/Auth/FindPassword/FindPassword";
import FinduserInfo from "./views/Auth/FindUserInfo";
import Login from "./views/Auth/Login";
import CustomerSupportList from "./views/CustomerSupport/CustomerSupportList";
import DangSitterMain from "./views/DangSitter/DangSitterMain";
import CustomerSupportDetail from "./views/CustomerSupport/CustomerSupportDetail";
import CustomerSupportWrite from "./views/CustomerSupport/CustomerSupportWrite";
import CustomerSupportUpdate from "./views/CustomerSupport/CustomerSupportUpdate";
import ProviderUpdate from "./views/DangSitter/providerUpdate";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          {/* 인증 관련 라우트  */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpMain />} />
          <Route path="/signup/rrs" element={<SignUp />} />
          <Route path="/find-id/:token" element={<FindId />} />
          <Route path="/find-password/:token" element={<FindPassword />} />
          <Route path="/find-user-info" element={<FinduserInfo />} />

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
          <Route path="/community/edit/:communityId" element={<CommunityEditView/>} />

          <Route path="/dang-sitter" element={<DangSitterMain />}/>
          
          <Route path="/users/dang-sitter/reservations" element={<ReservationList />} /> 
          <Route path="/users/dang-sitter/reservations/write" element={<ReservationForm />} />
          <Route path="/users/dang-sitter/reservations/:id" element={<ReservationUserDetail />} />

          <Route path="/users/dang-sitter/provider/profile" element={<ProviderUpdate />} />

          <Route path="/customer-supports" element={<CustomerSupportList />}/>
          <Route path="/customer-supports/:id" element={<CustomerSupportDetail />}/>
          <Route path="/customer-supports/write" element={<CustomerSupportWrite />}/>
          <Route path="/customer-supports/edit/:id" element={<CustomerSupportUpdate />}/>

          <Route path="/user/*" element={<MyPageView />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;