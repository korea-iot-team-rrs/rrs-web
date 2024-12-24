import './App.css';
import Footer from './layouts/Footer';
import { Route, Routes } from 'react-router-dom';
import Main from './views/Main';
import LoginView from './views/Authentication/LoginView';
import SignUpView from './views/Authentication';
import Header from './layouts/Header';
import PetDiary from './components/PetDiary';
import Announcement from './views/Announcement';

function App() {
  return (
    <div className="app-container">
      <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<LoginView />} />       
            <Route path="/signup" element={<SignUpView />} /> 
            <Route path="/petDiary" element={<PetDiary />} />
            <Route path="/announcements" element={<Announcement />} />       
          </Routes>
        </div>
      <Footer />
    </div>
  );
}

export default App;
