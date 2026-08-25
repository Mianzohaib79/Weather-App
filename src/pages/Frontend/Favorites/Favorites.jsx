import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useFavorites } from '../../../context/FavoritesContext';
import { useWeather } from '../../../context/WeatherContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { weatherData, fetchWeather } = useWeather();
  const navigate = useNavigate();

  // Home Page jaisi exact same weather condition aur night check values
  const icon = weatherData?.weather?.[0]?.icon || '';
  const isNight = icon.endsWith('n');

  const handleSelectCity = (cityName) => {
    fetchWeather(cityName);
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      {/* Main Content UI Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2.5 drop-shadow-md">
              <Heart className="w-7 h-7 text-rose-500 fill-current" />
              Favorite Cities
            </h1>
            <p className="text-sm text-slate-200 mt-1 drop-shadow">Quick access to your saved favorite locations</p>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl">
            <p className="text-slate-200 text-sm">Your favorites list is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favorites.map((item, idx) => {
              const cityName = typeof item === 'string' ? item : item.name || item.cityName || item.id;
              return (
                <motion.div
                  key={cityName + idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 flex items-center justify-between group hover:border-cyan-400/50 transition-all shadow-xl"
                >
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 capitalize">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {cityName}
                    </h3>
                    <button
                      onClick={() => handleSelectCity(cityName)}
                      className="text-xs text-cyan-300 hover:text-cyan-200 hover:underline flex items-center gap-1 mt-2 font-medium cursor-pointer"
                    >
                      View Forecast <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromFavorites(cityName)}
                    className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-colors cursor-pointer"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;