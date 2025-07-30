import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginPage/Login';
import Home from './components/HomePage/Home';
import Main from './components/MainPage/Main';
import Chat from './components/ChatPage/Chat';
import { auth } from './firebase/firebase-init';

const PrivateRoute = ({ children }) => {
  const isLoggedIn = !!auth.currentUser || !!localStorage.getItem('currentUserUid');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            !!auth.currentUser || !!localStorage.getItem('currentUserUid')
              ? <Navigate to="/app" replace />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;