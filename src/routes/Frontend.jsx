import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer';
import WeatherBackground from '../components/Misc/WeatherBackground';
import Home from '../pages/Frontend/Home';
import Favorites from '../pages/Frontend/Favorites';
import WeatherDetails from '../pages/Frontend/WeatherDetails';
import Dashboard from '../pages/Dashboard';

const Frontend = () => {
  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Animated Backdrop */}
      <WeatherBackground />

      {/* Main Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="weather-details" element={<WeatherDetails />} />
          <Route path="dashboard/*" element={<Dashboard />} />
        </Routes>
      </main>

      {/* Main Footer */}
      <Footer />
    </div>
  );
};

export default Frontend;