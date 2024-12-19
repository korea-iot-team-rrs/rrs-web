import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // 올바른 import 경로
import './App.css';
import MainPage from '../src/views/Main'; // 올바른 컴포넌트 경로

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;