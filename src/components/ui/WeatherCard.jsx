import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Gauge, Eye, Sun, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

const WeatherCard = ({ data }) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  if (!data) return null;

  const { name, main, weather, wind, visibility, sys } = data;
  const condition = weather?.[0]?.main || 'Clear';
  const description = weather?.[0]?.description || '';
  const icon = weather?.[0]?.icon;
  const isFav = isFavorite(name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 md:p-8 shadow-2xl shadow-cyan-950/30"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {name}
            {sys?.country && (
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {sys.country}
              </span>
            )}
          </h2>
          <p className="text-sm text-slate-400 capitalize mt-1 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            {description}
          </p>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={() => toggleFavorite(name)}
          className={`p-3 rounded-full border transition-all cursor-pointer ${isFav
              ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-500/20'
              : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
            }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Temp Display */}
      <div className="my-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {icon ? (
            <img
              src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
              alt={condition}
              className="w-24 h-24 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse"
            />
          ) : (
            <Sun className="w-20 h-20 text-amber-400 animate-spin-slow" />
          )}
          <div>
            <div className="text-6xl md:text-7xl font-black text-white tracking-tighter">
              {Math.round(main?.temp ?? 0)}°C
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Feels like <span className="text-slate-200 font-semibold">{Math.round(main?.feels_like ?? 0)}°C</span>
            </div>
          </div>
        </div>

        {/* High / Low Pill */}
        <div className="flex md:flex-col gap-3 text-center md:text-right">
          <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
            <span className="text-slate-400 block">High</span>
            <span className="text-slate-100 font-bold text-base">{Math.round(main?.temp_max ?? 0)}°C</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
            <span className="text-slate-400 block">Low</span>
            <span className="text-slate-100 font-bold text-base">{Math.round(main?.temp_min ?? 0)}°C</span>
          </div>
        </div>
      </div>

      {/* Grid Weather Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Humidity</div>
            <div className="text-sm font-bold text-slate-100">{main?.humidity}%</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Wind Speed</div>
            <div className="text-sm font-bold text-slate-100">{wind?.speed} m/s</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Pressure</div>
            <div className="text-sm font-bold text-slate-100">{main?.pressure} hPa</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Visibility</div>
            <div className="text-sm font-bold text-slate-100">{((visibility || 10000) / 1000).toFixed(1)} km</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
