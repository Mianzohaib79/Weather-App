import React from "react";
import { motion } from "framer-motion";

export function SunMoonArc({
    sunrise = "05:38 AM",
    sunset = "06:42 PM",
    isNight = false,
    progress = 65
}) {
    // Angle mapped from -90deg (sunrise) to +90deg (sunset)
    const angle = (progress / 100) * 180 - 90;

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl w-full text-white shadow-2xl relative overflow-hidden group">
            {/* Background Ambient Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isNight ? 'bg-indigo-600/20' : 'bg-amber-500/20'}`} />

            {/* Card Header */}
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="text-base">{isNight ? "🌙" : "🌅"}</span> Sun & Moon Position
                </h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-300 font-medium">
                    {progress}% Day Elapsed
                </span>
            </div>

            {/* Arc Tracker Display (Increased height & top padding so Sun never cuts) */}
            <div className="relative w-full h-44 flex justify-center items-end overflow-hidden pt-8">
                {/* Semi-Circle Arc Path Line */}
                <div className="w-64 h-64 rounded-full border-2 border-dashed border-sky-400/30 absolute -bottom-24 shadow-[0_0_15px_rgba(56,189,248,0.1)]" />

                {/* Glow Horizon Base Line */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent absolute bottom-0" />

                {/* Animated Rotating Arc Container */}
                <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: angle }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    className="absolute w-64 h-64 -bottom-24 flex justify-center items-start pointer-events-none origin-center"
                >
                    <div className="relative -top-5 flex items-center justify-center">
                        {isNight ? (
                            <div className="relative">
                                <div className="w-9 h-9 bg-slate-200 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)] border border-white/80 flex items-center justify-center text-xs">
                                    🌙
                                </div>
                                <div className="absolute inset-0 rounded-full bg-indigo-400/40 blur-md -z-10 animate-pulse" />
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Rotating Sun Rays Border */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                                    className="absolute -inset-2 rounded-full border border-dashed border-amber-400/60"
                                />
                                <div className="w-9 h-9 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-[0_0_25px_rgba(251,191,36,0.95)] border border-amber-200/90 flex items-center justify-center text-xs">
                                    ☀️
                                </div>
                                <div className="absolute inset-0 rounded-full bg-amber-400/50 blur-lg -z-10 animate-pulse" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Timings Footer */}
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800/60 text-xs text-slate-300">
                <div>
                    <p className="text-slate-500 text-[10px] uppercase font-semibold">Sunrise</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{sunrise}</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-[10px] uppercase font-semibold">Sunset</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{sunset}</p>
                </div>
            </div>
        </div>
    );
}