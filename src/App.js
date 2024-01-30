import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ChatBox from './pages/ChatBox';
import Register from './pages/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId'));


  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Nếu người dùng đã đăng nhập, chuyển hướng tới trang chat, ngược lại chuyển hướng tới trang đăng nhập */}
          <Route path="/" element={isLoggedIn ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/chat" element={isLoggedIn ? <ChatBox /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
