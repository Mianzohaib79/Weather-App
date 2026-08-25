import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Header/Navbar';
import Footer from '../components/Footer/Footer';
import { CloudShader } from '../components/ui/cloud-shader';
import { useWeather } from '../context/WeatherContext';
import { WeatherRainOverlay } from "../components/WeatherRainOverlay";
import Home from '../pages/Frontend/Home';
import Favorites from '../pages/Frontend/Favorites';
import WeatherDetails from '../pages/Frontend/WeatherDetails';
import Dashboard from '../pages/Dashboard';

const Frontend = () => {
  const { weatherData } = useWeather();
  const icon = weatherData?.weather?.[0]?.icon || '';
  const isNight = icon.endsWith('n');

  // Rain Overlay ke liye live weather condition check
  const weatherCondition =
    weatherData?.weather?.[0]?.main ||
    weatherData?.weather?.[0]?.description ||
    'Clear';

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Animated Aceternity UI Background (Global Single Instance) */}
      <CloudShader
        className="fixed inset-0 h-full w-full -z-10 pointer-events-none"
        speed={1}
        count={5}
        skyTopColor={isNight ? "#020617" : "#075985"}
        skyBottomColor={isNight ? "#0f172a" : "#0369a1"}
        cloudColor={isNight ? "#94a3b8" : "#e0f2fe"}
      />
      <WeatherRainOverlay
        speedMultiplier={1}
        weatherCondition={weatherCondition}
      />

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