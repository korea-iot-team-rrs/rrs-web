import './App.css';
import Footer from './layouts/Footer';
import { Route, Routes } from 'react-router-dom';
import Main from './views/Main';
import LoginView from './views/Authentication/LoginView';
import SignUpView from './views/Authentication';
import Header from './layouts/Header';

import Announcement from './views/Announcement';
import PetDiaryView from './views/PetDiaryView/PetDiaryView';

function App() {
  return (
    <div className="app-container">
      <Header />
        <div className="content">
          <Routes>
            
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<LoginView />} />       
            <Route path="/signup" element={<SignUpView />} /> 
            <Route path="/announcements" element={<Announcement />} />
            <Route path="/petdiary" element={<PetDiaryView />} />     
          </Routes>
        </div>
      <Footer />
    </div>
  );
}

export default App;
