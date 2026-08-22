import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';

const WeatherBackground = () => {
  const { weatherCondition, weatherData } = useWeather() || {};

  const condition = useMemo(() => {
    return (weatherCondition || weatherData?.weather?.[0]?.main || 'Clear').toLowerCase();
  }, [weatherCondition, weatherData]);

  // Check Day or Night via API icon ('d' = day, 'n' = night)
  const icon = weatherData?.weather?.[0]?.icon || '';
  const isNight = icon.endsWith('n') || (
    weatherData?.sys?.sunset && weatherData?.dt
      ? (weatherData.dt > weatherData.sys.sunset || weatherData.dt < weatherData.sys.sunrise)
      : false
  );

  const isThunder = condition.includes('thunder') || condition.includes('squall');
  const isRain = (condition.includes('rain') || condition.includes('drizzle')) && !isThunder;
  const isSnow = condition.includes('snow');
  const isMist = condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke');
  const isClouds = (condition.includes('cloud') || condition.includes('overcast')) && !isRain && !isThunder && !isSnow && !isMist;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden select-none transition-all duration-1000">

      {/* 1. DAY TIME - CLEAR / SUNNY SKY (Vibrant Blue like iOS) */}
      {!isNight && !isRain && !isThunder && !isSnow && !isMist && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-600 to-indigo-900"
          >
            {/* Bright Real Sun Effect */}
            <div className="absolute top-10 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute top-21 right-1/9 w-40 h-40 bg-yellow-100 rounded-full shadow-[0_0_80px_rgba(253,224,71,0.9)] pointer-events-none" />

            {/* Soft Ambient Floating Clouds for Day */}
            {isClouds && (
              <>
                <motion.div
                  animate={{ x: [-50, 50, -50] }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-12 left-10 w-96 h-36 bg-white/20 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ x: [50, -50, 50] }}
                  transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-28 right-16 w-[450px] h-48 bg-sky-100/25 rounded-full blur-3xl"
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 2. NIGHT TIME - CLEAR / CLOUDY SKY */}
      {isNight && !isRain && !isThunder && !isSnow && !isMist && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900"
          >
            {/* Glowing Moon Effect */}
            <div className="absolute top-12 right-1/4 w-48 h-48 bg-slate-100/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-21 right-1/9 w-28 h-28 bg-slate-100 rounded-full shadow-[0_0_50px_rgba(241,245,249,0.6)] pointer-events-none" />

            {/* Soft Night Clouds */}
            {isClouds && (
              <motion.div
                animate={{ x: [-40, 40, -40] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-20 left-10 w-96 h-40 bg-slate-800/30 rounded-full blur-2xl"
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 3. RAIN BACKDROP */}
      {isRain && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950">
          <div className="absolute top-0 left-0 right-0 h-64 bg-slate-800/40 blur-3xl" />
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-gradient-to-b from-transparent via-cyan-300/70 to-blue-400 rounded-full animate-rain"
              style={{
                left: `${(i * 2) % 100}%`,
                height: `${25 + (i % 5) * 15}px`,
                animationDelay: `${(i * 0.12) % 2}s`,
                animationDuration: `${0.7 + (i % 3) * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 4. THUNDERSTORM BACKDROP */}
      {isThunder && (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-slate-900 to-slate-950">
          <motion.div
            animate={{ opacity: [0, 0.6, 0, 0.9, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2.5 }}
            className="absolute inset-0 bg-cyan-100/15 pointer-events-none"
          />
        </div>
      )}

      {/* 5. SNOW BACKDROP */}
      {isSnow && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/80 to-slate-950">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/80 rounded-full animate-snow"
              style={{
                left: `${(i * 2.5) % 100}%`,
                width: `${4 + (i % 3) * 3}px`,
                height: `${4 + (i % 3) * 3}px`,
                animationDelay: `${(i * 0.3) % 4}s`,
                animationDuration: `${3.5 + (i % 4) * 2}s`,
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>
      )}

      {/* 6. MIST / FOG BACKDROP */}
      {isMist && (
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/90 to-slate-950">
          <div className="absolute inset-0 bg-slate-400/10 blur-3xl pointer-events-none animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default WeatherBackground;