import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CloudSun, Search, Heart, User, LogOut, LayoutDashboard, Navigation } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const { fetchWeather, getUserLocationWeather, isGeoLoading } = useWeather();
  const { isAuth, user, handleLogout: authLogout, logout } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = isAuth || Boolean(user?.email || localStorage.getItem('jwt') || localStorage.getItem('token'));

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
      navigate('/');
    }
  };

  const handleLocationClick = () => {
    getUserLocationWeather();
    navigate('/');
  };

  // Logout Handler
  const handleLogoutClick = async () => {
    try {
      if (typeof authLogout === 'function') {
        await authLogout();
      } else if (typeof logout === 'function') {
        await logout();
      }

      // Clear all auth storage
      localStorage.removeItem('jwt');
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Instantly navigate user to /auth/login replacing current history
      navigate('/auth/login', { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <CloudSun className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
              SkyPulse
            </span>
          </div>
        </Link>

        {/* Live Search Input & GPS Geolocation Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 group">
            <input
              type="text"
              placeholder="Search any city..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-800/70 text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-full border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
          </form>

          {/* GPS Location Button */}
          <button
            onClick={handleLocationClick}
            disabled={isGeoLoading}
            title="Use current GPS location"
            className="p-2.5 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 hover:text-cyan-300 transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Navigation className={`w-4 h-4 ${isGeoLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Navigation Links & User Controls */}
        <nav className="flex items-center gap-3">
          <Link
            to="/favorites"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Favorites</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;