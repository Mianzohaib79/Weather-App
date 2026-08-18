import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Frontend from './Frontend';
import Auth from './Auth';
import { useAuth } from '../context/AuthContext';
import WeatherLoader from '../components/Loader/WeatherLoader';

const Index = () => {
  const { isAuth, isAppLoading } = useAuth();

  if (isAppLoading) {
    return <WeatherLoader message="Initializing SkyPulse..." />;
  }

  return (
    <Routes>
      {/* Auth Layout - NO Navbar/Footer. Redirects to Home if logged in */}
      <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" replace />} />

      {/* Main Frontend Layout - Contains Navbar, Page Content & Footer */}
      <Route path="/*" element={<Frontend />} />
    </Routes>
  );
};

export default Index;
