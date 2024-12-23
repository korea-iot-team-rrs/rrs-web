import './App.css';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import { Route, Routes } from 'react-router-dom';
import Main from './views/Main';
import LoginView from './views/Authentication/LoginView';
import SignUpView from './views/Authentication';

function App() {
  return (
    <div className="app-container">
      <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<LoginView />} />       
            <Route path="/signup" element={<SignUpView />} />       
          </Routes>
        </div>
      <Footer />
    </div>
  );
}

export default App;
