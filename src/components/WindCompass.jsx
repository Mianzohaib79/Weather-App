import React from "react";
import { motion } from "framer-motion";

export function WindCompass({
    windSpeed = "3.2",
    windDegree = 147
}) {
    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl w-full text-white shadow-2xl relative overflow-hidden group">
            {/* Background Ambient Glow */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="text-base">💨</span> Wind Compass
                </h4>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-cyan-400 font-semibold">
                    {windSpeed} m/s
                </span>
            </div>

            {/* 3D Compass Circular Dial */}
            <div className="relative w-full h-40 flex items-center justify-center my-2">
                {/* Continuous Rotating Outer Air Waves */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="w-36 h-36 rounded-full border border-dashed border-cyan-400/30 absolute pointer-events-none"
                />

                {/* Outer Glowing Ring */}
                <div className="w-36 h-36 rounded-full border-2 border-slate-700/60 flex items-center justify-center relative shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    {/* Direction Marks */}
                    <span className="absolute top-1 text-[10px] font-bold text-cyan-400">N</span>
                    <span className="absolute right-2 text-[10px] font-bold text-slate-500">E</span>
                    <span className="absolute bottom-1 text-[10px] font-bold text-slate-500">S</span>
                    <span className="absolute left-2 text-[10px] font-bold text-slate-500">W</span>

                    {/* Dotted Inner Ring */}
                    <div className="w-28 h-28 rounded-full border border-dashed border-slate-600/50 absolute" />

                    {/* Dynamic Needle with Swaying Animation */}
                    <motion.div
                        initial={{ rotate: 0 }}
                        animate={{
                            rotate: [windDegree - 4, windDegree + 4, windDegree - 4]
                        }}
                        transition={{
                            rotate: {
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut"
                            }
                        }}
                        className="w-full h-full absolute flex items-center justify-center origin-center pointer-events-none"
                    >
                        {/* North Red/Cyan Pointer Arrow */}
                        <div className="relative flex flex-col items-center">
                            <div className="w-2.5 h-12 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-full shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
                            <div className="w-2.5 h-12 bg-slate-700/80 rounded-b-full" />
                        </div>
                    </motion.div>

                    {/* Center Pivot Point with Glowing Pulse */}
                    <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-400 z-10 shadow-[0_0_12px_rgba(6,182,212,0.9)] relative flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-800/60 text-xs text-slate-300">
                <div>
                    <p className="text-slate-500 text-[10px] uppercase font-semibold">Direction</p>
                    <p className="font-semibold text-slate-200 mt-0.5">{windDegree}° Angle</p>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 text-[10px] uppercase font-semibold">Status</p>
                    <p className="font-semibold text-cyan-400 mt-0.5">Gentle Breeze</p>
                </div>
            </div>
        </div>
    );
}