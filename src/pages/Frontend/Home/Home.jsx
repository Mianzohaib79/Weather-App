import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Navigation, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';
import WeatherCard from '../../../components/ui/WeatherCard';
import HourlyForecast from '../../../components/Misc/HourlyForecast';
import WeatherLoader from '../../../components/Loader/WeatherLoader';
import { Link } from 'react-router-dom';
import { CloudShader } from '../../../components/ui/cloud-shader';

const Home = () => {
  const {
    weatherData,
    forecastData,
    loading,
    error,
    isGeoLoading,
    isApiKeyInvalid,
    lastUpdated,
    retryApiKey,
    fetchWeather,
    getUserLocationWeather,
    refreshWeatherData,
  } = useWeather();

  const popularCities = ['London', 'Tokyo', 'New York', 'Paris', 'Dubai', 'Sydney'];
  const hasApiKey = Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY && import.meta.env.VITE_OPENWEATHER_API_KEY !== 'your_openweather_api_key_here');

  // Day / Night Auto-Detection via API icon
  const icon = weatherData?.weather?.[0]?.icon || '';
  const isNight = icon.endsWith('n');

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-white">
      {/* 1. Animated Cloud Background Shader Layer */}
      <CloudShader
        className="fixed inset-0 h-full w-full -z-0 opacity-80 pointer-events-none"
        speed={1}
        count={5}
        skyTopColor={isNight ? "#020617" : "#0f172a"}
        skyBottomColor={isNight ? "#0f172a" : "#1e3a8a"}
        cloudColor="#ffffff"
      />

      {/* 2. Main Weather App Content Layer */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Full-Screen Weather Loader for Geolocation / Atmospheric Search */}
        {isGeoLoading && <WeatherLoader message="Scanning GPS location & radar coordinates..." />}
        {loading && !weatherData && <WeatherLoader message="Fetching live atmospheric data..." />}

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          {/* Dynamic Heading with Drop Shadows for High Contrast */}
          <h1 className={`text-4xl md:text-5xl font-black tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] transition-colors ${isNight ? 'text-white' : 'text-slate-100'}`}>
            Live <span className={isNight ? 'text-cyan-400' : 'text-sky-400 font-extrabold'}>Location & Animated</span> Weather
          </h1>

          {/* Dynamic Subtitle */}
          <p className={`text-sm md:text-base max-w-xl mx-auto font-medium drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] transition-colors ${isNight ? 'text-slate-300' : 'text-slate-200'}`}>
            Automatically detects your current latitude & longitude via browser GPS or allows manual search for any city worldwide.
          </p>

          {/* Location Detection & Refresh Controls + Responsive Quick Cities */}
          <div className="flex flex-col items-center gap-3 pt-2">

            {/* Top Buttons: GPS Location & Live Refresh */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={getUserLocationWeather}
                disabled={isGeoLoading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Navigation className={`w-4 h-4 ${isGeoLoading ? 'animate-spin' : ''}`} />
                <span>{isGeoLoading ? 'Detecting Location...' : 'Use My GPS Location'}</span>
              </button>

              <button
                onClick={refreshWeatherData}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs font-semibold shadow-md transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                title="Auto-refreshes every 3 mins"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Data</span>
                {lastUpdated && <span className="text-[10px] text-slate-300 ml-1">({lastUpdated})</span>}
              </button>
            </div>

            {/* Popular Cities Bar - Fully Visible & Scrollable on Mobile */}
            <div className="w-full max-w-md overflow-x-auto no-scrollbar py-1 scrollbar-none">
              <div className="flex items-center justify-center sm:justify-center gap-1.5 min-w-max px-2">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => fetchWeather(city)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 hover:text-cyan-400 transition-all cursor-pointer shadow-sm backdrop-blur-md shrink-0"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* 401 Key Activation Warning */}
          {isApiKeyInvalid && (
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-200">OpenWeatherMap Key Activation (401 Unauthorized):</span>
                  Your API key is pending activation by OpenWeatherMap (new keys take <strong className="text-white">1–2 hours to activate</strong>). Demo weather data is displayed below in the meantime.
                </div>
              </div>
              <button
                onClick={retryApiKey}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Key</span>
              </button>
            </div>
          )}

          {/* Missing API Key Warning */}
          {!hasApiKey && !isApiKeyInvalid && (
            <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-200">OpenWeather API Key Setup:</span>
                Replace <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300">your_openweather_api_key_here</code> in your <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300">.env</code> file with your real key from <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-white">OpenWeatherMap</a> to fetch live worldwide API feeds.
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Weather Card & Loading/Error states */}
        {error && !weatherData ? (
          <div className="p-6 text-center rounded-3xl bg-rose-950/20 border border-rose-900/50 text-rose-300 space-y-2">
            <p className="font-semibold text-base">{error}</p>
            <button
              onClick={() => fetchWeather('London')}
              className="px-4 py-1.5 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Try Fallback City (London)
            </button>
          </div>
        ) : (
          <>
            {/* Weather Card */}
            <WeatherCard data={weatherData} />

            {/* Interactive Hourly Forecast Graph */}
            <HourlyForecast data={forecastData} />
          </>
        )}

        {/* 5-Day Forecast Grid */}
        {forecastData?.list && forecastData.list.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold flex items-center gap-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] ${isNight ? 'text-white' : 'text-slate-100'}`}>
                <Calendar className="w-5 h-5 text-cyan-400" />
                5-Day Weather Forecast
              </h3>
              <Link
                to="/weather-details"
                className={`text-xs font-semibold hover:underline flex items-center gap-1 ${isNight ? 'text-cyan-300' : 'text-cyan-400'}`}
              >
                Detailed Breakdown &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {forecastData.list.slice(0, 5).map((item, index) => {
                const date = new Date(item.dt_txt || Date.now() + index * 86400000);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const iconCode = item.weather?.[0]?.icon || '01d';

                return (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-center hover:border-cyan-500/40 transition-all group shadow-md"
                  >
                    <p className="text-xs font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                      {dayName}
                    </p>
                    <img
                      src={`https://openweathermap.org/img/wn/${iconCode}.png`}
                      alt={item.weather?.[0]?.description}
                      className="w-12 h-12 mx-auto my-1 group-hover:scale-110 transition-transform"
                    />
                    <p className="text-lg font-extrabold text-white">{Math.round(item.main?.temp ?? 0)}°C</p>
                    <p className="text-[11px] text-slate-400 capitalize truncate mt-0.5">
                      {item.weather?.[0]?.main}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Home;