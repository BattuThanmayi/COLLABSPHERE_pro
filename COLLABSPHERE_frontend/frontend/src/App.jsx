import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LayoutWrapper from './components/Layout/LayoutWrapper';
import Navbar from './components/Layout/Navbar';

// Pages - Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Pages - Dashboard & Features
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamsPage from './pages/TeamsPage';
import TasksPage from './pages/TasksPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            {/* Public Routes - Without Layout */}
            <Route
              path="/"
              element={
                <div className="app-wrapper">
                  <Navbar />
                  <div className="main-container">
                    <HomePage />
                  </div>
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div className="auth-wrapper">
                  <Login />
                </div>
              }
            />
            <Route
              path="/register"
              element={
                <div className="auth-wrapper">
                  <Register />
                </div>
              }
            />

            {/* Protected Routes - With Layout (Sidebar + Top Navbar) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <DashboardPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <ProjectsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <TeamsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <TasksPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <MessagesPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <NotificationsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <ProfilePage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <LayoutWrapper>
                    <SettingsPage />
                  </LayoutWrapper>
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
