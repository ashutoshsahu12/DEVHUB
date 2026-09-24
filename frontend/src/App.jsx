import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ComparePage from './pages/ComparePage';
import CompareDevelopersPage from './pages/CompareDevelopersPage';
import RepositoryDetailsPage from './pages/RepositoryDetailsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const token = localStorage.getItem('devhub_token');

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans selection:bg-accent selection:text-white">
        <Navbar />
        <main className="flex-1 pt-20 flex flex-col">
          <Routes>
            <Route 
              path="/" 
              element={token ? <Navigate to="/dashboard" replace /> : <HomePage />} 
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!token ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" replace />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/compare-developers" element={<CompareDevelopersPage />} />
            <Route path="/repository/:owner/:repoName" element={<RepositoryDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}