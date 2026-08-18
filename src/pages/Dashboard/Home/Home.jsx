import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Heart, ShieldCheck, Sun } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useWeather } from '../../../context/WeatherContext';
import { useFavorites } from '../../../context/FavoritesContext'; // Updated import
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();
  const weatherContext = useWeather() || {};
  const { weatherData, fetchWeather } = weatherContext;

  // Directly consume Favorites from FavoriteContext
  const { favorites = [] } = useFavorites ? useFavorites() : { favorites: [] };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome, {user?.fullName || user?.name || 'Weather Enthusiast'}!
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Authenticated Session ({user?.email || 'N/A'})
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/saved-locations"
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700/60 transition-all flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>Manage Saved Cities</span>
        </Link>
      </motion.div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Weather Highlight */}
        <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Active Search</span>
            <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
          </div>
          <div className="text-2xl font-bold text-white">{weatherData?.name || 'N/A'}</div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">
            {weatherData?.main?.temp != null ? `${Math.round(weatherData.main.temp)}°C` : '--'}
          </div>
          <p className="text-xs text-slate-400 capitalize mt-1">
            {weatherData?.weather?.[0]?.description || 'No data'}
          </p>
        </div>

        {/* Favorites Count */}
        <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Saved Cities</span>
            <Heart className="w-5 h-5 text-rose-400 fill-current" />
          </div>
          <div className="text-4xl font-extrabold text-white">{favorites.length}</div>
          <p className="text-xs text-slate-400 mt-2">
            {favorites.length > 0
              ? favorites.map(item => (typeof item === 'object' ? (item.name || item.cityName) : item)).join(', ')
              : 'No locations saved yet.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Quick Cities</div>
            <div className="flex flex-wrap gap-2 mt-3">
              {['New York', 'Tokyo', 'Paris', 'Sydney'].map((city) => (
                <button
                  key={city}
                  onClick={() => fetchWeather && fetchWeather(city)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-cyan-500/20 text-xs text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;