import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, ArrowRight } from 'lucide-react';
import { useFavorites } from '../../../context/FavoritesContext';
import { useWeather } from '../../../context/WeatherContext';
import { useNavigate } from 'react-router-dom';

const SavedLocations = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { fetchWeather } = useWeather();
  const navigate = useNavigate();

  const handleSelectCity = (cityObjOrName) => {
    const cityName = typeof cityObjOrName === 'string' ? cityObjOrName : cityObjOrName.name || cityObjOrName.cityName;
    fetchWeather(cityName);
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Saved Locations
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage your pinned cities for instant weather updates</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800">
          <p className="text-slate-400 text-sm">No saved locations found.</p>
          <p className="text-xs text-slate-500 mt-1">Search any city and click the heart icon on the weather card to save it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favorites.map((item, idx) => {
            const cityName = typeof item === 'string' ? item : item.name || item.cityName || item.id;
            return (
              <motion.div
                key={cityName + idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800 flex items-center justify-between group hover:border-cyan-500/40 transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors capitalize">{cityName}</h3>
                  <button
                    onClick={() => handleSelectCity(cityName)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1 cursor-pointer"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromFavorites(cityName)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer"
                  title="Remove city"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedLocations;
