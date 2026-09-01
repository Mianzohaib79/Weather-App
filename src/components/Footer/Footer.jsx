import React from 'react';
import { Heart, CloudSun } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <span>SkyPulse Weather App &copy; {new Date().getFullYear()}</span>
        </div>
        {/* <div className="flex items-center gap-1.5">
          <span>Powered by React, Express, MongoDB & OpenWeather API</span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
