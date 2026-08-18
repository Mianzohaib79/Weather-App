import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';

const WeatherBackground = () => {
  const { weatherCondition } = useWeather();
  const condition = weatherCondition ? weatherCondition.toLowerCase() : 'clear';

  const isRain = condition.includes('rain') || condition.includes('drizzle');
  const isSnow = condition.includes('snow');
  const isClouds = condition.includes('cloud') || condition.includes('overcast');
  const isThunder = condition.includes('thunder') || condition.includes('squall');
  const isMist = condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke');
  const isClear = condition.includes('clear') || condition.includes('sun');

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-1000">
      {/* Base Clear Sun Backdrop */}
      {isClear && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950">
          <div className="absolute top-12 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full animate-sun-pulse pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
        </div>
      )}

      {/* Cloud Atmospheric Backdrop */}
      {isClouds && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
          <motion.div
            animate={{ x: [-100, 100, -100] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 left-10 w-80 h-32 bg-slate-700/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ x: [100, -100, 100] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-36 right-12 w-96 h-40 bg-cyan-900/15 rounded-full blur-3xl"
          />
          <div className="absolute top-1/4 left-0 right-0 opacity-15 animate-cloud-slow">
            <svg viewBox="0 0 1000 300" fill="none" className="w-full h-auto text-slate-300">
              <path
                d="M 150,150 Q 200,80 300,120 Q 380,50 480,110 Q 560,70 650,130 Q 750,90 850,160 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Rain Backdrop */}
      {isRain && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyan-300/60 to-blue-400 rounded-full animate-rain"
              style={{
                left: `${(i * 2.2) % 100}%`,
                height: `${25 + (i % 5) * 15}px`,
                animationDelay: `${(i * 0.15) % 2.5}s`,
                animationDuration: `${0.8 + (i % 3) * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Snow Backdrop */}
      {isSnow && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/80 to-slate-950">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/70 rounded-full animate-snow"
              style={{
                left: `${(i * 2.8) % 100}%`,
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                animationDelay: `${(i * 0.4) % 5}s`,
                animationDuration: `${4 + (i % 4) * 2}s`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>
      )}

      {/* Thunderstorm Backdrop */}
      {isThunder && (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-slate-900 to-slate-950">
          <motion.div
            animate={{ opacity: [0, 0.4, 0, 0.8, 0] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
            className="absolute inset-0 bg-cyan-100/10 pointer-events-none"
          />
        </div>
      )}

      {/* Mist / Fog / Haze Backdrop */}
      {isMist && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/80 to-slate-950">
          <div className="absolute inset-0 bg-slate-400/5 blur-3xl pointer-events-none animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default WeatherBackground;