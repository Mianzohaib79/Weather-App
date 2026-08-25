import React from "react";
import { motion } from "framer-motion";

export function WeatherMetricsGrid({ weatherData }) {
    const humidity = weatherData?.main?.humidity || 75;
    const pressure = weatherData?.main?.pressure || 1021;
    const visibility = weatherData?.visibility ? (weatherData.visibility / 1000).toFixed(1) : 10.0;
    const windSpeed = weatherData?.wind?.speed || 2.24;

    const metrics = [
        {
            title: "Humidity",
            value: `${humidity}%`,
            subText: humidity > 60 ? "High Moisture" : "Optimal",
            icon: "💧",
            color: "from-blue-500 to-cyan-400",
            glow: "rgba(56,189,248,0.25)",
            progress: Math.min(Math.max(humidity, 5), 100),
        },
        {
            title: "Air Pressure",
            value: `${pressure} hPa`,
            subText: pressure > 1013 ? "High Pressure" : "Low Pressure",
            icon: "🧭",
            color: "from-indigo-500 to-purple-400",
            glow: "rgba(129,140,248,0.25)",
            progress: Math.min(Math.max(((pressure - 950) / 100) * 100, 10), 100),
        },
        {
            title: "Visibility",
            value: `${visibility} km`,
            subText: visibility >= 8 ? "Clear Vision" : "Hazy",
            icon: "👁️",
            color: "from-emerald-500 to-teal-400",
            glow: "rgba(52,211,153,0.25)",
            progress: Math.min(Math.max((visibility / 10) * 100, 10), 100),
        },
        {
            title: "Wind Velocity",
            value: `${windSpeed} m/s`,
            subText: "Gentle Breeze",
            icon: "💨",
            color: "from-cyan-400 to-blue-600",
            glow: "rgba(6,182,212,0.25)",
            progress: Math.min(Math.max((windSpeed / 15) * 100, 10), 100),
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full my-6 z-10 relative">
            {metrics.map((item, index) => (
                <div
                    key={index}
                    className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-5 rounded-3xl text-white shadow-xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                >
                    {/* Ambient Glow */}
                    <div
                        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none"
                        style={{ background: item.glow }}
                    />

                    <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50">
                            {item.title}
                        </span>
                    </div>

                    <div className="my-2">
                        <h3 className="text-2xl font-bold tracking-tight text-slate-100">
                            {item.value}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">{item.subText}</p>
                    </div>

                    {/* Fixed Glowing Progress Bar */}
                    <div className="w-full bg-slate-800/80 rounded-full h-2 mt-4 overflow-hidden p-0.5 border border-slate-700/40 relative">
                        <div
                            style={{ width: `${item.progress}%` }}
                            className={`h-full rounded-full bg-gradient-to-r ${item.color} shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-1000 ease-out`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}