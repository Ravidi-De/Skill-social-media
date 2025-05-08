import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { UserProvider } from './common/UserContext';
import UserProfile from './pages/User-Profile/UserProfile';
import FollowUsers from './pages/Follow-Users/FollowUsers';
import MotivationPopup from './common/MotivationPopup';

function App() {
  return (
    <UserProvider>
    {/* <MotivationPopup/> */}
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/register" element={<Signup/>} />
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/follow" element={<FollowUsers/>} />
        </Routes>
      </Router>
    </div>
    </UserProvider>
  );
}

export default App;
