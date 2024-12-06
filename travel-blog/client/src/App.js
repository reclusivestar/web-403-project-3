import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen';
import BlogDetailScreen from './components/BlogDetailScreen';
import BlogPostForm from './components/BlogPostForm';
import NavBar from './components/NavBar';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomeScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <ProtectedRoute>
              <BlogDetailScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <BlogPostForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
