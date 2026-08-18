import React from 'react';
import { CloudSun, Sparkles } from 'lucide-react';

const WeatherLoader = ({ message = "Fetching atmospheric data..." }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="absolute w-72 h-72 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-[120px] delay-700 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Weather Animated Icon Container */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-500/30 animate-bounce">
            <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center">
              <CloudSun className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>
          {/* Outer Rotating Radar Ring */}
          <div className="absolute -inset-3 rounded-3xl border border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
        </div>

        {/* Title & Dynamic Message */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent mb-2">
          SkyPulse
        </h3>
        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          {message}
        </p>

        {/* Pulsing Progress Indicator */}
        <div className="w-48 h-1 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default WeatherLoader;
