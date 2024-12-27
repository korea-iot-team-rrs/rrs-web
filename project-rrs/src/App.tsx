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
import UserView from "./views/UserView/User";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          {/* 인증 관련 라우트트  */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/signup" element={<SignUpView />} />

          <Route path="/announcements" element={<AnnouncementListView />} />
          <Route path="/announcements/:id" element={<AnnouncementView />} />
          <Route path="/usageGuide" element={<UsageGuideListView />} />
          <Route path="/usageGuide/:id" element={<UsageGuideDetailView />} />
          <Route path="/events" element={<EventListView />} />
          <Route path="/events/:id" element={<EventDetailView />} />

          <Route path="/petdiary" element={<PetDiaryView />} />
          <Route path="/community" element={<CommunityListView />} />
          
          <Route path="/user/*" element={<UserView />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
// 20241227 9:35