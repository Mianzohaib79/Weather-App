import React from 'react';
import { motion } from 'framer-motion';
import { CloudSun, Wind, Droplets, Gauge, Eye, Sunrise, Sunset, MapPin } from 'lucide-react';
import { useWeather } from '../../../context/WeatherContext';

const WeatherDetails = () => {
  const { weatherData, forecastData, currentCity } = useWeather();

  if (!weatherData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        No weather data loaded. Search for a city first.
      </div>
    );
  }

  const { name, main, weather, wind, visibility, sys } = weatherData;

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-7 h-7 text-cyan-400" />
            {name} Weather Details
          </h1>
          <p className="text-sm text-slate-400 mt-1 capitalize">
            {weather?.[0]?.description} &bull; Detailed atmospheric metrics
          </p>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temp Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 flex flex-col justify-between"
        >
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Temperature</div>
          <div className="my-4">
            <div className="text-5xl font-black text-white">{Math.round(main?.temp ?? 0)}°C</div>
            <div className="text-xs text-slate-400 mt-1">
              Feels like <span className="text-slate-200 font-bold">{Math.round(main?.feels_like ?? 0)}°C</span>
            </div>
          </div>
          <div className="flex justify-between text-xs border-t border-slate-800 pt-3 text-slate-400">
            <span>Min: {Math.round(main?.temp_min ?? 0)}°C</span>
            <span>Max: {Math.round(main?.temp_max ?? 0)}°C</span>
          </div>
        </motion.div>

        {/* Sun Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 flex flex-col justify-between"
        >
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Sun Schedule</div>
          <div className="my-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Sunrise className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Sunrise</div>
                <div className="text-sm font-bold text-white">{formatTime(sys?.sunrise)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                <Sunset className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Sunset</div>
                <div className="text-sm font-bold text-white">{formatTime(sys?.sunset)}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Atmospheric Pressure & Visibility */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 flex flex-col justify-between"
        >
          <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Atmosphere</div>
          <div className="my-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Barometric Pressure</div>
                <div className="text-sm font-bold text-white">{main?.pressure} hPa</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Visibility Distance</div>
                <div className="text-sm font-bold text-white">{((visibility || 10000) / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Hourly/Upcoming Forecast list */}
      {forecastData?.list && (
        <div className="p-6 rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white">Extended Forecast Breakdown</h3>
          <div className="divide-y divide-slate-800/80">
            {forecastData.list.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="text-slate-300 font-medium w-40">
                  {item.dt_txt ? new Date(item.dt_txt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit' }) : `Day ${idx + 1}`}
                </div>
                <div className="flex items-center gap-2 capitalize text-slate-400">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather?.[0]?.icon || '01d'}.png`}
                    alt={item.weather?.[0]?.main}
                    className="w-8 h-8"
                  />
                  <span>{item.weather?.[0]?.description}</span>
                </div>
                <div className="font-extrabold text-white text-right w-20">
                  {Math.round(item.main?.temp ?? 0)}°C
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDetails;
